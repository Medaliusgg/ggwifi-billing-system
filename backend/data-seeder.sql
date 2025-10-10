-- GGWIFI Data Seeder
-- This script creates the initial admin user and sample data

-- Create database if not exists (this should be done separately)
-- CREATE DATABASE IF NOT EXISTS ggwifi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE ggwifi;

-- Insert admin user
INSERT INTO users (
    id, 
    full_name, 
    phone_number, 
    email, 
    password_hash, 
    role, 
    is_active, 
    is_verified, 
    created_at, 
    updated_at
) VALUES (
    1,
    'GGWIFI Admin',
    '0773404760',
    'admin@ggwifi.co.tz',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: Ashruha@123%
    'ADMIN',
    true,
    true,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    email = VALUES(email),
    password_hash = VALUES(password_hash),
    role = VALUES(role),
    is_active = VALUES(is_active),
    is_verified = VALUES(is_verified),
    updated_at = NOW();

-- Insert sample locations
INSERT INTO locations (
    id,
    name,
    address,
    city,
    country,
    latitude,
    longitude,
    is_active,
    created_at,
    updated_at
) VALUES 
(1, 'Main Office', 'Dar es Salaam, Tanzania', 'Dar es Salaam', 'Tanzania', -6.7924, 39.2083, true, NOW(), NOW()),
(2, 'Branch Office', 'Arusha, Tanzania', 'Arusha', 'Tanzania', -3.3869, 36.6830, true, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    address = VALUES(address),
    city = VALUES(city),
    country = VALUES(country),
    latitude = VALUES(latitude),
    longitude = VALUES(longitude),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- Insert sample internet packages
INSERT INTO packages (
    id,
    name,
    description,
    price,
    duration_days,
    data_limit_gb,
    speed_mbps,
    type,
    is_active,
    created_at,
    updated_at
) VALUES 
(1, 'Basic Plan', 'Basic internet package for light usage', 25000, 30, 10, 5, 'HOTSPOT', true, NOW(), NOW()),
(2, 'Standard Plan', 'Standard internet package for regular usage', 45000, 30, 25, 10, 'HOTSPOT', true, NOW(), NOW()),
(3, 'Premium Plan', 'Premium internet package for heavy usage', 75000, 30, 50, 20, 'HOTSPOT', true, NOW(), NOW()),
(4, 'Unlimited Plan', 'Unlimited internet package', 100000, 30, -1, 50, 'HOTSPOT', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    duration_days = VALUES(duration_days),
    data_limit_gb = VALUES(data_limit_gb),
    speed_mbps = VALUES(speed_mbps),
    type = VALUES(type),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- Insert sample routers
INSERT INTO routers (
    id,
    name,
    ip_address,
    mac_address,
    model,
    firmware_version,
    location_id,
    is_online,
    is_active,
    created_at,
    updated_at
) VALUES 
(1, 'Main Router', '192.168.1.1', '00:11:22:33:44:55', 'MikroTik RB750', '7.12.1', 1, true, true, NOW(), NOW()),
(2, 'Branch Router', '192.168.2.1', '00:11:22:33:44:66', 'MikroTik RB4011', '7.12.1', 2, true, true, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    ip_address = VALUES(ip_address),
    mac_address = VALUES(mac_address),
    model = VALUES(model),
    firmware_version = VALUES(firmware_version),
    location_id = VALUES(location_id),
    is_online = VALUES(is_online),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- Insert sample customers
INSERT INTO customer_profiles (
    id,
    full_name,
    phone_number,
    email,
    user_type,
    is_active,
    created_at,
    updated_at
) VALUES 
(1, 'John Doe', '+255123456789', 'john.doe@example.com', 'HOTSPOT_USER', true, NOW(), NOW()),
(2, 'Jane Smith', '+255987654321', 'jane.smith@example.com', 'PPPOE_USER', true, NOW(), NOW()),
(3, 'Ahmed Hassan', '+255111222333', 'ahmed.hassan@example.com', 'HOTSPOT_USER', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    phone_number = VALUES(phone_number),
    email = VALUES(email),
    user_type = VALUES(user_type),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- Insert sample vouchers
INSERT INTO hotspot_vouchers (
    id,
    code,
    password,
    package_id,
    price,
    duration_hours,
    is_used,
    is_active,
    expires_at,
    created_at,
    updated_at
) VALUES 
(1, 'VOUCHER001', 'PASS001', 1, 25000, 720, false, true, DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
(2, 'VOUCHER002', 'PASS002', 2, 45000, 720, false, true, DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
(3, 'VOUCHER003', 'PASS003', 3, 75000, 720, false, true, DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW())
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    package_id = VALUES(package_id),
    price = VALUES(price),
    duration_hours = VALUES(duration_hours),
    is_used = VALUES(is_used),
    is_active = VALUES(is_active),
    expires_at = VALUES(expires_at),
    updated_at = NOW();

-- Insert sample payments
INSERT INTO payments (
    id,
    customer_id,
    package_id,
    amount,
    currency,
    payment_method,
    transaction_id,
    status,
    created_at,
    updated_at
) VALUES 
(1, 1, 1, 25000, 'TZS', 'MOBILE_MONEY', 'TXN001', 'COMPLETED', NOW(), NOW()),
(2, 2, 2, 45000, 'TZS', 'BANK_TRANSFER', 'TXN002', 'COMPLETED', NOW(), NOW()),
(3, 3, 3, 75000, 'TZS', 'CASH', 'TXN003', 'COMPLETED', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    amount = VALUES(amount),
    currency = VALUES(currency),
    payment_method = VALUES(payment_method),
    transaction_id = VALUES(transaction_id),
    status = VALUES(status),
    updated_at = NOW();

-- Insert sample audit logs
INSERT INTO audit_logs (
    id,
    user_id,
    action,
    entity_type,
    entity_id,
    details,
    ip_address,
    user_agent,
    created_at
) VALUES 
(1, 1, 'LOGIN', 'USER', 1, 'Admin user logged in', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
(2, 1, 'CREATE', 'PACKAGE', 1, 'Created new internet package', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
(3, 1, 'UPDATE', 'ROUTER', 1, 'Updated router configuration', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW())
ON DUPLICATE KEY UPDATE
    details = VALUES(details),
    ip_address = VALUES(ip_address),
    user_agent = VALUES(user_agent);

-- Display success message
SELECT 'GGWIFI Data Seeder completed successfully!' as message;
