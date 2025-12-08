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
import java.util.UUID;

/**
 * Admin Marketing Controller
 * CRUD operations for marketing campaigns
 */
@RestController
@RequestMapping("/api/v1/admin/marketing")
public class AdminMarketingController {

    @Autowired
    private MarketingCampaignRepository campaignRepository;

    /**
     * GET /api/v1/admin/marketing/campaigns
     * Get all campaigns (for admin)
     */
    @GetMapping("/campaigns")
    public ResponseEntity<Map<String, Object>> getAllCampaigns() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<MarketingCampaign> campaigns = campaignRepository.findAll();
            
            response.put("status", "success");
            response.put("campaigns", campaigns);
            response.put("count", campaigns.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve campaigns: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * POST /api/v1/admin/marketing/campaigns
     * Create a new campaign
     */
    @PostMapping("/campaigns")
    public ResponseEntity<Map<String, Object>> createCampaign(@RequestBody Map<String, Object> campaignData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            MarketingCampaign campaign = new MarketingCampaign();
            campaign.setCampaignId("CAMP_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            campaign.setTitle((String) campaignData.get("title"));
            campaign.setDescription((String) campaignData.get("description"));
            campaign.setType(MarketingCampaign.CampaignType.valueOf((String) campaignData.get("type")));
            campaign.setMediaUrl((String) campaignData.get("mediaUrl"));
            campaign.setBadge((String) campaignData.get("badge"));
            campaign.setCtaText((String) campaignData.get("ctaText"));
            campaign.setCtaUrl((String) campaignData.get("ctaUrl"));
            campaign.setDurationSeconds(campaignData.get("durationSeconds") != null ? 
                ((Number) campaignData.get("durationSeconds")).intValue() : null);
            campaign.setSkipAfterSeconds(campaignData.get("skipAfterSeconds") != null ? 
                ((Number) campaignData.get("skipAfterSeconds")).intValue() : 2);
            campaign.setIsActive(campaignData.get("isActive") != null ? 
                (Boolean) campaignData.get("isActive") : true);
            campaign.setPriority(campaignData.get("priority") != null ? 
                ((Number) campaignData.get("priority")).intValue() : 0);
            campaign.setTargetAudience((String) campaignData.get("targetAudience"));
            
            if (campaignData.get("startDate") != null) {
                campaign.setStartDate(LocalDateTime.parse((String) campaignData.get("startDate")));
            }
            if (campaignData.get("endDate") != null) {
                campaign.setEndDate(LocalDateTime.parse((String) campaignData.get("endDate")));
            }
            
            campaign = campaignRepository.save(campaign);
            
            response.put("status", "success");
            response.put("message", "Campaign created successfully");
            response.put("campaign", campaign);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create campaign: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * PUT /api/v1/admin/marketing/campaigns/{id}
     * Update a campaign
     */
    @PutMapping("/campaigns/{id}")
    public ResponseEntity<Map<String, Object>> updateCampaign(
            @PathVariable Long id,
            @RequestBody Map<String, Object> campaignData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            MarketingCampaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
            
            if (campaignData.get("title") != null) {
                campaign.setTitle((String) campaignData.get("title"));
            }
            if (campaignData.get("description") != null) {
                campaign.setDescription((String) campaignData.get("description"));
            }
            if (campaignData.get("type") != null) {
                campaign.setType(MarketingCampaign.CampaignType.valueOf((String) campaignData.get("type")));
            }
            if (campaignData.get("mediaUrl") != null) {
                campaign.setMediaUrl((String) campaignData.get("mediaUrl"));
            }
            if (campaignData.get("badge") != null) {
                campaign.setBadge((String) campaignData.get("badge"));
            }
            if (campaignData.get("ctaText") != null) {
                campaign.setCtaText((String) campaignData.get("ctaText"));
            }
            if (campaignData.get("ctaUrl") != null) {
                campaign.setCtaUrl((String) campaignData.get("ctaUrl"));
            }
            if (campaignData.get("isActive") != null) {
                campaign.setIsActive((Boolean) campaignData.get("isActive"));
            }
            if (campaignData.get("priority") != null) {
                campaign.setPriority(((Number) campaignData.get("priority")).intValue());
            }
            
            campaign = campaignRepository.save(campaign);
            
            response.put("status", "success");
            response.put("message", "Campaign updated successfully");
            response.put("campaign", campaign);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update campaign: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * DELETE /api/v1/admin/marketing/campaigns/{id}
     * Delete a campaign
     */
    @DeleteMapping("/campaigns/{id}")
    public ResponseEntity<Map<String, Object>> deleteCampaign(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            MarketingCampaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
            
            campaignRepository.delete(campaign);
            
            response.put("status", "success");
            response.put("message", "Campaign deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete campaign: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

