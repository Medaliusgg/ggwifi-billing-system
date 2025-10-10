package com.ggnetworks.repository;

import com.ggnetworks.entity.RadiusUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RadiusUserRepository extends JpaRepository<RadiusUser, Long> {
    
    // Find by username
    Optional<RadiusUser> findByUsername(String username);
    
    // Find by username and attribute
    Optional<RadiusUser> findByUsernameAndAttribute(String username, String attribute);
    
    // Find active users
    List<RadiusUser> findByIsActiveTrue();
    
    // Find by user type
    List<RadiusUser> findByUserType(RadiusUser.UserType userType);
    
    // Find active users by type
    List<RadiusUser> findByUserTypeAndIsActiveTrue(RadiusUser.UserType userType);
    
    // Find by location
    List<RadiusUser> findByLocationId(Long locationId);
    
    // Find by router
    List<RadiusUser> findByRouterId(Long routerId);
    
    // Find by package
    List<RadiusUser> findByPackageId(Long packageId);
    
    // Find expired users
    @Query("SELECT r FROM RadiusUser r WHERE r.expiresAt < :now AND r.isActive = true")
    List<RadiusUser> findExpiredUsers(@Param("now") LocalDateTime now);
    
    // Find users expiring soon
    @Query("SELECT r FROM RadiusUser r WHERE r.expiresAt BETWEEN :now AND :future AND r.isActive = true")
    List<RadiusUser> findUsersExpiringSoon(@Param("now") LocalDateTime now, @Param("future") LocalDateTime future);
    
    // Find by MAC address
    Optional<RadiusUser> findByMacAddress(String macAddress);
    
    // Find by IP address
    Optional<RadiusUser> findByIpAddress(String ipAddress);
    
    // Find users with high data usage
    @Query("SELECT r FROM RadiusUser r WHERE r.totalDataUsageMb > :threshold AND r.isActive = true")
    List<RadiusUser> findUsersWithHighDataUsage(@Param("threshold") Long threshold);
    
    // Find users with high time usage
    @Query("SELECT r FROM RadiusUser r WHERE r.totalTimeUsageMinutes > :threshold AND r.isActive = true")
    List<RadiusUser> findUsersWithHighTimeUsage(@Param("threshold") Long threshold);
    
    // Count active users by type
    @Query("SELECT COUNT(r) FROM RadiusUser r WHERE r.userType = :userType AND r.isActive = true")
    Long countActiveUsersByType(@Param("userType") RadiusUser.UserType userType);
    
    // Count users by location
    @Query("SELECT COUNT(r) FROM RadiusUser r WHERE r.locationId = :locationId AND r.isActive = true")
    Long countUsersByLocation(@Param("locationId") Long locationId);
    
    // Count users by router
    @Query("SELECT COUNT(r) FROM RadiusUser r WHERE r.routerId = :routerId AND r.isActive = true")
    Long countUsersByRouter(@Param("routerId") Long routerId);
    
    // Find users created in date range
    @Query("SELECT r FROM RadiusUser r WHERE r.createdAt BETWEEN :startDate AND :endDate")
    List<RadiusUser> findUsersCreatedInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find users with last login in range
    @Query("SELECT r FROM RadiusUser r WHERE r.lastLogin BETWEEN :startDate AND :endDate")
    List<RadiusUser> findUsersWithLastLoginInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find users by NAS identifier
    List<RadiusUser> findByNasIdentifier(String nasIdentifier);
    
    // Find users by VLAN
    List<RadiusUser> findByVlanId(Integer vlanId);
    
    // Find users with specific rate limits
    @Query("SELECT r FROM RadiusUser r WHERE r.rateLimitUp = :rateLimitUp AND r.rateLimitDown = :rateLimitDown")
    List<RadiusUser> findByRateLimits(@Param("rateLimitUp") String rateLimitUp, @Param("rateLimitDown") String rateLimitDown);
    
    // Find users with concurrent use limit
    @Query("SELECT r FROM RadiusUser r WHERE r.concurrentUse > :limit")
    List<RadiusUser> findByConcurrentUseGreaterThan(@Param("limit") Integer limit);
    
    // Find users by session timeout
    @Query("SELECT r FROM RadiusUser r WHERE r.sessionTimeout = :timeout")
    List<RadiusUser> findBySessionTimeout(@Param("timeout") Long timeout);
    
    // Find users by idle timeout
    @Query("SELECT r FROM RadiusUser r WHERE r.idleTimeout = :timeout")
    List<RadiusUser> findByIdleTimeout(@Param("timeout") Long timeout);
    
    // Find users with data limit
    @Query("SELECT r FROM RadiusUser r WHERE r.dataLimitMb IS NOT NULL AND r.dataLimitMb > 0")
    List<RadiusUser> findUsersWithDataLimit();
    
    // Find users with time limit
    @Query("SELECT r FROM RadiusUser r WHERE r.timeLimitMinutes IS NOT NULL AND r.timeLimitMinutes > 0")
    List<RadiusUser> findUsersWithTimeLimit();
    
    // Find users by multiple criteria
    @Query("SELECT r FROM RadiusUser r WHERE r.userType = :userType AND r.locationId = :locationId AND r.isActive = true")
    List<RadiusUser> findByUserTypeAndLocation(@Param("userType") RadiusUser.UserType userType, @Param("locationId") Long locationId);
    
    // Find users by multiple criteria with router
    @Query("SELECT r FROM RadiusUser r WHERE r.userType = :userType AND r.routerId = :routerId AND r.isActive = true")
    List<RadiusUser> findByUserTypeAndRouter(@Param("userType") RadiusUser.UserType userType, @Param("routerId") Long routerId);
    
    // Find users by multiple criteria with package
    @Query("SELECT r FROM RadiusUser r WHERE r.userType = :userType AND r.packageId = :packageId AND r.isActive = true")
    List<RadiusUser> findByUserTypeAndPackage(@Param("userType") RadiusUser.UserType userType, @Param("packageId") Long packageId);
    
    // Delete by username
    void deleteByUsername(String username);
    
    // Delete by username and attribute
    void deleteByUsernameAndAttribute(String username, String attribute);
    
    // Soft delete by username
    @Query("UPDATE RadiusUser r SET r.isActive = false, r.updatedAt = :now WHERE r.username = :username")
    void softDeleteByUsername(@Param("username") String username, @Param("now") LocalDateTime now);
    
    // Update last login
    @Query("UPDATE RadiusUser r SET r.lastLogin = :lastLogin, r.updatedAt = :now WHERE r.username = :username")
    void updateLastLogin(@Param("username") String username, @Param("lastLogin") LocalDateTime lastLogin, @Param("now") LocalDateTime now);
    
    // Update last logout
    @Query("UPDATE RadiusUser r SET r.lastLogout = :lastLogout, r.updatedAt = :now WHERE r.username = :username")
    void updateLastLogout(@Param("username") String username, @Param("lastLogout") LocalDateTime lastLogout, @Param("now") LocalDateTime now);
    
    // Update data usage
    @Query("UPDATE RadiusUser r SET r.totalDataUsageMb = :dataUsage, r.updatedAt = :now WHERE r.username = :username")
    void updateDataUsage(@Param("username") String username, @Param("dataUsage") Long dataUsage, @Param("now") LocalDateTime now);
    
    // Update time usage
    @Query("UPDATE RadiusUser r SET r.totalTimeUsageMinutes = :timeUsage, r.updatedAt = :now WHERE r.username = :username")
    void updateTimeUsage(@Param("username") String username, @Param("timeUsage") Long timeUsage, @Param("now") LocalDateTime now);
    
    // Count active users
    @Query("SELECT COUNT(r) FROM RadiusUser r WHERE r.isActive = true")
    Long countByIsActiveTrue();
    
    // Count users by type
    @Query("SELECT COUNT(r) FROM RadiusUser r WHERE r.userType = :userType")
    Long countByUserType(@Param("userType") RadiusUser.UserType userType);
} 