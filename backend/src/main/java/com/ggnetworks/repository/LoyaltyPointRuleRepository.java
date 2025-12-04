package com.ggnetworks.repository;

import com.ggnetworks.entity.InternetPackage;
import com.ggnetworks.entity.LoyaltyPointRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoyaltyPointRuleRepository extends JpaRepository<LoyaltyPointRule, Long> {

    List<LoyaltyPointRule> findByIsActiveTrueOrderByMinDurationDaysAsc();

    List<LoyaltyPointRule> findByPackageTypeAndIsActiveTrueOrderByMinDurationDaysAsc(InternetPackage.PackageType packageType);

    @Query("""
            SELECT r FROM LoyaltyPointRule r
            WHERE r.isActive = true
            AND (r.minDurationDays IS NULL OR r.minDurationDays <= :duration)
            AND (r.maxDurationDays IS NULL OR r.maxDurationDays >= :duration)
            AND r.packageType = :packageType
            ORDER BY r.minDurationDays ASC
            """)
    List<LoyaltyPointRule> findMatchingRules(InternetPackage.PackageType packageType, Integer duration);

    boolean existsByRuleId(String ruleId);

    LoyaltyPointRule findByRuleId(String ruleId);
}

