package com.ggnetworks.repository;

import com.ggnetworks.entity.DataPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DataPlanRepository extends JpaRepository<DataPlan, Long> {
    
    // Find by plan code
    Optional<DataPlan> findByPlanCode(String planCode);
    
    // Find active plans
    List<DataPlan> findByIsActiveTrue();
    
    // Find by plan type
    List<DataPlan> findByPlanType(DataPlan.PlanType planType);
    
    // Find active plans by type
    List<DataPlan> findByPlanTypeAndIsActiveTrue(DataPlan.PlanType planType);
    
    // Find by service type
    List<DataPlan> findByServiceType(DataPlan.ServiceType serviceType);
    
    // Find active plans by service type
    List<DataPlan> findByServiceTypeAndIsActiveTrue(DataPlan.ServiceType serviceType);
    
    // Find popular plans
    List<DataPlan> findByIsPopularTrue();
    
    // Find featured plans
    List<DataPlan> findByIsFeaturedTrue();
    
    // Find by price range
    @Query("SELECT d FROM DataPlan d WHERE d.price BETWEEN :minPrice AND :maxPrice AND d.isActive = true")
    List<DataPlan> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    // Find by duration range
    @Query("SELECT d FROM DataPlan d WHERE d.durationDays BETWEEN :minDays AND :maxDays AND d.isActive = true")
    List<DataPlan> findByDurationRange(@Param("minDays") Integer minDays, @Param("maxDays") Integer maxDays);
    
    // Find by speed range
    @Query("SELECT d FROM DataPlan d WHERE d.downloadSpeedMbps BETWEEN :minSpeed AND :maxSpeed AND d.isActive = true")
    List<DataPlan> findBySpeedRange(@Param("minSpeed") Integer minSpeed, @Param("maxSpeed") Integer maxSpeed);
    
    // Find unlimited data plans
    List<DataPlan> findByIsUnlimitedDataTrue();
    
    // Find limited data plans
    List<DataPlan> findByIsUnlimitedDataFalse();
    
    // Find by voucher prefix
    List<DataPlan> findByVoucherPrefix(String voucherPrefix);
    
    // Find by router
    List<DataPlan> findByRouterId(Long routerId);
    
    // Find by location
    List<DataPlan> findByLocationId(Long locationId);
    
    // Find by VLAN
    List<DataPlan> findByVlanId(Integer vlanId);
    
    // Find by NAS identifier
    List<DataPlan> findByNasIdentifier(String nasIdentifier);
    
    // Find plans valid in date range
    @Query("SELECT d FROM DataPlan d WHERE (d.validFrom IS NULL OR d.validFrom <= :now) AND (d.validUntil IS NULL OR d.validUntil >= :now) AND d.isActive = true")
    List<DataPlan> findValidPlans(@Param("now") LocalDateTime now);
    
    // Find plans expiring soon
    @Query("SELECT d FROM DataPlan d WHERE d.validUntil BETWEEN :now AND :future AND d.isActive = true")
    List<DataPlan> findPlansExpiringSoon(@Param("now") LocalDateTime now, @Param("future") LocalDateTime future);
    
    // Find plans by multiple criteria
    @Query("SELECT d FROM DataPlan d WHERE d.planType = :planType AND d.serviceType = :serviceType AND d.isActive = true")
    List<DataPlan> findByPlanTypeAndServiceType(@Param("planType") DataPlan.PlanType planType, @Param("serviceType") DataPlan.ServiceType serviceType);
    
    // Find plans by price and duration
    @Query("SELECT d FROM DataPlan d WHERE d.price <= :maxPrice AND d.durationDays >= :minDays AND d.isActive = true")
    List<DataPlan> findByPriceAndDuration(@Param("maxPrice") BigDecimal maxPrice, @Param("minDays") Integer minDays);
    
    // Find plans by speed and price
    @Query("SELECT d FROM DataPlan d WHERE d.downloadSpeedMbps >= :minSpeed AND d.price <= :maxPrice AND d.isActive = true")
    List<DataPlan> findBySpeedAndPrice(@Param("minSpeed") Integer minSpeed, @Param("maxPrice") BigDecimal maxPrice);
    
    // Count active plans by type
    @Query("SELECT COUNT(d) FROM DataPlan d WHERE d.planType = :planType AND d.isActive = true")
    Long countActivePlansByType(@Param("planType") DataPlan.PlanType planType);
    
    // Count active plans by service type
    @Query("SELECT COUNT(d) FROM DataPlan d WHERE d.serviceType = :serviceType AND d.isActive = true")
    Long countActivePlansByServiceType(@Param("serviceType") DataPlan.ServiceType serviceType);
    
    // Count popular plans
    @Query("SELECT COUNT(d) FROM DataPlan d WHERE d.isPopular = true AND d.isActive = true")
    Long countPopularPlans();
    
    // Count featured plans
    @Query("SELECT COUNT(d) FROM DataPlan d WHERE d.isFeatured = true AND d.isActive = true")
    Long countFeaturedPlans();
    
    // Find plans with highest price
    @Query("SELECT d FROM DataPlan d WHERE d.price = (SELECT MAX(d2.price) FROM DataPlan d2 WHERE d2.isActive = true) AND d.isActive = true")
    List<DataPlan> findMostExpensivePlans();
    
    // Find plans with lowest price
    @Query("SELECT d FROM DataPlan d WHERE d.price = (SELECT MIN(d2.price) FROM DataPlan d2 WHERE d2.isActive = true) AND d.isActive = true")
    List<DataPlan> findCheapestPlans();
    
    // Find plans with highest speed
    @Query("SELECT d FROM DataPlan d WHERE d.downloadSpeedMbps = (SELECT MAX(d2.downloadSpeedMbps) FROM DataPlan d2 WHERE d2.isActive = true) AND d.isActive = true")
    List<DataPlan> findFastestPlans();
    
    // Find plans with longest duration
    @Query("SELECT d FROM DataPlan d WHERE d.durationDays = (SELECT MAX(d2.durationDays) FROM DataPlan d2 WHERE d2.isActive = true) AND d.isActive = true")
    List<DataPlan> findLongestDurationPlans();
    
    // Find plans by sort order
    List<DataPlan> findBySortOrderOrderBySortOrderAsc(Integer sortOrder);
    
    // Find plans by concurrent users
    @Query("SELECT d FROM DataPlan d WHERE d.maxConcurrentUsers >= :minUsers AND d.isActive = true")
    List<DataPlan> findByMinConcurrentUsers(@Param("minUsers") Integer minUsers);
    
    // Find plans by session timeout
    @Query("SELECT d FROM DataPlan d WHERE d.sessionTimeoutMinutes = :timeout AND d.isActive = true")
    List<DataPlan> findBySessionTimeout(@Param("timeout") Integer timeout);
    
    // Find plans by idle timeout
    @Query("SELECT d FROM DataPlan d WHERE d.idleTimeoutMinutes = :timeout AND d.isActive = true")
    List<DataPlan> findByIdleTimeout(@Param("timeout") Integer timeout);
    
    // Find plans by rate limits
    @Query("SELECT d FROM DataPlan d WHERE d.rateLimitUp = :rateLimitUp AND d.rateLimitDown = :rateLimitDown AND d.isActive = true")
    List<DataPlan> findByRateLimits(@Param("rateLimitUp") String rateLimitUp, @Param("rateLimitDown") String rateLimitDown);
    
    // Find plans created by user
    List<DataPlan> findByCreatedBy(Long createdBy);
    
    // Find plans updated by user
    List<DataPlan> findByUpdatedBy(Long updatedBy);
    
    // Find plans created in date range
    @Query("SELECT d FROM DataPlan d WHERE d.createdAt BETWEEN :startDate AND :endDate")
    List<DataPlan> findPlansCreatedInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find plans by multiple criteria
    @Query("SELECT d FROM DataPlan d WHERE d.planType = :planType AND d.routerId = :routerId AND d.isActive = true")
    List<DataPlan> findByPlanTypeAndRouter(@Param("planType") DataPlan.PlanType planType, @Param("routerId") Long routerId);
    
    // Find plans by multiple criteria with location
    @Query("SELECT d FROM DataPlan d WHERE d.planType = :planType AND d.locationId = :locationId AND d.isActive = true")
    List<DataPlan> findByPlanTypeAndLocation(@Param("planType") DataPlan.PlanType planType, @Param("locationId") Long locationId);
    
    // Find plans by multiple criteria with VLAN
    @Query("SELECT d FROM DataPlan d WHERE d.planType = :planType AND d.vlanId = :vlanId AND d.isActive = true")
    List<DataPlan> findByPlanTypeAndVlan(@Param("planType") DataPlan.PlanType planType, @Param("vlanId") Integer vlanId);
    
    // Soft delete by plan code
    @Query("UPDATE DataPlan d SET d.isActive = false, d.updatedAt = :now WHERE d.planCode = :planCode")
    void softDeleteByPlanCode(@Param("planCode") String planCode, @Param("now") LocalDateTime now);
    
    // Update price
    @Query("UPDATE DataPlan d SET d.price = :price, d.updatedAt = :now WHERE d.id = :id")
    void updatePrice(@Param("id") Long id, @Param("price") BigDecimal price, @Param("now") LocalDateTime now);
    
    // Update popularity
    @Query("UPDATE DataPlan d SET d.isPopular = :isPopular, d.updatedAt = :now WHERE d.id = :id")
    void updatePopularity(@Param("id") Long id, @Param("isPopular") Boolean isPopular, @Param("now") LocalDateTime now);
    
    // Update featured status
    @Query("UPDATE DataPlan d SET d.isFeatured = :isFeatured, d.updatedAt = :now WHERE d.id = :id")
    void updateFeaturedStatus(@Param("id") Long id, @Param("isFeatured") Boolean isFeatured, @Param("now") LocalDateTime now);
    
    // Update active status
    @Query("UPDATE DataPlan d SET d.isActive = :isActive, d.updatedAt = :now WHERE d.id = :id")
    void updateActiveStatus(@Param("id") Long id, @Param("isActive") Boolean isActive, @Param("now") LocalDateTime now);
    
    // Update sort order
    @Query("UPDATE DataPlan d SET d.sortOrder = :sortOrder, d.updatedAt = :now WHERE d.id = :id")
    void updateSortOrder(@Param("id") Long id, @Param("sortOrder") Integer sortOrder, @Param("now") LocalDateTime now);
} 