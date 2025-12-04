package com.ggnetworks.repository;

import com.ggnetworks.entity.MarketingCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarketingCampaignRepository extends JpaRepository<MarketingCampaign, Long> {

    Optional<MarketingCampaign> findByCampaignId(String campaignId);

    List<MarketingCampaign> findByStatus(MarketingCampaign.CampaignStatus status);

    List<MarketingCampaign> findByScheduleAtBeforeAndStatus(LocalDateTime time,
                                                            MarketingCampaign.CampaignStatus status);
}

