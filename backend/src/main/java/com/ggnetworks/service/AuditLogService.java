package com.ggnetworks.service;

import com.ggnetworks.entity.AuditLog;
import com.ggnetworks.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAuthentication(String username, String action, String ipAddress, String userAgent, boolean success) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setAction(action);
        auditLog.setResourceType("AUTHENTICATION");
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        auditLog.setRequestMethod("POST");
        auditLog.setRequestUri("/api/v1/auth/login");
        auditLog.setStatusCode(success ? 200 : 401);
        auditLog.setRiskLevel(success ? AuditLog.RiskLevel.LOW : AuditLog.RiskLevel.MEDIUM);
        auditLog.setDetails("Authentication attempt: " + (success ? "SUCCESS" : "FAILED"));
        
        auditLogRepository.save(auditLog);
    }

    public void logUserAction(Long userId, String username, String action, String resourceType, String resourceId, String ipAddress, String userAgent) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUserId(userId);
        auditLog.setUsername(username);
        auditLog.setAction(action);
        auditLog.setResourceType(resourceType);
        auditLog.setResourceId(resourceId);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        auditLog.setRiskLevel(AuditLog.RiskLevel.LOW);
        auditLog.setDetails("User action: " + action + " on " + resourceType);
        
        auditLogRepository.save(auditLog);
    }

    public void logSecurityEvent(String username, String action, String details, AuditLog.RiskLevel riskLevel, String ipAddress) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setAction(action);
        auditLog.setResourceType("SECURITY");
        auditLog.setIpAddress(ipAddress);
        auditLog.setRiskLevel(riskLevel);
        auditLog.setDetails(details);
        
        auditLogRepository.save(auditLog);
    }

    public void logFailedLoginAttempt(String username, String ipAddress, String userAgent, String reason) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setAction("FAILED_LOGIN");
        auditLog.setResourceType("AUTHENTICATION");
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        auditLog.setRequestMethod("POST");
        auditLog.setRequestUri("/api/v1/auth/login");
        auditLog.setStatusCode(401);
        auditLog.setRiskLevel(AuditLog.RiskLevel.HIGH);
        auditLog.setDetails("Failed login attempt: " + reason);
        
        auditLogRepository.save(auditLog);
    }

    public void logAccountLockout(String username, String ipAddress, String reason) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setAction("ACCOUNT_LOCKOUT");
        auditLog.setResourceType("SECURITY");
        auditLog.setIpAddress(ipAddress);
        auditLog.setRiskLevel(AuditLog.RiskLevel.CRITICAL);
        auditLog.setDetails("Account locked: " + reason);
        
        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getUserActivity(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByUserIdAndCreatedAtBetween(userId, startDate, endDate);
    }

    public List<AuditLog> getSecurityEvents(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByRiskLevelIn(List.of(AuditLog.RiskLevel.HIGH, AuditLog.RiskLevel.CRITICAL));
    }

    public Map<String, Object> getAuditStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalLogs", auditLogRepository.countByCreatedAtBetween(startDate, endDate));
        stats.put("highRiskLogs", auditLogRepository.countByRiskLevel(AuditLog.RiskLevel.HIGH));
        stats.put("criticalLogs", auditLogRepository.countByRiskLevel(AuditLog.RiskLevel.CRITICAL));
        stats.put("failedLogins", auditLogRepository.countByAction("FAILED_LOGIN"));
        stats.put("accountLockouts", auditLogRepository.countByAction("ACCOUNT_LOCKOUT"));
        
        return stats;
    }

    public List<AuditLog> getRecentSecurityEvents(int limit) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        return auditLogRepository.findByRiskLevelInAndCreatedAtAfter(
            List.of(AuditLog.RiskLevel.HIGH, AuditLog.RiskLevel.CRITICAL), cutoff)
            .stream()
            .limit(limit)
            .toList();
    }
    
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }
    
    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    public List<AuditLog> getAuditLogsByRiskLevel(AuditLog.RiskLevel riskLevel) {
        return auditLogRepository.findByRiskLevel(riskLevel);
    }
    
    public List<AuditLog> getAuditLogsByAction(String action) {
        return auditLogRepository.findByAction(action);
    }
    
    public List<AuditLog> getAuditLogsByUsername(String username) {
        return auditLogRepository.findByUsername(username);
    }
    
    public Map<String, Object> getSecurityDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);
        LocalDateTime last7Days = LocalDateTime.now().minusDays(7);
        LocalDateTime last30Days = LocalDateTime.now().minusDays(30);
        
        dashboard.put("last24Hours", Map.of(
            "total", auditLogRepository.countByCreatedAtAfter(last24Hours),
            "highRisk", auditLogRepository.countByRiskLevelAndCreatedAtAfter(AuditLog.RiskLevel.HIGH, last24Hours),
            "critical", auditLogRepository.countByRiskLevelAndCreatedAtAfter(AuditLog.RiskLevel.CRITICAL, last24Hours),
            "failedLogins", auditLogRepository.countByActionAndCreatedAtAfter("FAILED_LOGIN", last24Hours)
        ));
        
        dashboard.put("last7Days", Map.of(
            "total", auditLogRepository.countByCreatedAtAfter(last7Days),
            "highRisk", auditLogRepository.countByRiskLevelAndCreatedAtAfter(AuditLog.RiskLevel.HIGH, last7Days),
            "critical", auditLogRepository.countByRiskLevelAndCreatedAtAfter(AuditLog.RiskLevel.CRITICAL, last7Days)
        ));
        
        dashboard.put("last30Days", Map.of(
            "total", auditLogRepository.countByCreatedAtAfter(last30Days),
            "highRisk", auditLogRepository.countByRiskLevelAndCreatedAtAfter(AuditLog.RiskLevel.HIGH, last30Days),
            "critical", auditLogRepository.countByRiskLevelAndCreatedAtAfter(AuditLog.RiskLevel.CRITICAL, last30Days)
        ));
        
        dashboard.put("topActions", auditLogRepository.findTopActionsByCount(10));
        dashboard.put("topUsers", auditLogRepository.findTopUsersByActionCount(10));
        
        return dashboard;
    }
}
