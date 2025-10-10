package com.ggnetworks.repository;

import com.ggnetworks.entity.CustomerProfile;
import com.ggnetworks.entity.DeviceHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceHistoryRepository extends JpaRepository<DeviceHistory, Long> {

    // Find by customer profile
    List<DeviceHistory> findByCustomerProfileAndDeletedAtIsNull(CustomerProfile customerProfile);
    
    // Find by customer profile and MAC address
    Optional<DeviceHistory> findByCustomerProfileAndMacAddressAndDeletedAtIsNull(CustomerProfile customerProfile, String macAddress);
    
    // Find by MAC address
    List<DeviceHistory> findByMacAddressAndDeletedAtIsNull(String macAddress);
    
    // Find by device type
    List<DeviceHistory> findByDeviceTypeAndDeletedAtIsNull(DeviceHistory.DeviceType deviceType);
    
    // Find by device status
    List<DeviceHistory> findByStatusAndDeletedAtIsNull(DeviceHistory.DeviceStatus status);
    
    // Find suspicious devices (MAC randomization)
    List<DeviceHistory> findByIsMacRandomizedTrueAndDeletedAtIsNull();
    
    // Find devices by last seen date
    List<DeviceHistory> findByLastSeenBeforeAndDeletedAtIsNull(LocalDateTime date);
    
    // Find devices by first seen date range
    List<DeviceHistory> findByFirstSeenBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find devices by last seen date range
    List<DeviceHistory> findByLastSeenBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find devices by IP address
    List<DeviceHistory> findByIpAddressAndDeletedAtIsNull(String ipAddress);
    
    // Find devices by IP address pattern
    @Query("SELECT dh FROM DeviceHistory dh WHERE dh.ipAddress LIKE %:pattern% AND dh.deletedAt IS NULL")
    List<DeviceHistory> findByIpAddressPattern(@Param("pattern") String pattern);
    
    // Find devices by location
    List<DeviceHistory> findByLocationAndDeletedAtIsNull(String location);
    
    // Find devices by AP name
    List<DeviceHistory> findByApNameAndDeletedAtIsNull(String apName);
    
    // Find devices by user agent pattern
    @Query("SELECT dh FROM DeviceHistory dh WHERE dh.userAgent LIKE %:pattern% AND dh.deletedAt IS NULL")
    List<DeviceHistory> findByUserAgentPattern(@Param("pattern") String pattern);
    
    // Find devices by device fingerprint
    List<DeviceHistory> findByDeviceFingerprintAndDeletedAtIsNull(String deviceFingerprint);
    
    // Find devices with high session count
    @Query("SELECT dh FROM DeviceHistory dh WHERE dh.totalSessions >= :minSessions AND dh.deletedAt IS NULL")
    List<DeviceHistory> findByMinSessions(@Param("minSessions") Long minSessions);
    
    // Find devices with high data usage
    @Query("SELECT dh FROM DeviceHistory dh WHERE dh.totalDataUsageMb >= :minDataUsage AND dh.deletedAt IS NULL")
    List<DeviceHistory> findByMinDataUsage(@Param("minDataUsage") Long minDataUsage);
    
    // Find devices by randomization count
    @Query("SELECT dh FROM DeviceHistory dh WHERE dh.randomizationCount >= :count AND dh.deletedAt IS NULL")
    List<DeviceHistory> findByRandomizationCountGreaterThanEqual(@Param("count") Integer count);
    
    // Find devices by customer profile with pagination
    Page<DeviceHistory> findByCustomerProfileAndDeletedAtIsNull(CustomerProfile customerProfile, Pageable pageable);
    
    // Find devices by status with pagination
    Page<DeviceHistory> findByStatusAndDeletedAtIsNull(DeviceHistory.DeviceStatus status, Pageable pageable);
    
    // Find devices by device type with pagination
    Page<DeviceHistory> findByDeviceTypeAndDeletedAtIsNull(DeviceHistory.DeviceType deviceType, Pageable pageable);
    
    // Count by device type
    long countByDeviceTypeAndDeletedAtIsNull(DeviceHistory.DeviceType deviceType);
    
    // Count by status
    long countByStatusAndDeletedAtIsNull(DeviceHistory.DeviceStatus status);
    
    // Count suspicious devices
    long countByIsMacRandomizedTrueAndDeletedAtIsNull();
    
    // Count devices by customer profile
    long countByCustomerProfileAndDeletedAtIsNull(CustomerProfile customerProfile);
    
    // Count devices by location
    long countByLocationAndDeletedAtIsNull(String location);
    
    // Count devices by AP name
    long countByApNameAndDeletedAtIsNull(String apName);
    
    // Find devices by customer profile and status
    List<DeviceHistory> findByCustomerProfileAndStatusAndDeletedAtIsNull(
            CustomerProfile customerProfile, DeviceHistory.DeviceStatus status);
    
    // Find devices by customer profile and device type
    List<DeviceHistory> findByCustomerProfileAndDeviceTypeAndDeletedAtIsNull(
            CustomerProfile customerProfile, DeviceHistory.DeviceType deviceType);
    
    // Find devices by customer profile and MAC randomization
    List<DeviceHistory> findByCustomerProfileAndIsMacRandomizedTrueAndDeletedAtIsNull(CustomerProfile customerProfile);
    
    // Find devices by customer profile and last seen date
    List<DeviceHistory> findByCustomerProfileAndLastSeenAfterAndDeletedAtIsNull(
            CustomerProfile customerProfile, LocalDateTime date);
    
    // Find devices by customer profile and session count
    @Query("SELECT dh FROM DeviceHistory dh WHERE dh.customerProfile = :customerProfile AND dh.totalSessions >= :minSessions AND dh.deletedAt IS NULL")
    List<DeviceHistory> findByCustomerProfileAndMinSessions(@Param("customerProfile") CustomerProfile customerProfile, @Param("minSessions") Long minSessions);
    
    // Find devices by customer profile and data usage
    @Query("SELECT dh FROM DeviceHistory dh WHERE dh.customerProfile = :customerProfile AND dh.totalDataUsageMb >= :minDataUsage AND dh.deletedAt IS NULL")
    List<DeviceHistory> findByCustomerProfileAndMinDataUsage(@Param("customerProfile") CustomerProfile customerProfile, @Param("minDataUsage") Long minDataUsage);
    
    // Get device statistics
    @Query("SELECT COUNT(dh) as totalDevices, " +
           "COUNT(CASE WHEN dh.isMacRandomized = TRUE THEN 1 END) as suspiciousDevices, " +
           "COUNT(CASE WHEN dh.status = 'BANNED' THEN 1 END) as bannedDevices, " +
           "COUNT(CASE WHEN dh.status = 'WHITELISTED' THEN 1 END) as whitelistedDevices, " +
           "AVG(dh.totalSessions) as avgSessions, " +
           "AVG(dh.totalDataUsageMb) as avgDataUsage " +
           "FROM DeviceHistory dh WHERE dh.deletedAt IS NULL")
    Object[] getDeviceStatistics();
    
    // Get device statistics by customer profile
    @Query("SELECT COUNT(dh) as totalDevices, " +
           "COUNT(CASE WHEN dh.isMacRandomized = TRUE THEN 1 END) as suspiciousDevices, " +
           "COUNT(CASE WHEN dh.status = 'BANNED' THEN 1 END) as bannedDevices, " +
           "COUNT(CASE WHEN dh.status = 'WHITELISTED' THEN 1 END) as whitelistedDevices, " +
           "AVG(dh.totalSessions) as avgSessions, " +
           "AVG(dh.totalDataUsageMb) as avgDataUsage " +
           "FROM DeviceHistory dh WHERE dh.customerProfile = :customerProfile AND dh.deletedAt IS NULL")
    Object[] getDeviceStatisticsByCustomer(@Param("customerProfile") CustomerProfile customerProfile);
} 