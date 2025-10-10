package com.ggnetworks.repository;

import com.ggnetworks.entity.CustomerLoyalty;
import com.ggnetworks.entity.CustomerProfile;
import com.ggnetworks.entity.LoyaltyProgram;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerLoyaltyRepository extends JpaRepository<CustomerLoyalty, Long> {

    // Find by phone number
    Optional<CustomerLoyalty> findByPhoneNumberAndDeletedAtIsNull(String phoneNumber);

    // Find by customer profile
    List<CustomerLoyalty> findByCustomerProfileAndDeletedAtIsNull(CustomerProfile customerProfile);

    // Find by tier level
    List<CustomerLoyalty> findByTierLevelAndDeletedAtIsNull(CustomerLoyalty.TierLevel tierLevel);

    // Find by loyalty program
    List<CustomerLoyalty> findByLoyaltyProgramAndDeletedAtIsNull(LoyaltyProgram loyaltyProgram);

    // Find high-value customers
    List<CustomerLoyalty> findByLifetimeSpendGreaterThanEqualAndDeletedAtIsNull(BigDecimal threshold);

    // Find VIP customers (top 5%)
    @Query("SELECT cl FROM CustomerLoyalty cl WHERE cl.deletedAt IS NULL ORDER BY cl.lifetimeSpend DESC")
    Page<CustomerLoyalty> findTopVipCustomers(Pageable pageable);

    // Find at-risk customers
    @Query("SELECT cl FROM CustomerLoyalty cl WHERE cl.retentionScore < :threshold AND cl.deletedAt IS NULL")
    List<CustomerLoyalty> findByRetentionScoreLessThan(@Param("threshold") BigDecimal threshold);

    // Find top engaged customers
    @Query("SELECT cl FROM CustomerLoyalty cl WHERE cl.deletedAt IS NULL ORDER BY cl.engagementScore DESC")
    List<CustomerLoyalty> findTopByEngagementScoreOrderByEngagementScoreDesc(int limit);

    // Count methods
    long countByDeletedAtIsNull();
    long countByTierLevelAndDeletedAtIsNull(CustomerLoyalty.TierLevel tierLevel);
    long countByIsHighValueCustomerTrueAndDeletedAtIsNull();
    long countByIsVipCustomerTrueAndDeletedAtIsNull();
    long countByIsPlatinumMemberTrueAndDeletedAtIsNull();

    // Sum methods
    @Query("SELECT SUM(cl.totalPointsEarned) FROM CustomerLoyalty cl WHERE cl.deletedAt IS NULL")
    Long sumTotalPointsEarned();

    @Query("SELECT AVG(cl.lifetimeSpend) FROM CustomerLoyalty cl WHERE cl.deletedAt IS NULL")
    BigDecimal averageLifetimeSpend();
} 