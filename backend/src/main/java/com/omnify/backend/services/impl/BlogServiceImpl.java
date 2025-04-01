package com.omnify.backend.services.impl;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.omnify.backend.dtos.BlogRequestDTO;
import com.omnify.backend.dtos.BlogResponseDTO;
import com.omnify.backend.entities.Blog;
import com.omnify.backend.entities.User;
import com.omnify.backend.exceptions.ResourceNotFoundException;
import com.omnify.backend.repositories.BlogRepository;
import com.omnify.backend.services.AuthService;
import com.omnify.backend.services.BlogService;

import lombok.RequiredArgsConstructor;

@Service("blogService")
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final AuthService authService;
    private final ModelMapper modelMapper;
    private final BlogRepository blogRepository;

    @Override
    public BlogResponseDTO createBlog(BlogRequestDTO blogDto) {
        User user = authService.getCurrentUser();
        Blog blog = modelMapper.map(blogDto, Blog.class);
        blog.setAuthor(user);
        Blog savedBlog = blogRepository.save(blog);
        return modelMapper.map(savedBlog, BlogResponseDTO.class);
    }

    @Override
    public Page<BlogResponseDTO> getBlogByAuthor(PageRequest pageRequest) {
        User user = authService.getCurrentUser();
        return blogRepository.findByAuthor(user, pageRequest).map(blog -> modelMapper.map(blog, BlogResponseDTO.class));
    }

    @Override
    public BlogResponseDTO updateBlog(Long id, BlogRequestDTO blogDto) {
        Blog existingBlog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));

        existingBlog.setTitle(blogDto.getTitle());
        existingBlog.setContent(blogDto.getContent());

        Blog savedBlog = blogRepository.save(existingBlog);
        return modelMapper.map(savedBlog, BlogResponseDTO.class);
    }

    @Override
    public Page<BlogResponseDTO> getAllBlogs(PageRequest pageRequest) {
        return blogRepository.findAll(pageRequest).map(blog -> modelMapper.map(blog, BlogResponseDTO.class));
    }

    @Override
    public void deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blogRepository.delete(blog);
    }

    @Override
    public BlogResponseDTO getBlog(Long id) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        return modelMapper.map(blog, BlogResponseDTO.class);
    }

    @Override
    public boolean isOwnerOfBlog(Long id) {
        User currentUser = authService.getCurrentUser();
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        return blog.getAuthor().getId().equals(currentUser.getId());
    }

}
