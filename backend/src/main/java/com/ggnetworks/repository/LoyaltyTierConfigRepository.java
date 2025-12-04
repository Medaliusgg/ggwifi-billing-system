package com.ggnetworks.repository;

import com.ggnetworks.entity.LoyaltyTierConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoyaltyTierConfigRepository extends JpaRepository<LoyaltyTierConfig, Long> {

    Optional<LoyaltyTierConfig> findByTierKey(String tierKey);

    @Query("""
            SELECT t FROM LoyaltyTierConfig t
            WHERE t.minPoints <= :points
            AND (t.maxPoints IS NULL OR t.maxPoints >= :points)
            ORDER BY t.minPoints DESC
            """)
    List<LoyaltyTierConfig> findTierForPoints(Integer points);

    List<LoyaltyTierConfig> findAllByOrderByMinPointsAsc();
}

