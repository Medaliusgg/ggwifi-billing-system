package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "webhook_receipts", indexes = {
        @Index(name = "idx_webhook_receipts_dedupe", columnList = "dedupe_key", unique = true)
})
public class WebhookReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider", nullable = false, length = 64)
    private String provider;

    @Column(name = "endpoint", nullable = false, length = 128)
    private String endpoint;

    @Column(name = "dedupe_key", nullable = false, length = 256, unique = true)
    private String dedupeKey;

    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload;

    @Column(name = "received_at", nullable = false)
    private LocalDateTime receivedAt;
}


