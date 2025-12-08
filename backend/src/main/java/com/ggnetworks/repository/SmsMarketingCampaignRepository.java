package com.ggnetworks.repository;

import com.ggnetworks.entity.SmsMarketingCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SmsMarketingCampaignRepository extends JpaRepository<SmsMarketingCampaign, Long> {
    
    Optional<SmsMarketingCampaign> findByCampaignId(String campaignId);
    
    List<SmsMarketingCampaign> findByStatus(SmsMarketingCampaign.CampaignStatus status);
    
    @Query("SELECT c FROM SmsMarketingCampaign c WHERE c.scheduleAt <= :now AND c.status = 'SCHEDULED'")
    List<SmsMarketingCampaign> findScheduledCampaignsReadyToRun(@Param("now") LocalDateTime now);
    
    List<SmsMarketingCampaign> findByCampaignType(SmsMarketingCampaign.CampaignType campaignType);
}

