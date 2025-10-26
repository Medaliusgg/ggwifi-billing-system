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

    // Basic queries
    List<AuditLog> findByUserId(Long userId);
    List<AuditLog> findByUsername(String username);
    List<AuditLog> findByAction(String action);
    List<AuditLog> findByResourceType(String resourceType);
    List<AuditLog> findByRiskLevel(AuditLog.RiskLevel riskLevel);
    List<AuditLog> findByIpAddress(String ipAddress);

    // Date range queries
    List<AuditLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<AuditLog> findByCreatedAtAfter(LocalDateTime date);
    List<AuditLog> findByCreatedAtBefore(LocalDateTime date);

    // User activity queries
    List<AuditLog> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    List<AuditLog> findByUsernameAndCreatedAtBetween(String username, LocalDateTime startDate, LocalDateTime endDate);

    // Risk-based queries
    List<AuditLog> findByRiskLevelAndCreatedAtBetween(AuditLog.RiskLevel riskLevel, LocalDateTime startDate, LocalDateTime endDate);
    List<AuditLog> findByRiskLevelIn(List<AuditLog.RiskLevel> riskLevels);
    List<AuditLog> findByRiskLevelInAndCreatedAtAfter(List<AuditLog.RiskLevel> riskLevels, LocalDateTime date);

    // IP-based queries
    List<AuditLog> findByIpAddressAndCreatedAtBetween(String ipAddress, LocalDateTime startDate, LocalDateTime endDate);

    // Resource-based queries
    List<AuditLog> findByResourceTypeAndResourceId(String resourceType, String resourceId);
    List<AuditLog> findByResourceTypeAndCreatedAtBetween(String resourceType, LocalDateTime startDate, LocalDateTime endDate);

    // Pagination support
    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
    Page<AuditLog> findByUsername(String username, Pageable pageable);
    Page<AuditLog> findByAction(String action, Pageable pageable);
    Page<AuditLog> findByRiskLevel(AuditLog.RiskLevel riskLevel, Pageable pageable);
    Page<AuditLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Count queries
    long countByUserId(Long userId);
    long countByUsername(String username);
    long countByAction(String action);
    long countByRiskLevel(AuditLog.RiskLevel riskLevel);
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Analytics queries
    @Query("SELECT a.action, COUNT(a) FROM AuditLog a WHERE a.createdAt BETWEEN :startDate AND :endDate GROUP BY a.action ORDER BY COUNT(a) DESC")
    List<Object[]> getActionCountsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a.username, COUNT(a) FROM AuditLog a WHERE a.createdAt BETWEEN :startDate AND :endDate GROUP BY a.username ORDER BY COUNT(a) DESC")
    List<Object[]> getUserActivityByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a.ipAddress, COUNT(a) FROM AuditLog a WHERE a.createdAt BETWEEN :startDate AND :endDate GROUP BY a.ipAddress ORDER BY COUNT(a) DESC")
    List<Object[]> getIpActivityByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a.riskLevel, COUNT(a) FROM AuditLog a WHERE a.createdAt BETWEEN :startDate AND :endDate GROUP BY a.riskLevel ORDER BY COUNT(a) DESC")
    List<Object[]> getRiskLevelCountsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Search queries
    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:username IS NULL OR a.username LIKE %:username%) AND " +
           "(:action IS NULL OR a.action LIKE %:action%) AND " +
           "(:resourceType IS NULL OR a.resourceType LIKE %:resourceType%) AND " +
           "(:ipAddress IS NULL OR a.ipAddress LIKE %:ipAddress%) AND " +
           "(:startDate IS NULL OR a.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR a.createdAt <= :endDate)")
    Page<AuditLog> searchAuditLogs(@Param("username") String username,
                                   @Param("action") String action,
                                   @Param("resourceType") String resourceType,
                                   @Param("ipAddress") String ipAddress,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate,
                                   Pageable pageable);
    
    // Dashboard methods
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.riskLevel = :riskLevel")
    long countByRiskLevelString(@Param("riskLevel") String riskLevel);
    
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.resourceType = :resourceType")
    long countByResourceType(@Param("resourceType") String resourceType);
    
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.resourceType = :resourceType AND a.riskLevel = :riskLevel")
    long countByResourceTypeAndRiskLevel(@Param("resourceType") String resourceType, @Param("riskLevel") AuditLog.RiskLevel riskLevel);
    
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.riskLevel = :riskLevel AND a.createdAt >= :date")
    long countByRiskLevelAndCreatedAtAfter(@Param("riskLevel") AuditLog.RiskLevel riskLevel, @Param("date") LocalDateTime date);
}
