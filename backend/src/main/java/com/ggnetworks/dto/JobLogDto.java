package com.ggnetworks.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Job Log DTO
 * Module J: VPN Module
 */
public class JobLogDto {
    
    private Long jobId;
    private String status;
    private List<String> logs;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String errorMessage;
    
    public JobLogDto() {}
    
    // Getters and Setters
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public List<String> getLogs() { return logs; }
    public void setLogs(List<String> logs) { this.logs = logs; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
