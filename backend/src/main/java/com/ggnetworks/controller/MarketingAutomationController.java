package com.ggnetworks.controller;

import com.ggnetworks.entity.*;
import com.ggnetworks.service.MarketingAutomationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/marketing")
// CORS handled globally via CorsConfig - no need for @CrossOrigin here
public class MarketingAutomationController {

    @Autowired
    private MarketingAutomationService marketingAutomationService;

    @GetMapping("/campaigns")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MARKETING')")
    public ResponseEntity<List<SmsMarketingCampaign>> getCampaigns() {
        return ResponseEntity.ok(marketingAutomationService.getCampaigns());
    }

    @PostMapping("/campaigns")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MARKETING')")
    public ResponseEntity<SmsMarketingCampaign> createCampaign(@RequestBody SmsMarketingCampaign campaign) {
        return ResponseEntity.ok(marketingAutomationService.createCampaign(campaign));
    }

    @PutMapping("/campaigns/{campaignId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MARKETING')")
    public ResponseEntity<SmsMarketingCampaign> updateCampaign(
            @PathVariable String campaignId,
            @RequestBody SmsMarketingCampaign campaign) {
        return ResponseEntity.ok(marketingAutomationService.updateCampaign(campaignId, campaign));
    }

    @DeleteMapping("/campaigns/{campaignId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MARKETING')")
    public ResponseEntity<Void> deleteCampaign(@PathVariable String campaignId) {
        marketingAutomationService.deleteCampaign(campaignId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/campaigns/{campaignId}/send")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MARKETING')")
    public ResponseEntity<Map<String, Object>> triggerCampaign(@PathVariable String campaignId) {
        return ResponseEntity.ok(marketingAutomationService.triggerCampaign(campaignId));
    }

    @PostMapping("/campaigns/process-scheduled")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MARKETING')")
    public ResponseEntity<Map<String, Object>> processScheduledCampaigns() {
        int processed = marketingAutomationService.processScheduledCampaigns();
        return ResponseEntity.ok(Map.of("processed", processed));
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MARKETING')")
    public ResponseEntity<List<MarketingEventLog>> getLogs(
            @RequestParam(required = false) String campaignId) {
        return ResponseEntity.ok(marketingAutomationService.getLogs(campaignId));
    }

    /* Audience segments */
    @GetMapping("/segments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<List<AudienceSegment>> getSegments() {
        return ResponseEntity.ok(marketingAutomationService.getSegments());
    }

    @PostMapping("/segments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<AudienceSegment> saveSegment(@RequestBody AudienceSegment payload) {
        return ResponseEntity.ok(marketingAutomationService.saveSegment(payload));
    }

    @DeleteMapping("/segments/{segmentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<Void> deleteSegment(@PathVariable String segmentId) {
        marketingAutomationService.deleteSegment(segmentId);
        return ResponseEntity.ok().build();
    }

    /* SMS templates */
    @GetMapping("/templates")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<List<SmsTemplate>> getTemplates() {
        return ResponseEntity.ok(marketingAutomationService.getTemplates());
    }

    @PostMapping("/templates")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<SmsTemplate> saveTemplate(@RequestBody SmsTemplate template) {
        return ResponseEntity.ok(marketingAutomationService.saveTemplate(template));
    }

    @DeleteMapping("/templates/{templateId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String templateId) {
        marketingAutomationService.deleteTemplate(templateId);
        return ResponseEntity.ok().build();
    }

    /* Media campaigns */
    @GetMapping("/media")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<List<MediaCampaign>> getMediaCampaigns() {
        return ResponseEntity.ok(marketingAutomationService.getMediaCampaigns());
    }

    @PostMapping("/media")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<MediaCampaign> saveMediaCampaign(@RequestBody MediaCampaign mediaCampaign) {
        return ResponseEntity.ok(marketingAutomationService.saveMediaCampaign(mediaCampaign));
    }

    @GetMapping("/media/active")
    public ResponseEntity<Map<String, Object>> getActiveMedia(
            @RequestParam(required = false, defaultValue = "generic") String device) {
        return ResponseEntity.ok(marketingAutomationService.getActiveMediaForPortal(device));
    }

    @PostMapping("/media/impressions")
    public ResponseEntity<Void> recordImpression(@RequestBody Map<String, Object> payload) {
        String campaignId = (String) payload.get("campaignId");
        String phone = (String) payload.get("phoneNumber");
        String deviceId = (String) payload.get("deviceId");
        Integer watched = payload.get("watchedSeconds") instanceof Number ?
            ((Number) payload.get("watchedSeconds")).intValue() : null;
        Boolean completed = payload.get("completed") instanceof Boolean ?
            (Boolean) payload.get("completed") : Boolean.FALSE;
        Boolean clicked = payload.get("clicked") instanceof Boolean ?
            (Boolean) payload.get("clicked") : Boolean.FALSE;
        marketingAutomationService.recordMediaImpression(campaignId, phone, deviceId, watched, completed, clicked);
        return ResponseEntity.ok().build();
    }

    /* Scheduler configs */
    @GetMapping("/schedules")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<List<SchedulerConfig>> getSchedules() {
        return ResponseEntity.ok(marketingAutomationService.getActiveSchedulers());
    }

    @PostMapping("/schedules")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<SchedulerConfig> saveSchedule(@RequestBody SchedulerConfig config) {
        return ResponseEntity.ok(marketingAutomationService.saveSchedulerConfig(config));
    }

    @PostMapping("/schedules/{scheduleId}/pause")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<Void> pauseSchedule(@PathVariable String scheduleId) {
        marketingAutomationService.pauseScheduler(scheduleId);
        return ResponseEntity.ok().build();
    }

    /* Automation triggers */
    @GetMapping("/automation")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<List<AutomationTrigger>> getAutomationTriggers() {
        return ResponseEntity.ok(marketingAutomationService.getAutomationTriggers());
    }

    @PostMapping("/automation")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<AutomationTrigger> saveAutomationTrigger(@RequestBody AutomationTrigger trigger) {
        return ResponseEntity.ok(marketingAutomationService.saveAutomationTrigger(trigger));
    }

    @DeleteMapping("/automation/{triggerId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MARKETING')")
    public ResponseEntity<Void> deleteAutomationTrigger(@PathVariable String triggerId) {
        marketingAutomationService.deleteAutomationTrigger(triggerId);
        return ResponseEntity.ok().build();
    }
}

