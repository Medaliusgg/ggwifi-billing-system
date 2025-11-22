package com.ggnetworks.service;

import com.ggnetworks.entity.AlertRule;
import com.ggnetworks.repository.AlertRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AlertRuleService {

    @Autowired
    private AlertRuleRepository alertRuleRepository;

    @Autowired
    private NotificationService notificationService;

    public AlertRule createAlertRule(AlertRule alertRule) {
        if (alertRule.getIsActive() == null) {
            alertRule.setIsActive(true);
        }
        return alertRuleRepository.save(alertRule);
    }

    public AlertRule updateAlertRule(Long id, AlertRule updatedRule) {
        AlertRule existing = alertRuleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert rule not found"));

        existing.setName(updatedRule.getName());
        existing.setDescription(updatedRule.getDescription());
        existing.setAlertType(updatedRule.getAlertType());
        existing.setMetricName(updatedRule.getMetricName());
        existing.setThresholdValue(updatedRule.getThresholdValue());
        existing.setCondition(updatedRule.getCondition());
        existing.setNotificationChannels(updatedRule.getNotificationChannels());
        existing.setRecipients(updatedRule.getRecipients());
        existing.setIsActive(updatedRule.getIsActive());
        existing.setEscalationEnabled(updatedRule.getEscalationEnabled());
        existing.setEscalationDelayMinutes(updatedRule.getEscalationDelayMinutes());

        return alertRuleRepository.save(existing);
    }

    public AlertRule toggleAlertRule(Long id, boolean isActive) {
        AlertRule rule = alertRuleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert rule not found"));
        rule.setIsActive(isActive);
        return alertRuleRepository.save(rule);
    }

    public List<AlertRule> getAllAlertRules() {
        return alertRuleRepository.findAll();
    }

    public List<AlertRule> getActiveAlertRules() {
        return alertRuleRepository.findByIsActive(true);
    }

    public AlertRule getAlertRule(Long id) {
        return alertRuleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert rule not found"));
    }

    public void deleteAlertRule(Long id) {
        alertRuleRepository.deleteById(id);
    }

    public Map<String, Object> evaluateMetric(String metricName, double metricValue, String description) {
        List<AlertRule> rules = alertRuleRepository.findByMetricName(metricName);
        if (rules.isEmpty()) {
            return Map.of(
                    "metricName", metricName,
                    "status", "no_rules",
                    "message", "No alert rules configured for this metric"
            );
        }

        List<Map<String, Object>> triggeredRules = new ArrayList<>();
        for (AlertRule rule : rules) {
            if (!Boolean.TRUE.equals(rule.getIsActive())) {
                continue;
            }
            boolean shouldTrigger = isConditionMet(rule.getCondition(), metricValue, rule.getThresholdValue());
            if (shouldTrigger) {
                recordTrigger(rule, metricValue, description);
                triggeredRules.add(Map.of(
                        "ruleId", rule.getId(),
                        "ruleName", rule.getName(),
                        "metricValue", metricValue,
                        "threshold", rule.getThresholdValue(),
                        "condition", rule.getCondition()
                ));
            }
        }

        return Map.of(
                "metricName", metricName,
                "metricValue", metricValue,
                "triggeredCount", triggeredRules.size(),
                "triggeredRules", triggeredRules
        );
    }

    public Map<String, Object> getAlertStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRules", alertRuleRepository.count());
        stats.put("activeRules", alertRuleRepository.findByIsActive(true).size());
        stats.put("systemAlerts", alertRuleRepository.findByAlertType(AlertRule.AlertType.SYSTEM).size());
        stats.put("networkAlerts", alertRuleRepository.findByAlertType(AlertRule.AlertType.NETWORK).size());
        stats.put("financialAlerts", alertRuleRepository.findByAlertType(AlertRule.AlertType.FINANCIAL).size());
        stats.put("securityAlerts", alertRuleRepository.findByAlertType(AlertRule.AlertType.SECURITY).size());
        return stats;
    }

    public List<Map<String, Object>> triggerManualAlert(Long ruleId, String description) {
        AlertRule rule = getAlertRule(ruleId);
        if (!Boolean.TRUE.equals(rule.getIsActive())) {
            return Collections.emptyList();
        }
        recordTrigger(rule, null, description);
        return List.of(Map.of(
                "ruleId", rule.getId(),
                "ruleName", rule.getName(),
                "description", description != null ? description : "Manual trigger"
        ));
    }

    private boolean isConditionMet(AlertRule.Condition condition, Double metricValue, Double threshold) {
        if (metricValue == null || threshold == null || condition == null) {
            return false;
        }
        return switch (condition) {
            case GREATER_THAN -> metricValue > threshold;
            case LESS_THAN -> metricValue < threshold;
            case EQUALS -> metricValue.equals(threshold);
            case NOT_EQUALS -> !metricValue.equals(threshold);
            case CONTAINS -> false;
        };
    }

    private void recordTrigger(AlertRule rule, Double metricValue, String description) {
        rule.setTriggerCount(rule.getTriggerCount() + 1);
        rule.setLastTriggeredAt(LocalDateTime.now());
        alertRuleRepository.save(rule);
        notifyRecipients(rule, metricValue, description);
    }

    private void notifyRecipients(AlertRule rule, Double metricValue, String description) {
        if (rule.getRecipients() == null || rule.getRecipients().isBlank() ||
                rule.getNotificationChannels() == null || rule.getNotificationChannels().isBlank()) {
            return;
        }

        String message = buildAlertMessage(rule, metricValue, description);
        String subject = "[GG-WIFI] Alert: " + rule.getName();
        String[] recipients = rule.getRecipients().split(",");
        String[] channels = rule.getNotificationChannels().split(",");

        for (String channel : channels) {
            String normalizedChannel = channel.trim().toUpperCase(Locale.ROOT);
            for (String recipient : recipients) {
                String trimmedRecipient = recipient.trim();
                if (trimmedRecipient.isEmpty()) {
                    continue;
                }
                notificationService.sendNotification(
                        "ALERT_RULE",
                        trimmedRecipient,
                        normalizedChannel,
                        rule.getAlertType().name(),
                        subject,
                        message
                );
            }
        }
    }

    private String buildAlertMessage(AlertRule rule, Double metricValue, String description) {
        StringBuilder builder = new StringBuilder();
        builder.append("Alert: ").append(rule.getName()).append("\n");
        if (description != null && !description.isBlank()) {
            builder.append(description).append("\n");
        }
        if (metricValue != null && rule.getThresholdValue() != null) {
            builder.append("Metric: ").append(rule.getMetricName())
                    .append(" value ").append(metricValue)
                    .append(" ").append(rule.getCondition())
                    .append(" threshold ").append(rule.getThresholdValue())
                    .append("\n");
        }
        if (Boolean.TRUE.equals(rule.getEscalationEnabled())) {
            builder.append("Escalation enabled (")
                    .append(rule.getEscalationDelayMinutes())
                    .append(" minutes).\n");
        }
        builder.append("Timestamp: ").append(LocalDateTime.now());
        return builder.toString();
    }
}

