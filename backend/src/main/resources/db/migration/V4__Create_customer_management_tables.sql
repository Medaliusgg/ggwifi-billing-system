-- Create customer management tables for GGNetworks backend
-- This migration creates tables for comprehensive customer tracking and management

-- Customer Profiles table (Central customer management)
CREATE TABLE customer_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    email VARCHAR(255),
    customer_type ENUM('HOTSPOT_USER', 'PPPOE_USER', 'BOTH') NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity_date TIMESTAMP NULL,
    total_sessions BIGINT DEFAULT 0,
    total_data_usage_mb BIGINT DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    loyalty_points INT DEFAULT 0,
    loyalty_tier ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND') NOT NULL DEFAULT 'BRONZE',
    referral_code VARCHAR(20) UNIQUE,
    referred_by VARCHAR(15),
    birthday TIMESTAMP NULL,
    marketing_consent BOOLEAN DEFAULT FALSE,
    sms_consent BOOLEAN DEFAULT FALSE,
    email_consent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_phone_number (phone_number),
    INDEX idx_customer_type (customer_type),
    INDEX idx_status (status),
    INDEX idx_loyalty_tier (loyalty_tier),
    INDEX idx_registration_date (registration_date),
    INDEX idx_last_activity_date (last_activity_date)
);

-- Device History table (MAC address tracking)
CREATE TABLE device_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_profile_id BIGINT NOT NULL,
    mac_address VARCHAR(17) NOT NULL,
    ip_address VARCHAR(45),
    device_name VARCHAR(255),
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    ap_name VARCHAR(255),
    location VARCHAR(255),
    device_type ENUM('MOBILE_PHONE', 'TABLET', 'LAPTOP', 'DESKTOP', 'SMART_TV', 'GAMING_CONSOLE', 'IOT_DEVICE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPICIOUS', 'BANNED', 'WHITELISTED') NOT NULL DEFAULT 'ACTIVE',
    first_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_sessions BIGINT DEFAULT 0,
    total_data_usage_mb BIGINT DEFAULT 0,
    is_mac_randomized BOOLEAN DEFAULT FALSE,
    randomization_count INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id),
    INDEX idx_customer_profile_id (customer_profile_id),
    INDEX idx_mac_address (mac_address),
    INDEX idx_device_type (device_type),
    INDEX idx_status (status),
    INDEX idx_is_mac_randomized (is_mac_randomized),
    INDEX idx_last_seen (last_seen),
    UNIQUE KEY uk_customer_mac (customer_profile_id, mac_address)
);

-- Marketing Communications table
CREATE TABLE marketing_communications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_profile_id BIGINT NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    communication_type ENUM('WELCOME_MESSAGE', 'BIRTHDAY_GREETING', 'LOYALTY_REWARD', 'PROMOTIONAL_OFFER', 'SERVICE_REMINDER', 'PAYMENT_REMINDER', 'WINBACK_CAMPAIGN', 'REFERRAL_INCENTIVE', 'NEW_SERVICE_ANNOUNCEMENT', 'MAINTENANCE_NOTICE', 'CUSTOM_MESSAGE') NOT NULL,
    channel ENUM('SMS', 'EMAIL', 'WHATSAPP', 'PUSH_NOTIFICATION', 'IN_APP_MESSAGE') NOT NULL,
    subject VARCHAR(255),
    message_content TEXT,
    template_id VARCHAR(100),
    status ENUM('PENDING', 'SENDING', 'SENT', 'DELIVERED', 'READ', 'CLICKED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    scheduled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    delivery_status VARCHAR(100),
    error_message TEXT,
    cost DECIMAL(10,4) DEFAULT 0.0000,
    campaign_id VARCHAR(100),
    customer_type ENUM('HOTSPOT_USER', 'PPPOE_USER', 'BOTH'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id),
    INDEX idx_customer_profile_id (customer_profile_id),
    INDEX idx_phone_number (phone_number),
    INDEX idx_communication_type (communication_type),
    INDEX idx_channel (channel),
    INDEX idx_status (status),
    INDEX idx_scheduled_at (scheduled_at),
    INDEX idx_customer_type (customer_type)
);

