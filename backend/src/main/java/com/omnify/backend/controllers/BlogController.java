package com.omnify.backend.controllers;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.omnify.backend.advices.ApiResponse;
import com.omnify.backend.dtos.BlogRequestDTO;
import com.omnify.backend.dtos.BlogResponseDTO;
import com.omnify.backend.services.BlogService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "api/v1/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping("/{id}")
    public ResponseEntity<BlogResponseDTO> getBlog(@PathVariable(name = "id") Long id) {
        return new ResponseEntity<>(blogService.getBlog(id), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<BlogResponseDTO>> getAllBlogs(@RequestParam(defaultValue = "0") Integer pageOffset,
            @RequestParam(defaultValue = "10", required = false) Integer pageSize) {
        PageRequest pageRequest = PageRequest.of(pageOffset, pageSize,
                Sort.by(Direction.DESC, "createdAt", "id"));
        return new ResponseEntity<>(blogService.getAllBlogs(pageRequest).getContent(), HttpStatus.OK);
    }

    @GetMapping(path = "/myblogs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BlogResponseDTO>> getAuthorBlogs(@RequestParam(defaultValue = "0") Integer pageOffset,
            @RequestParam(defaultValue = "10", required = false) Integer pageSize) {
        PageRequest pageRequest = PageRequest.of(pageOffset, pageSize,
                Sort.by(Direction.DESC, "createdAt", "id"));
        return new ResponseEntity<>(blogService.getBlogByAuthor(pageRequest).getContent(), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}")
    @PreAuthorize("isAuthenticated() and @blogService.isOwnerOfBlog(#id)")
    public ResponseEntity<Object> deleteBlog(@PathVariable(name = "id") Long id) {
        blogService.deleteBlog(id);
        return new ResponseEntity<>(new ApiResponse<String>("Blog deleted successfully"), HttpStatus.OK);
    }

    @PatchMapping(path = "/{id}")
    @PreAuthorize("isAuthenticated() and @blogService.isOwnerOfBlog(#id)")
    public ResponseEntity<BlogResponseDTO> updateBlog(@PathVariable(name = "id") Long id,
            @RequestBody @Valid BlogRequestDTO blogDto) {
        return new ResponseEntity<>(blogService.updateBlog(id, blogDto), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BlogResponseDTO> createBlog(@RequestBody @Valid BlogRequestDTO blogDto) {
        return new ResponseEntity<>(blogService.createBlog(blogDto), HttpStatus.CREATED);
    }
}
