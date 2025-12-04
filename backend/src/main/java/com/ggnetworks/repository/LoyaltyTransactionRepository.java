package com.ggnetworks.repository;

import com.ggnetworks.entity.LoyaltyTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, Long> {
    
    Optional<LoyaltyTransaction> findByTransactionId(String transactionId);
    
    List<LoyaltyTransaction> findByCustomerId(Long customerId);
    
    List<LoyaltyTransaction> findByPhoneNumber(String phoneNumber);
    
    List<LoyaltyTransaction> findByTransactionType(LoyaltyTransaction.TransactionType transactionType);
    
    @Query("SELECT lt FROM LoyaltyTransaction lt WHERE lt.customerId = :customerId OR lt.phoneNumber = :phoneNumber ORDER BY lt.createdAt DESC")
    List<LoyaltyTransaction> findByCustomerIdOrPhoneNumber(@Param("customerId") Long customerId, @Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT SUM(lt.points) FROM LoyaltyTransaction lt WHERE lt.phoneNumber = :phoneNumber AND lt.transactionType = 'EARNED' AND lt.isExpired = false")
    Integer sumEarnedPointsByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT SUM(lt.points) FROM LoyaltyTransaction lt WHERE lt.phoneNumber = :phoneNumber AND lt.transactionType = 'REDEEMED'")
    Integer sumRedeemedPointsByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT lt FROM LoyaltyTransaction lt WHERE lt.expiresAt <= :now AND lt.isExpired = false AND lt.transactionType = 'EARNED'")
    List<LoyaltyTransaction> findExpiredPoints(@Param("now") LocalDateTime now);
    
    @Query("SELECT lt FROM LoyaltyTransaction lt WHERE lt.phoneNumber = :phoneNumber AND lt.isExpired = false ORDER BY lt.expiresAt ASC")
    List<LoyaltyTransaction> findActivePointsByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}





