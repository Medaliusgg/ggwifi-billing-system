package com.ggnetworks.repository;

import com.ggnetworks.entity.ContactInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContactInteractionRepository extends JpaRepository<ContactInteraction, Long> {
    
    List<ContactInteraction> findByContactId(Long contactId);
    
    List<ContactInteraction> findByInteractionType(String interactionType);
    
    List<ContactInteraction> findByVoucherCode(String voucherCode);
    
    List<ContactInteraction> findByLocation(String location);
    
    List<ContactInteraction> findByPaymentStatus(String paymentStatus);
    
    List<ContactInteraction> findByOrderId(String orderId);
    
    List<ContactInteraction> findByTransactionId(String transactionId);
    
    List<ContactInteraction> findByPackageId(String packageId);
    
    List<ContactInteraction> findByIsSuccessful(Boolean isSuccessful);
    
    List<ContactInteraction> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<ContactInteraction> findBySystemGenerated(Boolean systemGenerated);
    
    List<ContactInteraction> findByRouterId(String routerId);
    
    List<ContactInteraction> findByDeviceMac(String deviceMac);
    
    List<ContactInteraction> findByDeviceIp(String deviceIp);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.contact.phoneNumber = :phoneNumber")
    List<ContactInteraction> findByContactPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.contact.phoneNumber = :phoneNumber AND ci.interactionType = :interactionType")
    List<ContactInteraction> findByContactPhoneNumberAndInteractionType(@Param("phoneNumber") String phoneNumber, @Param("interactionType") String interactionType);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.voucherCode = :voucherCode AND ci.interactionType = :interactionType")
    List<ContactInteraction> findByVoucherCodeAndInteractionType(@Param("voucherCode") String voucherCode, @Param("interactionType") String interactionType);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.location = :location AND ci.interactionType = :interactionType")
    List<ContactInteraction> findByLocationAndInteractionType(@Param("location") String location, @Param("interactionType") String interactionType);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.createdAt >= :date AND ci.interactionType = :interactionType")
    List<ContactInteraction> findByCreatedAtAfterAndInteractionType(@Param("date") LocalDateTime date, @Param("interactionType") String interactionType);
    
    @Query("SELECT COUNT(ci) FROM ContactInteraction ci WHERE ci.interactionType = :interactionType")
    Long countByInteractionType(@Param("interactionType") String interactionType);
    
    @Query("SELECT COUNT(ci) FROM ContactInteraction ci WHERE ci.location = :location")
    Long countByLocation(@Param("location") String location);
    
    @Query("SELECT COUNT(ci) FROM ContactInteraction ci WHERE ci.createdAt >= :date")
    Long countByCreatedAtAfter(@Param("date") LocalDateTime date);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.isSuccessful = true ORDER BY ci.createdAt DESC")
    List<ContactInteraction> findRecentSuccessfulInteractions();
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.isSuccessful = false ORDER BY ci.createdAt DESC")
    List<ContactInteraction> findRecentFailedInteractions();
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.sessionStart IS NOT NULL AND ci.sessionEnd IS NULL")
    List<ContactInteraction> findActiveSessions();
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.sessionStart BETWEEN :startDate AND :endDate")
    List<ContactInteraction> findSessionsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.dataUsedMb > :dataLimit")
    List<ContactInteraction> findHighDataUsage(@Param("dataLimit") Long dataLimit);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.durationMinutes > :durationLimit")
    List<ContactInteraction> findLongSessions(@Param("durationLimit") Integer durationLimit);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.contact.id = :contactId ORDER BY ci.createdAt DESC")
    List<ContactInteraction> findRecentInteractionsByContact(@Param("contactId") Long contactId);
    
    @Query("SELECT ci FROM ContactInteraction ci WHERE ci.voucherCode = :voucherCode ORDER BY ci.createdAt DESC")
    List<ContactInteraction> findInteractionsByVoucher(@Param("voucherCode") String voucherCode);
}

