package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity to track webhook processing for idempotency
 * Prevents duplicate processing of the same webhook
 */
@Entity
@Table(name = "webhook_processing", indexes = {
    @Index(name = "idx_webhook_id", columnList = "webhook_id", unique = true),
    @Index(name = "idx_order_id", columnList = "order_id"),
    @Index(name = "idx_processed_at", columnList = "processed_at")
})
public class WebhookProcessing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "webhook_id", unique = true, nullable = false, length = 255)
    private String webhookId;

    @Column(name = "order_id", nullable = false, length = 255)
    private String orderId;

    @Column(name = "payment_status", nullable = false, length = 50)
    private String paymentStatus;

    @Column(name = "gateway", nullable = false, length = 50)
    private String gateway; // ZENOPAY, etc.

    @Column(name = "transaction_id", length = 255)
    private String transactionId;

    @Column(name = "processed", nullable = false)
    private Boolean processed = false;

    @Column(name = "processing_result", columnDefinition = "TEXT")
    private String processingResult; // SUCCESS, FAILED, ERROR

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "webhook_payload", columnDefinition = "TEXT")
    private String webhookPayload; // Store original payload for audit

    @CreationTimestamp
    @Column(name = "processed_at", nullable = false, updatable = false)
    private LocalDateTime processedAt;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    // Constructors
    public WebhookProcessing() {}

    public WebhookProcessing(String webhookId, String orderId, String paymentStatus, String gateway) {
        this.webhookId = webhookId;
        this.orderId = orderId;
        this.paymentStatus = paymentStatus;
        this.gateway = gateway;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWebhookId() { return webhookId; }
    public void setWebhookId(String webhookId) { this.webhookId = webhookId; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getGateway() { return gateway; }
    public void setGateway(String gateway) { this.gateway = gateway; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Boolean getProcessed() { return processed; }
    public void setProcessed(Boolean processed) { this.processed = processed; }

    public String getProcessingResult() { return processingResult; }
    public void setProcessingResult(String processingResult) { this.processingResult = processingResult; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getWebhookPayload() { return webhookPayload; }
    public void setWebhookPayload(String webhookPayload) { this.webhookPayload = webhookPayload; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }

    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }
}

