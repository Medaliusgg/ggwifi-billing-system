package com.ggnetworks.repository;

import com.ggnetworks.entity.SmsCampaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SmsCampaignRepository extends JpaRepository<SmsCampaign, Long> {

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.status = :status AND sc.deletedAt IS NULL")
    List<SmsCampaign> findByStatus(@Param("status") SmsCampaign.CampaignStatus status);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.type = :type AND sc.deletedAt IS NULL")
    List<SmsCampaign> findByType(@Param("type") SmsCampaign.CampaignType type);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.targetAudience = :targetAudience AND sc.deletedAt IS NULL")
    List<SmsCampaign> findByTargetAudience(@Param("targetAudience") SmsCampaign.TargetAudience targetAudience);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.status = :status AND sc.type = :type AND sc.deletedAt IS NULL")
    List<SmsCampaign> findByStatusAndType(@Param("status") SmsCampaign.CampaignStatus status, 
                                        @Param("type") SmsCampaign.CampaignType type);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.scheduledAt >= :startDate AND sc.deletedAt IS NULL")
    List<SmsCampaign> findByScheduledAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.scheduledAt BETWEEN :startDate AND :endDate AND sc.deletedAt IS NULL")
    List<SmsCampaign> findByScheduledAtBetween(@Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.sentAt >= :startDate AND sc.deletedAt IS NULL")
    List<SmsCampaign> findBySentAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.isUrgent = true AND sc.deletedAt IS NULL")
    List<SmsCampaign> findUrgentCampaigns();

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.status = 'SCHEDULED' AND sc.scheduledAt <= :now AND sc.deletedAt IS NULL")
    List<SmsCampaign> findReadyToSendCampaigns(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(sc) FROM SmsCampaign sc WHERE sc.status = :status AND sc.deletedAt IS NULL")
    long countByStatus(@Param("status") SmsCampaign.CampaignStatus status);

    @Query("SELECT COUNT(sc) FROM SmsCampaign sc WHERE sc.type = :type AND sc.deletedAt IS NULL")
    long countByType(@Param("type") SmsCampaign.CampaignType type);

    @Query("SELECT COUNT(sc) FROM SmsCampaign sc WHERE sc.targetAudience = :targetAudience AND sc.deletedAt IS NULL")
    long countByTargetAudience(@Param("targetAudience") SmsCampaign.TargetAudience targetAudience);

    @Query("SELECT COUNT(sc) FROM SmsCampaign sc WHERE sc.status = 'COMPLETED' AND sc.deletedAt IS NULL")
    long countCompletedCampaigns();

    @Query("SELECT COUNT(sc) FROM SmsCampaign sc WHERE sc.status = 'FAILED' AND sc.deletedAt IS NULL")
    long countFailedCampaigns();

    @Query("SELECT SUM(sc.totalCost) FROM SmsCampaign sc WHERE sc.status = 'COMPLETED' AND sc.deletedAt IS NULL")
    Double sumTotalCost();

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.deletedAt IS NULL")
    Page<SmsCampaign> findAllActive(Pageable pageable);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.name LIKE %:name% AND sc.deletedAt IS NULL")
    Page<SmsCampaign> findByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.messageContent LIKE %:content% AND sc.deletedAt IS NULL")
    Page<SmsCampaign> findByMessageContentContaining(@Param("content") String content, Pageable pageable);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.senderId = :senderId AND sc.deletedAt IS NULL")
    List<SmsCampaign> findBySenderId(@Param("senderId") String senderId);

    @Query("SELECT sc FROM SmsCampaign sc WHERE sc.templateId = :templateId AND sc.deletedAt IS NULL")
    List<SmsCampaign> findByTemplateId(@Param("templateId") String templateId);
} 