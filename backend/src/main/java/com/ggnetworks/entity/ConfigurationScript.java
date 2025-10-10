package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "configuration_scripts")
public class ConfigurationScript extends BaseEntity {

    @NotBlank(message = "Script name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Script content is required")
    @Column(name = "script_content", nullable = false, columnDefinition = "TEXT")
    private String scriptContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "script_type", nullable = false)
    private ScriptType scriptType;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_router_type", nullable = false)
    private RouterType targetRouterType;

    @Column(name = "version", nullable = false)
    private String version = "1.0";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ScriptStatus status = ScriptStatus.DRAFT;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "execution_timeout_seconds")
    private Integer executionTimeoutSeconds = 300;

    @Column(name = "requires_confirmation")
    private Boolean requiresConfirmation = false;

    @Column(name = "backup_before_execution")
    private Boolean backupBeforeExecution = true;

    @Column(name = "rollback_script", columnDefinition = "TEXT")
    private String rollbackScript;

    @Column(name = "parameters_json", columnDefinition = "JSON")
    private String parametersJson;

    @Column(name = "last_executed_at")
    private LocalDateTime lastExecutedAt;

    @Column(name = "execution_count")
    private Integer executionCount = 0;

    @Column(name = "success_count")
    private Integer successCount = 0;

    @Column(name = "failure_count")
    private Integer failureCount = 0;

    @Column(name = "average_execution_time_seconds")
    private Double averageExecutionTimeSeconds;

    @Column(name = "tags")
    private String tags;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum ScriptType {
        CONFIGURATION, MAINTENANCE, MONITORING, SECURITY, BACKUP, RESTORE, 
        USER_MANAGEMENT, BANDWIDTH_CONTROL, FIREWALL, QOS, VPN
    }

    public enum RouterType {
        MIKROTIK, CISCO, TP_LINK, D_LINK, GENERIC, ALL
    }

    public enum ScriptStatus {
        DRAFT, TESTING, ACTIVE, DEPRECATED, ARCHIVED
    }

    public boolean isActive() {
        return isActive && status == ScriptStatus.ACTIVE;
    }

    public boolean canBeExecuted() {
        return isActive() && status == ScriptStatus.ACTIVE;
    }

    public void incrementExecutionCount() {
        this.executionCount++;
        this.lastExecutedAt = LocalDateTime.now();
    }

    public void recordSuccess() {
        this.successCount++;
        incrementExecutionCount();
    }

    public void recordFailure() {
        this.failureCount++;
        incrementExecutionCount();
    }

    public double getSuccessRate() {
        if (executionCount == 0) return 0.0;
        return (double) successCount / executionCount * 100;
    }

    public boolean supportsRouterType(Router.RouterType routerType) {
        return targetRouterType == RouterType.ALL || 
               targetRouterType.name().equals(routerType.name());
    }
} 