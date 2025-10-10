-- Create enhanced loyalty system for GGNetworks backend
-- This migration enhances the loyalty program with high-value customer tracking

-- Update loyalty_programs table with enhanced features
ALTER TABLE loyalty_programs 
ADD COLUMN program_name VARCHAR(255) NOT NULL DEFAULT 'GGNetworks Loyalty Program' AFTER id,
ADD COLUMN program_type ENUM('POINTS_BASED', 'TIER_BASED', 'CASHBACK', 'HYBRID') NOT NULL DEFAULT 'POINTS_BASED' AFTER description,
ADD COLUMN minimum_spend_threshold DECIMAL(10,2) DEFAULT 0.00 AFTER points_per_currency,
ADD COLUMN bonus_multiplier DECIMAL(5,2) DEFAULT 1.00 AFTER minimum_spend_threshold,
ADD COLUMN expiry_days INT DEFAULT 365 AFTER bonus_multiplier,
ADD COLUMN max_points_per_transaction INT NULL AFTER expiry_days,
ADD COLUMN daily_points_limit INT NULL AFTER max_points_per_transaction,
ADD COLUMN monthly_points_limit INT NULL AFTER daily_points_limit,
ADD COLUMN special_offers_enabled BOOLEAN DEFAULT FALSE AFTER monthly_points_limit,
ADD COLUMN priority_support_enabled BOOLEAN DEFAULT FALSE AFTER special_offers_enabled,
ADD COLUMN exclusive_packages_enabled BOOLEAN DEFAULT FALSE AFTER priority_support_enabled,
ADD COLUMN birthday_bonus_multiplier DECIMAL(5,2) DEFAULT 2.00 AFTER exclusive_packages_enabled,
ADD COLUMN referral_bonus_points INT DEFAULT 100 AFTER birthday_bonus_multiplier,
ADD COLUMN anniversary_bonus_points INT DEFAULT 500 AFTER referral_bonus_points,
ADD COLUMN retention_threshold_days INT DEFAULT 30 AFTER anniversary_bonus_points,
ADD COLUMN high_value_threshold DECIMAL(10,2) DEFAULT 100000.00 AFTER retention_threshold_days,
ADD COLUMN vip_threshold DECIMAL(10,2) DEFAULT 500000.00 AFTER high_value_threshold,
ADD COLUMN platinum_threshold DECIMAL(10,2) DEFAULT 1000000.00 AFTER vip_threshold;

-- Update target_service enum values
ALTER TABLE loyalty_programs 
MODIFY COLUMN target_service ENUM('HOTSPOT_ONLY', 'PPPOE_ONLY', 'BOTH_SERVICES', 'ALL_CUSTOMERS') NOT NULL DEFAULT 'ALL_CUSTOMERS';

