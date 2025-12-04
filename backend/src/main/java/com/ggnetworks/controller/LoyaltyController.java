package com.ggnetworks.controller;

import com.ggnetworks.entity.LoyaltyProductInventory;
import com.ggnetworks.entity.LoyaltyPointRule;
import com.ggnetworks.entity.LoyaltyReward;
import com.ggnetworks.entity.LoyaltyRedemption;
import com.ggnetworks.entity.LoyaltyTierConfig;
import com.ggnetworks.entity.LoyaltyTransaction;
import com.ggnetworks.service.LoyaltyService;
import com.ggnetworks.service.EnhancedLoyaltyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/loyalty")
@CrossOrigin(origins = "*")
public class LoyaltyController {

    @Autowired
    private LoyaltyService loyaltyService;

    @Autowired
    private EnhancedLoyaltyService enhancedLoyaltyService;

    /**
     * Get customer loyalty information
     * GET /api/v1/loyalty/customer/{customerId}
     */
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getCustomerLoyaltyInfo(@PathVariable Long customerId) {
        return ResponseEntity.ok(loyaltyService.getCustomerLoyaltyInfo(customerId));
    }

    /**
     * Get available rewards for customer
     * GET /api/v1/loyalty/customer/{customerId}/rewards
     */
    @GetMapping("/customer/{customerId}/rewards")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<List<LoyaltyReward>> getAvailableRewardsForCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(loyaltyService.getAvailableRewardsForCustomer(customerId));
    }

    /**
     * Redeem reward
     * POST /api/v1/loyalty/customer/{customerId}/redeem/{rewardId}
     */
    @PostMapping("/customer/{customerId}/redeem/{rewardId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<Map<String, Object>> redeemReward(
            @PathVariable Long customerId,
            @PathVariable String rewardId) {
        return ResponseEntity.ok(loyaltyService.redeemReward(customerId, rewardId));
    }

    /**
     * Get all available rewards
     * GET /api/v1/loyalty/rewards
     */
    @GetMapping("/rewards")
    public ResponseEntity<List<LoyaltyReward>> getAllAvailableRewards() {
        return ResponseEntity.ok(loyaltyService.getAllAvailableRewards());
    }

    /**
     * Get all rewards (admin)
     * GET /api/v1/loyalty/rewards/all
     */
    @GetMapping("/rewards/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<LoyaltyReward>> getAllRewards() {
        return ResponseEntity.ok(loyaltyService.getAllRewards());
    }

    /**
     * Get reward by ID
     * GET /api/v1/loyalty/rewards/{rewardId}
     */
    @GetMapping("/rewards/{rewardId}")
    public ResponseEntity<LoyaltyReward> getRewardById(@PathVariable String rewardId) {
        return loyaltyService.getRewardById(rewardId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new reward
     * POST /api/v1/loyalty/rewards
     */
    @PostMapping("/rewards")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<LoyaltyReward> createReward(@RequestBody LoyaltyReward reward) {
        return ResponseEntity.ok(loyaltyService.createReward(reward));
    }

    /**
     * Update reward
     * PUT /api/v1/loyalty/rewards/{rewardId}
     */
    @PutMapping("/rewards/{rewardId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<LoyaltyReward> updateReward(
            @PathVariable String rewardId,
            @RequestBody LoyaltyReward reward) {
        LoyaltyReward updated = loyaltyService.updateReward(rewardId, reward);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get top customers by loyalty points
     * GET /api/v1/loyalty/top-customers?limit=10
     */
    @GetMapping("/top-customers")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getTopCustomers(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(loyaltyService.getTopCustomersByPoints(limit));
    }

    /**
     * Get customer progress towards next reward
     * GET /api/v1/loyalty/customer/{customerId}/progress
     */
    @GetMapping("/customer/{customerId}/progress")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<Map<String, Object>> getCustomerProgress(@PathVariable Long customerId) {
        // Get phone number from customer
        return loyaltyService.getCustomerLoyaltyInfo(customerId).containsKey("phoneNumber") ?
            ResponseEntity.ok(enhancedLoyaltyService.getCustomerProgress(
                (String) loyaltyService.getCustomerLoyaltyInfo(customerId).get("phoneNumber"))) :
            ResponseEntity.notFound().build();
    }

    /**
     * Get customer progress by phone
     * GET /api/v1/loyalty/progress/{phoneNumber}
     */
    @GetMapping("/progress/{phoneNumber}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<Map<String, Object>> getCustomerProgressByPhone(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(enhancedLoyaltyService.getCustomerProgress(phoneNumber));
    }

    /**
     * Get transaction history
     * GET /api/v1/loyalty/customer/{customerId}/transactions
     */
    @GetMapping("/customer/{customerId}/transactions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<List<LoyaltyTransaction>> getTransactionHistory(@PathVariable Long customerId) {
        // Get phone number from customer
        Map<String, Object> customerInfo = loyaltyService.getCustomerLoyaltyInfo(customerId);
        if (customerInfo.containsKey("phoneNumber")) {
            return ResponseEntity.ok(enhancedLoyaltyService.getTransactionHistory(
                (String) customerInfo.get("phoneNumber")));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get redemption history
     * GET /api/v1/loyalty/customer/{customerId}/redemptions
     */
    @GetMapping("/customer/{customerId}/redemptions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<List<LoyaltyRedemption>> getRedemptionHistory(@PathVariable Long customerId) {
        Map<String, Object> customerInfo = loyaltyService.getCustomerLoyaltyInfo(customerId);
        if (customerInfo.containsKey("phoneNumber")) {
            return ResponseEntity.ok(enhancedLoyaltyService.getRedemptionHistory(
                (String) customerInfo.get("phoneNumber")));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Redeem reward with delivery method
     * POST /api/v1/loyalty/customer/{customerId}/redeem
     */
    @PostMapping("/customer/{customerId}/redeem")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<Map<String, Object>> redeemRewardWithDelivery(
            @PathVariable Long customerId,
            @RequestBody Map<String, Object> redemptionData) {
        String rewardId = (String) redemptionData.get("rewardId");
        String deliveryMethodStr = (String) redemptionData.get("deliveryMethod");
        String deliveryAddress = (String) redemptionData.get("deliveryAddress");
        String locationCode = (String) redemptionData.get("locationCode");
        String locationName = (String) redemptionData.getOrDefault("locationName", "Global Warehouse");

        LoyaltyRedemption.DeliveryMethod deliveryMethod = LoyaltyRedemption.DeliveryMethod.TECHNICIAN_DELIVERY;
        if (deliveryMethodStr != null) {
            try {
                deliveryMethod = LoyaltyRedemption.DeliveryMethod.valueOf(deliveryMethodStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Use default
            }
        }

        return ResponseEntity.ok(enhancedLoyaltyService.redeemReward(
            customerId, rewardId, deliveryMethod, deliveryAddress, locationCode, locationName));
    }

    /**
     * Get pending redemptions (admin)
     * GET /api/v1/loyalty/redemptions/pending
     */
    @GetMapping("/redemptions/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<LoyaltyRedemption>> getPendingRedemptions() {
        return ResponseEntity.ok(enhancedLoyaltyService.getPendingRedemptions());
    }

    /**
     * Approve redemption
     * POST /api/v1/loyalty/redemptions/{redemptionId}/approve
     */
    @PostMapping("/redemptions/{redemptionId}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> approveRedemption(
            @PathVariable String redemptionId,
            @RequestParam(required = false) String technicianAssigned) {
        enhancedLoyaltyService.approveRedemption(redemptionId, technicianAssigned);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark redemption as delivered
     * POST /api/v1/loyalty/redemptions/{redemptionId}/deliver
     */
    @PostMapping("/redemptions/{redemptionId}/deliver")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> markRedemptionDelivered(@PathVariable String redemptionId) {
        enhancedLoyaltyService.markRedemptionDelivered(redemptionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/customer/phone/{phoneNumber}/snapshot")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<Map<String, Object>> getCustomerSnapshot(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(enhancedLoyaltyService.getCustomerLoyaltySnapshot(phoneNumber));
    }

    @GetMapping("/point-rules")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<LoyaltyPointRule>> getPointRules() {
        return ResponseEntity.ok(enhancedLoyaltyService.getPointRules());
    }

    @PostMapping("/point-rules")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<LoyaltyPointRule> savePointRule(@RequestBody LoyaltyPointRule rule) {
        return ResponseEntity.ok(enhancedLoyaltyService.savePointRule(rule));
    }

    @DeleteMapping("/point-rules/{ruleId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deactivatePointRule(@PathVariable String ruleId) {
        enhancedLoyaltyService.deactivatePointRule(ruleId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tiers")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<LoyaltyTierConfig>> getTierConfigs() {
        return ResponseEntity.ok(enhancedLoyaltyService.getTierConfigs());
    }

    @PostMapping("/tiers")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<LoyaltyTierConfig> saveTierConfig(@RequestBody LoyaltyTierConfig config) {
        return ResponseEntity.ok(enhancedLoyaltyService.saveTierConfig(config));
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<LoyaltyProductInventory>> getInventory(
            @RequestParam(required = false) String rewardId) {
        return ResponseEntity.ok(enhancedLoyaltyService.getProductInventory(rewardId));
    }

    @PostMapping("/inventory")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<LoyaltyProductInventory> upsertInventory(@RequestBody Map<String, Object> payload) {
        String rewardId = (String) payload.get("rewardId");
        String locationCode = (String) payload.get("locationCode");
        String locationName = (String) payload.get("locationName");
        Integer stockAvailable = payload.get("stockAvailable") != null ?
            ((Number) payload.get("stockAvailable")).intValue() : null;
        Integer threshold = payload.get("thresholdAlert") != null ?
            ((Number) payload.get("thresholdAlert")).intValue() : null;
        return ResponseEntity.ok(enhancedLoyaltyService
            .upsertInventory(rewardId, locationCode, locationName, stockAvailable, threshold));
    }
}

