-- Admin Reset SQL - Use with root access
-- Run: mysql -u root -p ggnetworks_radius < RESET_WITH_ROOT.sql

-- Delete all existing admin and super_admin users
DELETE FROM users WHERE role IN ('ADMIN', 'SUPER_ADMIN');

-- Create new admin user
INSERT INTO users (
    username,
    phone_number,
    password,
    first_name,
    last_name,
    email,
    role,
    status,
    is_active,
    is_email_verified,
    is_phone_verified,
    created_at,
    updated_at
) VALUES (
    'medalius',
    '0742844024',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'Medalius',
    'Administrator',
    'medalius@ggwifi.co.tz',
    'SUPER_ADMIN',
    'ACTIVE',
    1,
    1,
    1,
    NOW(),
    NOW()
);

-- Verify
SELECT username, phone_number, role, status, is_active 
FROM users 
WHERE username = 'medalius';




