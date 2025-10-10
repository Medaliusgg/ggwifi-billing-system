package com.ggnetworks.repository;

import com.ggnetworks.entity.CustomerProfile;
import com.ggnetworks.entity.MarketingCommunication;
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
public interface MarketingCommunicationRepository extends JpaRepository<MarketingCommunication, Long> {

    // Find by customer profile
    List<MarketingCommunication> findByCustomerProfileAndDeletedAtIsNull(CustomerProfile customerProfile);
    
    // Find by phone number
    List<MarketingCommunication> findByPhoneNumberAndDeletedAtIsNull(String phoneNumber);
    
    // Find by communication type
    List<MarketingCommunication> findByCommunicationTypeAndDeletedAtIsNull(MarketingCommunication.CommunicationType communicationType);
    
    // Find by channel
    List<MarketingCommunication> findByChannelAndDeletedAtIsNull(MarketingCommunication.Channel channel);
    
    // Find by status
    List<MarketingCommunication> findByStatusAndDeletedAtIsNull(MarketingCommunication.CommunicationStatus status);
    
    // Find by customer type
    List<MarketingCommunication> findByCustomerTypeAndDeletedAtIsNull(CustomerProfile.CustomerType customerType);
    
    // Find by scheduled date range
    List<MarketingCommunication> findByScheduledAtBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by sent date range
    List<MarketingCommunication> findBySentAtBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by campaign ID
    List<MarketingCommunication> findByCampaignIdAndDeletedAtIsNull(String campaignId);
    
    // Find by template ID
    List<MarketingCommunication> findByTemplateIdAndDeletedAtIsNull(String templateId);
    
    // Find by subject pattern
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.subject LIKE %:pattern% AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findBySubjectPattern(@Param("pattern") String pattern);
    
    // Find by message content pattern
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.messageContent LIKE %:pattern% AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByMessageContentPattern(@Param("pattern") String pattern);
    
    // Find communications by customer profile with pagination
    Page<MarketingCommunication> findByCustomerProfileAndDeletedAtIsNull(CustomerProfile customerProfile, Pageable pageable);
    
    // Find communications by status with pagination
    Page<MarketingCommunication> findByStatusAndDeletedAtIsNull(MarketingCommunication.CommunicationStatus status, Pageable pageable);
    
    // Find communications by communication type with pagination
    Page<MarketingCommunication> findByCommunicationTypeAndDeletedAtIsNull(MarketingCommunication.CommunicationType communicationType, Pageable pageable);
    
    // Find communications by channel with pagination
    Page<MarketingCommunication> findByChannelAndDeletedAtIsNull(MarketingCommunication.Channel channel, Pageable pageable);
    
    // Count by communication type
    long countByCommunicationTypeAndDeletedAtIsNull(MarketingCommunication.CommunicationType communicationType);
    
    // Count by channel
    long countByChannelAndDeletedAtIsNull(MarketingCommunication.Channel channel);
    
    // Count by status
    long countByStatusAndDeletedAtIsNull(MarketingCommunication.CommunicationStatus status);
    
    // Count by customer type
    long countByCustomerTypeAndDeletedAtIsNull(CustomerProfile.CustomerType customerType);
    
    // Count by campaign ID
    long countByCampaignIdAndDeletedAtIsNull(String campaignId);
    
    // Count by customer profile
    long countByCustomerProfileAndDeletedAtIsNull(CustomerProfile customerProfile);
    
    // Count by phone number
    long countByPhoneNumberAndDeletedAtIsNull(String phoneNumber);
    
    // Find communications by customer profile and status
    List<MarketingCommunication> findByCustomerProfileAndStatusAndDeletedAtIsNull(
            CustomerProfile customerProfile, MarketingCommunication.CommunicationStatus status);
    
    // Find communications by customer profile and communication type
    List<MarketingCommunication> findByCustomerProfileAndCommunicationTypeAndDeletedAtIsNull(
            CustomerProfile customerProfile, MarketingCommunication.CommunicationType communicationType);
    
    // Find communications by customer profile and channel
    List<MarketingCommunication> findByCustomerProfileAndChannelAndDeletedAtIsNull(
            CustomerProfile customerProfile, MarketingCommunication.Channel channel);
    
    // Find communications by phone number and status
    List<MarketingCommunication> findByPhoneNumberAndStatusAndDeletedAtIsNull(
            String phoneNumber, MarketingCommunication.CommunicationStatus status);
    
    // Find communications by phone number and communication type
    List<MarketingCommunication> findByPhoneNumberAndCommunicationTypeAndDeletedAtIsNull(
            String phoneNumber, MarketingCommunication.CommunicationType communicationType);
    
    // Find communications by phone number and channel
    List<MarketingCommunication> findByPhoneNumberAndChannelAndDeletedAtIsNull(
            String phoneNumber, MarketingCommunication.Channel channel);
    
