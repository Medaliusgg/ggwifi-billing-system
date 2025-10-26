package com.ggnetworks.repository;

import com.ggnetworks.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    Optional<Contact> findByPhoneNumber(String phoneNumber);
    
    List<Contact> findByLocation(String location);
    
    List<Contact> findByStatus(String status);
    
    List<Contact> findBySource(String source);
    
    List<Contact> findByCustomerType(String customerType);
    
    List<Contact> findByIsMarketingConsent(Boolean isMarketingConsent);
    
    List<Contact> findByIsSmsConsent(Boolean isSmsConsent);
    
    List<Contact> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Contact> findByLastInteractionBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Contact> findByLastPurchaseDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Contact> findByTotalSpentGreaterThan(Double amount);
    
    List<Contact> findByTotalPurchasesGreaterThan(Integer count);
    
    List<Contact> findByPreferredLocation(String preferredLocation);
    
    List<Contact> findByReferralCode(String referralCode);
    
    List<Contact> findByReferredBy(String referredBy);
    
    List<Contact> findByIsVerified(Boolean isVerified);
    
    @Query("SELECT c FROM Contact c WHERE c.phoneNumber LIKE %:phoneNumber%")
    List<Contact> findByPhoneNumberContaining(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT c FROM Contact c WHERE c.name LIKE %:name%")
    List<Contact> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT c FROM Contact c WHERE c.email LIKE %:email%")
    List<Contact> findByEmailContaining(@Param("email") String email);
    
    @Query("SELECT c FROM Contact c WHERE c.tags LIKE %:tag%")
    List<Contact> findByTagsContaining(@Param("tag") String tag);
    
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.status = :status")
    Long countByStatus(@Param("status") String status);
    
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.source = :source")
    Long countBySource(@Param("source") String source);
    
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.createdAt >= :date")
    Long countByCreatedAtAfter(@Param("date") LocalDateTime date);
    
    @Query("SELECT c FROM Contact c ORDER BY c.totalSpent DESC")
    List<Contact> findTopSpenders();
    
    @Query("SELECT c FROM Contact c ORDER BY c.totalPurchases DESC")
    List<Contact> findTopCustomers();
    
    @Query("SELECT c FROM Contact c WHERE c.lastInteraction < :date")
    List<Contact> findInactiveContacts(@Param("date") LocalDateTime date);
    
    @Query("SELECT c FROM Contact c WHERE c.isMarketingConsent = true AND c.status = 'ACTIVE'")
    List<Contact> findMarketingConsentContacts();
    
    @Query("SELECT c FROM Contact c WHERE c.isSmsConsent = true AND c.status = 'ACTIVE'")
    List<Contact> findSmsConsentContacts();
}

