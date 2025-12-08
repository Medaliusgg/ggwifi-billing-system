-- Migration: Create sms_marketing_campaigns table
-- Description: Stores SMS marketing campaigns separate from media campaigns
-- Date: 2025-12-08

CREATE TABLE IF NOT EXISTS sms_marketing_campaigns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    channel VARCHAR(20) NOT NULL DEFAULT 'SMS',
    message_template TEXT,
    template_id VARCHAR(50),
    subject VARCHAR(200),
    schedule_at DATETIME,
    target_filters JSON,
    segment_id VARCHAR(50),
    auto_repeat BOOLEAN DEFAULT FALSE,
    repeat_interval_days INT,
    include_hotspot_customers BOOLEAN DEFAULT TRUE,
    include_pppoe_customers BOOLEAN DEFAULT FALSE,
    loyalty_point_threshold INT,
    inactivity_days_threshold INT,
    last_executed_at DATETIME,
    total_sent BIGINT DEFAULT 0,
    total_failed BIGINT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_status (status),
    INDEX idx_campaign_type (campaign_type),
    INDEX idx_schedule_at (schedule_at),
    INDEX idx_segment_id (segment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments
ALTER TABLE sms_marketing_campaigns 
    MODIFY COLUMN campaign_type VARCHAR(50) 
    COMMENT 'SMS_BROADCAST, SMS_AUTOMATION, SCHEDULED_PROMOTION';

ALTER TABLE sms_marketing_campaigns 
    MODIFY COLUMN status VARCHAR(20) 
    COMMENT 'DRAFT, SCHEDULED, RUNNING, COMPLETED, PAUSED, CANCELLED';

