package com.omnify.backend.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BlogResponseDTO {
    private Long id;
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;
    @NotBlank(message = "Content is required")
    private String content;
    private UserDTO author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
