package com.ggnetworks.repository;

import com.ggnetworks.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    @Query("SELECT bp FROM BlogPost bp WHERE bp.isPublished = true AND bp.publishedAt IS NOT NULL AND bp.deletedAt IS NULL ORDER BY bp.publishedAt DESC")
    List<BlogPost> findPublishedPosts();

    @Query("SELECT bp FROM BlogPost bp WHERE bp.isPublished = true AND bp.publishedAt IS NOT NULL AND bp.deletedAt IS NULL ORDER BY bp.publishedAt DESC")
    Page<BlogPost> findPublishedPosts(Pageable pageable);

    @Query("SELECT bp FROM BlogPost bp WHERE bp.author = :author AND bp.deletedAt IS NULL")
    List<BlogPost> findByAuthor(@Param("author") String author);

    @Query("SELECT bp FROM BlogPost bp WHERE bp.tags LIKE %:tag% AND bp.isPublished = true AND bp.publishedAt IS NOT NULL AND bp.deletedAt IS NULL")
    List<BlogPost> findByTag(@Param("tag") String tag);

    @Query("SELECT bp FROM BlogPost bp WHERE bp.publishedAt >= :startDate AND bp.isPublished = true AND bp.deletedAt IS NULL")
    List<BlogPost> findByPublishedAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT bp FROM BlogPost bp WHERE bp.publishedAt BETWEEN :startDate AND :endDate AND bp.isPublished = true AND bp.deletedAt IS NULL")
    List<BlogPost> findByPublishedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(bp) FROM BlogPost bp WHERE bp.isPublished = true AND bp.deletedAt IS NULL")
    long countPublishedPosts();

    @Query("SELECT COUNT(bp) FROM BlogPost bp WHERE bp.author = :author AND bp.deletedAt IS NULL")
    long countByAuthor(@Param("author") String author);

    @Query("SELECT bp FROM BlogPost bp WHERE bp.deletedAt IS NULL")
    Page<BlogPost> findAllActive(Pageable pageable);

    @Query("SELECT bp FROM BlogPost bp WHERE bp.title LIKE %:title% AND bp.deletedAt IS NULL")
    Page<BlogPost> findByTitleContaining(@Param("title") String title, Pageable pageable);

    @Query("SELECT bp FROM BlogPost bp WHERE bp.author LIKE %:author% AND bp.deletedAt IS NULL")
    Page<BlogPost> findByAuthorContaining(@Param("author") String author, Pageable pageable);

    @Query("SELECT bp FROM BlogPost bp WHERE bp.tags LIKE %:tags% AND bp.deletedAt IS NULL")
    Page<BlogPost> findByTagsContaining(@Param("tags") String tags, Pageable pageable);
} 