    // Find communications by customer type and status
    List<MarketingCommunication> findByCustomerTypeAndStatusAndDeletedAtIsNull(
            CustomerProfile.CustomerType customerType, MarketingCommunication.CommunicationStatus status);
    
    // Find communications by customer type and communication type
    List<MarketingCommunication> findByCustomerTypeAndCommunicationTypeAndDeletedAtIsNull(
            CustomerProfile.CustomerType customerType, MarketingCommunication.CommunicationType communicationType);
    
    // Find communications by customer type and channel
    List<MarketingCommunication> findByCustomerTypeAndChannelAndDeletedAtIsNull(
            CustomerProfile.CustomerType customerType, MarketingCommunication.Channel channel);
    
    // Find communications scheduled for specific date range
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.scheduledAt BETWEEN :startDate AND :endDate AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByScheduledDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find communications sent in specific date range
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.sentAt BETWEEN :startDate AND :endDate AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findBySentDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find communications delivered in specific date range
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.deliveredAt BETWEEN :startDate AND :endDate AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByDeliveredDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find communications read in specific date range
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.readAt BETWEEN :startDate AND :endDate AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByReadDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find communications clicked in specific date range
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.clickedAt BETWEEN :startDate AND :endDate AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByClickedDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find communications with high cost
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.cost >= :minCost AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByMinCost(@Param("minCost") Double minCost);
    
    // Find communications with delivery status
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.deliveryStatus LIKE %:status% AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByDeliveryStatusPattern(@Param("status") String status);
    
    // Find communications with error messages
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.errorMessage IS NOT NULL AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByErrorMessageNotNull();
    
    // Find communications with error message pattern
    @Query("SELECT mc FROM MarketingCommunication mc WHERE mc.errorMessage LIKE %:pattern% AND mc.deletedAt IS NULL")
    List<MarketingCommunication> findByErrorMessagePattern(@Param("pattern") String pattern);
    
    // Get communication statistics
    @Query("SELECT COUNT(mc) as totalCommunications, " +
           "COUNT(CASE WHEN mc.status = 'SENT' THEN 1 END) as sentCommunications, " +
           "COUNT(CASE WHEN mc.status = 'DELIVERED' THEN 1 END) as deliveredCommunications, " +
           "COUNT(CASE WHEN mc.status = 'READ' THEN 1 END) as readCommunications, " +
           "COUNT(CASE WHEN mc.status = 'CLICKED' THEN 1 END) as clickedCommunications, " +
           "COUNT(CASE WHEN mc.status = 'FAILED' THEN 1 END) as failedCommunications, " +
           "AVG(mc.cost) as avgCost, " +
           "SUM(mc.cost) as totalCost " +
           "FROM MarketingCommunication mc WHERE mc.deletedAt IS NULL")
    Object[] getCommunicationStatistics();
    
    // Get communication statistics by customer profile
    @Query("SELECT COUNT(mc) as totalCommunications, " +
           "COUNT(CASE WHEN mc.status = 'SENT' THEN 1 END) as sentCommunications, " +
           "COUNT(CASE WHEN mc.status = 'DELIVERED' THEN 1 END) as deliveredCommunications, " +
           "COUNT(CASE WHEN mc.status = 'READ' THEN 1 END) as readCommunications, " +
           "COUNT(CASE WHEN mc.status = 'CLICKED' THEN 1 END) as clickedCommunications, " +
           "COUNT(CASE WHEN mc.status = 'FAILED' THEN 1 END) as failedCommunications, " +
           "AVG(mc.cost) as avgCost, " +
           "SUM(mc.cost) as totalCost " +
           "FROM MarketingCommunication mc WHERE mc.customerProfile = :customerProfile AND mc.deletedAt IS NULL")
    Object[] getCommunicationStatisticsByCustomer(@Param("customerProfile") CustomerProfile customerProfile);
    
    // Get communication statistics by phone number
    @Query("SELECT COUNT(mc) as totalCommunications, " +
           "COUNT(CASE WHEN mc.status = 'SENT' THEN 1 END) as sentCommunications, " +
           "COUNT(CASE WHEN mc.status = 'DELIVERED' THEN 1 END) as deliveredCommunications, " +
           "COUNT(CASE WHEN mc.status = 'READ' THEN 1 END) as readCommunications, " +
           "COUNT(CASE WHEN mc.status = 'CLICKED' THEN 1 END) as clickedCommunications, " +
           "COUNT(CASE WHEN mc.status = 'FAILED' THEN 1 END) as failedCommunications, " +
           "AVG(mc.cost) as avgCost, " +
           "SUM(mc.cost) as totalCost " +
           "FROM MarketingCommunication mc WHERE mc.phoneNumber = :phoneNumber AND mc.deletedAt IS NULL")
    Object[] getCommunicationStatisticsByPhone(@Param("phoneNumber") String phoneNumber);
} 