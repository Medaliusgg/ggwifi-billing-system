#!/bin/bash

# GG-WIFI Backend Deployment Script for Vultr VPS
# This script will deploy the backend to your Vultr VPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_IP=""
VPS_USER="root"
VPS_PORT="22"
APP_NAME="ggnetworks-backend"
APP_DIR="/opt/ggnetworks"
SERVICE_NAME="ggnetworks-backend"

echo -e "${BLUE}🚀 GG-WIFI Backend Deployment Script${NC}"
echo "=================================="

# Check if VPS IP is provided
if [ -z "$VPS_IP" ]; then
    echo -e "${RED}❌ Error: VPS_IP is not set${NC}"
    echo "Please set your Vultr VPS IP address in the script"
    echo "Example: VPS_IP=\"your.vps.ip.address\""
    exit 1
fi

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "VPS IP: $VPS_IP"
echo "VPS User: $VPS_USER"
echo "App Directory: $APP_DIR"
echo "Service Name: $SERVICE_NAME"
echo ""

# Check if JAR file exists
if [ ! -f "target/ggnetworks-backend-1.0.0.jar" ]; then
    echo -e "${RED}❌ Error: JAR file not found${NC}"
    echo "Please run 'mvn clean install -DskipTests' first"
    exit 1
fi

echo -e "${GREEN}✅ JAR file found: target/ggnetworks-backend-1.0.0.jar${NC}"

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

# Create deployment directory on VPS
echo -e "${YELLOW}📁 Creating deployment directory...${NC}"
ssh $VPS_USER@$VPS_IP "mkdir -p $APP_DIR/{logs,config,backup}"

# Stop existing service
echo -e "${YELLOW}🛑 Stopping existing service...${NC}"
ssh $VPS_USER@$VPS_IP "systemctl stop $SERVICE_NAME || true"

# Backup existing JAR
echo -e "${YELLOW}💾 Creating backup...${NC}"
ssh $VPS_USER@$VPS_IP "if [ -f $APP_DIR/$APP_NAME.jar ]; then cp $APP_DIR/$APP_NAME.jar $APP_DIR/backup/$APP_NAME-$(date +%Y%m%d-%H%M%S).jar; fi"

# Upload JAR file
echo -e "${YELLOW}📤 Uploading JAR file...${NC}"
scp target/ggnetworks-backend-1.0.0.jar $VPS_USER@$VPS_IP:$APP_DIR/$APP_NAME.jar

# Upload production config
echo -e "${YELLOW}📤 Uploading production configuration...${NC}"
scp application-production.yml $VPS_USER@$VPS_IP:$APP_DIR/config/

# Create systemd service file
echo -e "${YELLOW}⚙️  Creating systemd service...${NC}"
ssh $VPS_USER@$VPS_IP "cat > /etc/systemd/system/$SERVICE_NAME.service << 'EOF'
[Unit]
Description=GG-WIFI Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/java -jar $APP_DIR/$APP_NAME.jar --spring.config.location=file:$APP_DIR/config/application-production.yml
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

[Install]
WantedBy=multi-user.target
EOF"

# Reload systemd and enable service
echo -e "${YELLOW}🔄 Reloading systemd and enabling service...${NC}"
ssh $VPS_USER@$VPS_IP "systemctl daemon-reload && systemctl enable $SERVICE_NAME"

# Start service
echo -e "${YELLOW}🚀 Starting service...${NC}"
ssh $VPS_USER@$VPS_IP "systemctl start $SERVICE_NAME"

# Wait for service to start
echo -e "${YELLOW}⏳ Waiting for service to start...${NC}"
sleep 10

# Check service status
echo -e "${YELLOW}📊 Checking service status...${NC}"
ssh $VPS_USER@$VPS_IP "systemctl status $SERVICE_NAME --no-pager"

# Test API endpoint
echo -e "${YELLOW}🧪 Testing API endpoint...${NC}"
if curl -f -s http://$VPS_IP:8080/actuator/health > /dev/null; then
    echo -e "${GREEN}✅ API is responding successfully${NC}"
else
    echo -e "${RED}❌ API is not responding${NC}"
    echo "Checking logs..."
    ssh $VPS_USER@$VPS_IP "journalctl -u $SERVICE_NAME --no-pager -n 20"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo "=================================="
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Setup MySQL database on VPS"
echo "2. Configure environment variables"
echo "3. Test all API endpoints"
echo ""
echo -e "${BLUE}🔗 Useful Commands:${NC}"
echo "Check logs: ssh $VPS_USER@$VPS_IP 'journalctl -u $SERVICE_NAME -f'"
echo "Restart service: ssh $VPS_USER@$VPS_IP 'systemctl restart $SERVICE_NAME'"
echo "Check status: ssh $VPS_USER@$VPS_IP 'systemctl status $SERVICE_NAME'"
echo ""
echo -e "${BLUE}🌐 API Endpoints:${NC}"
echo "Health Check: http://$VPS_IP:8080/actuator/health"
echo "API Base: http://$VPS_IP:8080/api"
echo "Admin Login: http://$VPS_IP:8080/api/auth/admin-login"
