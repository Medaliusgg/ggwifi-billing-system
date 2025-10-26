#!/bin/bash

# VPS Setup Script for GG-WIFI Backend Automated Deployment
# This script prepares your Vultr VPS for GitHub Actions deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 VPS Setup Script for GG-WIFI Backend${NC}"
echo "=============================================="

# Configuration
VPS_IP=""
VPS_USER="root"
VPS_PORT="22"

echo -e "${YELLOW}📋 VPS Configuration:${NC}"
echo "VPS IP: $VPS_IP"
echo "VPS User: $VPS_USER"
echo "VPS Port: $VPS_PORT"
echo ""

# Check if VPS IP is provided
if [ -z "$VPS_IP" ]; then
    echo -e "${RED}❌ Error: VPS_IP is not set${NC}"
    echo "Please set your Vultr VPS IP address in the script"
    echo "Example: VPS_IP=\"your.vps.ip.address\""
    exit 1
fi

echo -e "${YELLOW}🔧 Setting up VPS for automated deployment...${NC}"

# Test SSH connection
echo -e "${YELLOW}🔌 Testing SSH connection...${NC}"
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_USER@$VPS_IP "echo 'SSH connection successful'" 2>/dev/null; then
    echo -e "${RED}❌ Error: Cannot connect to VPS${NC}"
    echo "Please check:"
    echo "1. VPS IP address is correct"
    echo "2. SSH key is configured"
    echo "3. VPS is running"
    exit 1
fi

echo -e "${GREEN}✅ SSH connection successful${NC}"

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
ssh $VPS_USER@$VPS_IP "apt update && apt upgrade -y"

# Install Java 17
echo -e "${YELLOW}☕ Installing Java 17...${NC}"
ssh $VPS_USER@$VPS_IP "apt install -y openjdk-17-jdk"

# Install MySQL 8.0
echo -e "${YELLOW}🗄️ Installing MySQL 8.0...${NC}"
ssh $VPS_USER@$VPS_IP "apt install -y mysql-server mysql-client"

# Install additional tools
echo -e "${YELLOW}🛠️ Installing additional tools...${NC}"
ssh $VPS_USER@$VPS_IP "apt install -y curl wget unzip jq git"

# Start and enable MySQL
echo -e "${YELLOW}🔄 Starting MySQL service...${NC}"
ssh $VPS_USER@$VPS_IP "systemctl start mysql && systemctl enable mysql"

# Create deployment directory
echo -e "${YELLOW}📁 Creating deployment directory...${NC}"
ssh $VPS_USER@$VPS_IP "mkdir -p /opt/ggnetworks/{logs,config,backup}"

# Setup firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ssh $VPS_USER@$VPS_IP "ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw allow 8080 && ufw --force enable"

# Create systemd service file
echo -e "${YELLOW}⚙️ Creating systemd service...${NC}"
ssh $VPS_USER@$VPS_IP "cat > /etc/systemd/system/ggnetworks-backend.service << 'EOF'
[Unit]
Description=GG-WIFI Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ggnetworks
ExecStart=/usr/bin/java -jar /opt/ggnetworks/ggnetworks-backend.jar --spring.config.location=file:/opt/ggnetworks/config/application-production.yml
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ggnetworks-backend

[Install]
WantedBy=multi-user.target
EOF"

# Reload systemd
ssh $VPS_USER@$VPS_IP "systemctl daemon-reload"

# Setup MySQL database
echo -e "${YELLOW}🗄️ Setting up MySQL database...${NC}"
ssh $VPS_USER@$VPS_IP "mysql -e \"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root_password';\""
ssh $VPS_USER@$VPS_IP "mysql -e \"CREATE DATABASE IF NOT EXISTS ggnetworks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
ssh $VPS_USER@$VPS_IP "mysql -e \"CREATE USER IF NOT EXISTS 'ggnetworks'@'localhost' IDENTIFIED BY 'secure_password';\""
ssh $VPS_USER@$VPS_IP "mysql -e \"GRANT ALL PRIVILEGES ON ggnetworks.* TO 'ggnetworks'@'localhost';\""
ssh $VPS_USER@$VPS_IP "mysql -e \"FLUSH PRIVILEGES;\""

