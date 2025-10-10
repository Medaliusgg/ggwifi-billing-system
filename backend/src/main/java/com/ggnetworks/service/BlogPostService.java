package com.ggnetworks.service;

import com.ggnetworks.entity.BlogPost;
import com.ggnetworks.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;

    public Page<BlogPost> getPublishedBlogPosts(Pageable pageable) {
        try {
            return blogPostRepository.findPublishedPosts(pageable);
        } catch (Exception e) {
            log.error("Failed to get published blog posts", e);
            return Page.empty(pageable);
        }
    }

    public BlogPost getBlogPostById(Long id) {
        try {
            return blogPostRepository.findById(id).orElse(null);
        } catch (Exception e) {
            log.error("Failed to get blog post by ID", e);
            return null;
        }
    }
} 