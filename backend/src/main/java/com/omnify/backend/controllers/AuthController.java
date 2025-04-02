package com.omnify.backend.controllers;

import java.util.Arrays;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.omnify.backend.advices.ApiResponse;
import com.omnify.backend.dtos.LoginRequestDTO;
import com.omnify.backend.dtos.LoginResponseDTO;
import com.omnify.backend.dtos.SignupDTO;
import com.omnify.backend.dtos.UserDTO;
import com.omnify.backend.services.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<UserDTO> signUp(@RequestBody @Valid SignupDTO signupDTO) {
        return new ResponseEntity<>(authService.signup(signupDTO), HttpStatus.CREATED);
    }

    @PostMapping(path = "/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO loginDTO,
            HttpServletResponse response) {
        String[] token = authService.login(loginDTO);
        addCookie(response, "refreshToken", token[1], 60 * 60 * 24 * 30 * 6);
        addCookie(response, "accessToken", token[0], 60 * 60 * 24 * 5);
        return new ResponseEntity<>(new LoginResponseDTO(token[0]), HttpStatus.OK);
    }

    @PostMapping(path = "/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new AuthenticationServiceException("No cookies found in request");
        }
        String refreshToken = Arrays.stream(cookies)
                .filter(cookie -> "refreshToken".equals(cookie.getName()))
                .findFirst()
                .map(cookie -> cookie.getValue())
                .orElseThrow(() -> new AuthenticationServiceException("Refresh token not found in Cookies"));

        String accessToken = authService.refreshToken(refreshToken);
        addCookie(response, "accessToken", accessToken, 60 * 60 * 24 * 5);
        return ResponseEntity.ok(new LoginResponseDTO(accessToken));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> delete(HttpServletResponse response) {
        clearCookie(response, "refreshToken");
        clearCookie(response, "accessToken");
        authService.delete();
        return new ResponseEntity<>(new ApiResponse<String>("Profile deleted successfully"), HttpStatus.OK);
    }

    @PostMapping(path = "/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletResponse response) {
        clearCookie(response, "refreshToken");
        clearCookie(response, "accessToken");
        return ResponseEntity.ok(new ApiResponse<>("Logged out successfully"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getUser(HttpServletResponse response) {
        UserDTO user = modelMapper.map(authService.getCurrentUser(), UserDTO.class);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    private void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        // cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

    private void clearCookie(HttpServletResponse response, String name) {
        addCookie(response, name, null, 0);
    }
}
