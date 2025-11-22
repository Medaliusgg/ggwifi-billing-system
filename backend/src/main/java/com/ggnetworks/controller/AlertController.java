package com.ggnetworks.controller;

import com.ggnetworks.entity.AlertRule;
import com.ggnetworks.service.AlertRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertRuleService alertRuleService;

    @PostMapping("/rules")
    public ResponseEntity<Map<String, Object>> createAlertRule(@RequestBody AlertRule alertRule) {
        Map<String, Object> response = new HashMap<>();
        try {
            AlertRule created = alertRuleService.createAlertRule(alertRule);
            response.put("status", "success");
            response.put("message", "Alert rule created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create alert rule: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/rules")
    public ResponseEntity<Map<String, Object>> getAlertRules(
            @RequestParam(required = false) Boolean activeOnly
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<AlertRule> rules = (activeOnly != null && activeOnly)
                    ? alertRuleService.getActiveAlertRules()
                    : alertRuleService.getAllAlertRules();
            response.put("status", "success");
            response.put("message", "Alert rules retrieved successfully");
            response.put("data", rules);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve alert rules: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/rules/{id}")
    public ResponseEntity<Map<String, Object>> getAlertRuleById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            AlertRule rule = alertRuleService.getAlertRule(id);
            response.put("status", "success");
            response.put("message", "Alert rule retrieved successfully");
            response.put("data", rule);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve alert rule: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<Map<String, Object>> updateAlertRule(
            @PathVariable Long id,
            @RequestBody AlertRule alertRule
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            AlertRule updated = alertRuleService.updateAlertRule(id, alertRule);
            response.put("status", "success");
            response.put("message", "Alert rule updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update alert rule: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PatchMapping("/rules/{id}/toggle")
    public ResponseEntity<Map<String, Object>> toggleAlertRule(
            @PathVariable Long id,
            @RequestParam Boolean isActive
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            AlertRule rule = alertRuleService.toggleAlertRule(id, isActive);
            response.put("status", "success");
            response.put("message", "Alert rule toggled successfully");
            response.put("data", rule);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to toggle alert rule: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<Map<String, Object>> deleteAlertRule(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            alertRuleService.deleteAlertRule(id);
            response.put("status", "success");
            response.put("message", "Alert rule deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete alert rule: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, Object>> evaluateMetric(
            @RequestParam String metricName,
            @RequestParam Double metricValue,
            @RequestParam(required = false) String description
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> result = alertRuleService.evaluateMetric(metricName, metricValue, description);
            response.put("status", "success");
            response.put("message", "Metric evaluated successfully");
            response.put("data", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to evaluate metric: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/rules/{id}/trigger")
    public ResponseEntity<Map<String, Object>> triggerManualAlert(
            @PathVariable Long id,
            @RequestParam(required = false) String description
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> result = alertRuleService.triggerManualAlert(id, description);
            response.put("status", "success");
            response.put("message", "Alert triggered successfully");
            response.put("data", result);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to trigger alert: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getAlertStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = alertRuleService.getAlertStatistics();
            response.put("status", "success");
            response.put("message", "Alert statistics retrieved");
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to load statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

