package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private final CustomerLoyaltyRepository customerLoyaltyRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final LoyaltyProgramRepository loyaltyProgramRepository;
    private final PaymentRepository paymentRepository;
    private final HotspotSessionRepository hotspotSessionRepository;
    private final MarketingCommunicationRepository marketingCommunicationRepository;

    // ==================== HIGH-VALUE CUSTOMER TRACKING ====================

    /**
     * Track transaction and update loyalty metrics
     */
    @Transactional
    public CustomerLoyalty trackTransaction(String phoneNumber, BigDecimal amount, String transactionType) {
        try {
            CustomerProfile customerProfile = customerProfileRepository
                    .findByPhoneNumberAndDeletedAtIsNull(phoneNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

            CustomerLoyalty loyalty = getOrCreateCustomerLoyalty(customerProfile);
            
            // Update transaction metrics
            loyalty.setTotalTransactions(loyalty.getTotalTransactions() + 1);
            loyalty.setLifetimeSpend(loyalty.getLifetimeSpend().add(amount));
            loyalty.setLastTransactionDate(LocalDateTime.now());
            
            // Calculate average transaction value
            BigDecimal avgValue = loyalty.getLifetimeSpend()
                    .divide(BigDecimal.valueOf(loyalty.getTotalTransactions()), 2, BigDecimal.ROUND_HALF_UP);
            loyalty.setAverageTransactionValue(avgValue);
            
            // Calculate points based on amount
            int pointsEarned = calculatePointsEarned(amount, loyalty.getTierLevel());
            loyalty.setCurrentPoints(loyalty.getCurrentPoints() + pointsEarned);
            loyalty.setTotalPointsEarned(loyalty.getTotalPointsEarned() + pointsEarned);
            
            // Update monthly spend
            updateMonthlySpend(loyalty);
            
            // Update consecutive months active
            updateConsecutiveMonthsActive(loyalty);
            
            // Update scores
            loyalty.setRetentionScore(loyalty.calculateRetentionScore());
            loyalty.setEngagementScore(loyalty.calculateEngagementScore());
            loyalty.setLifetimeValueScore(loyalty.calculateLifetimeValueScore());
            
            CustomerLoyalty savedLoyalty = customerLoyaltyRepository.save(loyalty);
            
            // Check for tier upgrades and send notifications
            checkTierUpgrade(savedLoyalty);
            
            return savedLoyalty;
        } catch (Exception e) {
            log.error("Failed to track transaction for phone: {}", phoneNumber, e);
            throw new RuntimeException("Failed to track transaction", e);
        }
    }

    /**
     * Get or create customer loyalty record
     */
    private CustomerLoyalty getOrCreateCustomerLoyalty(CustomerProfile customerProfile) {
        List<CustomerLoyalty> existingLoyalty = customerLoyaltyRepository
                .findByCustomerProfileAndDeletedAtIsNull(customerProfile);
        
        if (!existingLoyalty.isEmpty()) {
            return existingLoyalty.get(0);
        }
        
        CustomerLoyalty newLoyalty = new CustomerLoyalty();
        newLoyalty.setCustomerProfile(customerProfile);
        newLoyalty.setPhoneNumber(customerProfile.getPhoneNumber());
        newLoyalty.setLoyaltyProgram(getDefaultLoyaltyProgram());
        newLoyalty.setMembershipStartDate(LocalDateTime.now());
        newLoyalty.setFirstTransactionDate(LocalDateTime.now());
        newLoyalty.setLastTransactionDate(LocalDateTime.now());
        return customerLoyaltyRepository.save(newLoyalty);
    }

    /**
     * Calculate points earned based on amount and tier
     */
    private int calculatePointsEarned(BigDecimal amount, CustomerLoyalty.TierLevel tierLevel) {
        // Base points: 1 point per 100 TZS
        int basePoints = amount.divide(BigDecimal.valueOf(100), 0, BigDecimal.ROUND_DOWN).intValue();
        
        // Tier bonus multiplier
        double bonusMultiplier = 1.0 + (tierLevel.getBonusPercentage() / 100.0);
        
        return (int) (basePoints * bonusMultiplier);
    }

    /**
     * Update monthly spend calculation
     */
    private void updateMonthlySpend(CustomerLoyalty loyalty) {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        
        List<Payment> monthlyPayments = paymentRepository
                .findByUserPhoneNumber(loyalty.getCustomerProfile().getPhoneNumber())
                .stream()
                .filter(payment -> payment.getCreatedAt().isAfter(monthStart))
                .toList();
        
        BigDecimal monthlyTotal = monthlyPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        loyalty.setMonthlySpend(monthlyTotal);
    }

    /**
     * Update consecutive months active
     */
    private void updateConsecutiveMonthsActive(CustomerLoyalty loyalty) {
        // This is a simplified calculation - in production, you'd want more sophisticated logic
        if (loyalty.getLastTransactionDate() != null) {
            long daysSinceLastTransaction = java.time.Duration.between(loyalty.getLastTransactionDate(), LocalDateTime.now()).toDays();
            if (daysSinceLastTransaction <= 30) {
                loyalty.setConsecutiveMonthsActive(loyalty.getConsecutiveMonthsActive() + 1);
            } else {
                loyalty.setConsecutiveMonthsActive(1);
            }
        }
    }

    // ==================== HIGH-VALUE CUSTOMER IDENTIFICATION ====================

    /**
     * Get high-value customers by spending threshold
     */
    public List<CustomerLoyalty> getHighValueCustomers(BigDecimal threshold) {
        return customerLoyaltyRepository.findByLifetimeSpendGreaterThanEqualAndDeletedAtIsNull(threshold);
    }

    /**
     * Get VIP customers (top 5% by lifetime spend)
     */
    public List<CustomerLoyalty> getVipCustomers() {
        Pageable pageable = PageRequest.of(0, 10); // Get top 10 VIP customers
        return customerLoyaltyRepository.findTopVipCustomers(pageable).getContent();
    }

    /**
     * Get platinum members (lifetime spend >= 1M TZS)
     */
    public List<CustomerLoyalty> getPlatinumMembers() {
        return customerLoyaltyRepository.findByTierLevelAndDeletedAtIsNull(CustomerLoyalty.TierLevel.PLATINUM);
    }

    /**
     * Get customers by tier level
     */
    public List<CustomerLoyalty> getCustomersByTier(CustomerLoyalty.TierLevel tierLevel) {
        return customerLoyaltyRepository.findByTierLevelAndDeletedAtIsNull(tierLevel);
    }

    /**
     * Get top customers by engagement score
     */
    public List<CustomerLoyalty> getTopEngagedCustomers(int limit) {
        return customerLoyaltyRepository.findTopByEngagementScoreOrderByEngagementScoreDesc(limit);
    }

    /**
     * Get at-risk customers
     */
    public List<CustomerLoyalty> getAtRiskCustomers(BigDecimal retentionThreshold) {
        return customerLoyaltyRepository.findByRetentionScoreLessThan(retentionThreshold);
    }

    // ==================== LOYALTY PROGRAM MANAGEMENT ====================

    /**
     * Get default loyalty program
     */
    private LoyaltyProgram getDefaultLoyaltyProgram() {
        return loyaltyProgramRepository.findByIsActiveTrueAndDeletedAtIsNull()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    LoyaltyProgram defaultProgram = new LoyaltyProgram();
                    defaultProgram.setProgramName("GGNetworks Loyalty Program");
                    defaultProgram.setProgramType(LoyaltyProgram.ProgramType.POINTS_BASED);
                    defaultProgram.setTargetService(LoyaltyProgram.TargetService.ALL_CUSTOMERS);
                    defaultProgram.setIsActive(true);
                    return loyaltyProgramRepository.save(defaultProgram);
                });
    }

    /**
     * Check for tier upgrades and send notifications
     */
    private void checkTierUpgrade(CustomerLoyalty loyalty) {
        CustomerLoyalty.TierLevel oldTier = loyalty.getTierLevel();
        CustomerLoyalty.TierLevel newTier = loyalty.getTierLevel();
        
        if (newTier.ordinal() > oldTier.ordinal()) {
            // Tier upgrade occurred
            log.info("Customer {} upgraded from {} to {}", 
                    loyalty.getPhoneNumber(), oldTier.getDisplayName(), newTier.getDisplayName());
            
            // Send tier upgrade notification
            sendTierUpgradeNotification(loyalty, oldTier, newTier);
            
            // Apply tier upgrade benefits
            applyTierUpgradeBenefits(loyalty, newTier);
        }
    }

    /**
     * Send tier upgrade notification
     */
    private void sendTierUpgradeNotification(CustomerLoyalty loyalty, 
                                           CustomerLoyalty.TierLevel oldTier, 
                                           CustomerLoyalty.TierLevel newTier) {
        try {
            String subject = "🎉 Congratulations! You've been upgraded to " + newTier.getDisplayName();
            String message = String.format(
                "Dear valued customer,\n\n" +
                "Congratulations! You've been upgraded from %s to %s tier.\n\n" +
                "New benefits include:\n" +
                "• %s%% bonus points on all transactions\n" +
                "• %s\n\n" +
                "Thank you for your loyalty!\n\n" +
                "Best regards,\nGGNetworks Team",
                oldTier.getDisplayName(),
                newTier.getDisplayName(),
                newTier.getBonusPercentage(),
                newTier.getDescription()
            );
            
            // Create marketing communication
            MarketingCommunication communication = new MarketingCommunication();
            communication.setCustomerProfile(loyalty.getCustomerProfile());
            communication.setPhoneNumber(loyalty.getPhoneNumber());
            communication.setCommunicationType(MarketingCommunication.CommunicationType.LOYALTY_REWARD);
            communication.setChannel(MarketingCommunication.Channel.SMS);
            communication.setSubject(subject);
            communication.setMessageContent(message);
            communication.setStatus(MarketingCommunication.CommunicationStatus.PENDING);
            
            marketingCommunicationRepository.save(communication);
        } catch (Exception e) {
            log.error("Failed to send tier upgrade notification", e);
        }
    }

    /**
     * Apply tier upgrade benefits
     */
    private void applyTierUpgradeBenefits(CustomerLoyalty loyalty, CustomerLoyalty.TierLevel newTier) {
        // Apply tier-specific benefits
        switch (newTier) {
            case GOLD:
                loyalty.setPrioritySupportEnabled(true);
                break;
            case PLATINUM:
                loyalty.setPrioritySupportEnabled(true);
                loyalty.setExclusivePackagesEnabled(true);
                loyalty.setCustomDiscountPercentage(BigDecimal.valueOf(5.0));
                break;
            case DIAMOND:
                loyalty.setPrioritySupportEnabled(true);
                loyalty.setExclusivePackagesEnabled(true);
                loyalty.setCustomDiscountPercentage(BigDecimal.valueOf(10.0));
                break;
            case VIP:
                loyalty.setPrioritySupportEnabled(true);
                loyalty.setExclusivePackagesEnabled(true);
                loyalty.setCustomDiscountPercentage(BigDecimal.valueOf(15.0));
                break;
            case ELITE:
                loyalty.setPrioritySupportEnabled(true);
                loyalty.setExclusivePackagesEnabled(true);
                loyalty.setCustomDiscountPercentage(BigDecimal.valueOf(20.0));
                break;
        }
        
        customerLoyaltyRepository.save(loyalty);
    }

    // ==================== SPECIAL OFFERS & BONUSES ====================

    /**
     * Award birthday bonus
     */
    @Transactional
    public CustomerLoyalty awardBirthdayBonus(String phoneNumber) {
        CustomerLoyalty loyalty = getCustomerLoyaltyByPhone(phoneNumber);
        
        if (loyalty != null && !loyalty.getBirthdayBonusClaimed()) {
            int bonusPoints = loyalty.getLoyaltyProgram().getBirthdayBonusMultiplier()
                    .multiply(BigDecimal.valueOf(1000))
                    .intValue();
            
            loyalty.setCurrentPoints(loyalty.getCurrentPoints() + bonusPoints);
            loyalty.setTotalPointsEarned(loyalty.getTotalPointsEarned() + bonusPoints);
            loyalty.setBirthdayBonusClaimed(true);
            
            return customerLoyaltyRepository.save(loyalty);
        }
        
        return loyalty;
    }

    /**
     * Award anniversary bonus
     */
    @Transactional
    public CustomerLoyalty awardAnniversaryBonus(String phoneNumber) {
        CustomerLoyalty loyalty = getCustomerLoyaltyByPhone(phoneNumber);
        
        if (loyalty != null && !loyalty.getAnniversaryBonusClaimed()) {
            int bonusPoints = loyalty.getLoyaltyProgram().getAnniversaryBonusPoints();
            
            loyalty.setCurrentPoints(loyalty.getCurrentPoints() + bonusPoints);
            loyalty.setTotalPointsEarned(loyalty.getTotalPointsEarned() + bonusPoints);
            loyalty.setAnniversaryBonusClaimed(true);
            
            return customerLoyaltyRepository.save(loyalty);
        }
        
        return loyalty;
    }

    /**
     * Award referral bonus
     */
    @Transactional
    public CustomerLoyalty awardReferralBonus(String phoneNumber) {
        CustomerLoyalty loyalty = getCustomerLoyaltyByPhone(phoneNumber);
        
        if (loyalty != null) {
            int bonusPoints = loyalty.getLoyaltyProgram().getReferralBonusPoints();
            
            loyalty.setCurrentPoints(loyalty.getCurrentPoints() + bonusPoints);
            loyalty.setTotalPointsEarned(loyalty.getTotalPointsEarned() + bonusPoints);
            loyalty.setReferralsCount(loyalty.getReferralsCount() + 1);
            
            return customerLoyaltyRepository.save(loyalty);
        }
        
        return loyalty;
    }

    // ==================== ANALYTICS & REPORTING ====================

    /**
     * Get loyalty statistics
     */
    public Map<String, Object> getLoyaltyStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total customers in loyalty program
        long totalCustomers = customerLoyaltyRepository.countByDeletedAtIsNull();
        stats.put("totalCustomers", totalCustomers);
        
        // Customers by tier
        Map<String, Long> customersByTier = Arrays.stream(CustomerLoyalty.TierLevel.values())
                .collect(Collectors.toMap(
                    CustomerLoyalty.TierLevel::getDisplayName,
                    tier -> customerLoyaltyRepository.countByTierLevelAndDeletedAtIsNull(tier)
                ));
        stats.put("customersByTier", customersByTier);
        
        // High-value customers
        long highValueCustomers = customerLoyaltyRepository.countByIsHighValueCustomerTrueAndDeletedAtIsNull();
        stats.put("highValueCustomers", highValueCustomers);
        
        // VIP customers
        long vipCustomers = customerLoyaltyRepository.countByIsVipCustomerTrueAndDeletedAtIsNull();
        stats.put("vipCustomers", vipCustomers);
        
        // Platinum members
        long platinumMembers = customerLoyaltyRepository.countByIsPlatinumMemberTrueAndDeletedAtIsNull();
        stats.put("platinumMembers", platinumMembers);
        
        // Total points awarded
        long totalPointsAwarded = customerLoyaltyRepository.sumTotalPointsEarned();
        stats.put("totalPointsAwarded", totalPointsAwarded);
        
        // Average lifetime spend
        BigDecimal avgLifetimeSpend = customerLoyaltyRepository.averageLifetimeSpend();
        stats.put("averageLifetimeSpend", avgLifetimeSpend);
        
        return stats;
    }

    /**
     * Get customer loyalty by phone number
     */
    public CustomerLoyalty getCustomerLoyaltyByPhone(String phoneNumber) {
        return customerLoyaltyRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber)
                .orElse(null);
    }

    /**
     * Get customer loyalty profile with all details
     */
    public Map<String, Object> getCustomerLoyaltyProfile(String phoneNumber) {
        CustomerLoyalty loyalty = getCustomerLoyaltyByPhone(phoneNumber);
        
        if (loyalty == null) {
            return Map.of("error", "Customer not found in loyalty program");
        }
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("loyalty", loyalty);
        profile.put("customerProfile", loyalty.getCustomerProfile());
        profile.put("loyaltyProgram", loyalty.getLoyaltyProgram());
        
        // Calculate next tier requirements
        CustomerLoyalty.TierLevel currentTier = loyalty.getTierLevel();
        CustomerLoyalty.TierLevel[] tiers = CustomerLoyalty.TierLevel.values();
        
        for (int i = currentTier.ordinal() + 1; i < tiers.length; i++) {
            CustomerLoyalty.TierLevel nextTier = tiers[i];
            int pointsNeeded = nextTier.getPointsRequired() - loyalty.getCurrentPoints();
            
            if (pointsNeeded > 0) {
                profile.put("nextTier", nextTier);
                profile.put("pointsNeededForNextTier", pointsNeeded);
                break;
            }
        }
        
        return profile;
    }

    /**
     * Export high-value customers for marketing
     */
    public List<Map<String, Object>> exportHighValueCustomers() {
        List<CustomerLoyalty> highValueCustomers = getHighValueCustomers(BigDecimal.valueOf(100000.00));
        
        return highValueCustomers.stream()
                .map(loyalty -> {
                    Map<String, Object> customer = new HashMap<>();
                    customer.put("phoneNumber", loyalty.getPhoneNumber());
                    customer.put("fullName", loyalty.getCustomerProfile().getFullName());
                    customer.put("tierLevel", loyalty.getTierLevel().getDisplayName());
                    customer.put("lifetimeSpend", loyalty.getLifetimeSpend());
                    customer.put("currentPoints", loyalty.getCurrentPoints());
                    customer.put("totalTransactions", loyalty.getTotalTransactions());
                    customer.put("averageTransactionValue", loyalty.getAverageTransactionValue());
                    customer.put("retentionScore", loyalty.getRetentionScore());
                    customer.put("engagementScore", loyalty.getEngagementScore());
                    customer.put("isVipCustomer", loyalty.getIsVipCustomer());
                    customer.put("isHighValueCustomer", loyalty.getIsHighValueCustomer());
                    customer.put("isPlatinumMember", loyalty.getIsPlatinumMember());
                    return customer;
                })
                .collect(Collectors.toList());
    }
} 