-- Update customer_loyalty table with enhanced tracking
ALTER TABLE customer_loyalty 
ADD COLUMN phone_number VARCHAR(15) NOT NULL AFTER customer_profile_id,
ADD COLUMN current_points INT DEFAULT 0 AFTER tier_level,
ADD COLUMN total_points_earned INT DEFAULT 0 AFTER current_points,
ADD COLUMN total_points_redeemed INT DEFAULT 0 AFTER total_points_earned,
ADD COLUMN total_points_expired INT DEFAULT 0 AFTER total_points_redeemed,
ADD COLUMN lifetime_spend DECIMAL(15,2) DEFAULT 0.00 AFTER total_points_expired,
ADD COLUMN monthly_spend DECIMAL(15,2) DEFAULT 0.00 AFTER lifetime_spend,
ADD COLUMN average_transaction_value DECIMAL(10,2) DEFAULT 0.00 AFTER monthly_spend,
ADD COLUMN total_transactions INT DEFAULT 0 AFTER average_transaction_value,
ADD COLUMN consecutive_months_active INT DEFAULT 0 AFTER total_transactions,
ADD COLUMN last_transaction_date TIMESTAMP NULL AFTER consecutive_months_active,
ADD COLUMN first_transaction_date TIMESTAMP NULL AFTER last_transaction_date,
ADD COLUMN membership_start_date TIMESTAMP NULL AFTER first_transaction_date,
ADD COLUMN membership_end_date TIMESTAMP NULL AFTER membership_start_date,
ADD COLUMN is_vip_customer BOOLEAN DEFAULT FALSE AFTER membership_end_date,
ADD COLUMN is_high_value_customer BOOLEAN DEFAULT FALSE AFTER is_vip_customer,
ADD COLUMN is_platinum_member BOOLEAN DEFAULT FALSE AFTER is_high_value_customer,
ADD COLUMN retention_score DECIMAL(5,2) DEFAULT 0.00 AFTER is_platinum_member,
ADD COLUMN engagement_score DECIMAL(5,2) DEFAULT 0.00 AFTER retention_score,
ADD COLUMN lifetime_value_score DECIMAL(5,2) DEFAULT 0.00 AFTER engagement_score,
ADD COLUMN special_offers_count INT DEFAULT 0 AFTER lifetime_value_score,
ADD COLUMN referrals_count INT DEFAULT 0 AFTER special_offers_count,
ADD COLUMN referral_earnings DECIMAL(10,2) DEFAULT 0.00 AFTER referrals_count,
ADD COLUMN birthday_bonus_claimed BOOLEAN DEFAULT FALSE AFTER referral_earnings,
ADD COLUMN anniversary_bonus_claimed BOOLEAN DEFAULT FALSE AFTER birthday_bonus_claimed,
ADD COLUMN welcome_bonus_claimed BOOLEAN DEFAULT FALSE AFTER anniversary_bonus_claimed,
ADD COLUMN priority_support_enabled BOOLEAN DEFAULT FALSE AFTER welcome_bonus_claimed,
ADD COLUMN exclusive_packages_enabled BOOLEAN DEFAULT FALSE AFTER priority_support_enabled,
ADD COLUMN custom_discount_percentage DECIMAL(5,2) DEFAULT 0.00 AFTER exclusive_packages_enabled,
ADD COLUMN notes TEXT AFTER custom_discount_percentage;

-- Update tier_level enum with enhanced tiers
ALTER TABLE customer_loyalty 
MODIFY COLUMN tier_level ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'VIP', 'ELITE') NOT NULL DEFAULT 'BRONZE';

-- Create indexes for better performance
CREATE INDEX idx_customer_loyalty_phone ON customer_loyalty(phone_number);
CREATE INDEX idx_customer_loyalty_tier ON customer_loyalty(tier_level);
CREATE INDEX idx_customer_loyalty_lifetime_spend ON customer_loyalty(lifetime_spend);
CREATE INDEX idx_customer_loyalty_vip ON customer_loyalty(is_vip_customer);
CREATE INDEX idx_customer_loyalty_high_value ON customer_loyalty(is_high_value_customer);
CREATE INDEX idx_customer_loyalty_platinum ON customer_loyalty(is_platinum_member);
CREATE INDEX idx_customer_loyalty_retention ON customer_loyalty(retention_score);
CREATE INDEX idx_customer_loyalty_engagement ON customer_loyalty(engagement_score);
CREATE INDEX idx_customer_loyalty_last_transaction ON customer_loyalty(last_transaction_date);

-- Create composite indexes for common queries
CREATE INDEX idx_customer_loyalty_phone_tier ON customer_loyalty(phone_number, tier_level);
CREATE INDEX idx_customer_loyalty_spend_tier ON customer_loyalty(lifetime_spend, tier_level);
CREATE INDEX idx_customer_loyalty_activity_score ON customer_loyalty(last_transaction_date, retention_score);

-- Insert default loyalty program if not exists
INSERT INTO loyalty_programs (
    program_name, 
    description, 
    program_type, 
    target_service, 
    points_per_currency, 
    is_active, 
    start_date,
    high_value_threshold,
    vip_threshold,
    platinum_threshold
) VALUES (
    'GGNetworks Loyalty Program',
    'Comprehensive loyalty program for both Hotspot and PPPoE customers with tier-based rewards',
    'TIER_BASED',
    'ALL_CUSTOMERS',
    1.00,
    TRUE,
    NOW(),
    100000.00,
    500000.00,
    1000000.00
) ON DUPLICATE KEY UPDATE 
    program_name = VALUES(program_name),
    description = VALUES(description),
    program_type = VALUES(program_type),
    target_service = VALUES(target_service);

