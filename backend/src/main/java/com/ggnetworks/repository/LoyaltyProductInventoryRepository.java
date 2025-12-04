package com.ggnetworks.repository;

import com.ggnetworks.entity.LoyaltyProductInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoyaltyProductInventoryRepository extends JpaRepository<LoyaltyProductInventory, Long> {

    List<LoyaltyProductInventory> findByRewardId(String rewardId);

    Optional<LoyaltyProductInventory> findByInventoryId(String inventoryId);

    Optional<LoyaltyProductInventory> findByRewardIdAndLocationCode(String rewardId, String locationCode);

    @Query("""
            SELECT inv FROM LoyaltyProductInventory inv
            WHERE inv.stockAvailable <= inv.thresholdAlert
            """)
    List<LoyaltyProductInventory> findLowStockItems();
}

