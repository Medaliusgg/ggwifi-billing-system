package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "internet_application_forms")
public class InternetApplicationForm extends BaseEntity {

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Location is required")
    @Column(name = "location", nullable = false)
    private String location;

    @NotBlank(message = "Address is required")
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private Package packageEntity;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "survey_date")
    private LocalDateTime surveyDate;

    @Column(name = "installation_date")
    private LocalDateTime installationDate;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    public enum ServiceType {
        PPPOE, HOTSPOT
    }

    public enum ApplicationStatus {
        SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, 
        SURVEY_SCHEDULED, SURVEY_COMPLETED, 
        INSTALLATION_SCHEDULED, INSTALLATION_COMPLETED
    }

    public boolean isSubmitted() {
        return status == ApplicationStatus.SUBMITTED;
    }

    public boolean isUnderReview() {
        return status == ApplicationStatus.UNDER_REVIEW;
    }

    public boolean isApproved() {
        return status == ApplicationStatus.APPROVED;
    }

    public boolean isRejected() {
        return status == ApplicationStatus.REJECTED;
    }

    public boolean isCompleted() {
        return status == ApplicationStatus.INSTALLATION_COMPLETED;
    }

    public void approve() {
        this.status = ApplicationStatus.APPROVED;
    }

    public void reject() {
        this.status = ApplicationStatus.REJECTED;
    }

    public void scheduleSurvey(LocalDateTime surveyDate) {
        this.status = ApplicationStatus.SURVEY_SCHEDULED;
        this.surveyDate = surveyDate;
    }

    public void completeSurvey(BigDecimal estimatedCost) {
        this.status = ApplicationStatus.SURVEY_COMPLETED;
        this.estimatedCost = estimatedCost;
    }

    public void scheduleInstallation(LocalDateTime installationDate) {
        this.status = ApplicationStatus.INSTALLATION_SCHEDULED;
        this.installationDate = installationDate;
    }

    public void completeInstallation() {
        this.status = ApplicationStatus.INSTALLATION_COMPLETED;
    }
} 