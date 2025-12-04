package com.ggnetworks.service;

import com.ggnetworks.entity.Customer;
import com.ggnetworks.entity.InternetPackage;
import com.ggnetworks.entity.LoyaltyReward;
import com.ggnetworks.repository.CustomerRepository;
import com.ggnetworks.repository.InternetPackageRepository;
import com.ggnetworks.repository.LoyaltyRewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LoyaltyService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private LoyaltyRewardRepository loyaltyRewardRepository;

    @Autowired
    private InternetPackageRepository packageRepository;

    @Autowired
    private EnhancedLoyaltyService enhancedLoyaltyService;

    /**
     * Award loyalty points to customer after package purchase
     * Delegates to EnhancedLoyaltyService for full business logic
     */
    @Transactional
    public void awardPointsForPurchase(Long customerId, Long packageId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            // Use enhanced service for point calculation
            Optional<InternetPackage> packageOpt = packageRepository.findById(packageId);
            if (packageOpt.isPresent()) {
                Integer points = enhancedLoyaltyService.calculatePointsForPackage(packageOpt.get());
                Customer customer = customerOpt.get();
                customer.setLoyaltyPoints(customer.getLoyaltyPoints() + points);
                customer.setTotalPointsEarned(customer.getTotalPointsEarned() + points);
                customer.updateLoyaltyTier();
                updateLoyaltyStatus(customer);
                customerRepository.save(customer);
            }
        }
    }

    /**
     * Award loyalty points by phone number
     */
    @Transactional
    public void awardPointsForPurchase(String phoneNumber, Long packageId) {
        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
        if (customerOpt.isPresent()) {
            awardPointsForPurchase(customerOpt.get().getId(), packageId);
        }
    }

    /**
     * Redeem reward using loyalty points
     */
    @Transactional
    public Map<String, Object> redeemReward(Long customerId, String rewardId) {
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

        // Check if reward is available
        if (!reward.isAvailable()) {
            result.put("success", false);
            result.put("message", "Reward is not available");
            return result;
        }

        // Check if customer has enough points
        if (customer.getLoyaltyPoints() < reward.getPointsRequired()) {
            result.put("success", false);
            result.put("message", "Insufficient loyalty points. Required: " + reward.getPointsRequired() + ", Available: " + customer.getLoyaltyPoints());
            return result;
        }

        // Deduct points and update inventory
        customer.setLoyaltyPoints(customer.getLoyaltyPoints() - reward.getPointsRequired());
        reward.incrementRedemption();
        updateLoyaltyStatus(customer);

        customerRepository.save(customer);
        loyaltyRewardRepository.save(reward);

        result.put("success", true);
        result.put("message", "Reward redeemed successfully");
        result.put("remainingPoints", customer.getLoyaltyPoints());
        result.put("reward", reward);

        return result;
    }

    /**
     * Get available rewards for customer based on their points
     */
    public List<LoyaltyReward> getAvailableRewardsForCustomer(Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (!customerOpt.isPresent()) {
            return new ArrayList<>();
        }

        Integer customerPoints = customerOpt.get().getLoyaltyPoints();
        return loyaltyRewardRepository.findAffordableRewards(customerPoints);
    }

    /**
     * Get all available rewards
     */
    public List<LoyaltyReward> getAllAvailableRewards() {
        return loyaltyRewardRepository.findAvailableRewards(LocalDateTime.now());
    }

    /**
     * Get customer loyalty points history
     */
    public Map<String, Object> getCustomerLoyaltyInfo(Long customerId) {
        Map<String, Object> info = new HashMap<>();

        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (!customerOpt.isPresent()) {
            info.put("error", "Customer not found");
            return info;
        }

        Customer customer = customerOpt.get();
        info.put("customerId", customer.getId());
        info.put("phoneNumber", customer.getPrimaryPhoneNumber());
        info.put("loyaltyPoints", customer.getLoyaltyPoints());
        info.put("loyaltyStatus", customer.getLoyaltyStatus());
        info.put("availableRewards", getAvailableRewardsForCustomer(customerId));
        info.put("totalSpent", customer.getTotalSpent());

        return info;
    }

    /**
     * Update customer loyalty status based on points
     */
    private void updateLoyaltyStatus(Customer customer) {
        Integer points = customer.getLoyaltyPoints();

        if (points >= 10000) {
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.VIP_CUSTOMER);
        } else if (points >= 5000) {
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.LOYAL_CUSTOMER);
        } else if (points >= 1000) {
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.REGULAR_CUSTOMER);
        } else if (points > 0) {
            customer.setLoyaltyStatus(Customer.LoyaltyStatus.NEW_CUSTOMER);
        }
    }

    /**
     * Get top customers by loyalty points
     */
    public List<Map<String, Object>> getTopCustomersByPoints(int limit) {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
            .filter(c -> c.getLoyaltyPoints() != null && c.getLoyaltyPoints() > 0)
            .sorted((a, b) -> b.getLoyaltyPoints().compareTo(a.getLoyaltyPoints()))
            .limit(limit)
            .map(customer -> {
                Map<String, Object> data = new HashMap<>();
                data.put("customerId", customer.getId());
                data.put("phoneNumber", customer.getPrimaryPhoneNumber());
                data.put("fullName", customer.getFullName());
                data.put("loyaltyPoints", customer.getLoyaltyPoints());
                data.put("loyaltyStatus", customer.getLoyaltyStatus());
                data.put("totalSpent", customer.getTotalSpent());
                return data;
            })
            .collect(Collectors.toList());
    }

    /**
     * Create new loyalty reward
     */
    @Transactional
    public LoyaltyReward createReward(LoyaltyReward reward) {
        if (reward.getRewardId() == null || reward.getRewardId().isEmpty()) {
            reward.setRewardId("REWARD_" + System.currentTimeMillis());
        }
        return loyaltyRewardRepository.save(reward);
    }

    /**
     * Update reward
     */
    @Transactional
    public LoyaltyReward updateReward(String rewardId, LoyaltyReward updatedReward) {
        Optional<LoyaltyReward> rewardOpt = loyaltyRewardRepository.findByRewardId(rewardId);
        if (rewardOpt.isPresent()) {
            LoyaltyReward reward = rewardOpt.get();
            reward.setRewardName(updatedReward.getRewardName());
            reward.setDescription(updatedReward.getDescription());
            reward.setPointsRequired(updatedReward.getPointsRequired());
            reward.setRewardTier(updatedReward.getRewardTier());
            reward.setInventoryCount(updatedReward.getInventoryCount());
            reward.setIsActive(updatedReward.getIsActive());
            reward.setImageUrl(updatedReward.getImageUrl());
            reward.setValidFrom(updatedReward.getValidFrom());
            reward.setValidUntil(updatedReward.getValidUntil());
            return loyaltyRewardRepository.save(reward);
        }
        return null;
    }

    /**
     * Get all rewards
     */
    public List<LoyaltyReward> getAllRewards() {
        return loyaltyRewardRepository.findAll();
    }

    /**
     * Get reward by ID
     */
    public Optional<LoyaltyReward> getRewardById(String rewardId) {
        return loyaltyRewardRepository.findByRewardId(rewardId);
    }
}

