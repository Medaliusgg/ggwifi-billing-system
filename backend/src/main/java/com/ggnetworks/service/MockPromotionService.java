package com.ggnetworks.service;

import com.ggnetworks.entity.Promotion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Mock Promotion Service for when backend is disabled
 * Provides sample campaign data for customer portal
 */
@Slf4j
@Service
public class MockPromotionService extends PromotionService {

    public MockPromotionService() {
        super(null);
    }

    @Override
    public List<Promotion> getActivePromotions() {
        log.info("Mock: Fetching active promotions");
        return generateMockPromotions();
    }

    @Override
    public Promotion getPromotionById(Long id) {
        log.info("Mock: Fetching promotion by ID: {}", id);
        return generateMockPromotions().stream()
                .filter(promotion -> promotion.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    // ==================== MOCK DATA GENERATION ====================

    private List<Promotion> generateMockPromotions() {
        List<Promotion> promotions = new ArrayList<>();
        
        // Promotion 1: Student Discount
        Promotion studentDiscount = new Promotion();
        studentDiscount.setId(1L);
        studentDiscount.setTitle("Student Discount Campaign");
        studentDiscount.setDescription("Special discount for students on all packages");
        studentDiscount.setStartDate(LocalDateTime.now().minusDays(30));
        studentDiscount.setEndDate(LocalDateTime.now().plusDays(60));
        studentDiscount.setIsActive(true);
        studentDiscount.setTargetAudience(Promotion.TargetAudience.ALL);
        promotions.add(studentDiscount);

        // Promotion 2: New User Welcome
        Promotion newUserWelcome = new Promotion();
        newUserWelcome.setId(2L);
        newUserWelcome.setTitle("New User Welcome Offer");
        newUserWelcome.setDescription("Welcome offer for new customers");
        newUserWelcome.setStartDate(LocalDateTime.now().minusDays(15));
        newUserWelcome.setEndDate(LocalDateTime.now().plusDays(45));
        newUserWelcome.setIsActive(true);
        newUserWelcome.setTargetAudience(Promotion.TargetAudience.ALL);
        promotions.add(newUserWelcome);

        // Promotion 3: Weekend Special
        Promotion weekendSpecial = new Promotion();
        weekendSpecial.setId(3L);
        weekendSpecial.setTitle("Weekend Special");
        weekendSpecial.setDescription("Special weekend rates for all packages");
        weekendSpecial.setStartDate(LocalDateTime.now().minusDays(7));
        weekendSpecial.setEndDate(LocalDateTime.now().plusDays(30));
        weekendSpecial.setIsActive(true);
        weekendSpecial.setTargetAudience(Promotion.TargetAudience.ALL);
        promotions.add(weekendSpecial);

        // Promotion 4: Loyalty Reward
        Promotion loyaltyReward = new Promotion();
        loyaltyReward.setId(4L);
        loyaltyReward.setTitle("Loyalty Reward Program");
        loyaltyReward.setDescription("Rewards for loyal customers");
        loyaltyReward.setStartDate(LocalDateTime.now().minusDays(60));
        loyaltyReward.setEndDate(LocalDateTime.now().plusDays(90));
        loyaltyReward.setIsActive(true);
        loyaltyReward.setTargetAudience(Promotion.TargetAudience.ALL);
        promotions.add(loyaltyReward);

        // Promotion 5: Business Package
        Promotion businessPackage = new Promotion();
        businessPackage.setId(5L);
        businessPackage.setTitle("Business Package Promotion");
        businessPackage.setDescription("Special rates for business customers");
        businessPackage.setStartDate(LocalDateTime.now().minusDays(45));
        businessPackage.setEndDate(LocalDateTime.now().plusDays(75));
        businessPackage.setIsActive(true);
        businessPackage.setTargetAudience(Promotion.TargetAudience.ALL);
        promotions.add(businessPackage);

        return promotions;
    }
} 