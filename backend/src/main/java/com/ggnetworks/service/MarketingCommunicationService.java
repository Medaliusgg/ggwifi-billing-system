package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketingCommunicationService {

    private final MarketingCommunicationRepository marketingCommunicationRepository;
    private final CustomerProfileRepository customerProfileRepository;

    // ==================== COMMUNICATION MANAGEMENT ====================

    /**
     * Get communications by customer profile
     */
    public List<MarketingCommunication> getCommunicationsByCustomerProfile(CustomerProfile customerProfile) {
        try {
            return marketingCommunicationRepository.findByCustomerProfileAndDeletedAtIsNull(customerProfile);
        } catch (Exception e) {
            log.error("Failed to get communications for customer profile: {}", customerProfile.getId(), e);
            throw new RuntimeException("Failed to get communications", e);
        }
    }

    /**
     * Get communications by customer profile with pagination
     */
    public Page<MarketingCommunication> getCommunicationsByCustomerProfile(CustomerProfile customerProfile, Pageable pageable) {
        try {
            return marketingCommunicationRepository.findByCustomerProfileAndDeletedAtIsNull(customerProfile, pageable);
        } catch (Exception e) {
            log.error("Failed to get communications for customer profile: {}", customerProfile.getId(), e);
            throw new RuntimeException("Failed to get communications", e);
        }
    }

    /**
     * Get communications by phone number
     */
    public List<MarketingCommunication> getCommunicationsByPhoneNumber(String phoneNumber) {
        try {
            return marketingCommunicationRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber);
        } catch (Exception e) {
            log.error("Failed to get communications for phone number: {}", phoneNumber, e);
            throw new RuntimeException("Failed to get communications", e);
        }
    }

    /**
     * Get communications by communication type
     */
    public List<MarketingCommunication> getCommunicationsByType(MarketingCommunication.CommunicationType communicationType) {
        try {
            return marketingCommunicationRepository.findByCommunicationTypeAndDeletedAtIsNull(communicationType);
        } catch (Exception e) {
            log.error("Failed to get communications by type: {}", communicationType, e);
            throw new RuntimeException("Failed to get communications by type", e);
        }
    }

    /**
     * Get communications by channel
     */
    public List<MarketingCommunication> getCommunicationsByChannel(MarketingCommunication.Channel channel) {
        try {
            return marketingCommunicationRepository.findByChannelAndDeletedAtIsNull(channel);
        } catch (Exception e) {
            log.error("Failed to get communications by channel: {}", channel, e);
            throw new RuntimeException("Failed to get communications by channel", e);
        }
    }

    /**
     * Get communications by status
     */
    public List<MarketingCommunication> getCommunicationsByStatus(MarketingCommunication.CommunicationStatus status) {
        try {
            return marketingCommunicationRepository.findByStatusAndDeletedAtIsNull(status);
        } catch (Exception e) {
            log.error("Failed to get communications by status: {}", status, e);
            throw new RuntimeException("Failed to get communications by status", e);
        }
    }

    /**
     * Get communications by customer type
     */
    public List<MarketingCommunication> getCommunicationsByCustomerType(CustomerProfile.CustomerType customerType) {
        try {
            return marketingCommunicationRepository.findByCustomerTypeAndDeletedAtIsNull(customerType);
        } catch (Exception e) {
            log.error("Failed to get communications by customer type: {}", customerType, e);
            throw new RuntimeException("Failed to get communications by customer type", e);
        }
    }

    /**
     * Get communications by campaign ID
     */
    public List<MarketingCommunication> getCommunicationsByCampaignId(String campaignId) {
        try {
            return marketingCommunicationRepository.findByCampaignIdAndDeletedAtIsNull(campaignId);
        } catch (Exception e) {
            log.error("Failed to get communications by campaign ID: {}", campaignId, e);
            throw new RuntimeException("Failed to get communications by campaign ID", e);
        }
    }

    /**
     * Get communications by template ID
     */
    public List<MarketingCommunication> getCommunicationsByTemplateId(String templateId) {
        try {
            return marketingCommunicationRepository.findByTemplateIdAndDeletedAtIsNull(templateId);
        } catch (Exception e) {
            log.error("Failed to get communications by template ID: {}", templateId, e);
            throw new RuntimeException("Failed to get communications by template ID", e);
        }
    }

    // ==================== COMMUNICATION STATUS MANAGEMENT ====================

    /**
     * Update communication status
     */
    @Transactional
    public MarketingCommunication updateCommunicationStatus(Long communicationId, MarketingCommunication.CommunicationStatus status) {
        try {
            MarketingCommunication communication = marketingCommunicationRepository.findById(communicationId)
                    .orElseThrow(() -> new IllegalArgumentException("Communication not found"));
            
            communication.setStatus(status);
            
            // Update timestamps based on status
            switch (status) {
                case SENT:
                    communication.setSentAt(LocalDateTime.now());
                    break;
                case DELIVERED:
                    communication.setDeliveredAt(LocalDateTime.now());
                    break;
                case READ:
                    communication.setReadAt(LocalDateTime.now());
                    break;
                case CLICKED:
                    communication.setClickedAt(LocalDateTime.now());
                    break;
            }
            
            return marketingCommunicationRepository.save(communication);
        } catch (Exception e) {
            log.error("Failed to update communication status: {}", communicationId, e);
            throw new RuntimeException("Failed to update communication status", e);
        }
    }

    /**
     * Mark communication as sent
     */
    @Transactional
    public MarketingCommunication markAsSent(Long communicationId) {
        try {
            MarketingCommunication communication = marketingCommunicationRepository.findById(communicationId)
                    .orElseThrow(() -> new IllegalArgumentException("Communication not found"));
            
            communication.setStatus(MarketingCommunication.CommunicationStatus.SENT);
            communication.setSentAt(LocalDateTime.now());
            
            return marketingCommunicationRepository.save(communication);
        } catch (Exception e) {
            log.error("Failed to mark communication as sent: {}", communicationId, e);
            throw new RuntimeException("Failed to mark communication as sent", e);
        }
    }

    /**
     * Mark communication as delivered
     */
    @Transactional
    public MarketingCommunication markAsDelivered(Long communicationId) {
        try {
            MarketingCommunication communication = marketingCommunicationRepository.findById(communicationId)
                    .orElseThrow(() -> new IllegalArgumentException("Communication not found"));
            
            communication.setStatus(MarketingCommunication.CommunicationStatus.DELIVERED);
            communication.setDeliveredAt(LocalDateTime.now());
            
            return marketingCommunicationRepository.save(communication);
        } catch (Exception e) {
            log.error("Failed to mark communication as delivered: {}", communicationId, e);
            throw new RuntimeException("Failed to mark communication as delivered", e);
        }
    }

    /**
     * Mark communication as read
     */
    @Transactional
    public MarketingCommunication markAsRead(Long communicationId) {
        try {
            MarketingCommunication communication = marketingCommunicationRepository.findById(communicationId)
                    .orElseThrow(() -> new IllegalArgumentException("Communication not found"));
            
            communication.setStatus(MarketingCommunication.CommunicationStatus.READ);
            communication.setReadAt(LocalDateTime.now());
            
            return marketingCommunicationRepository.save(communication);
        } catch (Exception e) {
            log.error("Failed to mark communication as read: {}", communicationId, e);
            throw new RuntimeException("Failed to mark communication as read", e);
        }
    }

    /**
     * Mark communication as clicked
     */
    @Transactional
    public MarketingCommunication markAsClicked(Long communicationId) {
        try {
            MarketingCommunication communication = marketingCommunicationRepository.findById(communicationId)
                    .orElseThrow(() -> new IllegalArgumentException("Communication not found"));
            
            communication.setStatus(MarketingCommunication.CommunicationStatus.CLICKED);
            communication.setClickedAt(LocalDateTime.now());
            
            return marketingCommunicationRepository.save(communication);
        } catch (Exception e) {
            log.error("Failed to mark communication as clicked: {}", communicationId, e);
            throw new RuntimeException("Failed to mark communication as clicked", e);
        }
    }

    /**
     * Mark communication as failed
     */
    @Transactional
    public MarketingCommunication markAsFailed(Long communicationId, String errorMessage) {
        try {
            MarketingCommunication communication = marketingCommunicationRepository.findById(communicationId)
                    .orElseThrow(() -> new IllegalArgumentException("Communication not found"));
            
            communication.setStatus(MarketingCommunication.CommunicationStatus.FAILED);
            communication.setErrorMessage(errorMessage);
            
            return marketingCommunicationRepository.save(communication);
        } catch (Exception e) {
            log.error("Failed to mark communication as failed: {}", communicationId, e);
            throw new RuntimeException("Failed to mark communication as failed", e);
        }
    }

    // ==================== COMMUNICATION ANALYTICS ====================

    /**
     * Get communication statistics
     */
    public Map<String, Object> getCommunicationStatistics() {
        try {
            Object[] stats = marketingCommunicationRepository.getCommunicationStatistics();
            
            Map<String, Object> statistics = Map.of(
                "totalCommunications", stats[0],
                "sentCommunications", stats[1],
                "deliveredCommunications", stats[2],
                "readCommunications", stats[3],
                "clickedCommunications", stats[4],
                "failedCommunications", stats[5],
                "avgCost", stats[6],
                "totalCost", stats[7]
            );
            
            return statistics;
        } catch (Exception e) {
            log.error("Failed to get communication statistics", e);
            throw new RuntimeException("Failed to get communication statistics", e);
        }
    }

    /**
     * Get communication statistics by customer profile
     */
    public Map<String, Object> getCommunicationStatisticsByCustomer(CustomerProfile customerProfile) {
        try {
            Object[] stats = marketingCommunicationRepository.getCommunicationStatisticsByCustomer(customerProfile);
            
            Map<String, Object> statistics = Map.of(
                "totalCommunications", stats[0],
                "sentCommunications", stats[1],
                "deliveredCommunications", stats[2],
                "readCommunications", stats[3],
                "clickedCommunications", stats[4],
                "failedCommunications", stats[5],
                "avgCost", stats[6],
                "totalCost", stats[7]
            );
            
            return statistics;
        } catch (Exception e) {
            log.error("Failed to get communication statistics for customer: {}", customerProfile.getId(), e);
            throw new RuntimeException("Failed to get communication statistics", e);
        }
    }

    /**
     * Get communication statistics by phone number
     */
    public Map<String, Object> getCommunicationStatisticsByPhone(String phoneNumber) {
        try {
            Object[] stats = marketingCommunicationRepository.getCommunicationStatisticsByPhone(phoneNumber);
            
            Map<String, Object> statistics = Map.of(
                "totalCommunications", stats[0],
                "sentCommunications", stats[1],
                "deliveredCommunications", stats[2],
                "readCommunications", stats[3],
                "clickedCommunications", stats[4],
                "failedCommunications", stats[5],
                "avgCost", stats[6],
                "totalCost", stats[7]
            );
            
            return statistics;
        } catch (Exception e) {
            log.error("Failed to get communication statistics for phone: {}", phoneNumber, e);
            throw new RuntimeException("Failed to get communication statistics", e);
        }
    }

    // ==================== COMMUNICATION SEARCH & FILTERING ====================

    /**
     * Search communications by subject pattern
     */
    public List<MarketingCommunication> searchCommunicationsBySubject(String pattern) {
        try {
            return marketingCommunicationRepository.findBySubjectPattern(pattern);
        } catch (Exception e) {
            log.error("Failed to search communications by subject pattern: {}", pattern, e);
            throw new RuntimeException("Failed to search communications by subject pattern", e);
        }
    }

    /**
     * Search communications by message content pattern
     */
    public List<MarketingCommunication> searchCommunicationsByMessageContent(String pattern) {
        try {
            return marketingCommunicationRepository.findByMessageContentPattern(pattern);
        } catch (Exception e) {
            log.error("Failed to search communications by message content pattern: {}", pattern, e);
            throw new RuntimeException("Failed to search communications by message content pattern", e);
        }
    }

    /**
     * Get communications by scheduled date range
     */
    public List<MarketingCommunication> getCommunicationsByScheduledDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return marketingCommunicationRepository.findByScheduledDateRange(startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to get communications by scheduled date range: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to get communications by scheduled date range", e);
        }
    }

    /**
     * Get communications by sent date range
     */
    public List<MarketingCommunication> getCommunicationsBySentDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return marketingCommunicationRepository.findBySentDateRange(startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to get communications by sent date range: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to get communications by sent date range", e);
        }
    }

    /**
     * Get communications by delivered date range
     */
    public List<MarketingCommunication> getCommunicationsByDeliveredDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return marketingCommunicationRepository.findByDeliveredDateRange(startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to get communications by delivered date range: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to get communications by delivered date range", e);
        }
    }

    /**
     * Get communications by read date range
     */
    public List<MarketingCommunication> getCommunicationsByReadDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return marketingCommunicationRepository.findByReadDateRange(startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to get communications by read date range: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to get communications by read date range", e);
        }
    }

    /**
     * Get communications by clicked date range
     */
    public List<MarketingCommunication> getCommunicationsByClickedDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return marketingCommunicationRepository.findByClickedDateRange(startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to get communications by clicked date range: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to get communications by clicked date range", e);
        }
    }

    // ==================== COMMUNICATION COUNTING ====================

    /**
     * Count communications by type
     */
    public long countCommunicationsByType(MarketingCommunication.CommunicationType communicationType) {
        try {
            return marketingCommunicationRepository.countByCommunicationTypeAndDeletedAtIsNull(communicationType);
        } catch (Exception e) {
            log.error("Failed to count communications by type: {}", communicationType, e);
            throw new RuntimeException("Failed to count communications by type", e);
        }
    }

    /**
     * Count communications by channel
     */
    public long countCommunicationsByChannel(MarketingCommunication.Channel channel) {
        try {
            return marketingCommunicationRepository.countByChannelAndDeletedAtIsNull(channel);
        } catch (Exception e) {
            log.error("Failed to count communications by channel: {}", channel, e);
            throw new RuntimeException("Failed to count communications by channel", e);
        }
    }

    /**
     * Count communications by status
     */
    public long countCommunicationsByStatus(MarketingCommunication.CommunicationStatus status) {
        try {
            return marketingCommunicationRepository.countByStatusAndDeletedAtIsNull(status);
        } catch (Exception e) {
            log.error("Failed to count communications by status: {}", status, e);
            throw new RuntimeException("Failed to count communications by status", e);
        }
    }

    /**
     * Count communications by customer type
     */
    public long countCommunicationsByCustomerType(CustomerProfile.CustomerType customerType) {
        try {
            return marketingCommunicationRepository.countByCustomerTypeAndDeletedAtIsNull(customerType);
        } catch (Exception e) {
            log.error("Failed to count communications by customer type: {}", customerType, e);
            throw new RuntimeException("Failed to count communications by customer type", e);
        }
    }

    /**
     * Count communications by campaign ID
     */
    public long countCommunicationsByCampaignId(String campaignId) {
        try {
            return marketingCommunicationRepository.countByCampaignIdAndDeletedAtIsNull(campaignId);
        } catch (Exception e) {
            log.error("Failed to count communications by campaign ID: {}", campaignId, e);
            throw new RuntimeException("Failed to count communications by campaign ID", e);
        }
    }

    /**
     * Count communications by customer profile
     */
    public long countCommunicationsByCustomerProfile(CustomerProfile customerProfile) {
        try {
            return marketingCommunicationRepository.countByCustomerProfileAndDeletedAtIsNull(customerProfile);
        } catch (Exception e) {
            log.error("Failed to count communications for customer: {}", customerProfile.getId(), e);
            throw new RuntimeException("Failed to count communications by customer profile", e);
        }
    }

    /**
     * Count communications by phone number
     */
    public long countCommunicationsByPhoneNumber(String phoneNumber) {
        try {
            return marketingCommunicationRepository.countByPhoneNumberAndDeletedAtIsNull(phoneNumber);
        } catch (Exception e) {
            log.error("Failed to count communications for phone number: {}", phoneNumber, e);
            throw new RuntimeException("Failed to count communications by phone number", e);
        }
    }

    // Additional methods for AdminCustomerController
    public Page<MarketingCommunication> getCommunicationsByCustomerId(Long customerId, Pageable pageable) {
        // Find communications through customer profile
        CustomerProfile customerProfile = customerProfileRepository.findById(customerId).orElse(null);
        if (customerProfile == null) {
            return Page.empty(pageable);
        }
        return marketingCommunicationRepository.findByCustomerProfileAndDeletedAtIsNull(customerProfile, pageable);
    }
} 