-- Create customer loyalty records for existing customers
INSERT INTO customer_loyalty (
    customer_profile_id,
    loyalty_program_id,
    phone_number,
    tier_level,
    current_points,
    total_points_earned,
    lifetime_spend,
    total_transactions,
    membership_start_date,
    first_transaction_date,
    last_transaction_date,
    retention_score,
    engagement_score,
    lifetime_value_score
)
SELECT 
    cp.id as customer_profile_id,
    lp.id as loyalty_program_id,
    cp.phone_number,
    CASE 
        WHEN COALESCE(SUM(p.amount), 0) >= 1000000 THEN 'PLATINUM'
        WHEN COALESCE(SUM(p.amount), 0) >= 500000 THEN 'VIP'
        WHEN COALESCE(SUM(p.amount), 0) >= 100000 THEN 'GOLD'
        WHEN COALESCE(SUM(p.amount), 0) >= 50000 THEN 'SILVER'
        ELSE 'BRONZE'
    END as tier_level,
    COALESCE(SUM(p.amount) / 100, 0) as current_points,
    COALESCE(SUM(p.amount) / 100, 0) as total_points_earned,
    COALESCE(SUM(p.amount), 0) as lifetime_spend,
    COUNT(p.id) as total_transactions,
    cp.registration_date as membership_start_date,
    MIN(p.created_at) as first_transaction_date,
    MAX(p.created_at) as last_transaction_date,
    CASE 
        WHEN DATEDIFF(NOW(), MAX(p.created_at)) <= 7 THEN 1.0
        WHEN DATEDIFF(NOW(), MAX(p.created_at)) <= 30 THEN 0.8
        WHEN DATEDIFF(NOW(), MAX(p.created_at)) <= 90 THEN 0.6
        WHEN DATEDIFF(NOW(), MAX(p.created_at)) <= 180 THEN 0.4
        ELSE 0.2
    END as retention_score,
    CASE 
        WHEN COUNT(p.id) / GREATEST(DATEDIFF(NOW(), MIN(p.created_at)), 1) >= 0.1 THEN 1.0
        WHEN COUNT(p.id) / GREATEST(DATEDIFF(NOW(), MIN(p.created_at)), 1) >= 0.05 THEN 0.8
        WHEN COUNT(p.id) / GREATEST(DATEDIFF(NOW(), MIN(p.created_at)), 1) >= 0.02 THEN 0.6
        ELSE 0.4
    END as engagement_score,
    CASE 
        WHEN COALESCE(SUM(p.amount), 0) >= 1000000 THEN 1.0
        WHEN COALESCE(SUM(p.amount), 0) >= 500000 THEN 0.9
        WHEN COALESCE(SUM(p.amount), 0) >= 100000 THEN 0.7
        WHEN COALESCE(SUM(p.amount), 0) >= 50000 THEN 0.5
        ELSE 0.3
    END as lifetime_value_score
FROM customer_profiles cp
LEFT JOIN loyalty_programs lp ON lp.is_active = TRUE
LEFT JOIN payments p ON p.customer_profile_id = cp.id AND p.deleted_at IS NULL
WHERE cp.deleted_at IS NULL
GROUP BY cp.id, cp.phone_number, cp.registration_date
ON DUPLICATE KEY UPDATE 
    tier_level = VALUES(tier_level),
    current_points = VALUES(current_points),
    total_points_earned = VALUES(total_points_earned),
    lifetime_spend = VALUES(lifetime_spend),
    total_transactions = VALUES(total_transactions),
    retention_score = VALUES(retention_score),
    engagement_score = VALUES(engagement_score),
    lifetime_value_score = VALUES(lifetime_value_score);

-- Update customer status flags based on spending
UPDATE customer_loyalty 
SET 
    is_high_value_customer = (lifetime_spend >= 100000.00),
    is_vip_customer = (lifetime_spend >= 500000.00),
    is_platinum_member = (lifetime_spend >= 1000000.00),
    priority_support_enabled = (tier_level IN ('GOLD', 'PLATINUM', 'DIAMOND', 'VIP', 'ELITE')),
    exclusive_packages_enabled = (tier_level IN ('PLATINUM', 'DIAMOND', 'VIP', 'ELITE')),
    custom_discount_percentage = CASE 
        WHEN tier_level = 'ELITE' THEN 30.0
        WHEN tier_level = 'VIP' THEN 25.0
        WHEN tier_level = 'DIAMOND' THEN 20.0
        WHEN tier_level = 'PLATINUM' THEN 15.0
        WHEN tier_level = 'GOLD' THEN 10.0
        WHEN tier_level = 'SILVER' THEN 5.0
        ELSE 0.0
    END;

