package com.ggnetworks.repository;

import com.ggnetworks.entity.MarketingCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MarketingCampaignRepository extends JpaRepository<MarketingCampaign, Long> {
    
    MarketingCampaign findByCampaignId(String campaignId);
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.isActive = true " +
           "AND (c.startDate IS NULL OR c.startDate <= :now) " +
           "AND (c.endDate IS NULL OR c.endDate >= :now) " +
           "ORDER BY c.priority DESC, c.createdAt DESC")
    List<MarketingCampaign> findActiveCampaigns(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.isActive = true " +
           "AND (c.targetAudience = :audience OR c.targetAudience = 'ALL') " +
           "AND (c.startDate IS NULL OR c.startDate <= :now) " +
           "AND (c.endDate IS NULL OR c.endDate >= :now) " +
           "ORDER BY c.priority DESC, c.createdAt DESC")
    List<MarketingCampaign> findActiveCampaignsByAudience(
        @Param("audience") String audience,
        @Param("now") LocalDateTime now
    );
}
