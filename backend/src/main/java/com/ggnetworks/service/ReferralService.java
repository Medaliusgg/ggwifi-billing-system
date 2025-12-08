package com.ggnetworks.service;

import com.ggnetworks.entity.CustomerAccount;
import com.ggnetworks.entity.Referral;
import com.ggnetworks.entity.Customer;
import com.ggnetworks.repository.CustomerAccountRepository;
import com.ggnetworks.repository.ReferralRepository;
import com.ggnetworks.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Referral Service
 * Handles referral code generation, tracking, and reward distribution
 */
@Service
public class ReferralService {

    @Autowired
    private ReferralRepository referralRepository;

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EnhancedLoyaltyService loyaltyService;

    /**
     * Record a referral when a new user signs up with a referral code
     */
    @Transactional
    public Referral recordReferral(String referrerCode, String referredPhoneNumber, Long referredAccountId) {
        // Find referrer by referral code
        Optional<CustomerAccount> referrerOpt = customerAccountRepository.findByReferralCode(referrerCode);
        if (referrerOpt.isEmpty()) {
            throw new RuntimeException("Invalid referral code");
        }

        CustomerAccount referrer = referrerOpt.get();
        String referrerPhoneNumber = referrer.getPhoneNumber();

        // Check if referral already exists
        Optional<Referral> existing = referralRepository.findByReferrerPhoneNumberAndReferredPhoneNumber(
            referrerPhoneNumber, 
            referredPhoneNumber
        );

        if (existing.isPresent()) {
            return existing.get();
        }

        // Create new referral record
        Referral referral = new Referral(referrerPhoneNumber, referredPhoneNumber, referrerCode);
        referral.setReferrerAccountId(referrer.getId());
        referral.setReferredAccountId(referredAccountId);
        referral.setStatus(Referral.ReferralStatus.PENDING);
        
        return referralRepository.save(referral);
    }

    /**
     * Process referral reward when referred user makes first purchase
     * Awards points to both referrer and referred user
     */
    @Transactional
    public Map<String, Object> processReferralReward(String referredPhoneNumber, Long paymentId) {
        Map<String, Object> result = new HashMap<>();

        // Find pending referrals for this user
        List<Referral> pendingReferrals = referralRepository.findByReferredPhoneNumber(referredPhoneNumber)
            .stream()
            .filter(r -> r.getStatus() == Referral.ReferralStatus.PENDING)
            .toList();

        if (pendingReferrals.isEmpty()) {
            result.put("success", false);
            result.put("message", "No pending referrals found");
            return result;
        }

        // Process first pending referral
        Referral referral = pendingReferrals.get(0);
        
        // Award points: Referrer gets 10 points, Referred gets 5 points
        int referrerPoints = 10;
        int referredPoints = 5;

        // Award points to referrer
        Optional<Customer> referrerCustomer = customerRepository.findByPhoneNumber(referral.getReferrerPhoneNumber());
        if (referrerCustomer.isPresent()) {
            Customer referrer = referrerCustomer.get();
            referrer.setLoyaltyPoints(referrer.getLoyaltyPoints() + referrerPoints);
            referrer.setTotalPointsEarned(referrer.getTotalPointsEarned() + referrerPoints);
            customerRepository.save(referrer);
        }

        // Award points to referred user
        Optional<Customer> referredCustomer = customerRepository.findByPhoneNumber(referredPhoneNumber);
        if (referredCustomer.isPresent()) {
            Customer referred = referredCustomer.get();
            referred.setLoyaltyPoints(referred.getLoyaltyPoints() + referredPoints);
            referred.setTotalPointsEarned(referred.getTotalPointsEarned() + referredPoints);
            customerRepository.save(referred);
        }

        // Update referral status
        referral.setStatus(Referral.ReferralStatus.ACTIVE);
        referral.setFirstPurchaseDate(LocalDateTime.now());
        referral.setReferrerRewardPoints(referrerPoints);
        referral.setReferredRewardPoints(referredPoints);
        referral.setRewardEligible(true);
        referralRepository.save(referral);

        result.put("success", true);
        result.put("referrerPoints", referrerPoints);
        result.put("referredPoints", referredPoints);
        result.put("message", "Referral rewards processed successfully");

        return result;
    }

    /**
     * Get referral statistics for a user
     */
    public Map<String, Object> getReferralStats(String phoneNumber) {
        Map<String, Object> stats = new HashMap<>();

        List<Referral> allReferrals = referralRepository.findByReferrerPhoneNumber(phoneNumber);
        long totalReferrals = allReferrals.size();
        long activeReferrals = referralRepository.countActiveReferralsByReferrer(phoneNumber);

        stats.put("totalReferrals", totalReferrals);
        stats.put("activeReferrals", activeReferrals);
        stats.put("pendingReferrals", totalReferrals - activeReferrals);
        stats.put("totalRewardPoints", allReferrals.stream()
            .mapToInt(r -> r.getReferrerRewardPoints() != null ? r.getReferrerRewardPoints() : 0)
            .sum());

        return stats;
    }
}

