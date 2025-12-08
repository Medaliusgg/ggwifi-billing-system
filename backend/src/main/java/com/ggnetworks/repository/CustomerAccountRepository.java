package com.ggnetworks.repository;

import com.ggnetworks.entity.CustomerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface CustomerAccountRepository extends JpaRepository<CustomerAccount, Long> {
    
    Optional<CustomerAccount> findByPhoneNumber(String phoneNumber);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    @Query("SELECT ca FROM CustomerAccount ca WHERE ca.phoneNumber = :phoneNumber AND ca.status = 'ACTIVE'")
    Optional<CustomerAccount> findActiveByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT COUNT(ca) FROM CustomerAccount ca WHERE ca.createdAt >= :startDate")
    Long countByCreatedAtAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(ca) FROM CustomerAccount ca WHERE ca.lastLoginAt >= :startDate")
    Long countActiveUsersSince(@Param("startDate") LocalDateTime startDate);
    
    Optional<CustomerAccount> findByReferralCode(String referralCode);
}



