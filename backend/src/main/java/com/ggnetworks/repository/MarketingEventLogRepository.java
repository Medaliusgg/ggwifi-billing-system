package com.ggnetworks.repository;

import com.ggnetworks.entity.MarketingEventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketingEventLogRepository extends JpaRepository<MarketingEventLog, Long> {

    List<MarketingEventLog> findByCampaignId(String campaignId);
}

