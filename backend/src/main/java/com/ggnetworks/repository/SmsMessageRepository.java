package com.ggnetworks.repository;

import com.ggnetworks.entity.SmsMessage;
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
public interface SmsMessageRepository extends JpaRepository<SmsMessage, Long> {

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.phoneNumber = :phoneNumber AND sm.deletedAt IS NULL")
    List<SmsMessage> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.status = :status AND sm.deletedAt IS NULL")
    List<SmsMessage> findByStatus(@Param("status") SmsMessage.MessageStatus status);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.type = :type AND sm.deletedAt IS NULL")
    List<SmsMessage> findByType(@Param("type") SmsMessage.MessageType type);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.user.id = :userId AND sm.deletedAt IS NULL")
    List<SmsMessage> findByUserId(@Param("userId") Long userId);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.campaign.id = :campaignId AND sm.deletedAt IS NULL")
    List<SmsMessage> findByCampaignId(@Param("campaignId") Long campaignId);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.status = :status AND sm.type = :type AND sm.deletedAt IS NULL")
    List<SmsMessage> findByStatusAndType(@Param("status") SmsMessage.MessageStatus status, 
                                       @Param("type") SmsMessage.MessageType type);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.scheduledAt >= :startDate AND sm.deletedAt IS NULL")
    List<SmsMessage> findByScheduledAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.sentAt >= :startDate AND sm.deletedAt IS NULL")
    List<SmsMessage> findBySentAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.deliveredAt >= :startDate AND sm.deletedAt IS NULL")
    List<SmsMessage> findByDeliveredAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.isUrgent = true AND sm.deletedAt IS NULL")
    List<SmsMessage> findUrgentMessages();

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.status = 'PENDING' AND sm.scheduledAt <= :now AND sm.deletedAt IS NULL")
    List<SmsMessage> findReadyToSendMessages(@Param("now") LocalDateTime now);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.status = 'FAILED' AND sm.retryCount < 3 AND sm.deletedAt IS NULL")
    List<SmsMessage> findFailedMessagesForRetry();

    @Query("SELECT COUNT(sm) FROM SmsMessage sm WHERE sm.status = :status AND sm.deletedAt IS NULL")
    long countByStatus(@Param("status") SmsMessage.MessageStatus status);

    @Query("SELECT COUNT(sm) FROM SmsMessage sm WHERE sm.type = :type AND sm.deletedAt IS NULL")
    long countByType(@Param("type") SmsMessage.MessageType type);

    @Query("SELECT COUNT(sm) FROM SmsMessage sm WHERE sm.campaign.id = :campaignId AND sm.deletedAt IS NULL")
    long countByCampaignId(@Param("campaignId") Long campaignId);

    @Query("SELECT COUNT(sm) FROM SmsMessage sm WHERE sm.status = 'DELIVERED' AND sm.deletedAt IS NULL")
    long countDeliveredMessages();

    @Query("SELECT COUNT(sm) FROM SmsMessage sm WHERE sm.status = 'FAILED' AND sm.deletedAt IS NULL")
    long countFailedMessages();

    @Query("SELECT SUM(sm.cost) FROM SmsMessage sm WHERE sm.status = 'DELIVERED' AND sm.deletedAt IS NULL")
    Double sumTotalCost();

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.deletedAt IS NULL")
    Page<SmsMessage> findAllActive(Pageable pageable);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.phoneNumber LIKE %:phoneNumber% AND sm.deletedAt IS NULL")
    Page<SmsMessage> findByPhoneNumberContaining(@Param("phoneNumber") String phoneNumber, Pageable pageable);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.messageContent LIKE %:content% AND sm.deletedAt IS NULL")
    Page<SmsMessage> findByMessageContentContaining(@Param("content") String content, Pageable pageable);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.senderId = :senderId AND sm.deletedAt IS NULL")
    List<SmsMessage> findBySenderId(@Param("senderId") String senderId);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.templateId = :templateId AND sm.deletedAt IS NULL")
    List<SmsMessage> findByTemplateId(@Param("templateId") String templateId);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.user.phoneNumber = :phoneNumber AND sm.deletedAt IS NULL")
    List<SmsMessage> findByUserPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT sm FROM SmsMessage sm WHERE sm.messageId = :messageId AND sm.deletedAt IS NULL")
    Optional<SmsMessage> findByMessageId(@Param("messageId") String messageId);
} 