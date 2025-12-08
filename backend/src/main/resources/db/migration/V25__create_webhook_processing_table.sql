-- Migration: Create webhook_processing table for idempotency and audit logging
-- Created: 2025-12-06

CREATE TABLE IF NOT EXISTS webhook_processing (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    webhook_id VARCHAR(255) UNIQUE NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    gateway VARCHAR(50) NOT NULL DEFAULT 'ZENOPAY',
    transaction_id VARCHAR(255),
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processing_result TEXT,
    error_message TEXT,
    ip_address VARCHAR(50),
    webhook_payload TEXT,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retry_count INT DEFAULT 0,
    INDEX idx_webhook_id (webhook_id),
    INDEX idx_order_id (order_id),
    INDEX idx_processed_at (processed_at),
    INDEX idx_gateway (gateway)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


