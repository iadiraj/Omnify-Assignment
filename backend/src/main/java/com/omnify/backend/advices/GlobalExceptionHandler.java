package com.omnify.backend.advices;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.omnify.backend.exceptions.ResourceNotFoundException;
import com.omnify.backend.exceptions.RuntimeConflictException;

import io.jsonwebtoken.JwtException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private ResponseEntity<ApiResponse<?>> buildErrorResponseEntity(ApiError apiError) {
        return new ResponseEntity<>(new ApiResponse<>(apiError), apiError.getStatus());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(ResourceNotFoundException exception) {
        ApiError apiError = ApiError.builder().status(HttpStatus.NOT_FOUND).message(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(RuntimeConflictException.class)
    public ResponseEntity<ApiResponse<?>> handleRuntimeConflictException(RuntimeConflictException exception) {
        ApiError apiError = ApiError.builder().status(HttpStatus.CONFLICT).message(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationExceptions(MethodArgumentNotValidException exception) {
        List<String> subErrors = new ArrayList<>();
        exception.getBindingResult().getFieldErrors().forEach(error -> {
            subErrors.add(error.getField() + ": " + error.getDefaultMessage());
        });
        ApiError apiError = ApiError.builder().status(HttpStatus.BAD_REQUEST).message("Validation failed")
                .subErrors(subErrors).build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<?>> handleAuthenticationException(AuthenticationException exception) {
        ApiError apiError = ApiError.builder().status(HttpStatus.UNAUTHORIZED).message(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<?>> handleJwtException(JwtException exception) {
        ApiError apiError = ApiError.builder().status(HttpStatus.UNAUTHORIZED).message(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> handleAccessDeniedException(AccessDeniedException exception) {
        ApiError apiError = ApiError.builder().status(HttpStatus.FORBIDDEN).message(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleInternalServerError(Exception exception) {
        ApiError apiError = ApiError.builder().status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message(exception.getLocalizedMessage())
                .build();
        return buildErrorResponseEntity(apiError);
    }
}