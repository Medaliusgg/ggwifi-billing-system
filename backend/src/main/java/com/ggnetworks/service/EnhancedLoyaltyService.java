package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Enhanced Loyalty Service
 * Implements the complete GG Points loyalty program with:
 * - Package-based point calculation (Short=1, Daily=2, Weekly=6, Monthly=10, Semester=40)
 * - Transaction tracking
 * - 3-month expiry rules
 * - Tier management (Bronze, Silver, Gold, Platinum)
 * - Redemption workflow
 * - Progress tracking
 */
@Service
public class EnhancedLoyaltyService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private LoyaltyRewardRepository loyaltyRewardRepository;

    @Autowired
    private InternetPackageRepository packageRepository;

    @Autowired
    private LoyaltyTransactionRepository loyaltyTransactionRepository;

    @Autowired
    private LoyaltyRedemptionRepository loyaltyRedemptionRepository;

    @Autowired
    private LoyaltyPointRuleRepository loyaltyPointRuleRepository;

    @Autowired
    private LoyaltyTierConfigRepository loyaltyTierConfigRepository;

    @Autowired
    private LoyaltyProductInventoryRepository loyaltyProductInventoryRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private NotificationService notificationService;

    /**
     * Calculate points based on package type and duration
     * Package Type | Validity | Points Earned
     * Short/Hourly | 12 hrs   | 1 point
     * Daily        | 24 hrs   | 2 points
     * Weekly       | 7 days   | 6 points
     * Monthly      | 30 days  | 10 points
     * Semester     | 5 months | 40 points
     */
    public Integer calculatePointsForPackage(InternetPackage pkg) {
        if (pkg.getLoyaltyPointsAwarded() != null && pkg.getLoyaltyPointsAwarded() > 0) {
            return pkg.getLoyaltyPointsAwarded();
        }

        Integer durationDays = pkg.getDurationDays() != null ? pkg.getDurationDays() : 1;
        InternetPackage.PackageType packageType = pkg.getPackageType() != null ?
            pkg.getPackageType() : InternetPackage.PackageType.TIME_BASED_OFFER;

        List<LoyaltyPointRule> matchingRules = loyaltyPointRuleRepository
            .findMatchingRules(packageType, durationDays);
        if (!matchingRules.isEmpty()) {
            return matchingRules.get(0).getPointsAwarded();
        }

        List<LoyaltyPointRule> defaultRules = loyaltyPointRuleRepository
            .findByIsActiveTrueOrderByMinDurationDaysAsc();
        if (!defaultRules.isEmpty()) {
            return defaultRules.get(0).getPointsAwarded();
        }

        // Legacy fallback so points continue to work if no rules configured
        if (durationDays <= 1) {
            if (packageType == InternetPackage.PackageType.TIME_BASED_OFFER || durationDays < 1) {
                return 1;
            }
            return 2;
        } else if (durationDays <= 7) {
            return 6;
        } else if (durationDays <= 30) {
            return 10;
        } else if (durationDays >= 150) {
            return 40;
        }
        return Math.max(1, durationDays / 3);
    }

    /**
     * Award points after successful payment
     * This is called automatically when payment is successful
     */
    @Transactional
    public Map<String, Object> awardPointsAfterPayment(Long paymentId, String phoneNumber, Long packageId, String voucherCode) {
        Map<String, Object> result = new HashMap<>();

        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        Optional<InternetPackage> packageOpt = packageRepository.findById(packageId);
        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);

        if (!paymentOpt.isPresent() || !packageOpt.isPresent()) {
            result.put("success", false);
            result.put("message", "Payment or package not found");
            return result;
        }

        Payment payment = paymentOpt.get();
        InternetPackage pkg = packageOpt.get();

        // Only award points for successful payments
        if (payment.getStatus() != Payment.PaymentStatus.SUCCESSFUL) {
            result.put("success", false);
            result.put("message", "Payment not successful");
            return result;
        }

        // Calculate points
        Integer pointsToAward = calculatePointsForPackage(pkg);

        if (pointsToAward <= 0) {
            result.put("success", false);
            result.put("message", "No points awarded for this package");
            return result;
        }

        // Get or create customer
        Customer customer;
        if (customerOpt.isPresent()) {
            customer = customerOpt.get();
        } else {
            // Create new customer record
            customer = new Customer();
            customer.setCustomerId("CUST_" + System.currentTimeMillis());
            customer.setPrimaryPhoneNumber(phoneNumber);
            customer.setFirstName("Customer");
            customer.setLastName(phoneNumber.substring(phoneNumber.length() - 4));
            customer.setEmail(phoneNumber + "@ggwifi.co.tz");
            customer.setStatus(Customer.CustomerStatus.ACTIVE);
            customer.setAccountType(Customer.AccountType.INDIVIDUAL);
            customer.setRegistrationDate(LocalDateTime.now());
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.NEW_CUSTOMER);
            customer.setLoyaltyPoints(0);
            customer.setTotalPointsEarned(0);
            customer.setTotalPointsRedeemed(0);
            customer = customerRepository.save(customer);
        }

        // Award points
        Integer oldBalance = customer.getLoyaltyPoints();
        Integer newBalance = oldBalance + pointsToAward;

        customer.setLoyaltyPoints(newBalance);
        customer.setTotalPointsEarned(customer.getTotalPointsEarned() + pointsToAward);
        customer.setLastPointsEarnedAt(LocalDateTime.now());
        applyConfigDrivenTier(customer);
        updateLoyaltyStatus(customer);

        customerRepository.save(customer);
        notifyUnlockedRewards(customer, oldBalance, newBalance);

        // Create loyalty transaction record
        LoyaltyTransaction transaction = new LoyaltyTransaction(
            customer.getId(),
            phoneNumber,
            LoyaltyTransaction.TransactionType.EARNED,
            pointsToAward,
            newBalance
        );
        transaction.setPackageId(packageId);
        transaction.setPackageName(pkg.getName());
        transaction.setPaymentId(paymentId);
        transaction.setVoucherCode(voucherCode);
        transaction.setDescription("Points earned from " + pkg.getName() + " purchase");
        loyaltyTransactionRepository.save(transaction);

        // Send SMS notification
        try {
            String message = String.format(
                "Congratulations! You earned %d GG Points from your %s purchase. " +
                "Your total points: %d. Keep buying to unlock amazing rewards!",
                pointsToAward, pkg.getName(), newBalance
            );
            smsService.sendSms(phoneNumber, message);
        } catch (Exception e) {
            // Log error but don't fail the transaction
            System.err.println("Failed to send loyalty SMS: " + e.getMessage());
        }

        result.put("success", true);
        result.put("pointsAwarded", pointsToAward);
        result.put("newBalance", newBalance);
        result.put("loyaltyTier", customer.getLoyaltyTier());
        result.put("message", "Points awarded successfully");

        return result;
    }

    /**
     * Redeem reward with full workflow
     */
    @Transactional
    public Map<String, Object> redeemReward(Long customerId,
                                            String rewardId,
                                            LoyaltyRedemption.DeliveryMethod deliveryMethod,
                                            String deliveryAddress) {
        return redeemReward(customerId, rewardId, deliveryMethod, deliveryAddress, null, null);
    }

    public Map<String, Object> redeemReward(Long customerId,
                                            String rewardId,
                                            LoyaltyRedemption.DeliveryMethod deliveryMethod,
                                            String deliveryAddress,
                                            String locationCode,
                                            String locationName) {
        Map<String, Object> result = new HashMap<>();

        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        Optional<LoyaltyReward> rewardOpt = loyaltyRewardRepository.findByRewardId(rewardId);

        if (!customerOpt.isPresent()) {
            result.put("success", false);
            result.put("message", "Customer not found");
            return result;
        }

        if (!rewardOpt.isPresent()) {
            result.put("success", false);
            result.put("message", "Reward not found");
            return result;
        }

        Customer customer = customerOpt.get();
        LoyaltyReward reward = rewardOpt.get();

        // Validate reward availability
        if (!reward.isAvailable()) {
            result.put("success", false);
            result.put("message", "Reward is not available");
            return result;
        }

        if (reward.getMaxRedemptionsPerCustomer() != null &&
            reward.getMaxRedemptionsPerCustomer() > 0) {
            long redemptionCount = loyaltyRedemptionRepository
                .countByCustomerIdAndRewardId(customerId, rewardId);
            if (redemptionCount >= reward.getMaxRedemptionsPerCustomer()) {
                result.put("success", false);
                result.put("message", "Redemption limit reached for this reward");
                return result;
            }
        }

        // Check points balance
        if (customer.getLoyaltyPoints() < reward.getPointsRequired()) {
            result.put("success", false);
            result.put("message", String.format(
                "Insufficient points. Required: %d, Available: %d",
                reward.getPointsRequired(), customer.getLoyaltyPoints()
            ));
            result.put("pointsNeeded", reward.getPointsRequired() - customer.getLoyaltyPoints());
            return result;
        }

        // Deduct points
        Integer oldBalance = customer.getLoyaltyPoints();
        Integer newBalance = oldBalance - reward.getPointsRequired();

        customer.setLoyaltyPoints(newBalance);
        customer.setTotalPointsRedeemed(customer.getTotalPointsRedeemed() + reward.getPointsRequired());
        applyConfigDrivenTier(customer);
        customerRepository.save(customer);

        // Create redemption record
        LoyaltyRedemption redemption = new LoyaltyRedemption(
            customerId,
            customer.getPrimaryPhoneNumber(),
            rewardId,
            reward.getRewardName(),
            reward.getPointsRequired()
        );
        redemption.setDeliveryMethod(deliveryMethod);
        redemption.setDeliveryAddress(deliveryAddress);
        redemption.setLocationCode(locationCode);
        redemption.setLocationName(locationName);
        redemption.setStatus(LoyaltyRedemption.RedemptionStatus.PENDING);
        redemption = loyaltyRedemptionRepository.save(redemption);

        // Create transaction record
        LoyaltyTransaction transaction = new LoyaltyTransaction(
            customerId,
            customer.getPrimaryPhoneNumber(),
            LoyaltyTransaction.TransactionType.REDEEMED,
            -reward.getPointsRequired(), // Negative for redemption
            newBalance
        );
        transaction.setRewardId(rewardId);
        transaction.setRewardName(reward.getRewardName());
        transaction.setDescription("Redeemed " + reward.getRewardName());
        loyaltyTransactionRepository.save(transaction);

        // Update reward inventory
        reward.incrementRedemption();
        loyaltyRewardRepository.save(reward);
        adjustInventoryCount(rewardId, -1, locationCode, locationName);

        // Send SMS notification
        try {
            String message = String.format(
                "Congratulations! You redeemed %d GG Points for %s. " +
                "Your request is pending approval. Remaining points: %d",
                reward.getPointsRequired(), reward.getRewardName(), newBalance
            );
            smsService.sendSms(customer.getPrimaryPhoneNumber(), message);
        } catch (Exception e) {
            System.err.println("Failed to send redemption SMS: " + e.getMessage());
        }

        result.put("success", true);
        result.put("redemptionId", redemption.getRedemptionId());
        result.put("remainingPoints", newBalance);
        result.put("message", "Reward redemption request submitted successfully");

        return result;
    }

    /**
     * Get customer progress towards next reward
     */
    public Map<String, Object> getCustomerProgress(String phoneNumber) {
        Map<String, Object> progress = new HashMap<>();

        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
        if (!customerOpt.isPresent()) {
            progress.put("error", "Customer not found");
            return progress;
        }

        Customer customer = customerOpt.get();
        Integer currentPoints = customer.getLoyaltyPoints();

        // Get next available reward
        List<LoyaltyReward> availableRewards = loyaltyRewardRepository.findAffordableRewards(currentPoints);
        List<LoyaltyReward> allRewards = loyaltyRewardRepository.findAvailableRewards(LocalDateTime.now());

        // Find next reward customer can't afford yet
        LoyaltyReward nextReward = allRewards.stream()
            .filter(r -> r.getPointsRequired() > currentPoints)
            .sorted(Comparator.comparing(LoyaltyReward::getPointsRequired))
            .findFirst()
            .orElse(null);

        progress.put("currentPoints", currentPoints);
        progress.put("loyaltyTier", customer.getLoyaltyTier());
        progress.put("totalPointsEarned", customer.getTotalPointsEarned());
        progress.put("totalPointsRedeemed", customer.getTotalPointsRedeemed());

        if (nextReward != null) {
            Integer pointsNeeded = nextReward.getPointsRequired() - currentPoints;
            Double progressPercentage = (currentPoints * 100.0) / nextReward.getPointsRequired();

            progress.put("nextReward", Map.of(
                "rewardId", nextReward.getRewardId(),
                "rewardName", nextReward.getRewardName(),
                "pointsRequired", nextReward.getPointsRequired(),
                "pointsNeeded", pointsNeeded,
                "progressPercentage", progressPercentage
            ));
            progress.put("progressMessage", String.format(
                "%d points left to get %s!", pointsNeeded, nextReward.getRewardName()
            ));
        }

        progress.put("availableRewards", availableRewards.size());
        progress.put("allRewards", allRewards.size());

        return progress;
    }

    /**
     * Process expired points (run as scheduled job)
     */
    @Transactional
    public int processExpiredPoints() {
        LocalDateTime now = LocalDateTime.now();
        List<LoyaltyTransaction> expiredTransactions = loyaltyTransactionRepository.findExpiredPoints(now);

        int expiredCount = 0;
        for (LoyaltyTransaction transaction : expiredTransactions) {
            if (!transaction.getIsExpired() && transaction.getPoints() > 0) {
                // Get customer
                Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(transaction.getPhoneNumber());
                if (customerOpt.isPresent()) {
                    Customer customer = customerOpt.get();
                    Integer currentBalance = customer.getLoyaltyPoints();
                    Integer expiredPoints = transaction.getPoints();
                    Integer newBalance = Math.max(0, currentBalance - expiredPoints);

                    customer.setLoyaltyPoints(newBalance);
                    customer.updateLoyaltyTier();
                    customerRepository.save(customer);

                    // Mark transaction as expired
                    transaction.markAsExpired();
                    loyaltyTransactionRepository.save(transaction);

                    // Create expiry transaction
                    LoyaltyTransaction expiryTransaction = new LoyaltyTransaction(
                        customer.getId(),
                        transaction.getPhoneNumber(),
                        LoyaltyTransaction.TransactionType.EXPIRED,
                        -expiredPoints,
                        newBalance
                    );
                    expiryTransaction.setDescription("Points expired after 3 months");
                    loyaltyTransactionRepository.save(expiryTransaction);

                    expiredCount++;
                }
            }
        }

        return expiredCount;
    }

    /**
     * Update loyalty status based on points and activity
     */
    private void updateLoyaltyStatus(Customer customer) {
        Integer points = customer.getLoyaltyPoints();

        if (points >= 400) {
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.VIP_CUSTOMER);
        } else if (points >= 151) {
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.LOYAL_CUSTOMER);
        } else if (points >= 51) {
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.REGULAR_CUSTOMER);
        } else if (points > 0) {
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.NEW_CUSTOMER);
        }
    }

    private void applyConfigDrivenTier(Customer customer) {
        Integer points = customer.getLoyaltyPoints();
        List<LoyaltyTierConfig> tierConfigs = loyaltyTierConfigRepository.findTierForPoints(points);
        if (!tierConfigs.isEmpty()) {
            LoyaltyTierConfig config = tierConfigs.get(0);
            customer.setLoyaltyTier(config.getMappedTier());
            customer.setLoyaltyStatus(mapTierToStatus(config.getMappedTier(), config.getPrioritySupport()));
        } else {
            customer.updateLoyaltyTier();
        }
    }

    private Customer.LoyaltyStatus mapTierToStatus(Customer.LoyaltyTier tier, Boolean prioritySupport) {
        if (Boolean.TRUE.equals(prioritySupport)) {
            return Customer.LoyaltyStatus.VIP_CUSTOMER;
        }
        return switch (tier) {
            case PLATINUM -> Customer.LoyaltyStatus.VIP_CUSTOMER;
            case GOLD -> Customer.LoyaltyStatus.LOYAL_CUSTOMER;
            case SILVER -> Customer.LoyaltyStatus.REGULAR_CUSTOMER;
            default -> Customer.LoyaltyStatus.NEW_CUSTOMER;
        };
    }

    private void notifyUnlockedRewards(Customer customer, Integer previousBalance, Integer newBalance) {
        if (previousBalance == null || newBalance == null || newBalance <= previousBalance) {
            return;
        }
        List<LoyaltyReward> availableRewards = loyaltyRewardRepository.findAvailableRewards(LocalDateTime.now());
        List<LoyaltyReward> unlocked = new ArrayList<>();
        for (LoyaltyReward reward : availableRewards) {
            if (previousBalance < reward.getPointsRequired() && newBalance >= reward.getPointsRequired()) {
                unlocked.add(reward);
            }
        }
        if (unlocked.isEmpty()) {
            return;
        }
        for (LoyaltyReward reward : unlocked) {
            String message = String.format(
                "Great news %s! You now have enough points (%d) to redeem %s.",
                customer.getFullName(), newBalance, reward.getRewardName()
            );
            try {
                smsService.sendSms(customer.getPrimaryPhoneNumber(), message);
            } catch (Exception ignored) { }
            try {
                notificationService.sendNotification(
                    "CUSTOMER",
                    customer.getPrimaryPhoneNumber(),
                    "IN_APP",
                    "LOYALTY_REWARD_UNLOCKED",
                    "Reward unlocked",
                    message
                );
            } catch (Exception ignored) { }
        }
    }

    private void adjustInventoryCount(String rewardId, int delta, String locationCode, String locationName) {
        if (rewardId == null || delta == 0) {
            return;
        }

        String safeLocationCode = (locationCode == null || locationCode.isEmpty()) ? "GLOBAL" : locationCode;
        LoyaltyProductInventory inventory = loyaltyProductInventoryRepository
            .findByRewardIdAndLocationCode(rewardId, safeLocationCode)
            .orElseGet(() -> {
                LoyaltyProductInventory inv = new LoyaltyProductInventory();
                inv.setRewardId(rewardId);
                inv.setLocationCode(safeLocationCode);
                inv.setLocationName(locationName != null ? locationName : "Global Warehouse");
                inv.setStockAvailable(0);
                return inv;
            });

        inventory.setStockAvailable(Math.max(0, inventory.getStockAvailable() + delta));
        if (locationName != null) {
            inventory.setLocationName(locationName);
        }
        loyaltyProductInventoryRepository.save(inventory);
        syncRewardInventory(rewardId);
    }

    private void syncRewardInventory(String rewardId) {
        if (rewardId == null) return;
        int totalStock = loyaltyProductInventoryRepository.findByRewardId(rewardId).stream()
            .map(inv -> inv.getStockAvailable() != null ? inv.getStockAvailable() : 0)
            .reduce(0, Integer::sum);
        loyaltyRewardRepository.findByRewardId(rewardId).ifPresent(reward -> {
            reward.setInventoryCount(Math.max(0, totalStock));
            loyaltyRewardRepository.save(reward);
        });
    }

    /**
     * Get loyalty transaction history
     */
    public List<LoyaltyTransaction> getTransactionHistory(String phoneNumber) {
        return loyaltyTransactionRepository.findByPhoneNumber(phoneNumber);
    }

    /**
     * Get redemption history
     */
    public List<LoyaltyRedemption> getRedemptionHistory(String phoneNumber) {
        return loyaltyRedemptionRepository.findByPhoneNumber(phoneNumber);
    }

    /**
     * Approve redemption (admin action)
     */
    @Transactional
    public void approveRedemption(String redemptionId, String technicianAssigned) {
        Optional<LoyaltyRedemption> redemptionOpt = loyaltyRedemptionRepository.findByRedemptionId(redemptionId);
        if (redemptionOpt.isPresent()) {
            LoyaltyRedemption redemption = redemptionOpt.get();
            redemption.approve();
            if (technicianAssigned != null) {
                redemption.setTechnicianAssigned(technicianAssigned);
            }
            loyaltyRedemptionRepository.save(redemption);

            // Send SMS
            try {
                String message = String.format(
                    "Your reward redemption for %s has been approved! " +
                    "We'll contact you soon for delivery.",
                    redemption.getRewardName()
                );
                smsService.sendSms(redemption.getPhoneNumber(), message);
            } catch (Exception e) {
                System.err.println("Failed to send approval SMS: " + e.getMessage());
            }
        }
    }

    /**
     * Mark redemption as delivered
     */
    @Transactional
    public void markRedemptionDelivered(String redemptionId) {
        Optional<LoyaltyRedemption> redemptionOpt = loyaltyRedemptionRepository.findByRedemptionId(redemptionId);
        if (redemptionOpt.isPresent()) {
            LoyaltyRedemption redemption = redemptionOpt.get();
            redemption.markAsDelivered();
            loyaltyRedemptionRepository.save(redemption);

            // Send SMS
            try {
                String message = String.format(
                    "Congratulations! Your %s has been delivered. " +
                    "Thank you for being a loyal GG Wi-Fi customer!",
                    redemption.getRewardName()
                );
                smsService.sendSms(redemption.getPhoneNumber(), message);
            } catch (Exception e) {
                System.err.println("Failed to send delivery SMS: " + e.getMessage());
            }
        }
    }

    /**
     * Get pending redemptions (awaiting admin approval)
     */
    public List<LoyaltyRedemption> getPendingRedemptions() {
        return loyaltyRedemptionRepository.findByStatus(LoyaltyRedemption.RedemptionStatus.PENDING);
    }

    /**
     * Admin utilities
     */
    public List<LoyaltyPointRule> getPointRules() {
        return loyaltyPointRuleRepository.findByIsActiveTrueOrderByMinDurationDaysAsc();
    }

    public LoyaltyPointRule savePointRule(LoyaltyPointRule payload) {
        LoyaltyPointRule rule;
        if (payload.getRuleId() != null && loyaltyPointRuleRepository.existsByRuleId(payload.getRuleId())) {
            rule = loyaltyPointRuleRepository.findByRuleId(payload.getRuleId());
        } else {
            rule = new LoyaltyPointRule();
        }
        rule.setPackageType(payload.getPackageType());
        rule.setMinDurationDays(payload.getMinDurationDays());
        rule.setMaxDurationDays(payload.getMaxDurationDays());
        rule.setPointsAwarded(payload.getPointsAwarded());
        rule.setDefaultRule(payload.getDefaultRule());
        rule.setActive(payload.getActive());
        rule.setDescription(payload.getDescription());
        return loyaltyPointRuleRepository.save(rule);
    }

    public void deactivatePointRule(String ruleId) {
        LoyaltyPointRule rule = loyaltyPointRuleRepository.findByRuleId(ruleId);
        if (rule != null) {
            rule.setActive(false);
            loyaltyPointRuleRepository.save(rule);
        }
    }

    public List<LoyaltyTierConfig> getTierConfigs() {
        return loyaltyTierConfigRepository.findAllByOrderByMinPointsAsc();
    }

    public LoyaltyTierConfig saveTierConfig(LoyaltyTierConfig payload) {
        LoyaltyTierConfig config = payload;
        if (payload.getId() != null) {
            config = loyaltyTierConfigRepository.findById(payload.getId()).orElse(payload);
        }
        config.setDisplayName(payload.getDisplayName());
        config.setMappedTier(payload.getMappedTier());
        config.setMinPoints(payload.getMinPoints());
        config.setMaxPoints(payload.getMaxPoints());
        config.setBenefits(payload.getBenefits());
        config.setBadgeColor(payload.getBadgeColor());
        config.setBonusMultiplier(payload.getBonusMultiplier());
        config.setPrioritySupport(payload.getPrioritySupport());
        config.setEnableAutoUpgrade(payload.getEnableAutoUpgrade());
        return loyaltyTierConfigRepository.save(config);
    }

    public List<LoyaltyProductInventory> getProductInventory(String rewardId) {
        if (rewardId != null && !rewardId.isEmpty()) {
            return loyaltyProductInventoryRepository.findByRewardId(rewardId);
        }
        return loyaltyProductInventoryRepository.findAll();
    }

    public LoyaltyProductInventory upsertInventory(String rewardId,
                                                   String locationCode,
                                                   String locationName,
                                                   Integer stockAvailable,
                                                   Integer threshold) {
        if (rewardId == null || rewardId.isEmpty()) {
            throw new IllegalArgumentException("rewardId is required");
        }
        String safeLocation = (locationCode == null || locationCode.isEmpty()) ? "GLOBAL" : locationCode;
        LoyaltyProductInventory inventory = loyaltyProductInventoryRepository
            .findByRewardIdAndLocationCode(rewardId, safeLocation)
            .orElseGet(() -> {
                LoyaltyProductInventory inv = new LoyaltyProductInventory();
                inv.setRewardId(rewardId);
                inv.setLocationCode(safeLocation);
                inv.setLocationName(locationName != null ? locationName : "Global Warehouse");
                inv.setStockAvailable(0);
                return inv;
            });
        if (stockAvailable != null) {
            inventory.setStockAvailable(Math.max(0, stockAvailable));
        }
        if (locationName != null) {
            inventory.setLocationName(locationName);
        }
        if (threshold != null) {
            inventory.setThresholdAlert(threshold);
        }
        LoyaltyProductInventory saved = loyaltyProductInventoryRepository.save(inventory);
        syncRewardInventory(rewardId);
        return saved;
    }

    public Map<String, Object> getCustomerLoyaltySnapshot(String phoneNumber) {
        Map<String, Object> snapshot = new HashMap<>();
        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
        if (!customerOpt.isPresent()) {
            snapshot.put("error", "Customer not found");
            return snapshot;
        }

        Customer customer = customerOpt.get();
        snapshot.put("customerPhone", customer.getPrimaryPhoneNumber());
        snapshot.put("points", customer.getLoyaltyPoints());
        snapshot.put("rewardTier", customer.getLoyaltyTier());
        snapshot.put("loyaltyStatus", customer.getLoyaltyStatus());
        snapshot.put("totalPointsEarned", customer.getTotalPointsEarned());
        snapshot.put("totalPointsRedeemed", customer.getTotalPointsRedeemed());

        List<LoyaltyTransaction> transactions = loyaltyTransactionRepository.findByPhoneNumber(phoneNumber);
        snapshot.put("earnedHistory", transactions.stream()
            .filter(tx -> tx.getTransactionType() == LoyaltyTransaction.TransactionType.EARNED)
            .limit(10)
            .toList());
        snapshot.put("rewardsRedeemed", loyaltyRedemptionRepository.findByPhoneNumber(phoneNumber)
            .stream()
            .limit(10)
            .toList());
        snapshot.put("availableRewards", loyaltyRewardRepository
            .findAffordableRewards(customer.getLoyaltyPoints()));
        snapshot.put("productInventory", loyaltyProductInventoryRepository.findAll());
        return snapshot;
    }
}

