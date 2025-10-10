package com.ggnetworks.repository;

import com.ggnetworks.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT al FROM AuditLog al WHERE al.user.id = :userId ORDER BY al.createdAt DESC")
    List<AuditLog> findByUserId(@Param("userId") Long userId);

    @Query("SELECT al FROM AuditLog al WHERE al.action = :action ORDER BY al.createdAt DESC")
    List<AuditLog> findByAction(@Param("action") String action);

    @Query("SELECT al FROM AuditLog al WHERE al.entityType = :entityType ORDER BY al.createdAt DESC")
    List<AuditLog> findByEntityType(@Param("entityType") String entityType);

    @Query("SELECT al FROM AuditLog al WHERE al.entityType = :entityType AND al.entityId = :entityId ORDER BY al.createdAt DESC")
    List<AuditLog> findByEntityTypeAndEntityId(@Param("entityType") String entityType, @Param("entityId") Long entityId);

    @Query("SELECT al FROM AuditLog al WHERE al.createdAt >= :startDate ORDER BY al.createdAt DESC")
    List<AuditLog> findByCreatedAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT al FROM AuditLog al WHERE al.createdAt BETWEEN :startDate AND :endDate ORDER BY al.createdAt DESC")
    List<AuditLog> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);

    @Query("SELECT al FROM AuditLog al WHERE al.ipAddress = :ipAddress ORDER BY al.createdAt DESC")
    List<AuditLog> findByIpAddress(@Param("ipAddress") String ipAddress);

    @Query("SELECT COUNT(al) FROM AuditLog al WHERE al.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(al) FROM AuditLog al WHERE al.action = :action")
    long countByAction(@Param("action") String action);

    @Query("SELECT COUNT(al) FROM AuditLog al WHERE al.entityType = :entityType")
    long countByEntityType(@Param("entityType") String entityType);

    @Query("SELECT al FROM AuditLog al ORDER BY al.createdAt DESC")
    Page<AuditLog> findAllOrdered(Pageable pageable);

    @Query("SELECT al FROM AuditLog al WHERE al.user.id = :userId ORDER BY al.createdAt DESC")
    Page<AuditLog> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT al FROM AuditLog al WHERE al.action LIKE %:action% ORDER BY al.createdAt DESC")
    Page<AuditLog> findByActionContaining(@Param("action") String action, Pageable pageable);

    @Query("SELECT al FROM AuditLog al WHERE al.entityType LIKE %:entityType% ORDER BY al.createdAt DESC")
    Page<AuditLog> findByEntityTypeContaining(@Param("entityType") String entityType, Pageable pageable);
} 