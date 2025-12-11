package com.ggnetworks.repository;

import com.ggnetworks.entity.MediaCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MediaCampaignRepository extends JpaRepository<MediaCampaign, Long> {

    Optional<MediaCampaign> findByCampaignId(String campaignId);

    @Query("""
            SELECT mc FROM MediaCampaign mc
            WHERE mc.isActive = true
            AND (mc.startDate IS NULL OR mc.startDate <= :now)
            AND (mc.endDate IS NULL OR mc.endDate >= :now)
            ORDER BY mc.priority DESC, mc.updatedAt DESC
            """)
    List<MediaCampaign> findActiveCampaigns(LocalDateTime now);
}

