package com.ggnetworks.repository;

import com.ggnetworks.entity.LoyaltyProgram;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoyaltyProgramRepository extends JpaRepository<LoyaltyProgram, Long> {

    // Find by program type
    List<LoyaltyProgram> findByProgramTypeAndDeletedAtIsNull(LoyaltyProgram.ProgramType programType);

    // Find by target service
    List<LoyaltyProgram> findByTargetServiceAndDeletedAtIsNull(LoyaltyProgram.TargetService targetService);

    // Find by program type and target service
    List<LoyaltyProgram> findByProgramTypeAndTargetServiceAndDeletedAtIsNull(LoyaltyProgram.ProgramType programType, 
                                                  LoyaltyProgram.TargetService targetService);

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.startDate >= :startDate AND lp.deletedAt IS NULL")
    List<LoyaltyProgram> findByStartDateAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.endDate <= :endDate AND lp.deletedAt IS NULL")
    List<LoyaltyProgram> findByEndDateBefore(@Param("endDate") LocalDateTime endDate);

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.startDate BETWEEN :startDate AND :endDate AND lp.deletedAt IS NULL")
    List<LoyaltyProgram> findByStartDateBetween(@Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);

    // Find active programs
    List<LoyaltyProgram> findByIsActiveTrueAndDeletedAtIsNull();

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.targetService = 'HOTSPOT' AND lp.isActive = true AND lp.deletedAt IS NULL")
    List<LoyaltyProgram> findActiveHotspotPrograms();

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.targetService = 'PPPOE' AND lp.isActive = true AND lp.deletedAt IS NULL")
    List<LoyaltyProgram> findActivePppoePrograms();

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.targetService = 'BOTH' AND lp.isActive = true AND lp.deletedAt IS NULL")
    List<LoyaltyProgram> findActiveUniversalPrograms();

    @Query("SELECT COUNT(lp) FROM LoyaltyProgram lp WHERE lp.programType = :type AND lp.deletedAt IS NULL")
    long countByType(@Param("type") LoyaltyProgram.ProgramType type);

    @Query("SELECT COUNT(lp) FROM LoyaltyProgram lp WHERE lp.targetService = :targetService AND lp.deletedAt IS NULL")
    long countByTargetService(@Param("targetService") LoyaltyProgram.TargetService targetService);

    @Query("SELECT COUNT(lp) FROM LoyaltyProgram lp WHERE lp.isActive = true AND lp.deletedAt IS NULL")
    long countActivePrograms();

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.deletedAt IS NULL")
    Page<LoyaltyProgram> findAllActive(Pageable pageable);

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.programName LIKE %:name% AND lp.deletedAt IS NULL")
    Page<LoyaltyProgram> findByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("SELECT lp FROM LoyaltyProgram lp WHERE lp.description LIKE %:description% AND lp.deletedAt IS NULL")
    Page<LoyaltyProgram> findByDescriptionContaining(@Param("description") String description, Pageable pageable);

    // Note: These fields don't exist in the LoyaltyProgram entity
    // Removed methods that reference non-existent fields
} 