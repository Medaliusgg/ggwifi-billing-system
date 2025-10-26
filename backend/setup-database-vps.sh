#!/bin/bash

# MySQL Database Setup Script for GG-WIFI Backend
# This script will setup the MySQL database on your Vultr VPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  MySQL Database Setup Script${NC}"
echo "=================================="

# Configuration
DB_NAME="ggnetworks"
DB_USER="ggnetworks"
DB_PASSWORD="secure_password"
MYSQL_ROOT_PASSWORD=""

echo -e "${YELLOW}📋 Database Configuration:${NC}"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Password: $DB_PASSWORD"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}📦 Installing MySQL...${NC}"
    apt update
    apt install -y mysql-server mysql-client
    systemctl start mysql
    systemctl enable mysql
    echo -e "${GREEN}✅ MySQL installed successfully${NC}"
else
    echo -e "${GREEN}✅ MySQL is already installed${NC}"
fi

# Secure MySQL installation
echo -e "${YELLOW}🔒 Securing MySQL installation...${NC}"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root_password';"
mysql -e "DELETE FROM mysql.user WHERE User='';"
mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
mysql -e "DROP DATABASE IF EXISTS test;"
mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
mysql -e "FLUSH PRIVILEGES;"

# Create database and user
echo -e "${YELLOW}🏗️  Creating database and user...${NC}"
mysql -u root -proot_password -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -proot_password -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
mysql -u root -proot_password -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
mysql -u root -proot_password -e "FLUSH PRIVILEGES;"

echo -e "${GREEN}✅ Database and user created successfully${NC}"

# Test database connection
echo -e "${YELLOW}🧪 Testing database connection...${NC}"
if mysql -u $DB_USER -p$DB_PASSWORD -e "USE $DB_NAME; SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

# Create initial admin user
echo -e "${YELLOW}👤 Creating initial admin user...${NC}"
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
INSERT INTO users (username, email, password, phone_number, first_name, last_name, role, status, is_active, is_email_verified, is_phone_verified, created_at, updated_at) 
VALUES ('admin', 'admin@ggnetworks.com', '\$2a\$10\$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '0676591880', 'System', 'Administrator', 'ADMIN', 'ACTIVE', 1, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
"

echo -e "${GREEN}✅ Initial admin user created${NC}"

# Create system configuration
echo -e "${YELLOW}⚙️  Creating system configuration...${NC}"
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
INSERT INTO system_configurations (config_key, config_value, description, created_at, updated_at) VALUES
('ZENOPAY_API_URL', 'https://api.zenopay.com', 'ZenoPay API URL', NOW(), NOW()),
('ZENOPAY_API_KEY', 'your_api_key', 'ZenoPay API Key', NOW(), NOW()),
('ZENOPAY_WEBHOOK_URL', 'http://your-vps-ip:8080/api/customer-portal/webhook', 'ZenoPay Webhook URL', NOW(), NOW()),
('SMS_API_URL', 'https://api.nextsms.co.tz', 'SMS API URL', NOW(), NOW()),
('SMS_API_KEY', 'your_sms_api_key', 'SMS API Key', NOW(), NOW()),
('SMS_SENDER_ID', 'GGNETWORKS', 'SMS Sender ID', NOW(), NOW()),
('FREERADIUS_HOST', 'localhost', 'FreeRADIUS Host', NOW(), NOW()),
('FREERADIUS_PORT', '1812', 'FreeRADIUS Port', NOW(), NOW()),
('FREERADIUS_SECRET', 'testing123', 'FreeRADIUS Secret', NOW(), NOW()),
('MIKROTIK_HOST', '192.168.1.1', 'MikroTik Host', NOW(), NOW()),
('MIKROTIK_PORT', '8728', 'MikroTik Port', NOW(), NOW()),
('MIKROTIK_USERNAME', 'admin', 'MikroTik Username', NOW(), NOW()),
('MIKROTIK_PASSWORD', 'admin', 'MikroTik Password', NOW(), NOW()),
('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production', 'JWT Secret Key', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
"

echo -e "${GREEN}✅ System configuration created${NC}"

# Create sample packages
echo -e "${YELLOW}📦 Creating sample packages...${NC}"
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
INSERT INTO internet_packages (name, description, price, duration_days, data_limit_gb, speed_mbps, package_type, package_category, target_audience, status, created_at, updated_at) VALUES
('Basic Plan', 'Basic internet package for light usage', 5000.00, 30, 10, 5, 'STANDARD', 'BASIC', 'INDIVIDUAL', 'ACTIVE', NOW(), NOW()),
('Standard Plan', 'Standard internet package for regular usage', 10000.00, 30, 25, 10, 'STANDARD', 'STANDARD', 'INDIVIDUAL', 'ACTIVE', NOW(), NOW()),
('Premium Plan', 'Premium internet package for heavy usage', 20000.00, 30, 50, 20, 'PREMIUM', 'PREMIUM', 'INDIVIDUAL', 'ACTIVE', NOW(), NOW()),
('Business Plan', 'Business internet package for offices', 50000.00, 30, 100, 50, 'BUSINESS', 'BUSINESS', 'BUSINESS', 'ACTIVE', NOW(), NOW()),
('Weekend Special', 'Special weekend package with discount', 3000.00, 2, 5, 10, 'TIME_BASED_OFFER', 'OFFER', 'ALL', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
"

echo -e "${GREEN}✅ Sample packages created${NC}"

echo ""
echo -e "${GREEN}🎉 Database setup completed!${NC}"
echo "=================================="
echo -e "${BLUE}📋 Database Information:${NC}"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Password: $DB_PASSWORD"
echo ""
echo -e "${BLUE}👤 Admin Login Credentials:${NC}"
echo "Username: admin"
echo "Phone: 0676591880"
echo "Password: admin123"
echo ""
echo -e "${BLUE}🔗 Useful Commands:${NC}"
echo "Connect to database: mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME"
echo "Check database status: systemctl status mysql"
echo "Restart MySQL: systemctl restart mysql"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "1. Change the default passwords in production"
echo "2. Update the system configuration with real API keys"
echo "3. Configure firewall rules for MySQL if needed"
