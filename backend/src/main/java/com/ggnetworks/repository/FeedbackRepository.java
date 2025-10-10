package com.ggnetworks.repository;

import com.ggnetworks.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    @Query("SELECT f FROM Feedback f WHERE f.user.id = :userId AND f.deletedAt IS NULL")
    List<Feedback> findByUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM Feedback f WHERE f.status = :status AND f.deletedAt IS NULL")
    List<Feedback> findByStatus(@Param("status") Feedback.FeedbackStatus status);

    @Query("SELECT f FROM Feedback f WHERE f.rating = :rating AND f.deletedAt IS NULL")
    List<Feedback> findByRating(@Param("rating") Integer rating);

    @Query("SELECT f FROM Feedback f WHERE f.rating >= :minRating AND f.deletedAt IS NULL")
    List<Feedback> findByRatingGreaterThanEqual(@Param("minRating") Integer minRating);

    @Query("SELECT f FROM Feedback f WHERE f.email = :email AND f.deletedAt IS NULL")
    List<Feedback> findByEmail(@Param("email") String email);

    @Query("SELECT f FROM Feedback f WHERE f.phoneNumber = :phoneNumber AND f.deletedAt IS NULL")
    List<Feedback> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.status = :status AND f.deletedAt IS NULL")
    long countByStatus(@Param("status") Feedback.FeedbackStatus status);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.rating = :rating AND f.deletedAt IS NULL")
    long countByRating(@Param("rating") Integer rating);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.rating IS NOT NULL AND f.deletedAt IS NULL")
    Double getAverageRating();

    @Query("SELECT f FROM Feedback f WHERE f.deletedAt IS NULL")
    Page<Feedback> findAllActive(Pageable pageable);

    @Query("SELECT f FROM Feedback f WHERE f.name LIKE %:name% AND f.deletedAt IS NULL")
    Page<Feedback> findByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("SELECT f FROM Feedback f WHERE f.subject LIKE %:subject% AND f.deletedAt IS NULL")
    Page<Feedback> findBySubjectContaining(@Param("subject") String subject, Pageable pageable);
} 