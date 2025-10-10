package com.ggnetworks.repository;

import com.ggnetworks.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.application.id = :applicationId AND c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findByApplicationId(@Param("applicationId") Long applicationId);

    @Query("SELECT c FROM Comment c WHERE c.user.id = :userId AND c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Comment c WHERE c.application.id = :applicationId AND c.deletedAt IS NULL")
    Page<Comment> findByApplicationId(@Param("applicationId") Long applicationId, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.application.id = :applicationId AND c.deletedAt IS NULL")
    long countByApplicationId(@Param("applicationId") Long applicationId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.user.id = :userId AND c.deletedAt IS NULL")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Comment c WHERE c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findAllActive(Pageable pageable);
} 