package com.ggnetworks.repository;

import com.ggnetworks.entity.LoyaltyRedemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoyaltyRedemptionRepository extends JpaRepository<LoyaltyRedemption, Long> {
    
    Optional<LoyaltyRedemption> findByRedemptionId(String redemptionId);
    
    List<LoyaltyRedemption> findByCustomerId(Long customerId);
    
    List<LoyaltyRedemption> findByPhoneNumber(String phoneNumber);
    
    List<LoyaltyRedemption> findByStatus(LoyaltyRedemption.RedemptionStatus status);
    
    List<LoyaltyRedemption> findByRewardId(String rewardId);

    long countByCustomerIdAndRewardId(Long customerId, String rewardId);
    
    @Query("SELECT lr FROM LoyaltyRedemption lr WHERE lr.status = 'PENDING' OR lr.status = 'APPROVED' ORDER BY lr.requestedAt ASC")
    List<LoyaltyRedemption> findPendingRedemptions();
    
    @Query("SELECT lr FROM LoyaltyRedemption lr WHERE lr.technicianAssigned = :technician AND lr.status != 'DELIVERED'")
    List<LoyaltyRedemption> findByTechnicianAssigned(@Param("technician") String technician);
}