-- Update existing tables to link with customer profiles

-- Update users table to link with customer profiles
ALTER TABLE users ADD COLUMN customer_profile_id BIGINT NULL;
ALTER TABLE users ADD FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id);
ALTER TABLE users ADD INDEX idx_customer_profile_id (customer_profile_id);

-- Update hotspot_sessions table to link with customer profiles
ALTER TABLE hotspot_sessions ADD COLUMN customer_profile_id BIGINT NULL;
ALTER TABLE hotspot_sessions ADD FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id);
ALTER TABLE hotspot_sessions ADD INDEX idx_customer_profile_id (customer_profile_id);

-- Update payments table to link with customer profiles
ALTER TABLE payments ADD COLUMN customer_profile_id BIGINT NULL;
ALTER TABLE payments ADD FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id);
ALTER TABLE payments ADD INDEX idx_customer_profile_id (customer_profile_id);

-- Update internet_application_forms table to link with customer profiles
ALTER TABLE internet_application_forms ADD COLUMN customer_profile_id BIGINT NULL;
ALTER TABLE internet_application_forms ADD FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id);
ALTER TABLE internet_application_forms ADD INDEX idx_customer_profile_id (customer_profile_id);

-- Update hotspot_vouchers table to link with customer profiles
ALTER TABLE hotspot_vouchers ADD COLUMN customer_profile_id BIGINT NULL;
ALTER TABLE hotspot_vouchers ADD FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id);
ALTER TABLE hotspot_vouchers ADD INDEX idx_customer_profile_id (customer_profile_id);

-- Create indexes for better performance
CREATE INDEX idx_customer_phone_normalized ON customer_profiles(phone_number);
CREATE INDEX idx_device_mac_customer ON device_history(customer_profile_id, mac_address);
CREATE INDEX idx_marketing_phone_type ON marketing_communications(phone_number, customer_type);
CREATE INDEX idx_customer_activity ON customer_profiles(last_activity_date, status);
CREATE INDEX idx_device_suspicious ON device_history(is_mac_randomized, status);

-- Insert sample customer profiles for existing data
INSERT INTO customer_profiles (phone_number, full_name, customer_type, status, registration_date, last_activity_date)
SELECT DISTINCT 
    u.phone_number,
    u.full_name,
    CASE 
        WHEN u.role = 'HOTSPOT_USER' THEN 'HOTSPOT_USER'
        WHEN u.role = 'PPPOE_USER' THEN 'PPPOE_USER'
        ELSE 'HOTSPOT_USER'
    END as customer_type,
    CASE 
        WHEN u.status = 'ACTIVE' THEN 'ACTIVE'
        ELSE 'INACTIVE'
    END as status,
    u.created_at,
    u.updated_at
FROM users u
WHERE u.deleted_at IS NULL;

-- Update existing records to link with customer profiles
UPDATE users u 
JOIN customer_profiles cp ON u.phone_number = cp.phone_number 
SET u.customer_profile_id = cp.id 
WHERE u.deleted_at IS NULL;

UPDATE hotspot_sessions hs 
JOIN hotspot_vouchers hv ON hs.voucher_id = hv.id 
JOIN customer_profiles cp ON hv.assigned_to = cp.phone_number 
SET hs.customer_profile_id = cp.id 
WHERE hs.deleted_at IS NULL;

UPDATE payments p 
JOIN users u ON p.user_id = u.id 
JOIN customer_profiles cp ON u.phone_number = cp.phone_number 
SET p.customer_profile_id = cp.id 
WHERE p.deleted_at IS NULL;

UPDATE internet_application_forms iaf 
JOIN users u ON iaf.user_id = u.id 
JOIN customer_profiles cp ON u.phone_number = cp.phone_number 
SET iaf.customer_profile_id = cp.id 
WHERE iaf.deleted_at IS NULL;

UPDATE hotspot_vouchers hv 
JOIN customer_profiles cp ON hv.assigned_to = cp.phone_number 
SET hv.customer_profile_id = cp.id 
WHERE hv.deleted_at IS NULL; 