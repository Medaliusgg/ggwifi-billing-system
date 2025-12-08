package com.ggnetworks.controller;

import com.ggnetworks.entity.MarketingCampaign;
import com.ggnetworks.repository.MarketingCampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Marketing Controller
 * Handles campaign retrieval and impression tracking
 */
@RestController
@RequestMapping("/api/v1/customer-portal/marketing")
public class MarketingController {

    @Autowired
    private MarketingCampaignRepository campaignRepository;

    /**
     * GET /api/v1/customer-portal/marketing/campaigns
     * Get active campaigns for customer portal
     */
    @GetMapping("/campaigns")
    public ResponseEntity<Map<String, Object>> getCampaigns(
            @RequestParam(required = false) String audience) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            LocalDateTime now = LocalDateTime.now();
            List<MarketingCampaign> campaigns;
            
            if (audience != null && !audience.isEmpty()) {
                campaigns = campaignRepository.findActiveCampaignsByAudience(audience, now);
            } else {
                campaigns = campaignRepository.findActiveCampaigns(now);
            }
            
            // Transform to DTO format
            List<Map<String, Object>> campaignList = campaigns.stream().map(campaign -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", campaign.getCampaignId());
                dto.put("title", campaign.getTitle());
                dto.put("description", campaign.getDescription());
                dto.put("type", campaign.getType().toString());
                dto.put("mediaUrl", campaign.getMediaUrl());
                dto.put("badge", campaign.getBadge());
                dto.put("ctaText", campaign.getCtaText());
                dto.put("ctaUrl", campaign.getCtaUrl());
                dto.put("duration", campaign.getDurationSeconds());
                dto.put("skipAfter", campaign.getSkipAfterSeconds());
                return dto;
            }).collect(Collectors.toList());
            
            response.put("status", "success");
            response.put("campaigns", campaignList);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve campaigns: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * POST /api/v1/customer-portal/marketing/campaigns/{campaignId}/impression
     * Track campaign impression
     */
    @PostMapping("/campaigns/{campaignId}/impression")
    public ResponseEntity<Map<String, Object>> trackImpression(
            @PathVariable String campaignId,
            @RequestHeader(value = "X-Forwarded-For", required = false) String ipAddress,
            @RequestHeader(value = "User-Agent", required = false) String userAgent) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            MarketingCampaign campaign = campaignRepository.findByCampaignId(campaignId);
            
            if (campaign == null) {
                response.put("status", "error");
                response.put("message", "Campaign not found");
                return ResponseEntity.status(404).body(response);
            }
            
            // Increment impression count
            campaign.setImpressionCount(campaign.getImpressionCount() + 1);
            campaignRepository.save(campaign);
            
            // TODO: Store detailed impression log (IP, user agent, timestamp, etc.)
            // This could go into a separate MarketingImpressionLog table
            
            response.put("status", "success");
            response.put("message", "Impression tracked");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to track impression: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * POST /api/v1/customer-portal/marketing/campaigns/{campaignId}/click
     * Track campaign click
     */
    @PostMapping("/campaigns/{campaignId}/click")
    public ResponseEntity<Map<String, Object>> trackClick(@PathVariable String campaignId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            MarketingCampaign campaign = campaignRepository.findByCampaignId(campaignId);
            
            if (campaign == null) {
                response.put("status", "error");
                response.put("message", "Campaign not found");
                return ResponseEntity.status(404).body(response);
            }
            
            // Increment click count
            campaign.setClickCount(campaign.getClickCount() + 1);
            campaignRepository.save(campaign);
            
            response.put("status", "success");
            response.put("message", "Click tracked");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to track click: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

