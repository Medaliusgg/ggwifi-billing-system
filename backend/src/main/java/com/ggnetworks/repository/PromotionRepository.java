package com.ggnetworks.repository;

import com.ggnetworks.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p WHERE p.isActive = true AND p.startDate <= :now AND p.endDate >= :now AND p.deletedAt IS NULL")
    List<Promotion> findActivePromotions(@Param("now") LocalDateTime now);

    @Query("SELECT p FROM Promotion p WHERE p.targetAudience = :targetAudience AND p.isActive = true AND p.startDate <= :now AND p.endDate >= :now AND p.deletedAt IS NULL")
    List<Promotion> findActivePromotionsByTargetAudience(@Param("targetAudience") Promotion.TargetAudience targetAudience, 
                                                        @Param("now") LocalDateTime now);



    @Query("SELECT p FROM Promotion p WHERE p.startDate >= :startDate AND p.deletedAt IS NULL")
    List<Promotion> findByStartDateAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT p FROM Promotion p WHERE p.endDate <= :endDate AND p.deletedAt IS NULL")
    List<Promotion> findByEndDateBefore(@Param("endDate") LocalDateTime endDate);

    @Query("SELECT p FROM Promotion p WHERE p.startDate BETWEEN :startDate AND :endDate AND p.deletedAt IS NULL")
    List<Promotion> findByStartDateBetween(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(p) FROM Promotion p WHERE p.isActive = true AND p.deletedAt IS NULL")
    long countActivePromotions();

    @Query("SELECT p FROM Promotion p WHERE p.deletedAt IS NULL")
    Page<Promotion> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Promotion p WHERE p.title LIKE %:title% AND p.deletedAt IS NULL")
    Page<Promotion> findByTitleContaining(@Param("title") String title, Pageable pageable);

    @Query("SELECT p FROM Promotion p WHERE p.targetAudience = :targetAudience AND p.deletedAt IS NULL")
    Page<Promotion> findByTargetAudience(@Param("targetAudience") Promotion.TargetAudience targetAudience, Pageable pageable);

    // Additional methods for PromotionService
    @Query("SELECT p FROM Promotion p WHERE p.isActive = true AND p.startDate <= :now AND p.endDate >= :now AND p.deletedAt IS NULL")
    List<Promotion> findByIsActiveTrueAndStartDateBeforeAndEndDateAfter(@Param("now") LocalDateTime now, @Param("now") LocalDateTime now2);

    @Query("SELECT p FROM Promotion p WHERE p.id = :id AND p.deletedAt IS NULL")
    java.util.Optional<Promotion> findByIdAndDeletedAtIsNull(@Param("id") Long id);
} 