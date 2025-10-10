package com.ggnetworks.controller;

import com.ggnetworks.entity.*;
import com.ggnetworks.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin/loyalty")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Loyalty Management", description = "Comprehensive loyalty program management for high-value customers")
public class AdminLoyaltyController {

    private final LoyaltyService loyaltyService;
    private final CustomerProfileService customerProfileService;
    private final MarketingCommunicationService marketingCommunicationService;

    // ==================== HIGH-VALUE CUSTOMER TRACKING ====================

    @GetMapping("/high-value-customers")
    @Operation(summary = "Get high-value customers", description = "Get customers with high lifetime spend")
    public ResponseEntity<List<CustomerLoyalty>> getHighValueCustomers(
            @RequestParam(defaultValue = "100000") BigDecimal threshold) {
        try {
            List<CustomerLoyalty> highValueCustomers = loyaltyService.getHighValueCustomers(threshold);
            return ResponseEntity.ok(highValueCustomers);
        } catch (Exception e) {
            log.error("Failed to get high-value customers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/vip-customers")
    @Operation(summary = "Get VIP customers", description = "Get top 5% customers by lifetime spend")
    public ResponseEntity<List<CustomerLoyalty>> getVipCustomers() {
        try {
            List<CustomerLoyalty> vipCustomers = loyaltyService.getVipCustomers();
            return ResponseEntity.ok(vipCustomers);
        } catch (Exception e) {
            log.error("Failed to get VIP customers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/platinum-members")
    @Operation(summary = "Get platinum members", description = "Get customers with lifetime spend >= 1M TZS")
    public ResponseEntity<List<CustomerLoyalty>> getPlatinumMembers() {
        try {
            List<CustomerLoyalty> platinumMembers = loyaltyService.getPlatinumMembers();
            return ResponseEntity.ok(platinumMembers);
        } catch (Exception e) {
            log.error("Failed to get platinum members", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/customers/by-tier/{tierLevel}")
    @Operation(summary = "Get customers by tier", description = "Get all customers in a specific loyalty tier")
    public ResponseEntity<List<CustomerLoyalty>> getCustomersByTier(@PathVariable String tierLevel) {
        try {
            CustomerLoyalty.TierLevel tier = CustomerLoyalty.TierLevel.valueOf(tierLevel.toUpperCase());
            List<CustomerLoyalty> customers = loyaltyService.getCustomersByTier(tier);
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            log.error("Failed to get customers by tier: {}", tierLevel, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/top-engaged-customers")
    @Operation(summary = "Get top engaged customers", description = "Get customers with highest engagement scores")
    public ResponseEntity<List<CustomerLoyalty>> getTopEngagedCustomers(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<CustomerLoyalty> topCustomers = loyaltyService.getTopEngagedCustomers(limit);
            return ResponseEntity.ok(topCustomers);
        } catch (Exception e) {
            log.error("Failed to get top engaged customers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== CUSTOMER LOYALTY PROFILES ====================

    @GetMapping("/customer/{phoneNumber}/profile")
    @Operation(summary = "Get customer loyalty profile", description = "Get comprehensive loyalty profile by phone number")
    public ResponseEntity<Map<String, Object>> getCustomerLoyaltyProfile(@PathVariable String phoneNumber) {
        try {
            Map<String, Object> profile = loyaltyService.getCustomerLoyaltyProfile(phoneNumber);
            
            if (profile.containsKey("error")) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("Failed to get customer loyalty profile: {}", phoneNumber, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get customer loyalty profile"));
        }
    }

    @GetMapping("/customer/{phoneNumber}/transactions")
    @Operation(summary = "Get customer transaction history", description = "Get detailed transaction history for loyalty tracking")
    public ResponseEntity<Map<String, Object>> getCustomerTransactionHistory(
            @PathVariable String phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            // This would integrate with PaymentService to get transaction history
            Map<String, Object> history = new HashMap<>();
            history.put("phoneNumber", phoneNumber);
            history.put("message", "Transaction history integration pending");
            
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Failed to get customer transaction history: {}", phoneNumber, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get transaction history"));
        }
    }

    // ==================== LOYALTY PROGRAM MANAGEMENT ====================

    @GetMapping("/statistics")
    @Operation(summary = "Get loyalty statistics", description = "Get comprehensive loyalty program statistics")
    public ResponseEntity<Map<String, Object>> getLoyaltyStatistics() {
        try {
            Map<String, Object> statistics = loyaltyService.getLoyaltyStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            log.error("Failed to get loyalty statistics", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get loyalty statistics"));
        }
    }

    @GetMapping("/tier-analysis")
    @Operation(summary = "Get tier analysis", description = "Analyze customer distribution across loyalty tiers")
    public ResponseEntity<Map<String, Object>> getTierAnalysis() {
        try {
            Map<String, Object> analysis = new HashMap<>();
            
            // Get customers by tier
            for (CustomerLoyalty.TierLevel tier : CustomerLoyalty.TierLevel.values()) {
                List<CustomerLoyalty> customers = loyaltyService.getCustomersByTier(tier);
                analysis.put(tier.getDisplayName(), Map.of(
                    "count", customers.size(),
                    "percentage", calculatePercentage(customers.size()),
                    "averageSpend", calculateAverageSpend(customers),
                    "averagePoints", calculateAveragePoints(customers)
                ));
            }
            
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            log.error("Failed to get tier analysis", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get tier analysis"));
        }
    }

    // ==================== SPECIAL OFFERS & BONUSES ====================

    @PostMapping("/customer/{phoneNumber}/birthday-bonus")
    @Operation(summary = "Award birthday bonus", description = "Award birthday bonus to customer")
    public ResponseEntity<CustomerLoyalty> awardBirthdayBonus(@PathVariable String phoneNumber) {
        try {
            CustomerLoyalty loyalty = loyaltyService.awardBirthdayBonus(phoneNumber);
            
            if (loyalty == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(loyalty);
        } catch (Exception e) {
            log.error("Failed to award birthday bonus: {}", phoneNumber, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/customer/{phoneNumber}/anniversary-bonus")
    @Operation(summary = "Award anniversary bonus", description = "Award anniversary bonus to customer")
    public ResponseEntity<CustomerLoyalty> awardAnniversaryBonus(@PathVariable String phoneNumber) {
        try {
            CustomerLoyalty loyalty = loyaltyService.awardAnniversaryBonus(phoneNumber);
            
            if (loyalty == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(loyalty);
        } catch (Exception e) {
            log.error("Failed to award anniversary bonus: {}", phoneNumber, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/customer/{phoneNumber}/referral-bonus")
    @Operation(summary = "Award referral bonus", description = "Award referral bonus to customer")
    public ResponseEntity<CustomerLoyalty> awardReferralBonus(@PathVariable String phoneNumber) {
        try {
            CustomerLoyalty loyalty = loyaltyService.awardReferralBonus(phoneNumber);
            
            if (loyalty == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(loyalty);
        } catch (Exception e) {
            log.error("Failed to award referral bonus: {}", phoneNumber, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== MARKETING & COMMUNICATIONS ====================

    @PostMapping("/customer/{phoneNumber}/send-loyalty-message")
    @Operation(summary = "Send loyalty message", description = "Send targeted loyalty message to customer")
    public ResponseEntity<MarketingCommunication> sendLoyaltyMessage(
            @PathVariable String phoneNumber,
            @RequestBody Map<String, Object> request) {
        try {
            String messageType = (String) request.get("messageType");
            String subject = (String) request.get("subject");
            String message = (String) request.get("message");
            
            MarketingCommunication.CommunicationType communicationType = 
                    MarketingCommunication.CommunicationType.valueOf(messageType.toUpperCase());
            
            MarketingCommunication communication = customerProfileService.sendMarketingCommunication(
                    phoneNumber, communicationType, MarketingCommunication.Channel.SMS, subject, message);
            
            return ResponseEntity.ok(communication);
        } catch (Exception e) {
            log.error("Failed to send loyalty message: {}", phoneNumber, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/bulk-loyalty-campaign")
    @Operation(summary = "Send bulk loyalty campaign", description = "Send loyalty campaign to multiple customers")
    public ResponseEntity<Map<String, Object>> sendBulkLoyaltyCampaign(
            @RequestBody Map<String, Object> request) {
        try {
            String tierLevel = (String) request.get("tierLevel");
            String messageType = (String) request.get("messageType");
            String subject = (String) request.get("subject");
            String message = (String) request.get("message");
            
            CustomerLoyalty.TierLevel tier = CustomerLoyalty.TierLevel.valueOf(tierLevel.toUpperCase());
            List<CustomerLoyalty> customers = loyaltyService.getCustomersByTier(tier);
            
            int successCount = 0;
            for (CustomerLoyalty customer : customers) {
                try {
                    MarketingCommunication.CommunicationType communicationType = 
                            MarketingCommunication.CommunicationType.valueOf(messageType.toUpperCase());
                    
                    customerProfileService.sendMarketingCommunication(
                            customer.getPhoneNumber(), communicationType, 
                            MarketingCommunication.Channel.SMS, subject, message);
                    successCount++;
                } catch (Exception e) {
                    log.error("Failed to send message to: {}", customer.getPhoneNumber(), e);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalCustomers", customers.size());
            response.put("successCount", successCount);
            response.put("failureCount", customers.size() - successCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to send bulk loyalty campaign", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to send bulk campaign"));
        }
    }

    // ==================== EXPORT & REPORTING ====================

    @GetMapping("/export/high-value-customers")
    @Operation(summary = "Export high-value customers", description = "Export high-value customers for marketing campaigns")
    public ResponseEntity<List<Map<String, Object>>> exportHighValueCustomers() {
        try {
            List<Map<String, Object>> exportData = loyaltyService.exportHighValueCustomers();
            return ResponseEntity.ok(exportData);
        } catch (Exception e) {
            log.error("Failed to export high-value customers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/export/vip-customers")
    @Operation(summary = "Export VIP customers", description = "Export VIP customers for exclusive campaigns")
    public ResponseEntity<List<Map<String, Object>>> exportVipCustomers() {
        try {
            List<CustomerLoyalty> vipCustomers = loyaltyService.getVipCustomers();
            
            List<Map<String, Object>> exportData = vipCustomers.stream()
                    .map(customer -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("phoneNumber", customer.getPhoneNumber());
                        data.put("fullName", customer.getCustomerProfile().getFullName());
                        data.put("tierLevel", customer.getTierLevel().getDisplayName());
                        data.put("lifetimeSpend", customer.getLifetimeSpend());
                        data.put("currentPoints", customer.getCurrentPoints());
                        data.put("totalTransactions", customer.getTotalTransactions());
                        data.put("averageTransactionValue", customer.getAverageTransactionValue());
                        data.put("retentionScore", customer.getRetentionScore());
                        data.put("engagementScore", customer.getEngagementScore());
                        return data;
                    })
                    .toList();
            
            return ResponseEntity.ok(exportData);
        } catch (Exception e) {
            log.error("Failed to export VIP customers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== CUSTOMER RETENTION ====================

    @GetMapping("/at-risk-customers")
    @Operation(summary = "Get at-risk customers", description = "Get customers with low retention scores")
    public ResponseEntity<List<CustomerLoyalty>> getAtRiskCustomers(
            @RequestParam(defaultValue = "0.3") BigDecimal retentionThreshold) {
        try {
            // This would be implemented in LoyaltyService
            List<CustomerLoyalty> atRiskCustomers = loyaltyService.getAtRiskCustomers(retentionThreshold);
            return ResponseEntity.ok(atRiskCustomers);
        } catch (Exception e) {
            log.error("Failed to get at-risk customers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/customer/{phoneNumber}/retention-campaign")
    @Operation(summary = "Send retention campaign", description = "Send retention campaign to at-risk customer")
    public ResponseEntity<MarketingCommunication> sendRetentionCampaign(
            @PathVariable String phoneNumber,
            @RequestBody Map<String, Object> request) {
        try {
            String subject = (String) request.get("subject");
            String message = (String) request.get("message");
            
            MarketingCommunication communication = customerProfileService.sendMarketingCommunication(
                    phoneNumber, 
                    MarketingCommunication.CommunicationType.WINBACK_CAMPAIGN,
                    MarketingCommunication.Channel.SMS, 
                    subject, 
                    message);
            
            return ResponseEntity.ok(communication);
        } catch (Exception e) {
            log.error("Failed to send retention campaign: {}", phoneNumber, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== HELPER METHODS ====================

    private double calculatePercentage(int count) {
        // This would calculate percentage of total customers
        return count * 100.0 / 1000.0; // Simplified calculation
    }

    private BigDecimal calculateAverageSpend(List<CustomerLoyalty> customers) {
        if (customers.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal totalSpend = customers.stream()
                .map(CustomerLoyalty::getLifetimeSpend)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return totalSpend.divide(BigDecimal.valueOf(customers.size()), 2, BigDecimal.ROUND_HALF_UP);
    }

    private double calculateAveragePoints(List<CustomerLoyalty> customers) {
        if (customers.isEmpty()) {
            return 0.0;
        }
        
        int totalPoints = customers.stream()
                .mapToInt(CustomerLoyalty::getCurrentPoints)
                .sum();
        
        return (double) totalPoints / customers.size();
    }
} 