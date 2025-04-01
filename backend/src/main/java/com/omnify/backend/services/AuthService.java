package com.omnify.backend.services;

import com.omnify.backend.dtos.LoginRequestDTO;
import com.omnify.backend.dtos.SignupDTO;
import com.omnify.backend.dtos.UserDTO;
import com.omnify.backend.entities.User;

public interface AuthService {
    User getCurrentUser();

    String[] login(LoginRequestDTO loginRequestDTO);

    UserDTO signup(SignupDTO signupDTO);

    String refreshToken(String refreshToken);

    void delete();
}
