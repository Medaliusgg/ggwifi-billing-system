#!/bin/bash

# Deploy to VPS - Option 1
# This script will SSH to VPS and run DEPLOY_VPS_NOW.sh

set -e

# Configuration - Update these with your VPS details
VPS_HOST="${VPS_HOST:-139.84.241.182}"
VPS_USER="${VPS_USER:-root}"
VPS_BACKEND_DIR="${VPS_BACKEND_DIR:-/opt/ggnetworks}"
SERVICE_NAME="${SERVICE_NAME:-ggnetworks-backend}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOYING TO VPS - OPTION 1"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "VPS Host: $VPS_HOST"
echo "VPS User: $VPS_USER"
echo "Backend Dir: $VPS_BACKEND_DIR"
echo ""
echo "This will:"
echo "  1. SSH to VPS server"
echo "  2. Navigate to backend directory"
echo "  3. Pull latest code (with webhook fixes)"
echo "  4. Build backend"
echo "  5. Restart backend service"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "🔐 Connecting to VPS and deploying..."
echo ""

# SSH to VPS and run deployment
ssh $VPS_USER@$VPS_HOST << ENDSSH
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📥 Connected to VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Find git repository (source code location)
echo "🔍 Looking for git repository..."
GIT_REPO=""
if [ -d "/root/ggwifi-billing-system" ] && [ -d "/root/ggwifi-billing-system/.git" ]; then
    GIT_REPO="/root/ggwifi-billing-system"
elif [ -d "/home/root/ggwifi-billing-system" ] && [ -d "/home/root/ggwifi-billing-system/.git" ]; then
    GIT_REPO="/home/root/ggwifi-billing-system"
elif [ -d "/opt/ggwifi-billing-system" ] && [ -d "/opt/ggwifi-billing-system/.git" ]; then
    GIT_REPO="/opt/ggwifi-billing-system"
elif [ -d "~/ggwifi-billing-system" ] && [ -d "~/ggwifi-billing-system/.git" ]; then
    GIT_REPO="~/ggwifi-billing-system"
else
    echo "⚠️  Git repository not found. Trying to clone..."
    GIT_REPO="/tmp/ggwifi-billing-system"
    mkdir -p \$GIT_REPO
    cd \$GIT_REPO
    if [ ! -d ".git" ]; then
        git clone https://github.com/Medaliusgg/ggwifi-billing-system.git . || {
            echo "❌ Failed to clone repository!"
            echo "Please ensure git repository exists on VPS or clone it manually"
            exit 1
        }
    fi
fi

if [ -z "\$GIT_REPO" ] || [ ! -d "\$GIT_REPO/.git" ]; then
    echo "❌ Git repository not found!"
    echo "Please clone the repository on VPS first:"
    echo "  git clone https://github.com/Medaliusgg/ggwifi-billing-system.git"
    exit 1
fi

cd "\$GIT_REPO" || exit 1
echo "📁 Git repository: \$GIT_REPO"
echo ""

# Step 1: Pull latest code
echo "1️⃣  Pulling latest code from repository..."
git pull origin main
if [ \$? -ne 0 ]; then
    echo "❌ Failed to pull latest code!"
    exit 1
fi
echo "✅ Code pulled successfully"
echo ""

# Navigate to backend directory
BACKEND_DIR="\$GIT_REPO/backend"
cd "\$BACKEND_DIR" || exit 1
echo "📁 Backend source directory: \$BACKEND_DIR"
echo ""

# Step 2: Stop existing backend
echo "2️⃣  Stopping existing backend..."
if systemctl is-active --quiet $SERVICE_NAME 2>/dev/null; then
    sudo systemctl stop $SERVICE_NAME
    echo "✅ Stopped systemd service ($SERVICE_NAME)"
elif systemctl is-active --quiet ggwifi-backend 2>/dev/null; then
    sudo systemctl stop ggwifi-backend
    echo "✅ Stopped systemd service (ggwifi-backend)"
elif command -v pm2 &> /dev/null && pm2 list | grep -q ggnetworks-backend; then
    pm2 stop ggnetworks-backend
    echo "✅ Stopped PM2 process"
