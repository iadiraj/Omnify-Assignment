package com.omnify.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.omnify.backend.entities.Blog;
import com.omnify.backend.entities.User;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByAuthor(User author, Pageable pageRequest);
}
