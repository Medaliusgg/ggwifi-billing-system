package com.ggnetworks.repository;

import com.ggnetworks.entity.VoucherSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherSeriesRepository extends JpaRepository<VoucherSeries, Long> {
    
    // Find by series code
    Optional<VoucherSeries> findBySeriesCode(String seriesCode);
    
    // Find active series
    List<VoucherSeries> findByIsActiveTrue();
    
    // Find by series type
    List<VoucherSeries> findBySeriesType(VoucherSeries.SeriesType seriesType);
    
    // Find active series by type
    List<VoucherSeries> findBySeriesTypeAndIsActiveTrue(VoucherSeries.SeriesType seriesType);
    
    // Find by status
    List<VoucherSeries> findByStatus(VoucherSeries.SeriesStatus status);
    
    // Find active series by status
    List<VoucherSeries> findByStatusAndIsActiveTrue(VoucherSeries.SeriesStatus status);
    
    // Find by data plan
    List<VoucherSeries> findByDataPlanId(Long dataPlanId);
    
    // Find by location
    List<VoucherSeries> findByLocationId(Long locationId);
    
    // Find by router
    List<VoucherSeries> findByRouterId(Long routerId);
    
    // Find by voucher prefix
    List<VoucherSeries> findByVoucherPrefix(String voucherPrefix);
    
    // Find roaming enabled series
    List<VoucherSeries> findByIsRoamingEnabledTrue();
    
    // Find series with multiple devices allowed
    List<VoucherSeries> findByAllowMultipleDevicesTrue();
    
    // Find series with MAC address checking
    List<VoucherSeries> findByCheckMacAddressTrue();
    
    // Find auto-generate series
    List<VoucherSeries> findByAutoGenerateTrue();
    
    // Find series by price range
    @Query("SELECT v FROM VoucherSeries v WHERE v.pricePerVoucher BETWEEN :minPrice AND :maxPrice AND v.isActive = true")
    List<VoucherSeries> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    // Find series by duration range
    @Query("SELECT v FROM VoucherSeries v WHERE v.durationHours BETWEEN :minHours AND :maxHours AND v.isActive = true")
    List<VoucherSeries> findByDurationRange(@Param("minHours") Integer minHours, @Param("maxHours") Integer maxHours);
    
    // Find series by speed range
    @Query("SELECT v FROM VoucherSeries v WHERE v.downloadSpeedMbps BETWEEN :minSpeed AND :maxSpeed AND v.isActive = true")
    List<VoucherSeries> findBySpeedRange(@Param("minSpeed") Integer minSpeed, @Param("maxSpeed") Integer maxSpeed);
    
    // Find unlimited data series
    List<VoucherSeries> findByIsUnlimitedDataTrue();
    
    // Find limited data series
    List<VoucherSeries> findByIsUnlimitedDataFalse();
    
    // Find series by usage limit
    @Query("SELECT v FROM VoucherSeries v WHERE v.usageLimit = :usageLimit AND v.isActive = true")
    List<VoucherSeries> findByUsageLimit(@Param("usageLimit") Integer usageLimit);
    
    // Find series by concurrent use
    @Query("SELECT v FROM VoucherSeries v WHERE v.concurrentUse = :concurrentUse AND v.isActive = true")
    List<VoucherSeries> findByConcurrentUse(@Param("concurrentUse") Integer concurrentUse);
    
    // Find series by batch size
    @Query("SELECT v FROM VoucherSeries v WHERE v.batchSize = :batchSize AND v.isActive = true")
    List<VoucherSeries> findByBatchSize(@Param("batchSize") Integer batchSize);
    
    // Find series by voucher length
    @Query("SELECT v FROM VoucherSeries v WHERE v.voucherLength = :length AND v.isActive = true")
    List<VoucherSeries> findByVoucherLength(@Param("length") Integer length);
    
    // Find series valid in date range
    @Query("SELECT v FROM VoucherSeries v WHERE (v.validFrom IS NULL OR v.validFrom <= :now) AND (v.validUntil IS NULL OR v.validUntil >= :now) AND v.isActive = true")
    List<VoucherSeries> findValidSeries(@Param("now") LocalDateTime now);
    
    // Find series expiring soon
    @Query("SELECT v FROM VoucherSeries v WHERE v.expiresAt BETWEEN :now AND :future AND v.isActive = true")
    List<VoucherSeries> findSeriesExpiringSoon(@Param("now") LocalDateTime now, @Param("future") LocalDateTime future);
    
    // Find series by generation progress
    @Query("SELECT v FROM VoucherSeries v WHERE v.generatedCount < v.quantity AND v.isActive = true")
    List<VoucherSeries> findIncompleteSeries();
    
    // Find series by usage progress
    @Query("SELECT v FROM VoucherSeries v WHERE v.usedCount > 0 AND v.isActive = true")
    List<VoucherSeries> findUsedSeries();
    
    // Find series by expiration progress
    @Query("SELECT v FROM VoucherSeries v WHERE v.expiredCount > 0 AND v.isActive = true")
    List<VoucherSeries> findExpiredSeries();
    
    // Find series by multiple criteria
    @Query("SELECT v FROM VoucherSeries v WHERE v.seriesType = :seriesType AND v.status = :status AND v.isActive = true")
    List<VoucherSeries> findBySeriesTypeAndStatus(@Param("seriesType") VoucherSeries.SeriesType seriesType, @Param("status") VoucherSeries.SeriesStatus status);
    
    // Find series by price and duration
    @Query("SELECT v FROM VoucherSeries v WHERE v.pricePerVoucher <= :maxPrice AND v.durationHours >= :minHours AND v.isActive = true")
    List<VoucherSeries> findByPriceAndDuration(@Param("maxPrice") BigDecimal maxPrice, @Param("minHours") Integer minHours);
    
    // Find series by speed and price
    @Query("SELECT v FROM VoucherSeries v WHERE v.downloadSpeedMbps >= :minSpeed AND v.pricePerVoucher <= :maxPrice AND v.isActive = true")
    List<VoucherSeries> findBySpeedAndPrice(@Param("minSpeed") Integer minSpeed, @Param("maxPrice") BigDecimal maxPrice);
    
    // Count active series by type
    @Query("SELECT COUNT(v) FROM VoucherSeries v WHERE v.seriesType = :seriesType AND v.isActive = true")
    Long countActiveSeriesByType(@Param("seriesType") VoucherSeries.SeriesType seriesType);
    
    // Count active series by status
    @Query("SELECT COUNT(v) FROM VoucherSeries v WHERE v.status = :status AND v.isActive = true")
    Long countActiveSeriesByStatus(@Param("status") VoucherSeries.SeriesStatus status);
    
    // Count roaming enabled series
    @Query("SELECT COUNT(v) FROM VoucherSeries v WHERE v.isRoamingEnabled = true AND v.isActive = true")
    Long countRoamingSeries();
    
    // Count auto-generate series
    @Query("SELECT COUNT(v) FROM VoucherSeries v WHERE v.autoGenerate = true AND v.isActive = true")
    Long countAutoGenerateSeries();
    
    // Find series with highest price
    @Query("SELECT v FROM VoucherSeries v WHERE v.pricePerVoucher = (SELECT MAX(v2.pricePerVoucher) FROM VoucherSeries v2 WHERE v2.isActive = true) AND v.isActive = true")
    List<VoucherSeries> findMostExpensiveSeries();
    
    // Find series with lowest price
    @Query("SELECT v FROM VoucherSeries v WHERE v.pricePerVoucher = (SELECT MIN(v2.pricePerVoucher) FROM VoucherSeries v2 WHERE v2.isActive = true) AND v.isActive = true")
    List<VoucherSeries> findCheapestSeries();
    
    // Find series with highest speed
    @Query("SELECT v FROM VoucherSeries v WHERE v.downloadSpeedMbps = (SELECT MAX(v2.downloadSpeedMbps) FROM VoucherSeries v2 WHERE v2.isActive = true) AND v.isActive = true")
    List<VoucherSeries> findFastestSeries();
    
    // Find series with longest duration
    @Query("SELECT v FROM VoucherSeries v WHERE v.durationHours = (SELECT MAX(v2.durationHours) FROM VoucherSeries v2 WHERE v2.isActive = true) AND v.isActive = true")
    List<VoucherSeries> findLongestDurationSeries();
    
    // Find series by VLAN
    List<VoucherSeries> findByVlanId(Integer vlanId);
    
    // Find series by NAS identifier
    List<VoucherSeries> findByNasIdentifier(String nasIdentifier);
    
    // Find series by session timeout
    @Query("SELECT v FROM VoucherSeries v WHERE v.sessionTimeoutMinutes = :timeout AND v.isActive = true")
    List<VoucherSeries> findBySessionTimeout(@Param("timeout") Integer timeout);
    
    // Find series by idle timeout
    @Query("SELECT v FROM VoucherSeries v WHERE v.idleTimeoutMinutes = :timeout AND v.isActive = true")
    List<VoucherSeries> findByIdleTimeout(@Param("timeout") Integer timeout);
    
    // Find series by rate limits
    @Query("SELECT v FROM VoucherSeries v WHERE v.rateLimitUp = :rateLimitUp AND v.rateLimitDown = :rateLimitDown AND v.isActive = true")
    List<VoucherSeries> findByRateLimits(@Param("rateLimitUp") String rateLimitUp, @Param("rateLimitDown") String rateLimitDown);
    
    // Find series created by user
    List<VoucherSeries> findByCreatedBy(Long createdBy);
    
    // Find series updated by user
    List<VoucherSeries> findByUpdatedBy(Long updatedBy);
    
    // Find series created in date range
    @Query("SELECT v FROM VoucherSeries v WHERE v.createdAt BETWEEN :startDate AND :endDate")
    List<VoucherSeries> findSeriesCreatedInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find series by multiple criteria
    @Query("SELECT v FROM VoucherSeries v WHERE v.seriesType = :seriesType AND v.routerId = :routerId AND v.isActive = true")
    List<VoucherSeries> findBySeriesTypeAndRouter(@Param("seriesType") VoucherSeries.SeriesType seriesType, @Param("routerId") Long routerId);
    
    // Find series by multiple criteria with location
    @Query("SELECT v FROM VoucherSeries v WHERE v.seriesType = :seriesType AND v.locationId = :locationId AND v.isActive = true")
    List<VoucherSeries> findBySeriesTypeAndLocation(@Param("seriesType") VoucherSeries.SeriesType seriesType, @Param("locationId") Long locationId);
    
    // Find series by multiple criteria with data plan
    @Query("SELECT v FROM VoucherSeries v WHERE v.seriesType = :seriesType AND v.dataPlanId = :dataPlanId AND v.isActive = true")
    List<VoucherSeries> findBySeriesTypeAndDataPlan(@Param("seriesType") VoucherSeries.SeriesType seriesType, @Param("dataPlanId") Long dataPlanId);
    
    // Soft delete by series code
    @Query("UPDATE VoucherSeries v SET v.isActive = false, v.updatedAt = :now WHERE v.seriesCode = :seriesCode")
    void softDeleteBySeriesCode(@Param("seriesCode") String seriesCode, @Param("now") LocalDateTime now);
    
    // Update status
    @Query("UPDATE VoucherSeries v SET v.status = :status, v.updatedAt = :now WHERE v.id = :id")
    void updateStatus(@Param("id") Long id, @Param("status") VoucherSeries.SeriesStatus status, @Param("now") LocalDateTime now);
    
    // Update generated count
    @Query("UPDATE VoucherSeries v SET v.generatedCount = :count, v.updatedAt = :now WHERE v.id = :id")
    void updateGeneratedCount(@Param("id") Long id, @Param("count") Integer count, @Param("now") LocalDateTime now);
    
    // Update used count
    @Query("UPDATE VoucherSeries v SET v.usedCount = :count, v.updatedAt = :now WHERE v.id = :id")
    void updateUsedCount(@Param("id") Long id, @Param("count") Integer count, @Param("now") LocalDateTime now);
    
    // Update expired count
    @Query("UPDATE VoucherSeries v SET v.expiredCount = :count, v.updatedAt = :now WHERE v.id = :id")
    void updateExpiredCount(@Param("id") Long id, @Param("count") Integer count, @Param("now") LocalDateTime now);
    
    // Update price per voucher
    @Query("UPDATE VoucherSeries v SET v.pricePerVoucher = :price, v.updatedAt = :now WHERE v.id = :id")
    void updatePricePerVoucher(@Param("id") Long id, @Param("price") BigDecimal price, @Param("now") LocalDateTime now);
    
    // Update total value
    @Query("UPDATE VoucherSeries v SET v.totalValue = :value, v.updatedAt = :now WHERE v.id = :id")
    void updateTotalValue(@Param("id") Long id, @Param("value") BigDecimal value, @Param("now") LocalDateTime now);
    
    // Update active status
    @Query("UPDATE VoucherSeries v SET v.isActive = :isActive, v.updatedAt = :now WHERE v.id = :id")
    void updateActiveStatus(@Param("id") Long id, @Param("isActive") Boolean isActive, @Param("now") LocalDateTime now);
    
    // Update roaming enabled
    @Query("UPDATE VoucherSeries v SET v.isRoamingEnabled = :enabled, v.updatedAt = :now WHERE v.id = :id")
    void updateRoamingEnabled(@Param("id") Long id, @Param("enabled") Boolean enabled, @Param("now") LocalDateTime now);
    
    // Update multiple devices allowed
    @Query("UPDATE VoucherSeries v SET v.allowMultipleDevices = :allowed, v.updatedAt = :now WHERE v.id = :id")
    void updateAllowMultipleDevices(@Param("id") Long id, @Param("allowed") Boolean allowed, @Param("now") LocalDateTime now);
    
    // Update check MAC address
    @Query("UPDATE VoucherSeries v SET v.checkMacAddress = :check, v.updatedAt = :now WHERE v.id = :id")
    void updateCheckMacAddress(@Param("id") Long id, @Param("check") Boolean check, @Param("now") LocalDateTime now);
    
    // Update auto generate
    @Query("UPDATE VoucherSeries v SET v.autoGenerate = :auto, v.updatedAt = :now WHERE v.id = :id")
    void updateAutoGenerate(@Param("id") Long id, @Param("auto") Boolean auto, @Param("now") LocalDateTime now);
} 