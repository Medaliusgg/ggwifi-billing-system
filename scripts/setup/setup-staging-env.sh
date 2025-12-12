#!/bin/bash

# Setup Staging Environment on VPS
# This script sets up a staging environment on the same server (different port)

set -e

VPS_HOST="${1:-139.84.241.182}"
VPS_USER="${2:-root}"

echo "🧪 Setting up staging environment on $VPS_USER@$VPS_HOST..."
echo ""

# Create staging directories
echo "📁 Creating staging directories..."
ssh $VPS_USER@$VPS_HOST << 'EOF'
    sudo mkdir -p /opt/ggnetworks-staging/{backup,config,logs}
    sudo chown -R root:root /opt/ggnetworks-staging
    echo "✅ Directories created"
EOF

# Copy production config
echo "📋 Copying production config..."
ssh $VPS_USER@$VPS_HOST << 'EOF'
    if [ -f /opt/ggnetworks/config/application-production.yml ]; then
        sudo cp /opt/ggnetworks/config/application-production.yml /opt/ggnetworks-staging/config/application-staging.yml
        echo "✅ Config copied"
    else
        echo "⚠️  Production config not found, creating default..."
        sudo tee /opt/ggnetworks-staging/config/application-staging.yml > /dev/null << 'CONFIG'
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggnetworks?useSSL=false&serverTimezone=UTC
    username: root
    password: your_password

logging:
  level:
    com.ggnetworks: INFO
CONFIG
    fi
EOF

# Create staging systemd service
echo "⚙️  Creating staging systemd service..."
ssh $VPS_USER@$VPS_HOST << 'EOF'
    sudo tee /etc/systemd/system/ggnetworks-backend-staging.service > /dev/null << 'SERVICE'
[Unit]
Description=GG-WIFI Backend Service (Staging)
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ggnetworks-staging
ExecStart=/usr/bin/java -jar /opt/ggnetworks-staging/ggnetworks-backend.jar --spring.config.location=file:/opt/ggnetworks-staging/config/application-staging.yml
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE

    sudo systemctl daemon-reload
    sudo systemctl enable ggnetworks-backend-staging
    echo "✅ Service created and enabled"
EOF

echo ""
echo "✅ Staging environment setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Edit staging config (if needed):"
echo "   ssh $VPS_USER@$VPS_HOST 'sudo nano /opt/ggnetworks-staging/config/application-staging.yml'"
echo ""
echo "2. Deploy a JAR to staging to test:"
echo "   scp backend/target/ggnetworks-backend-1.0.0.jar $VPS_USER@$VPS_HOST:/opt/ggnetworks-staging/"
echo ""
echo "3. Start staging service:"
echo "   ssh $VPS_USER@$VPS_HOST 'sudo systemctl start ggnetworks-backend-staging'"
echo ""
echo "4. Check status:"
echo "   ssh $VPS_USER@$VPS_HOST 'sudo systemctl status ggnetworks-backend-staging'"
echo ""