else
    JAVA_PID=\$(ps aux | grep "[j]ava.*ggnetworks" | awk '{print \$2}' | head -1)
    if [ -n "\$JAVA_PID" ]; then
        kill \$JAVA_PID
        sleep 2
        echo "✅ Stopped Java process (PID: \$JAVA_PID)"
    else
        echo "⚠️  No running backend process found"
    fi
fi
echo ""

# Step 3: Build backend
echo "3️⃣  Building backend with webhook fixes..."
mvn clean package -DskipTests
if [ \$? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 4: Copy JAR to deployment directory
echo "4️⃣  Copying JAR to deployment directory..."
DEPLOY_DIR="/opt/ggnetworks"
mkdir -p \$DEPLOY_DIR/backup

# Find the built JAR file
JAR_FILE=\$(find target -name "ggnetworks-backend*.jar" -type f | head -1)
if [ -z "\$JAR_FILE" ] || [ ! -f "\$JAR_FILE" ]; then
    echo "❌ JAR file not found in target directory!"
    echo "   Expected location: target/ggnetworks-backend*.jar"
    exit 1
fi

echo "   Found JAR: \$JAR_FILE"

# Backup existing JAR if it exists
if [ -f "\$DEPLOY_DIR/ggnetworks-backend.jar" ]; then
    BACKUP_NAME="ggnetworks-backend.jar.backup.\$(date +%Y%m%d_%H%M%S)"
    cp "\$DEPLOY_DIR/ggnetworks-backend.jar" "\$DEPLOY_DIR/backup/\$BACKUP_NAME"
    echo "   ✅ Backed up existing JAR to: backup/\$BACKUP_NAME"
fi

# Copy new JAR
cp "\$JAR_FILE" "\$DEPLOY_DIR/ggnetworks-backend.jar"
echo "   ✅ Copied JAR to: \$DEPLOY_DIR/ggnetworks-backend.jar"
echo ""

# Step 5: Start backend
echo "5️⃣  Starting backend..."
if [ -f "/etc/systemd/system/$SERVICE_NAME.service" ]; then
    sudo systemctl start $SERVICE_NAME
    sudo systemctl status $SERVICE_NAME --no-pager | head -5
    echo "✅ Started via systemd ($SERVICE_NAME)"
elif [ -f "/etc/systemd/system/ggwifi-backend.service" ]; then
    sudo systemctl start ggwifi-backend
    sudo systemctl status ggwifi-backend --no-pager | head -5
    echo "✅ Started via systemd (ggwifi-backend)"
elif command -v pm2 &> /dev/null; then
    pm2 start \$DEPLOY_DIR/ggnetworks-backend.jar --name ggnetworks-backend
    pm2 save
    echo "✅ Started via PM2"
else
    mkdir -p \$DEPLOY_DIR/logs
    cd \$DEPLOY_DIR
    nohup java -jar ggnetworks-backend.jar > logs/backend.log 2>&1 &
    echo "✅ Started manually (PID: \$!)"
fi
echo ""

# Step 6: Wait for startup
echo "6️⃣  Waiting for backend to start (30 seconds)..."
sleep 30
echo ""

# Step 7: Verify deployment
echo "7️⃣  Verifying deployment..."
HTTP_CODE=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/customer-portal/packages 2>&1 || echo "000")

if [ "\$HTTP_CODE" = "200" ] || [ "\$HTTP_CODE" = "400" ]; then
    echo "✅ Backend is responding (HTTP \$HTTP_CODE)"
else
    echo "⚠️  Backend may still be starting (HTTP \$HTTP_CODE)"
    echo "   Check logs: tail -f \$BACKEND_DIR/logs/backend.log"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE ON VPS!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🧪 Next Steps:"
echo ""
echo "1. Test webhook authentication:"
echo "   ./test-webhook-fixes.sh"
echo ""
echo "2. Test payment flow:"
echo "   • Open: https://hotspot.ggwifi.co.tz"
echo "   • Initiate payment with phone: 0658823944"
echo "   • Complete payment on phone"
echo "   • Verify webhook is received"
echo ""
echo "3. Monitor backend logs:"
echo "   ssh $VPS_USER@$VPS_HOST 'tail -f $VPS_BACKEND_DIR/logs/backend.log'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

