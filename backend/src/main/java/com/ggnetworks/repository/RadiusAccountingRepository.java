package com.ggnetworks.repository;

import com.ggnetworks.entity.RadiusAccounting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RadiusAccountingRepository extends JpaRepository<RadiusAccounting, Long> {
    
    // Find by session ID
    Optional<RadiusAccounting> findByAcctSessionId(String acctSessionId);
    
    // Find by unique ID
    Optional<RadiusAccounting> findByAcctUniqueId(String acctUniqueId);
    
    // Find by username
    List<RadiusAccounting> findByUsername(String username);
    
    // Find by NAS IP address
    List<RadiusAccounting> findByNasIpAddress(String nasIpAddress);
    
    // Find by MAC address
    List<RadiusAccounting> findByMacAddress(String macAddress);
    
    // Find by IP address
    List<RadiusAccounting> findByIpAddress(String ipAddress);
    
    // Find by user type
    List<RadiusAccounting> findByUserType(RadiusAccounting.UserType userType);
    
    // Find by billing status
    List<RadiusAccounting> findByBillingStatus(RadiusAccounting.BillingStatus billingStatus);
    
    // Find by location
    List<RadiusAccounting> findByLocationId(Long locationId);
    
    // Find by router
    List<RadiusAccounting> findByRouterId(Long routerId);
    
    // Find by package
    List<RadiusAccounting> findByPackageId(Long packageId);
    
    // Find by voucher
    List<RadiusAccounting> findByVoucherId(Long voucherId);
    
    // Find by VLAN
    List<RadiusAccounting> findByVlanId(Integer vlanId);
    
    // Find active sessions (no end time)
    @Query("SELECT r FROM RadiusAccounting r WHERE r.acctStopTime IS NULL")
    List<RadiusAccounting> findActiveSessions();
    
    // Find completed sessions (has end time)
    @Query("SELECT r FROM RadiusAccounting r WHERE r.acctStopTime IS NOT NULL")
    List<RadiusAccounting> findCompletedSessions();
    
    // Find sessions by date range
    @Query("SELECT r FROM RadiusAccounting r WHERE r.acctStartTime BETWEEN :startDate AND :endDate")
    List<RadiusAccounting> findSessionsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find sessions by duration range
    @Query("SELECT r FROM RadiusAccounting r WHERE r.acctSessionTime BETWEEN :minDuration AND :maxDuration")
    List<RadiusAccounting> findSessionsByDurationRange(@Param("minDuration") Long minDuration, @Param("maxDuration") Long maxDuration);
    
    // Find sessions by data usage range
    @Query("SELECT r FROM RadiusAccounting r WHERE r.dataUsageMb BETWEEN :minUsage AND :maxUsage")
    List<RadiusAccounting> findSessionsByDataUsageRange(@Param("minUsage") Long minUsage, @Param("maxUsage") Long maxUsage);
    
    // Find sessions by time usage range
    @Query("SELECT r FROM RadiusAccounting r WHERE r.timeUsageMinutes BETWEEN :minTime AND :maxTime")
    List<RadiusAccounting> findSessionsByTimeUsageRange(@Param("minTime") Long minTime, @Param("maxTime") Long maxTime);
    
    // Find sessions by cost range
    @Query("SELECT r FROM RadiusAccounting r WHERE r.sessionCost BETWEEN :minCost AND :maxCost")
    List<RadiusAccounting> findSessionsByCostRange(@Param("minCost") BigDecimal minCost, @Param("maxCost") BigDecimal maxCost);
    
    // Find sessions with high data usage
    @Query("SELECT r FROM RadiusAccounting r WHERE r.dataUsageMb > :threshold")
    List<RadiusAccounting> findSessionsWithHighDataUsage(@Param("threshold") Long threshold);
    
    // Find sessions with high time usage
    @Query("SELECT r FROM RadiusAccounting r WHERE r.timeUsageMinutes > :threshold")
    List<RadiusAccounting> findSessionsWithHighTimeUsage(@Param("threshold") Long threshold);
    
    // Find sessions with high cost
    @Query("SELECT r FROM RadiusAccounting r WHERE r.sessionCost > :threshold")
    List<RadiusAccounting> findSessionsWithHighCost(@Param("threshold") BigDecimal threshold);
    
    // Find sessions by terminate cause
    List<RadiusAccounting> findByAcctTerminateCause(String acctTerminateCause);
    
    // Find sessions by service type
    List<RadiusAccounting> findByServiceType(String serviceType);
    
    // Find sessions by framed protocol
    List<RadiusAccounting> findByFramedProtocol(String framedProtocol);
    
    // Find sessions by framed IP address
    List<RadiusAccounting> findByFramedIpAddress(String framedIpAddress);
    
    // Find sessions by called station ID
    List<RadiusAccounting> findByCalledStationId(String calledStationId);
    
    // Find sessions by calling station ID
    List<RadiusAccounting> findByCallingStationId(String callingStationId);
    
    // Find sessions by rate limits
    @Query("SELECT r FROM RadiusAccounting r WHERE r.rateLimitUp = :rateLimitUp AND r.rateLimitDown = :rateLimitDown")
    List<RadiusAccounting> findByRateLimits(@Param("rateLimitUp") String rateLimitUp, @Param("rateLimitDown") String rateLimitDown);
    
    // Find sessions by multiple criteria
    @Query("SELECT r FROM RadiusAccounting r WHERE r.userType = :userType AND r.locationId = :locationId")
    List<RadiusAccounting> findByUserTypeAndLocation(@Param("userType") RadiusAccounting.UserType userType, @Param("locationId") Long locationId);
    
    // Find sessions by multiple criteria with router
    @Query("SELECT r FROM RadiusAccounting r WHERE r.userType = :userType AND r.routerId = :routerId")
    List<RadiusAccounting> findByUserTypeAndRouter(@Param("userType") RadiusAccounting.UserType userType, @Param("routerId") Long routerId);
    
    // Find sessions by multiple criteria with package
    @Query("SELECT r FROM RadiusAccounting r WHERE r.userType = :userType AND r.packageId = :packageId")
    List<RadiusAccounting> findByUserTypeAndPackage(@Param("userType") RadiusAccounting.UserType userType, @Param("packageId") Long packageId);
    
    // Find sessions by multiple criteria with voucher
    @Query("SELECT r FROM RadiusAccounting r WHERE r.userType = :userType AND r.voucherId = :voucherId")
    List<RadiusAccounting> findByUserTypeAndVoucher(@Param("userType") RadiusAccounting.UserType userType, @Param("voucherId") Long voucherId);
    
    // Count active sessions by user type
    @Query("SELECT COUNT(r) FROM RadiusAccounting r WHERE r.userType = :userType AND r.acctStopTime IS NULL")
    Long countActiveSessionsByUserType(@Param("userType") RadiusAccounting.UserType userType);
    
    // Count active sessions by location
    @Query("SELECT COUNT(r) FROM RadiusAccounting r WHERE r.locationId = :locationId AND r.acctStopTime IS NULL")
    Long countActiveSessionsByLocation(@Param("locationId") Long locationId);
    
    // Count active sessions by router
    @Query("SELECT COUNT(r) FROM RadiusAccounting r WHERE r.routerId = :routerId AND r.acctStopTime IS NULL")
    Long countActiveSessionsByRouter(@Param("routerId") Long routerId);
    
    // Count active sessions by package
    @Query("SELECT COUNT(r) FROM RadiusAccounting r WHERE r.packageId = :packageId AND r.acctStopTime IS NULL")
    Long countActiveSessionsByPackage(@Param("packageId") Long packageId);
    
    // Count active sessions by voucher
    @Query("SELECT COUNT(r) FROM RadiusAccounting r WHERE r.voucherId = :voucherId AND r.acctStopTime IS NULL")
    Long countActiveSessionsByVoucher(@Param("voucherId") Long voucherId);
    
    // Count sessions by billing status
    @Query("SELECT COUNT(r) FROM RadiusAccounting r WHERE r.billingStatus = :billingStatus")
    Long countSessionsByBillingStatus(@Param("billingStatus") RadiusAccounting.BillingStatus billingStatus);
    
    // Sum data usage by user type
    @Query("SELECT SUM(r.dataUsageMb) FROM RadiusAccounting r WHERE r.userType = :userType")
    Long sumDataUsageByUserType(@Param("userType") RadiusAccounting.UserType userType);
    
    // Sum data usage by location
    @Query("SELECT SUM(r.dataUsageMb) FROM RadiusAccounting r WHERE r.locationId = :locationId")
    Long sumDataUsageByLocation(@Param("locationId") Long locationId);
    
    // Sum data usage by router
    @Query("SELECT SUM(r.dataUsageMb) FROM RadiusAccounting r WHERE r.routerId = :routerId")
    Long sumDataUsageByRouter(@Param("routerId") Long routerId);
    
    // Sum data usage by package
    @Query("SELECT SUM(r.dataUsageMb) FROM RadiusAccounting r WHERE r.packageId = :packageId")
    Long sumDataUsageByPackage(@Param("packageId") Long packageId);
    
    // Sum data usage by voucher
    @Query("SELECT SUM(r.dataUsageMb) FROM RadiusAccounting r WHERE r.voucherId = :voucherId")
    Long sumDataUsageByVoucher(@Param("voucherId") Long voucherId);
    
    // Sum time usage by user type
    @Query("SELECT SUM(r.timeUsageMinutes) FROM RadiusAccounting r WHERE r.userType = :userType")
    Long sumTimeUsageByUserType(@Param("userType") RadiusAccounting.UserType userType);
    
    // Sum time usage by location
    @Query("SELECT SUM(r.timeUsageMinutes) FROM RadiusAccounting r WHERE r.locationId = :locationId")
    Long sumTimeUsageByLocation(@Param("locationId") Long locationId);
    
    // Sum time usage by router
    @Query("SELECT SUM(r.timeUsageMinutes) FROM RadiusAccounting r WHERE r.routerId = :routerId")
    Long sumTimeUsageByRouter(@Param("routerId") Long routerId);
    
    // Sum time usage by package
    @Query("SELECT SUM(r.timeUsageMinutes) FROM RadiusAccounting r WHERE r.packageId = :packageId")
    Long sumTimeUsageByPackage(@Param("packageId") Long packageId);
    
    // Sum time usage by voucher
    @Query("SELECT SUM(r.timeUsageMinutes) FROM RadiusAccounting r WHERE r.voucherId = :voucherId")
    Long sumTimeUsageByVoucher(@Param("voucherId") Long voucherId);
    
    // Sum session cost by user type
    @Query("SELECT SUM(r.sessionCost) FROM RadiusAccounting r WHERE r.userType = :userType")
    BigDecimal sumSessionCostByUserType(@Param("userType") RadiusAccounting.UserType userType);
    
    // Sum session cost by location
    @Query("SELECT SUM(r.sessionCost) FROM RadiusAccounting r WHERE r.locationId = :locationId")
    BigDecimal sumSessionCostByLocation(@Param("locationId") Long locationId);
    
    // Sum session cost by router
    @Query("SELECT SUM(r.sessionCost) FROM RadiusAccounting r WHERE r.routerId = :routerId")
    BigDecimal sumSessionCostByRouter(@Param("routerId") Long routerId);
    
    // Sum session cost by package
    @Query("SELECT SUM(r.sessionCost) FROM RadiusAccounting r WHERE r.packageId = :packageId")
    BigDecimal sumSessionCostByPackage(@Param("packageId") Long packageId);
    
    // Sum session cost by voucher
    @Query("SELECT SUM(r.sessionCost) FROM RadiusAccounting r WHERE r.voucherId = :voucherId")
    BigDecimal sumSessionCostByVoucher(@Param("voucherId") Long voucherId);
    
    // Find sessions with longest duration
    @Query("SELECT r FROM RadiusAccounting r WHERE r.acctSessionTime = (SELECT MAX(r2.acctSessionTime) FROM RadiusAccounting r2)")
    List<RadiusAccounting> findSessionsWithLongestDuration();
    
    // Find sessions with highest data usage
    @Query("SELECT r FROM RadiusAccounting r WHERE r.dataUsageMb = (SELECT MAX(r2.dataUsageMb) FROM RadiusAccounting r2)")
    List<RadiusAccounting> findSessionsWithHighestDataUsage();
    
    // Find sessions with highest time usage
    @Query("SELECT r FROM RadiusAccounting r WHERE r.timeUsageMinutes = (SELECT MAX(r2.timeUsageMinutes) FROM RadiusAccounting r2)")
    List<RadiusAccounting> findSessionsWithHighestTimeUsage();
    
    // Find sessions with highest cost
    @Query("SELECT r FROM RadiusAccounting r WHERE r.sessionCost = (SELECT MAX(r2.sessionCost) FROM RadiusAccounting r2)")
    List<RadiusAccounting> findSessionsWithHighestCost();
    
    // Find sessions by input octets range
    @Query("SELECT r FROM RadiusAccounting r WHERE r.acctInputOctets BETWEEN :minOctets AND :maxOctets")
    List<RadiusAccounting> findByInputOctetsRange(@Param("minOctets") Long minOctets, @Param("maxOctets") Long maxOctets);
    
    // Find sessions by output octets range
    @Query("SELECT r FROM RadiusAccounting r WHERE r.acctOutputOctets BETWEEN :minOctets AND :maxOctets")
    List<RadiusAccounting> findByOutputOctetsRange(@Param("minOctets") Long minOctets, @Param("maxOctets") Long maxOctets);
    
    // Find sessions by session interval
    @Query("SELECT r FROM RadiusAccounting r WHERE r.acctInterval BETWEEN :minInterval AND :maxInterval")
    List<RadiusAccounting> findBySessionIntervalRange(@Param("minInterval") Long minInterval, @Param("maxInterval") Long maxInterval);
    
    // Find sessions by session timeout
    @Query("SELECT r FROM RadiusAccounting r WHERE r.sessionTimeout = :timeout")
    List<RadiusAccounting> findBySessionTimeout(@Param("timeout") Long timeout);
    
    // Find sessions by idle timeout
    @Query("SELECT r FROM RadiusAccounting r WHERE r.idleTimeout = :timeout")
    List<RadiusAccounting> findByIdleTimeout(@Param("timeout") Long timeout);
    
    // Find sessions by class
    List<RadiusAccounting> findByClazz(String clazz);
    
    // Find sessions by termination action
    List<RadiusAccounting> findByTerminationAction(String terminationAction);
    
    // Find sessions by called station SSID
    List<RadiusAccounting> findByCalledStationSsid(String calledStationSsid);
    
    // Find sessions by EAP type
    List<RadiusAccounting> findByEapType(String eapType);
    
    // Find sessions by connection info
    List<RadiusAccounting> findByConnectionInfo(String connectionInfo);
    
    // Find sessions by tunnel connection
    List<RadiusAccounting> findByTunnelConnection(String tunnelConnection);
    
    // Find sessions by tunnel type
    List<RadiusAccounting> findByTunnelType(String tunnelType);
    
    // Find sessions by tunnel medium type
    List<RadiusAccounting> findByTunnelMediumType(String tunnelMediumType);
    
    // Find sessions by tunnel client endpoint
    List<RadiusAccounting> findByTunnelClientEndpoint(String tunnelClientEndpoint);
    
    // Find sessions by tunnel server endpoint
    List<RadiusAccounting> findByTunnelServerEndpoint(String tunnelServerEndpoint);
    
    // Find sessions by tunnel client auth ID
    List<RadiusAccounting> findByTunnelClientAuthId(String tunnelClientAuthId);
    
    // Find sessions by tunnel server auth ID
    List<RadiusAccounting> findByTunnelServerAuthId(String tunnelServerAuthId);
    
    // Find sessions by tunnel assignment ID
    List<RadiusAccounting> findByTunnelAssignmentId(String tunnelAssignmentId);
    
    // Find sessions by tunnel preference
    List<RadiusAccounting> findByTunnelPreference(String tunnelPreference);
    
    // Find sessions by tunnel client auth
    List<RadiusAccounting> findByTunnelClientAuth(String tunnelClientAuth);
    
    // Find sessions by tunnel server auth
    List<RadiusAccounting> findByTunnelServerAuth(String tunnelServerAuth);
    
    // Find sessions by tunnel private group ID
    List<RadiusAccounting> findByTunnelPrivateGroupId(String tunnelPrivateGroupId);
    
    // Find sessions by tunnel type ID
    List<RadiusAccounting> findByTunnelTypeId(String tunnelTypeId);
    
    // Find sessions by tunnel medium type ID
    List<RadiusAccounting> findByTunnelMediumTypeId(String tunnelMediumTypeId);
    
    // Update billing status
    @Query("UPDATE RadiusAccounting r SET r.billingStatus = :billingStatus, r.updatedAt = :now WHERE r.id = :id")
    void updateBillingStatus(@Param("id") Long id, @Param("billingStatus") RadiusAccounting.BillingStatus billingStatus, @Param("now") LocalDateTime now);
    
    // Update session cost
    @Query("UPDATE RadiusAccounting r SET r.sessionCost = :cost, r.updatedAt = :now WHERE r.id = :id")
    void updateSessionCost(@Param("id") Long id, @Param("cost") BigDecimal cost, @Param("now") LocalDateTime now);
    
    // Update data usage
    @Query("UPDATE RadiusAccounting r SET r.dataUsageMb = :usage, r.updatedAt = :now WHERE r.id = :id")
    void updateDataUsage(@Param("id") Long id, @Param("usage") Long usage, @Param("now") LocalDateTime now);
    
    // Update time usage
    @Query("UPDATE RadiusAccounting r SET r.timeUsageMinutes = :usage, r.updatedAt = :now WHERE r.id = :id")
    void updateTimeUsage(@Param("id") Long id, @Param("usage") Long usage, @Param("now") LocalDateTime now);
    
    // Update session end time
    @Query("UPDATE RadiusAccounting r SET r.acctStopTime = :endTime, r.updatedAt = :now WHERE r.id = :id")
    void updateSessionEndTime(@Param("id") Long id, @Param("endTime") LocalDateTime endTime, @Param("now") LocalDateTime now);
    
    // Update session time
    @Query("UPDATE RadiusAccounting r SET r.acctSessionTime = :sessionTime, r.updatedAt = :now WHERE r.id = :id")
    void updateSessionTime(@Param("id") Long id, @Param("sessionTime") Long sessionTime, @Param("now") LocalDateTime now);
    
    // Update input octets
    @Query("UPDATE RadiusAccounting r SET r.acctInputOctets = :octets, r.updatedAt = :now WHERE r.id = :id")
    void updateInputOctets(@Param("id") Long id, @Param("octets") Long octets, @Param("now") LocalDateTime now);
    
    // Update output octets
    @Query("UPDATE RadiusAccounting r SET r.acctOutputOctets = :octets, r.updatedAt = :now WHERE r.id = :id")
    void updateOutputOctets(@Param("id") Long id, @Param("octets") Long octets, @Param("now") LocalDateTime now);
    
    // Count active sessions
    @Query("SELECT COUNT(r) FROM RadiusAccounting r WHERE r.acctStopTime IS NULL")
    Long countByAcctstoptimeIsNull();
    
    // Count sessions by date range
    @Query("SELECT COUNT(r) FROM RadiusAccounting r WHERE r.acctStartTime BETWEEN :startDate AND :endDate")
    Long countByAcctstarttimeBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Sum data usage
    @Query("SELECT SUM(r.dataUsageMb) FROM RadiusAccounting r")
    Long sumDataUsageMb();
    
    // Sum time usage
    @Query("SELECT SUM(r.timeUsageMinutes) FROM RadiusAccounting r")
    Long sumTimeUsageMinutes();
    
    // Find sessions by username ordered by start time
    @Query("SELECT r FROM RadiusAccounting r WHERE r.username = :username ORDER BY r.acctStartTime DESC")
    List<RadiusAccounting> findByUsernameOrderByAcctstarttimeDesc(@Param("username") String username);
} 