# Create initial admin user
echo -e "${YELLOW}👤 Creating initial admin user...${NC}"
ssh $VPS_USER@$VPS_IP "mysql -u ggnetworks -psecure_password ggnetworks -e \"
INSERT INTO users (username, email, password, phone_number, first_name, last_name, role, status, is_active, is_email_verified, is_phone_verified, created_at, updated_at) 
VALUES ('admin', 'admin@ggnetworks.com', '\\\$2a\\\$10\\\$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '0676591880', 'System', 'Administrator', 'ADMIN', 'ACTIVE', 1, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
\""

# Create system configuration
echo -e "${YELLOW}⚙️ Creating system configuration...${NC}"
ssh $VPS_USER@$VPS_IP "mysql -u ggnetworks -psecure_password ggnetworks -e \"
INSERT INTO system_configurations (config_key, config_value, description, created_at, updated_at) VALUES
('ZENOPAY_API_URL', 'https://api.zenopay.com', 'ZenoPay API URL', NOW(), NOW()),
('ZENOPAY_API_KEY', 'your_api_key', 'ZenoPay API Key', NOW(), NOW()),
('ZENOPAY_WEBHOOK_URL', 'http://$VPS_IP:8080/api/customer-portal/webhook', 'ZenoPay Webhook URL', NOW(), NOW()),
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
\""

# Create sample packages
echo -e "${YELLOW}📦 Creating sample packages...${NC}"
ssh $VPS_USER@$VPS_IP "mysql -u ggnetworks -psecure_password ggnetworks -e \"
INSERT INTO internet_packages (name, description, price, duration_days, data_limit_gb, speed_mbps, package_type, package_category, target_audience, status, created_at, updated_at) VALUES
('Basic Plan', 'Basic internet package for light usage', 5000.00, 30, 10, 5, 'STANDARD', 'BASIC', 'INDIVIDUAL', 'ACTIVE', NOW(), NOW()),
('Standard Plan', 'Standard internet package for regular usage', 10000.00, 30, 25, 10, 'STANDARD', 'STANDARD', 'INDIVIDUAL', 'ACTIVE', NOW(), NOW()),
('Premium Plan', 'Premium internet package for heavy usage', 20000.00, 30, 50, 20, 'PREMIUM', 'PREMIUM', 'INDIVIDUAL', 'ACTIVE', NOW(), NOW()),
('Business Plan', 'Business internet package for offices', 50000.00, 30, 100, 50, 'BUSINESS', 'BUSINESS', 'BUSINESS', 'ACTIVE', NOW(), NOW()),
('Weekend Special', 'Special weekend package with discount', 3000.00, 2, 5, 10, 'TIME_BASED_OFFER', 'OFFER', 'ALL', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
\""

# Test database connection
echo -e "${YELLOW}🧪 Testing database connection...${NC}"
if ssh $VPS_USER@$VPS_IP "mysql -u ggnetworks -psecure_password ggnetworks -e 'SELECT 1;'" &> /dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 VPS setup completed successfully!${NC}"
echo "=================================="
echo -e "${BLUE}📋 VPS Information:${NC}"
echo "VPS IP: $VPS_IP"
echo "VPS User: $VPS_USER"
echo "VPS Port: $VPS_PORT"
echo ""
echo -e "${BLUE}🗄️ Database Information:${NC}"
echo "Database Name: ggnetworks"
echo "Database User: ggnetworks"
echo "Database Password: secure_password"
echo ""
echo -e "${BLUE}👤 Admin Login Credentials:${NC}"
echo "Username: admin"
echo "Phone: 0676591880"
echo "Password: admin123"
echo ""
echo -e "${BLUE}🔗 Next Steps:${NC}"
echo "1. Configure GitHub Secrets:"
echo "   - VPS_HOST: $VPS_IP"
echo "   - VPS_USER: $VPS_USER"
echo "   - VPS_PORT: $VPS_PORT"
echo "   - VPS_SSH_KEY: your-private-ssh-key"
echo "   - DB_USERNAME: ggnetworks"
echo "   - DB_PASSWORD: secure_password"
echo "   - ZENOPAY_API_KEY: your-zenopay-api-key"
echo "   - SMS_API_KEY: your-sms-api-key"
echo "   - JWT_SECRET: your-super-secret-jwt-key"
echo ""
echo "2. Push to GitHub main branch to trigger deployment"
echo "3. Or manually trigger deployment in GitHub Actions"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo "Check service status: ssh $VPS_USER@$VPS_IP 'systemctl status ggnetworks-backend'"
echo "View logs: ssh $VPS_USER@$VPS_IP 'journalctl -u ggnetworks-backend -f'"
echo "Restart service: ssh $VPS_USER@$VPS_IP 'systemctl restart ggnetworks-backend'"
echo ""
echo -e "${YELLOW}⚠️ Important:${NC}"
echo "1. Change the default passwords in production"
echo "2. Update the system configuration with real API keys"
echo "3. Configure firewall rules if needed"
echo "4. Setup SSL certificates for production"
