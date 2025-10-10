-- Update package plans to new simplified structure
-- This migration replaces existing packages with the new 4-plan structure

-- First, deactivate all existing packages
UPDATE packages SET is_active = false, deleted_at = NOW() WHERE deleted_at IS NULL;

-- Insert new package plans
INSERT INTO packages (name, type, price, duration_days, bandwidth_limit_mb, description, is_popular, is_active) VALUES
-- Short Plan - 12 hours, 1000 TZS
('Short Plan', 'HOTSPOT', 1000.00, 0.5, NULL, '12 hours of high-speed internet access. Perfect for quick browsing and short-term needs.', false, true),

-- Daily Plan - 24 hours, 2000 TZS  
('Daily Plan', 'HOTSPOT', 2000.00, 1, NULL, '24 hours of unlimited high-speed internet access. Ideal for daily usage and extended browsing.', true, true),

-- Weekly Plan - 7 days, 6000 TZS
('Weekly Plan', 'HOTSPOT', 6000.00, 7, NULL, '7 days of unlimited high-speed internet access. Great value for weekly usage and multiple users.', false, true),

-- Monthly Plan - 30 days, 20000 TZS
('Monthly Plan', 'HOTSPOT', 20000.00, 30, NULL, '30 days of unlimited high-speed internet access. Best value for long-term usage and heavy internet users.', true, true);

-- Update any existing vouchers to use the new packages (optional)
-- This ensures existing vouchers continue to work with the new package structure 