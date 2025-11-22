package com.ggnetworks.controller;

import com.ggnetworks.entity.Notification;
import com.ggnetworks.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendNotification(
            @RequestParam String recipientType,
            @RequestParam String recipientId,
            @RequestParam String channel,
            @RequestParam String type,
            @RequestParam(required = false) String subject,
            @RequestParam String message
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Notification notification = notificationService.sendNotification(
                    recipientType, recipientId, channel, type, subject, message);
            response.put("status", "success");
            response.put("message", "Notification sent successfully");
            response.put("data", notification);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to send notification: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Notification notification) {
        Map<String, Object> response = new HashMap<>();
        try {
            Notification created = notificationService.createNotification(notification);
            response.put("status", "success");
            response.put("message", "Notification created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create notification: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(
            @RequestParam(required = false) String recipientType,
            @RequestParam(required = false) String recipientId,
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) Notification.NotificationStatus status
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Notification> notifications;
            if (recipientType != null && recipientId != null) {
                notifications = notificationService.getNotificationsByRecipient(recipientType, recipientId);
            } else if (status != null) {
                notifications = notificationService.getNotificationsByStatus(status);
            } else if (channel != null) {
                notifications = notificationService.getNotificationsByChannel(channel);
            } else {
                notifications = notificationService.getAllNotifications();
            }
            response.put("status", "success");
            response.put("message", "Notifications retrieved successfully");
            response.put("data", notifications);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve notifications: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNotificationById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Notification> notification = notificationService.getNotification(id);
            if (notification.isPresent()) {
                response.put("status", "success");
                response.put("message", "Notification retrieved successfully");
                response.put("data", notification.get());
                return ResponseEntity.ok(response);
            }
            response.put("status", "error");
            response.put("message", "Notification not found");
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve notification: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Notification notification = notificationService.markAsRead(id);
            response.put("status", "success");
            response.put("message", "Notification marked as read");
            response.put("data", notification);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update notification: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestParam Notification.NotificationStatus status
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Notification notification = notificationService.updateStatus(id, status);
            response.put("status", "success");
            response.put("message", "Notification status updated");
            response.put("data", notification);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/resend")
    public ResponseEntity<Map<String, Object>> resendNotification(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Notification notification = notificationService.resendNotification(id);
            response.put("status", "success");
            response.put("message", "Notification resent successfully");
            response.put("data", notification);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to resend notification: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            notificationService.deleteNotification(id);
            response.put("status", "success");
            response.put("message", "Notification deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete notification: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getNotificationStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = notificationService.getNotificationStatistics();
            response.put("status", "success");
            response.put("message", "Notification statistics retrieved");
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to load statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