-- Create view for high-value customer analysis
CREATE VIEW high_value_customers_view AS
SELECT 
    cl.phone_number,
    cp.full_name,
    cl.tier_level,
    cl.lifetime_spend,
    cl.current_points,
    cl.total_transactions,
    cl.average_transaction_value,
    cl.retention_score,
    cl.engagement_score,
    cl.lifetime_value_score,
    cl.is_vip_customer,
    cl.is_high_value_customer,
    cl.is_platinum_member,
    cp.customer_type,
    cp.registration_date,
    cl.last_transaction_date
FROM customer_loyalty cl
JOIN customer_profiles cp ON cl.customer_profile_id = cp.id
WHERE cl.deleted_at IS NULL 
  AND cp.deleted_at IS NULL
  AND cl.lifetime_spend >= 100000.00;

-- Create view for VIP customer analysis
CREATE VIEW vip_customers_view AS
SELECT 
    cl.phone_number,
    cp.full_name,
    cl.tier_level,
    cl.lifetime_spend,
    cl.current_points,
    cl.total_transactions,
    cl.average_transaction_value,
    cl.retention_score,
    cl.engagement_score,
    cl.lifetime_value_score,
    cp.customer_type,
    cp.registration_date,
    cl.last_transaction_date
FROM customer_loyalty cl
JOIN customer_profiles cp ON cl.customer_profile_id = cp.id
WHERE cl.deleted_at IS NULL 
  AND cp.deleted_at IS NULL
  AND cl.lifetime_spend >= 500000.00
ORDER BY cl.lifetime_spend DESC;

-- Create view for tier distribution analysis
CREATE VIEW tier_distribution_view AS
SELECT 
    cl.tier_level,
    COUNT(*) as customer_count,
    AVG(cl.lifetime_spend) as avg_lifetime_spend,
    AVG(cl.current_points) as avg_current_points,
    AVG(cl.total_transactions) as avg_total_transactions,
    AVG(cl.retention_score) as avg_retention_score,
    AVG(cl.engagement_score) as avg_engagement_score,
    AVG(cl.lifetime_value_score) as avg_lifetime_value_score
FROM customer_loyalty cl
WHERE cl.deleted_at IS NULL
GROUP BY cl.tier_level
ORDER BY cl.tier_level;

-- Create stored procedure for loyalty statistics
DELIMITER //
CREATE PROCEDURE GetLoyaltyStatistics()
BEGIN
    SELECT 
        COUNT(*) as total_customers,
        SUM(CASE WHEN is_high_value_customer = TRUE THEN 1 ELSE 0 END) as high_value_customers,
        SUM(CASE WHEN is_vip_customer = TRUE THEN 1 ELSE 0 END) as vip_customers,
        SUM(CASE WHEN is_platinum_member = TRUE THEN 1 ELSE 0 END) as platinum_members,
        SUM(total_points_earned) as total_points_awarded,
        AVG(lifetime_spend) as avg_lifetime_spend,
        SUM(lifetime_spend) as total_lifetime_spend
    FROM customer_loyalty 
    WHERE deleted_at IS NULL;
END //
DELIMITER ;

-- Create stored procedure for tier upgrade check
DELIMITER //
CREATE PROCEDURE CheckTierUpgrade(IN customer_phone VARCHAR(15))
BEGIN
    DECLARE current_tier VARCHAR(20);
    DECLARE current_points INT;
    DECLARE new_tier VARCHAR(20);
    
    SELECT tier_level, current_points 
    INTO current_tier, current_points
    FROM customer_loyalty 
    WHERE phone_number = customer_phone AND deleted_at IS NULL;
    
    SET new_tier = CASE 
        WHEN current_points >= 100000 THEN 'ELITE'
        WHEN current_points >= 50000 THEN 'VIP'
        WHEN current_points >= 25000 THEN 'DIAMOND'
        WHEN current_points >= 10000 THEN 'PLATINUM'
        WHEN current_points >= 5000 THEN 'GOLD'
        WHEN current_points >= 1000 THEN 'SILVER'
        ELSE 'BRONZE'
    END;
    
    IF new_tier != current_tier THEN
        UPDATE customer_loyalty 
        SET tier_level = new_tier 
        WHERE phone_number = customer_phone AND deleted_at IS NULL;
        
        SELECT 'UPGRADED' as status, current_tier as old_tier, new_tier as new_tier;
    ELSE
        SELECT 'NO_CHANGE' as status, current_tier as current_tier, current_tier as current_tier;
    END IF;
END //
DELIMITER ; 