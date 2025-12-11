package com.ggnetworks.dto;

import java.time.LocalDateTime;

/**
 * Job Status DTO
 * Module J: VPN Module
 */
public class JobStatusDto {
    
    private Long jobId;
    private String status; // PENDING, RUNNING, COMPLETED, FAILED
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    public JobStatusDto() {}
    
    public JobStatusDto(Long jobId) {
        this.jobId = jobId;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
