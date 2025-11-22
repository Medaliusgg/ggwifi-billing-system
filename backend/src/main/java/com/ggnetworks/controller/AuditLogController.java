package com.ggnetworks.controller;

import com.ggnetworks.entity.AuditLog;
import com.ggnetworks.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) AuditLog.RiskLevel riskLevel,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String username
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<AuditLog> logs;
            if (startDate != null && endDate != null) {
                logs = auditLogService.getAuditLogsByDateRange(startDate, endDate);
            } else if (riskLevel != null) {
                logs = auditLogService.getAuditLogsByRiskLevel(riskLevel);
            } else if (action != null) {
                logs = auditLogService.getAuditLogsByAction(action);
            } else if (username != null) {
                logs = auditLogService.getAuditLogsByUsername(username);
            } else {
                logs = auditLogService.getAllAuditLogs();
            }
            response.put("status", "success");
            response.put("message", "Audit logs retrieved successfully");
            response.put("data", logs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve audit logs: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/security-events")
    public ResponseEntity<Map<String, Object>> getSecurityEvents(
            @RequestParam(defaultValue = "24") int hours
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<AuditLog> events = auditLogService.getRecentSecurityEvents(hours);
            response.put("status", "success");
            response.put("message", "Security events retrieved successfully");
            response.put("data", events);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve security events: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getAuditStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
            LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();
            Map<String, Object> statistics = auditLogService.getAuditStatistics(start, end);
            response.put("status", "success");
            response.put("message", "Audit statistics retrieved successfully");
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getSecurityDashboard() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> dashboard = auditLogService.getSecurityDashboard();
            response.put("status", "success");
            response.put("message", "Security dashboard data retrieved");
            response.put("data", dashboard);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve dashboard: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/user/{userId}/activity")
    public ResponseEntity<Map<String, Object>> getUserActivity(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
            LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();
            List<AuditLog> activity = auditLogService.getUserActivity(userId, start, end);
            response.put("status", "success");
            response.put("message", "User activity retrieved successfully");
            response.put("data", activity);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve user activity: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

