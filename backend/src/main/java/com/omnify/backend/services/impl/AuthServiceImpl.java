package com.omnify.backend.services.impl;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.omnify.backend.dtos.LoginRequestDTO;
import com.omnify.backend.dtos.SignupDTO;
import com.omnify.backend.dtos.UserDTO;
import com.omnify.backend.entities.User;
import com.omnify.backend.exceptions.ResourceNotFoundException;
import com.omnify.backend.exceptions.RuntimeConflictException;
import com.omnify.backend.repositories.UserRepository;
import com.omnify.backend.security.JwtService;
import com.omnify.backend.services.AuthService;

import lombok.RequiredArgsConstructor;

@Service("authService")
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public User getCurrentUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long id = user.getId();
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public String[] login(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(),
                        loginRequestDTO.getPassword()));
        User user = (User) authentication.getPrincipal();
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new String[] { accessToken, refreshToken };
    }

    @Override
    public UserDTO signup(SignupDTO signupDTO) {
        User user = userRepository.findByEmail(signupDTO.getEmail()).orElse(null);
        if (user != null) {
            throw new RuntimeConflictException("Cannot Signup, User already exists with email" + signupDTO.getEmail());
        }
        User mappedUser = modelMapper.map(signupDTO, User.class);
        mappedUser.setPassword(passwordEncoder.encode(mappedUser.getPassword()));
        User savedUser = userRepository.save(mappedUser);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public String refreshToken(String refreshToken) {
        Long userId = jwtService.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return jwtService.generateAccessToken(user);
    }

    @Override
    public void delete() {
        User user = getCurrentUser();
        userRepository.delete(user);
    }

}
