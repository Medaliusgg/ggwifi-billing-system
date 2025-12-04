package com.ggnetworks.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MarketingSchedulerRunner {

    @Autowired
    private MarketingAutomationService marketingAutomationService;

    @Scheduled(cron = "${marketing.scheduler.cron:0 */5 * * * *}")
    public void runScheduledCampaigns() {
        marketingAutomationService.processScheduledCampaigns();
    }

    @Scheduled(cron = "${marketing.automation.cron:0 30 6 * * *}")
    public void runAutomations() {
        marketingAutomationService.runAutomationTriggers();
    }

    @Scheduled(cron = "${marketing.segment.cron:0 0 */4 * * *}")
    public void refreshSegments() {
        marketingAutomationService.refreshSegmentEstimates();
    }
}

