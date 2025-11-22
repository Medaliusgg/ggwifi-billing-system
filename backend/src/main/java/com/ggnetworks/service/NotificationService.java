package com.ggnetworks.service;

import com.ggnetworks.entity.Notification;
import com.ggnetworks.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SmsService smsService;

    public Notification sendNotification(
            String recipientType,
            String recipientId,
            String channel,
            String type,
            String subject,
            String message
    ) {
        Notification notification = new Notification();
        notification.setRecipientType(recipientType != null ? recipientType : "SYSTEM");
        notification.setRecipientId(recipientId);
        notification.setType(type != null ? type : "SYSTEM");
        notification.setSubject(subject);
        notification.setMessage(message);

        String normalizedChannel = (channel == null ? "IN_APP" : channel).trim().toUpperCase(Locale.ROOT);
        notification.setChannel(normalizedChannel);
        notification.setStatus(Notification.NotificationStatus.PENDING);

        notification = notificationRepository.save(notification);

        try {
            switch (normalizedChannel) {
                case "SMS" -> handleSmsNotification(notification);
                case "EMAIL" -> handleEmailNotification(notification);
                case "PUSH" -> handlePushNotification(notification);
                default -> handleInAppNotification(notification);
            }
        } catch (Exception ex) {
            notification.setStatus(Notification.NotificationStatus.FAILED);
            notification.setErrorMessage(ex.getMessage());
            notification.setRetryCount(notification.getRetryCount() + 1);
            notificationRepository.save(notification);
        }

        return notification;
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotification(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByRecipient(String recipientType, String recipientId) {
        if (recipientType == null || recipientId == null) {
            return Collections.emptyList();
        }
        return notificationRepository.findByRecipientTypeAndRecipientId(recipientType, recipientId);
    }

    public List<Notification> getNotificationsByStatus(Notification.NotificationStatus status) {
        if (status == null) {
            return notificationRepository.findAll();
        }
        return notificationRepository.findByStatus(status);
    }

    public List<Notification> getNotificationsByChannel(String channel) {
        if (channel == null) {
            return notificationRepository.findAll();
        }
        return notificationRepository.findByChannel(channel);
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setStatus(Notification.NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public Notification updateStatus(Long notificationId, Notification.NotificationStatus status) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setStatus(status);
        if (status == Notification.NotificationStatus.DELIVERED) {
            notification.setDeliveredAt(LocalDateTime.now());
        }
        if (status == Notification.NotificationStatus.SENT && notification.getSentAt() == null) {
            notification.setSentAt(LocalDateTime.now());
        }
        if (status == Notification.NotificationStatus.READ && notification.getReadAt() == null) {
            notification.setReadAt(LocalDateTime.now());
        }
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void recordDelivery(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setStatus(Notification.NotificationStatus.DELIVERED);
            notification.setDeliveredAt(LocalDateTime.now());
            notificationRepository.save(notification);
        });
    }

    public void recordFailure(Long notificationId, String errorMessage) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setStatus(Notification.NotificationStatus.FAILED);
            notification.setErrorMessage(errorMessage);
            notification.setRetryCount(notification.getRetryCount() + 1);
            notificationRepository.save(notification);
        });
    }

    public Notification resendNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        return sendNotification(notification.getRecipientType(), notification.getRecipientId(),
                notification.getChannel(), notification.getType(), notification.getSubject(), notification.getMessage());
    }

    public Notification.NotificationStatus determineStatusFromResponse(Map<String, Object> response) {
        if (response == null) {
            return Notification.NotificationStatus.FAILED;
        }
        Object status = response.get("status");
        if (status != null && "success".equalsIgnoreCase(String.valueOf(status))) {
            return Notification.NotificationStatus.SENT;
        }
        return Notification.NotificationStatus.FAILED;
    }

    public Map<String, Object> getNotificationStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", notificationRepository.count());
        stats.put("pending", notificationRepository.countByStatus(Notification.NotificationStatus.PENDING));
        stats.put("sent", notificationRepository.countByStatus(Notification.NotificationStatus.SENT));
        stats.put("delivered", notificationRepository.countByStatus(Notification.NotificationStatus.DELIVERED));
        stats.put("failed", notificationRepository.countByStatus(Notification.NotificationStatus.FAILED));
        stats.put("read", notificationRepository.countByStatus(Notification.NotificationStatus.READ));
        stats.put("sms", notificationRepository.countByChannel("SMS"));
        stats.put("email", notificationRepository.countByChannel("EMAIL"));
        stats.put("push", notificationRepository.countByChannel("PUSH"));
        stats.put("inApp", notificationRepository.countByChannel("IN_APP"));
        return stats;
    }

    private void handleSmsNotification(Notification notification) {
        if (notification.getRecipientId() == null) {
            throw new IllegalArgumentException("Recipient phone number is required for SMS notifications");
        }
        Map<String, Object> response = smsService.sendSms(notification.getRecipientId(), notification.getMessage());
        Notification.NotificationStatus status = determineStatusFromResponse(response);
        notification.setStatus(status);
        notification.setSentAt(LocalDateTime.now());
        if (status == Notification.NotificationStatus.FAILED && response != null) {
            notification.setErrorMessage(String.valueOf(response.get("message")));
        }
        notificationRepository.save(notification);
    }

    private void handleEmailNotification(Notification notification) {
        // Placeholder for email sending integration
        notification.setStatus(Notification.NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    private void handlePushNotification(Notification notification) {
        notification.setStatus(Notification.NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    private void handleInAppNotification(Notification notification) {
        notification.setStatus(Notification.NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
}

