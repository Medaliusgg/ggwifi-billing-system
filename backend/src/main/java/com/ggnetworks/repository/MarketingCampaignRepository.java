package com.ggnetworks.repository;

import com.ggnetworks.entity.MarketingCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarketingCampaignRepository extends JpaRepository<MarketingCampaign, Long> {
    
    // Find by campaign code
    Optional<MarketingCampaign> findByCampaignCode(String campaignCode);
    
    // Find active campaigns
    List<MarketingCampaign> findByIsActiveTrue();
    
    // Find by campaign type
    List<MarketingCampaign> findByCampaignType(MarketingCampaign.CampaignType campaignType);
    
    // Find active campaigns by type
    List<MarketingCampaign> findByCampaignTypeAndIsActiveTrue(MarketingCampaign.CampaignType campaignType);
    
    // Find by media type
    List<MarketingCampaign> findByMediaType(MarketingCampaign.MediaType mediaType);
    
    // Find active campaigns by media type
    List<MarketingCampaign> findByMediaTypeAndIsActiveTrue(MarketingCampaign.MediaType mediaType);
    
    // Find by status
    List<MarketingCampaign> findByStatus(MarketingCampaign.CampaignStatus status);
    
    // Find active campaigns by status
    List<MarketingCampaign> findByStatusAndIsActiveTrue(MarketingCampaign.CampaignStatus status);
    
    // Find featured campaigns
    List<MarketingCampaign> findByIsFeaturedTrue();
    
    // Find roaming enabled campaigns
    List<MarketingCampaign> findByIsRoamingEnabledTrue();
    
    // Find campaigns by target audience
    List<MarketingCampaign> findByTargetAudience(MarketingCampaign.TargetAudience targetAudience);
    
    // Find active campaigns by target audience
    List<MarketingCampaign> findByTargetAudienceAndIsActiveTrue(MarketingCampaign.TargetAudience targetAudience);
    
    // Find campaigns by priority
    @Query("SELECT m FROM MarketingCampaign m WHERE m.priority = :priority AND m.isActive = true")
    List<MarketingCampaign> findByPriority(@Param("priority") Integer priority);
    
    // Find campaigns by budget range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.budget BETWEEN :minBudget AND :maxBudget AND m.isActive = true")
    List<MarketingCampaign> findByBudgetRange(@Param("minBudget") BigDecimal minBudget, @Param("maxBudget") BigDecimal maxBudget);
    
    // Find campaigns by spent amount range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.spentAmount BETWEEN :minSpent AND :maxSpent AND m.isActive = true")
    List<MarketingCampaign> findBySpentAmountRange(@Param("minSpent") BigDecimal minSpent, @Param("maxSpent") BigDecimal maxSpent);
    
    // Find campaigns by impression count range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.impressionCount BETWEEN :minImpressions AND :maxImpressions AND m.isActive = true")
    List<MarketingCampaign> findByImpressionCountRange(@Param("minImpressions") Long minImpressions, @Param("maxImpressions") Long maxImpressions);
    
    // Find campaigns by click count range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.clickCount BETWEEN :minClicks AND :maxClicks AND m.isActive = true")
    List<MarketingCampaign> findByClickCountRange(@Param("minClicks") Long minClicks, @Param("maxClicks") Long maxClicks);
    
    // Find campaigns by conversion count range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.conversionCount BETWEEN :minConversions AND :maxConversions AND m.isActive = true")
    List<MarketingCampaign> findByConversionCountRange(@Param("minConversions") Long minConversions, @Param("maxConversions") Long maxConversions);
    
    // Find campaigns by CTR range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.ctrPercentage BETWEEN :minCTR AND :maxCTR AND m.isActive = true")
    List<MarketingCampaign> findByCTRRange(@Param("minCTR") Double minCTR, @Param("maxCTR") Double maxCTR);
    
    // Find campaigns by conversion rate range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.conversionRate BETWEEN :minRate AND :maxRate AND m.isActive = true")
    List<MarketingCampaign> findByConversionRateRange(@Param("minRate") Double minRate, @Param("maxRate") Double maxRate);
    
    // Find campaigns by frequency cap
    @Query("SELECT m FROM MarketingCampaign m WHERE m.frequencyCap = :cap AND m.isActive = true")
    List<MarketingCampaign> findByFrequencyCap(@Param("cap") Integer cap);
    
    // Find campaigns by frequency period
    @Query("SELECT m FROM MarketingCampaign m WHERE m.frequencyPeriodHours = :period AND m.isActive = true")
    List<MarketingCampaign> findByFrequencyPeriod(@Param("period") Integer period);
    
    // Find campaigns by ad counter
    @Query("SELECT m FROM MarketingCampaign m WHERE m.adCounter = :counter AND m.isActive = true")
    List<MarketingCampaign> findByAdCounter(@Param("counter") Integer counter);
    
    // Find campaigns by duration before skip
    @Query("SELECT m FROM MarketingCampaign m WHERE m.durationBeforeSkip = :duration AND m.isActive = true")
    List<MarketingCampaign> findByDurationBeforeSkip(@Param("duration") Integer duration);
    
    // Find campaigns by display duration
    @Query("SELECT m FROM MarketingCampaign m WHERE m.displayDurationSeconds = :duration AND m.isActive = true")
    List<MarketingCampaign> findByDisplayDuration(@Param("duration") Integer duration);
    
    // Find campaigns valid in date range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.startDate <= :now AND m.endDate >= :now AND m.isActive = true")
    List<MarketingCampaign> findActiveCampaigns(@Param("now") LocalDateTime now);
    
    // Find campaigns starting soon
    @Query("SELECT m FROM MarketingCampaign m WHERE m.startDate BETWEEN :now AND :future AND m.isActive = true")
    List<MarketingCampaign> findCampaignsStartingSoon(@Param("now") LocalDateTime now, @Param("future") LocalDateTime future);
    
    // Find campaigns ending soon
    @Query("SELECT m FROM MarketingCampaign m WHERE m.endDate BETWEEN :now AND :future AND m.isActive = true")
    List<MarketingCampaign> findCampaignsEndingSoon(@Param("now") LocalDateTime now, @Param("future") LocalDateTime future);
    
    // Find campaigns by multiple criteria
    @Query("SELECT m FROM MarketingCampaign m WHERE m.campaignType = :campaignType AND m.mediaType = :mediaType AND m.isActive = true")
    List<MarketingCampaign> findByCampaignTypeAndMediaType(@Param("campaignType") MarketingCampaign.CampaignType campaignType, @Param("mediaType") MarketingCampaign.MediaType mediaType);
    
    // Find campaigns by multiple criteria with status
    @Query("SELECT m FROM MarketingCampaign m WHERE m.campaignType = :campaignType AND m.status = :status AND m.isActive = true")
    List<MarketingCampaign> findByCampaignTypeAndStatus(@Param("campaignType") MarketingCampaign.CampaignType campaignType, @Param("status") MarketingCampaign.CampaignStatus status);
    
    // Find campaigns by multiple criteria with target audience
    @Query("SELECT m FROM MarketingCampaign m WHERE m.campaignType = :campaignType AND m.targetAudience = :targetAudience AND m.isActive = true")
    List<MarketingCampaign> findByCampaignTypeAndTargetAudience(@Param("campaignType") MarketingCampaign.CampaignType campaignType, @Param("targetAudience") MarketingCampaign.TargetAudience targetAudience);
    
    // Find campaigns by budget and CTR
    @Query("SELECT m FROM MarketingCampaign m WHERE m.budget <= :maxBudget AND m.ctrPercentage >= :minCTR AND m.isActive = true")
    List<MarketingCampaign> findByBudgetAndCTR(@Param("maxBudget") BigDecimal maxBudget, @Param("minCTR") Double minCTR);
    
    // Find campaigns by impressions and clicks
    @Query("SELECT m FROM MarketingCampaign m WHERE m.impressionCount >= :minImpressions AND m.clickCount >= :minClicks AND m.isActive = true")
    List<MarketingCampaign> findByImpressionsAndClicks(@Param("minImpressions") Long minImpressions, @Param("minClicks") Long minClicks);
    
    // Count active campaigns by type
    @Query("SELECT COUNT(m) FROM MarketingCampaign m WHERE m.campaignType = :campaignType AND m.isActive = true")
    Long countActiveCampaignsByType(@Param("campaignType") MarketingCampaign.CampaignType campaignType);
    
    // Count active campaigns by media type
    @Query("SELECT COUNT(m) FROM MarketingCampaign m WHERE m.mediaType = :mediaType AND m.isActive = true")
    Long countActiveCampaignsByMediaType(@Param("mediaType") MarketingCampaign.MediaType mediaType);
    
    // Count active campaigns by status
    @Query("SELECT COUNT(m) FROM MarketingCampaign m WHERE m.status = :status AND m.isActive = true")
    Long countActiveCampaignsByStatus(@Param("status") MarketingCampaign.CampaignStatus status);
    
    // Count active campaigns by target audience
    @Query("SELECT COUNT(m) FROM MarketingCampaign m WHERE m.targetAudience = :targetAudience AND m.isActive = true")
    Long countActiveCampaignsByTargetAudience(@Param("targetAudience") MarketingCampaign.TargetAudience targetAudience);
    
    // Count featured campaigns
    @Query("SELECT COUNT(m) FROM MarketingCampaign m WHERE m.isFeatured = true AND m.isActive = true")
    Long countFeaturedCampaigns();
    
    // Count roaming enabled campaigns
    @Query("SELECT COUNT(m) FROM MarketingCampaign m WHERE m.isRoamingEnabled = true AND m.isActive = true")
    Long countRoamingCampaigns();
    
    // Find campaigns with highest budget
    @Query("SELECT m FROM MarketingCampaign m WHERE m.budget = (SELECT MAX(m2.budget) FROM MarketingCampaign m2 WHERE m2.isActive = true) AND m.isActive = true")
    List<MarketingCampaign> findHighestBudgetCampaigns();
    
    // Find campaigns with highest spent amount
    @Query("SELECT m FROM MarketingCampaign m WHERE m.spentAmount = (SELECT MAX(m2.spentAmount) FROM MarketingCampaign m2 WHERE m2.isActive = true) AND m.isActive = true")
    List<MarketingCampaign> findHighestSpentCampaigns();
    
    // Find campaigns with highest impressions
    @Query("SELECT m FROM MarketingCampaign m WHERE m.impressionCount = (SELECT MAX(m2.impressionCount) FROM MarketingCampaign m2 WHERE m2.isActive = true) AND m.isActive = true")
    List<MarketingCampaign> findHighestImpressionCampaigns();
    
    // Find campaigns with highest clicks
    @Query("SELECT m FROM MarketingCampaign m WHERE m.clickCount = (SELECT MAX(m2.clickCount) FROM MarketingCampaign m2 WHERE m2.isActive = true) AND m.isActive = true")
    List<MarketingCampaign> findHighestClickCampaigns();
    
    // Find campaigns with highest conversions
    @Query("SELECT m FROM MarketingCampaign m WHERE m.conversionCount = (SELECT MAX(m2.conversionCount) FROM MarketingCampaign m2 WHERE m2.isActive = true) AND m.isActive = true")
    List<MarketingCampaign> findHighestConversionCampaigns();
    
    // Find campaigns with highest CTR
    @Query("SELECT m FROM MarketingCampaign m WHERE m.ctrPercentage = (SELECT MAX(m2.ctrPercentage) FROM MarketingCampaign m2 WHERE m2.isActive = true) AND m.isActive = true")
    List<MarketingCampaign> findHighestCTRCampaigns();
    
    // Find campaigns with highest conversion rate
    @Query("SELECT m FROM MarketingCampaign m WHERE m.conversionRate = (SELECT MAX(m2.conversionRate) FROM MarketingCampaign m2 WHERE m2.isActive = true) AND m.isActive = true")
    List<MarketingCampaign> findHighestConversionRateCampaigns();
    
    // Find campaigns by priority order
    List<MarketingCampaign> findByPriorityOrderByPriorityAsc(Integer priority);
    
    // Find campaigns by SMS sent count
    @Query("SELECT m FROM MarketingCampaign m WHERE m.smsSentCount >= :minSent AND m.isActive = true")
    List<MarketingCampaign> findByMinSMSSent(@Param("minSent") Integer minSent);
    
    // Find campaigns by SMS delivered count
    @Query("SELECT m FROM MarketingCampaign m WHERE m.smsDeliveredCount >= :minDelivered AND m.isActive = true")
    List<MarketingCampaign> findByMinSMSDelivered(@Param("minDelivered") Integer minDelivered);
    
    // Find campaigns by SMS failed count
    @Query("SELECT m FROM MarketingCampaign m WHERE m.smsFailedCount >= :minFailed AND m.isActive = true")
    List<MarketingCampaign> findByMinSMSFailed(@Param("minFailed") Integer minFailed);
    
    // Find campaigns by SMS scheduled time
    @Query("SELECT m FROM MarketingCampaign m WHERE m.smsScheduledTime BETWEEN :startTime AND :endTime AND m.isActive = true")
    List<MarketingCampaign> findBySMSScheduledTime(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    // Find campaigns by show on login
    List<MarketingCampaign> findByShowOnLoginTrue();
    
    // Find campaigns by show on package selection
    List<MarketingCampaign> findByShowOnPackageSelectionTrue();
    
    // Find campaigns by show on payment
    List<MarketingCampaign> findByShowOnPaymentTrue();
    
    // Find campaigns by show on success
    List<MarketingCampaign> findByShowOnSuccessTrue();
    
    // Find campaigns created by user
    List<MarketingCampaign> findByCreatedBy(Long createdBy);
    
    // Find campaigns updated by user
    List<MarketingCampaign> findByUpdatedBy(Long updatedBy);
    
    // Find campaigns created in date range
    @Query("SELECT m FROM MarketingCampaign m WHERE m.createdAt BETWEEN :startDate AND :endDate")
    List<MarketingCampaign> findCampaignsCreatedInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find campaigns by multiple criteria
    @Query("SELECT m FROM MarketingCampaign m WHERE m.campaignType = :campaignType AND m.targetAudience = :targetAudience AND m.status = :status AND m.isActive = true")
    List<MarketingCampaign> findByCampaignTypeAndTargetAudienceAndStatus(@Param("campaignType") MarketingCampaign.CampaignType campaignType, @Param("targetAudience") MarketingCampaign.TargetAudience targetAudience, @Param("status") MarketingCampaign.CampaignStatus status);
    
    // Soft delete by campaign code
    @Query("UPDATE MarketingCampaign m SET m.isActive = false, m.updatedAt = :now WHERE m.campaignCode = :campaignCode")
    void softDeleteByCampaignCode(@Param("campaignCode") String campaignCode, @Param("now") LocalDateTime now);
    
    // Update status
    @Query("UPDATE MarketingCampaign m SET m.status = :status, m.updatedAt = :now WHERE m.id = :id")
    void updateStatus(@Param("id") Long id, @Param("status") MarketingCampaign.CampaignStatus status, @Param("now") LocalDateTime now);
    
    // Update impressions
    @Query("UPDATE MarketingCampaign m SET m.impressionCount = :count, m.updatedAt = :now WHERE m.id = :id")
    void updateImpressionCount(@Param("id") Long id, @Param("count") Long count, @Param("now") LocalDateTime now);
    
    // Update clicks
    @Query("UPDATE MarketingCampaign m SET m.clickCount = :count, m.updatedAt = :now WHERE m.id = :id")
    void updateClickCount(@Param("id") Long id, @Param("count") Long count, @Param("now") LocalDateTime now);
    
    // Update conversions
    @Query("UPDATE MarketingCampaign m SET m.conversionCount = :count, m.updatedAt = :now WHERE m.id = :id")
    void updateConversionCount(@Param("id") Long id, @Param("count") Long count, @Param("now") LocalDateTime now);
    
    // Update CTR
    @Query("UPDATE MarketingCampaign m SET m.ctrPercentage = :ctr, m.updatedAt = :now WHERE m.id = :id")
    void updateCTR(@Param("id") Long id, @Param("ctr") Double ctr, @Param("now") LocalDateTime now);
    
    // Update conversion rate
    @Query("UPDATE MarketingCampaign m SET m.conversionRate = :rate, m.updatedAt = :now WHERE m.id = :id")
    void updateConversionRate(@Param("id") Long id, @Param("rate") Double rate, @Param("now") LocalDateTime now);
    
    // Update spent amount
    @Query("UPDATE MarketingCampaign m SET m.spentAmount = :amount, m.updatedAt = :now WHERE m.id = :id")
    void updateSpentAmount(@Param("id") Long id, @Param("amount") BigDecimal amount, @Param("now") LocalDateTime now);
    
    // Update SMS sent count
    @Query("UPDATE MarketingCampaign m SET m.smsSentCount = :count, m.updatedAt = :now WHERE m.id = :id")
    void updateSMSSentCount(@Param("id") Long id, @Param("count") Integer count, @Param("now") LocalDateTime now);
    
    // Update SMS delivered count
    @Query("UPDATE MarketingCampaign m SET m.smsDeliveredCount = :count, m.updatedAt = :now WHERE m.id = :id")
    void updateSMSDeliveredCount(@Param("id") Long id, @Param("count") Integer count, @Param("now") LocalDateTime now);
    
    // Update SMS failed count
    @Query("UPDATE MarketingCampaign m SET m.smsFailedCount = :count, m.updatedAt = :now WHERE m.id = :id")
    void updateSMSFailedCount(@Param("id") Long id, @Param("count") Integer count, @Param("now") LocalDateTime now);
    
    // Update active status
    @Query("UPDATE MarketingCampaign m SET m.isActive = :isActive, m.updatedAt = :now WHERE m.id = :id")
    void updateActiveStatus(@Param("id") Long id, @Param("isActive") Boolean isActive, @Param("now") LocalDateTime now);
    
    // Update featured status
    @Query("UPDATE MarketingCampaign m SET m.isFeatured = :isFeatured, m.updatedAt = :now WHERE m.id = :id")
    void updateFeaturedStatus(@Param("id") Long id, @Param("isFeatured") Boolean isFeatured, @Param("now") LocalDateTime now);
    
    // Update roaming enabled
    @Query("UPDATE MarketingCampaign m SET m.isRoamingEnabled = :enabled, m.updatedAt = :now WHERE m.id = :id")
    void updateRoamingEnabled(@Param("id") Long id, @Param("enabled") Boolean enabled, @Param("now") LocalDateTime now);
    
    // Update priority
    @Query("UPDATE MarketingCampaign m SET m.priority = :priority, m.updatedAt = :now WHERE m.id = :id")
    void updatePriority(@Param("id") Long id, @Param("priority") Integer priority, @Param("now") LocalDateTime now);
    
    // Update show on login
    @Query("UPDATE MarketingCampaign m SET m.showOnLogin = :show, m.updatedAt = :now WHERE m.id = :id")
    void updateShowOnLogin(@Param("id") Long id, @Param("show") Boolean show, @Param("now") LocalDateTime now);
    
    // Update show on package selection
    @Query("UPDATE MarketingCampaign m SET m.showOnPackageSelection = :show, m.updatedAt = :now WHERE m.id = :id")
    void updateShowOnPackageSelection(@Param("id") Long id, @Param("show") Boolean show, @Param("now") LocalDateTime now);
    
    // Update show on payment
    @Query("UPDATE MarketingCampaign m SET m.showOnPayment = :show, m.updatedAt = :now WHERE m.id = :id")
    void updateShowOnPayment(@Param("id") Long id, @Param("show") Boolean show, @Param("now") LocalDateTime now);
    
    // Update show on success
    @Query("UPDATE MarketingCampaign m SET m.showOnSuccess = :show, m.updatedAt = :now WHERE m.id = :id")
    void updateShowOnSuccess(@Param("id") Long id, @Param("show") Boolean show, @Param("now") LocalDateTime now);
} 