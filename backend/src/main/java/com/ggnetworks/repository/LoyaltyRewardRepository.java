package com.ggnetworks.repository;

import com.ggnetworks.entity.LoyaltyReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoyaltyRewardRepository extends JpaRepository<LoyaltyReward, Long> {
    
    Optional<LoyaltyReward> findByRewardId(String rewardId);
    
    List<LoyaltyReward> findByIsActive(Boolean isActive);
    
    List<LoyaltyReward> findByRewardTier(LoyaltyReward.RewardTier rewardTier);
    
    @Query("SELECT r FROM LoyaltyReward r WHERE r.isActive = true AND " +
           "(r.validFrom IS NULL OR r.validFrom <= :now) AND " +
           "(r.validUntil IS NULL OR r.validUntil >= :now) AND " +
           "r.inventoryCount > 0")
    List<LoyaltyReward> findAvailableRewards(@Param("now") LocalDateTime now);
    
    @Query("SELECT r FROM LoyaltyReward r WHERE r.pointsRequired <= :points AND r.isActive = true")
    List<LoyaltyReward> findAffordableRewards(@Param("points") Integer points);
}





