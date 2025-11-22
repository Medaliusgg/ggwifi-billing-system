package com.ggnetworks.repository;

import com.ggnetworks.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByRecipientTypeAndRecipientId(String recipientType, String recipientId);
    
    List<Notification> findByChannel(String channel);
    
    List<Notification> findByType(String type);
    
    List<Notification> findByStatus(Notification.NotificationStatus status);
    
    List<Notification> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Notification> findByRecipientTypeAndRecipientIdAndStatus(String recipientType, String recipientId, Notification.NotificationStatus status);
    
    long countByStatus(Notification.NotificationStatus status);
    
    long countByChannel(String channel);
}


