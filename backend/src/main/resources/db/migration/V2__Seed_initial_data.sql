-- Seed initial data for GGNetworks backend
-- This migration populates the database with essential initial data

-- Insert admin user (password: Kolombo@123% - hashed with BCrypt)
INSERT INTO users (phone_number, password, first_name, last_name, role, status) 
VALUES ('0742844024', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'GGNetworks', 'Admin', 'ADMIN', 'ACTIVE');

-- Insert sample staff users with different credentials for testing
INSERT INTO users (phone_number, password, first_name, last_name, role, status, staff_id, username) VALUES
('0742844025', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'John', 'Technician', 'TECHNICIAN', 'ACTIVE', 'STF001', 'john.tech'),
('0742844026', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Sarah', 'Finance', 'FINANCE', 'ACTIVE', 'STF002', 'sarah.finance'),
('0742844027', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Mike', 'Marketing', 'MARKETING', 'ACTIVE', 'STF003', 'mike.marketing'),
('0742844030', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Hassan', 'Engineer', 'TECHNICIAN', 'ACTIVE', 'STF004', 'hassan.engineer'),
('0742844031', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Aisha', 'Accountant', 'FINANCE', 'ACTIVE', 'STF005', 'aisha.accountant'),
('0742844032', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Omar', 'Sales Rep', 'SALES', 'ACTIVE', 'STF006', 'omar.sales');

-- Insert admin users with different credentials for testing
INSERT INTO users (phone_number, password, first_name, last_name, role, status, username, email) VALUES
('0742844024', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'GGNetworks', 'Admin', 'ADMIN', 'ACTIVE', 'admin', 'admin@ggwifi.co.tz'),
('0742844001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'System', 'Administrator', 'ADMIN', 'ACTIVE', 'newadmin', 'newadmin@ggwifi.co.tz'),
('0742844028', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Ahmed', 'Manager', 'ADMIN', 'ACTIVE', 'ahmed.manager', 'ahmed@ggwifi.co.tz'),
('0742844029', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Fatma', 'Director', 'SUPER_ADMIN', 'ACTIVE', 'fatma.director', 'fatma@ggwifi.co.tz');

-- Insert sample packages for Hotspot
INSERT INTO packages (name, type, price, duration_days, bandwidth_limit_mb, description, is_popular, is_active) VALUES
('1 Hour - 100MB', 'HOTSPOT', 500.00, 1, 100, 'Quick internet access for 1 hour with 100MB data limit', false, true),
('2 Hours - 250MB', 'HOTSPOT', 1000.00, 1, 250, 'Extended internet access for 2 hours with 250MB data limit', true, true),
('4 Hours - 500MB', 'HOTSPOT', 1800.00, 1, 500, 'Half-day internet access with 500MB data limit', false, true),
('8 Hours - 1GB', 'HOTSPOT', 3000.00, 1, 1024, 'Full day internet access with 1GB data limit', true, true),
('24 Hours - 3GB', 'HOTSPOT', 5000.00, 1, 3072, '24-hour internet access with 3GB data limit', false, true);

-- Insert sample packages for PPPoE
INSERT INTO packages (name, type, price, duration_days, bandwidth_limit_mb, description, is_popular, is_active) VALUES
('Basic Plan - 5Mbps', 'PPPOE', 25000.00, 30, NULL, 'Basic internet plan with 5Mbps unlimited data', true, true),
('Standard Plan - 10Mbps', 'PPPOE', 45000.00, 30, NULL, 'Standard internet plan with 10Mbps unlimited data', true, true),
('Premium Plan - 20Mbps', 'PPPOE', 75000.00, 30, NULL, 'Premium internet plan with 20Mbps unlimited data', false, true),
('Business Plan - 50Mbps', 'PPPOE', 150000.00, 30, NULL, 'Business internet plan with 50Mbps unlimited data', false, true);

-- Insert sample promotions
INSERT INTO promotions (title, description, target_audience, start_date, end_date, is_active) VALUES
('Welcome to GGNetworks!', 'Get 50% off on your first PPPoE installation. Limited time offer for new customers.', 'PPPOE_USERS', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), true),
('Hotspot Bundle Deal', 'Buy 3 hotspot vouchers and get 1 free! Perfect for group usage.', 'HOTSPOT_USERS', NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), true),
('Business Package Promotion', 'Upgrade to Business Plan and get 2 months free installation fee.', 'PPPOE_USERS', NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author, tags, is_published, published_at) VALUES
('Welcome to GGNetworks - Your Trusted Internet Service Provider', 
'GGNetworks is proud to announce our launch as a leading internet service provider in Tanzania. We offer high-speed internet solutions for both residential and business customers through our innovative PPPoE and Hotspot services.

Our mission is to provide reliable, fast, and affordable internet connectivity to all Tanzanians. With our state-of-the-art infrastructure and dedicated support team, we ensure that our customers enjoy seamless internet experience.

Whether you need internet for your home, office, or public hotspot access, GGNetworks has the perfect solution for you. Our flexible packages cater to different needs and budgets, making quality internet accessible to everyone.

Stay connected with GGNetworks - where speed meets reliability!',
'Welcome to GGNetworks - Your Trusted Internet Service Provider in Tanzania',
'GGNetworks Team',
'launch,internet,service,tanzania',
true, NOW()),

('Understanding PPPoE vs Hotspot: Which Internet Service is Right for You?',
'When choosing an internet service, it''s important to understand the differences between PPPoE and Hotspot services. Both have their advantages and are designed for different use cases.

PPPoE (Point-to-Point Protocol over Ethernet) is ideal for:
- Residential and business users who need dedicated internet connection
- Users who require consistent, high-speed internet access
- Long-term internet solutions with unlimited data usage
- Users who want to connect multiple devices through a router

Hotspot services are perfect for:
- Temporary internet access needs
- Public places like cafes, hotels, and restaurants
- Users who need internet on-the-go
- Cost-effective short-term internet solutions

At GGNetworks, we offer both services to meet diverse customer needs. Our PPPoE packages provide unlimited data with speeds up to 50Mbps, while our hotspot vouchers offer flexible, pay-as-you-go internet access.',
'Learn the differences between PPPoE and Hotspot services to choose the right internet solution for your needs',
'GGNetworks Technical Team',
'pppoe,hotspot,internet,comparison,guide',
true, NOW()),

('Tips for Optimizing Your Internet Speed and Performance',
'Getting the best performance from your internet connection requires proper setup and maintenance. Here are some essential tips to optimize your internet speed and performance:

1. Router Placement: Position your router in a central location, away from walls and electronic devices that may interfere with the signal.

2. Regular Updates: Keep your router firmware and device software updated to ensure optimal performance and security.

3. Bandwidth Management: Monitor your data usage and avoid running multiple high-bandwidth applications simultaneously.

4. Security: Use strong passwords and enable WPA3 encryption to prevent unauthorized access that could slow down your connection.

5. Device Maintenance: Regularly restart your router and devices to clear cache and resolve connectivity issues.

6. Cable Quality: Use high-quality Ethernet cables for wired connections to ensure maximum speed and stability.

7. Interference Reduction: Keep your router away from microwaves, cordless phones, and other devices that operate on similar frequencies.

At GGNetworks, we provide 24/7 technical support to help you optimize your internet experience. Contact our support team for personalized assistance with your connection setup.',
'Essential tips and best practices for optimizing your internet speed and performance',
'GGNetworks Support Team',
'optimization,speed,performance,tips,router,bandwidth',
true, NOW()); 