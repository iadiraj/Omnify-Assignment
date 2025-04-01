package com.omnify.backend.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.omnify.backend.dtos.BlogRequestDTO;
import com.omnify.backend.dtos.BlogResponseDTO;

public interface BlogService {
    BlogResponseDTO createBlog(BlogRequestDTO blog);

    BlogResponseDTO updateBlog(Long id, BlogRequestDTO blog);

    Page<BlogResponseDTO> getBlogByAuthor(PageRequest pageRequest);

    Page<BlogResponseDTO> getAllBlogs(PageRequest pageRequest);

    void deleteBlog(Long id);

    BlogResponseDTO getBlog(Long id);

    boolean isOwnerOfBlog(Long id);
}
