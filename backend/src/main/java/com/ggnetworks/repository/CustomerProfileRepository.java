package com.ggnetworks.repository;

import com.ggnetworks.entity.CustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {

    // Find by phone number
    Optional<CustomerProfile> findByPhoneNumberAndDeletedAtIsNull(String phoneNumber);
    
    // Find by customer type
    List<CustomerProfile> findByCustomerTypeAndDeletedAtIsNull(CustomerProfile.CustomerType customerType);
    
    // Find by customer type with pagination
    Page<CustomerProfile> findByCustomerTypeAndDeletedAtIsNull(CustomerProfile.CustomerType customerType, Pageable pageable);
    
    // Find by status
    List<CustomerProfile> findByStatusAndDeletedAtIsNull(CustomerProfile.CustomerStatus status);
    
    // Find by loyalty tier
    List<CustomerProfile> findByLoyaltyTierAndDeletedAtIsNull(CustomerProfile.LoyaltyTier loyaltyTier);
    
    // Find by registration date range
    List<CustomerProfile> findByRegistrationDateBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by last activity date
    List<CustomerProfile> findByLastActivityDateBeforeAndDeletedAtIsNull(LocalDateTime date);
    
    // Find active customers
    List<CustomerProfile> findByStatusAndLastActivityDateAfterAndDeletedAtIsNull(
            CustomerProfile.CustomerStatus status, LocalDateTime date);
    
    // Find by marketing consent
    List<CustomerProfile> findByMarketingConsentTrueAndDeletedAtIsNull();
    
    // Find by SMS consent
    List<CustomerProfile> findBySmsConsentTrueAndDeletedAtIsNull();
    
    // Find by email consent
    List<CustomerProfile> findByEmailConsentTrueAndDeletedAtIsNull();
    
    // Find by referral code
    Optional<CustomerProfile> findByReferralCodeAndDeletedAtIsNull(String referralCode);
    
    // Find by referred by
    List<CustomerProfile> findByReferredByAndDeletedAtIsNull(String referredBy);
    
    // Find high-value customers
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.totalSpent >= :threshold AND cp.deletedAt IS NULL")
    List<CustomerProfile> findHighValueCustomers(@Param("threshold") Double threshold);
    
    // Find VIP customers (top 5% by spending)
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.deletedAt IS NULL ORDER BY cp.totalSpent DESC")
    Page<CustomerProfile> findVipCustomers(Pageable pageable);
    
    // Find customers by loyalty tier with pagination
    Page<CustomerProfile> findByLoyaltyTierAndDeletedAtIsNull(CustomerProfile.LoyaltyTier loyaltyTier, Pageable pageable);
    
    // Find customers by type and status
    List<CustomerProfile> findByCustomerTypeAndStatusAndDeletedAtIsNull(
            CustomerProfile.CustomerType customerType, CustomerProfile.CustomerStatus status);
    
    // Find customers by type and loyalty tier
    List<CustomerProfile> findByCustomerTypeAndLoyaltyTierAndDeletedAtIsNull(
            CustomerProfile.CustomerType customerType, CustomerProfile.LoyaltyTier loyaltyTier);
    
    // Count by customer type
    long countByCustomerTypeAndDeletedAtIsNull(CustomerProfile.CustomerType customerType);
    
    // Count by status
    long countByStatusAndDeletedAtIsNull(CustomerProfile.CustomerStatus status);
    
    // Count by loyalty tier
    long countByLoyaltyTierAndDeletedAtIsNull(CustomerProfile.LoyaltyTier loyaltyTier);
    
    // Count customers with marketing consent
    long countByMarketingConsentTrueAndDeletedAtIsNull();
    
    // Count customers with SMS consent
    long countBySmsConsentTrueAndDeletedAtIsNull();
    
    // Count customers with email consent
    long countByEmailConsentTrueAndDeletedAtIsNull();
    
    // Find customers by phone number pattern
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.phoneNumber LIKE %:pattern% AND cp.deletedAt IS NULL")
    List<CustomerProfile> findByPhoneNumberPattern(@Param("pattern") String pattern);
    
    // Find customers by name pattern
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.fullName LIKE %:pattern% AND cp.deletedAt IS NULL")
    List<CustomerProfile> findByFullNamePattern(@Param("pattern") String pattern);
    
    // Find customers by email pattern
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.email LIKE %:pattern% AND cp.deletedAt IS NULL")
    List<CustomerProfile> findByEmailPattern(@Param("pattern") String pattern);
    
    // Find customers registered in date range
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.registrationDate BETWEEN :startDate AND :endDate AND cp.deletedAt IS NULL")
    List<CustomerProfile> findByRegistrationDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find customers active in date range
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.lastActivityDate BETWEEN :startDate AND :endDate AND cp.deletedAt IS NULL")
    List<CustomerProfile> findByActivityDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find inactive customers
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.lastActivityDate < :date AND cp.deletedAt IS NULL")
    List<CustomerProfile> findInactiveCustomers(@Param("date") LocalDateTime date);
    
    // Find customers with high spending
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.totalSpent >= :minSpend AND cp.deletedAt IS NULL ORDER BY cp.totalSpent DESC")
    List<CustomerProfile> findCustomersByMinSpending(@Param("minSpend") Double minSpend);
    
    // Find customers with high session count
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.totalSessions >= :minSessions AND cp.deletedAt IS NULL ORDER BY cp.totalSessions DESC")
    List<CustomerProfile> findCustomersByMinSessions(@Param("minSessions") Long minSessions);
    
    // Find customers with high data usage
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.totalDataUsageMb >= :minDataUsage AND cp.deletedAt IS NULL ORDER BY cp.totalDataUsageMb DESC")
    List<CustomerProfile> findCustomersByMinDataUsage(@Param("minDataUsage") Long minDataUsage);
    
    // Get customer statistics
    @Query("SELECT COUNT(cp) as totalCustomers, " +
           "COUNT(CASE WHEN cp.totalSpent >= 100000 THEN 1 END) as highValueCustomers, " +
           "COUNT(CASE WHEN cp.totalSpent >= 500000 THEN 1 END) as vipCustomers, " +
           "COUNT(CASE WHEN cp.totalSpent >= 1000000 THEN 1 END) as platinumCustomers, " +
           "AVG(cp.totalSpent) as avgLifetimeSpend, " +
           "SUM(cp.totalSpent) as totalLifetimeSpend " +
           "FROM CustomerProfile cp WHERE cp.deletedAt IS NULL")
    Object[] getCustomerStatistics();
} 