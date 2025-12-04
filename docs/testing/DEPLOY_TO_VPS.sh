#!/bin/bash

# Deploy Backend to VPS Script
# This script deploys the newly built JAR to the VPS

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     VPS BACKEND DEPLOYMENT SCRIPT                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Configuration - UPDATE THESE VALUES
VPS_HOST="139.84.241.182"
VPS_USER="${VPS_USER:-root}"  # Can be overridden with environment variable
VPS_DEPLOY_PATH="${VPS_DEPLOY_PATH:-/opt/ggnetworks}"  # Can be overridden
SERVICE_NAME="${SERVICE_NAME:-ggnetworks-backend}"  # Can be overridden
# Path to JAR relative to project root; this script lives in docs/testing
JAR_FILE="$(cd "$(dirname "$0")/../.." && pwd)/backend/target/ggnetworks-backend-1.0.0.jar"
BACKUP_DIR="${VPS_DEPLOY_PATH}/backup"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Deployment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "VPS Host: $VPS_HOST"
echo "VPS User: $VPS_USER"
echo "Deploy Path: $VPS_DEPLOY_PATH"
echo "Service Name: $SERVICE_NAME"
echo "JAR File: $JAR_FILE"
echo ""

# Check if JAR file exists
if [ ! -f "$JAR_FILE" ]; then
    echo -e "${RED}❌ Error: JAR file not found: $JAR_FILE${NC}"
    echo "Please build the backend first:"
    echo "  cd backend && mvn clean package -DskipTests"
    exit 1
fi

echo -e "${GREEN}✅ JAR file found: $JAR_FILE${NC}"
JAR_SIZE=$(du -h "$JAR_FILE" | cut -f1)
echo "   Size: $JAR_SIZE"
echo ""

# Prompt for confirmation (skip if AUTO_DEPLOY is set)
if [ -z "$AUTO_DEPLOY" ]; then
    read -p "Do you want to proceed with deployment? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Deployment cancelled."
        exit 0
    fi
else
    echo "Auto-deploy mode enabled, proceeding..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Uploading JAR to VPS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create temporary file name
TEMP_JAR="ggnetworks-backend-1.0.0-$(date +%Y%m%d-%H%M%S).jar"

echo "Uploading $JAR_FILE to $VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/$TEMP_JAR"
echo "Creating directory if it doesn't exist..."
ssh "$VPS_USER@$VPS_HOST" "mkdir -p $VPS_DEPLOY_PATH $BACKUP_DIR"
scp "$JAR_FILE" "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/$TEMP_JAR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Upload successful${NC}"
else
    echo -e "${RED}❌ Upload failed${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Deploying on VPS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# SSH and deploy
ssh "$VPS_USER@$VPS_HOST" << EOF
set -e

echo "Current directory: \$(pwd)"
echo "Deploy path: $VPS_DEPLOY_PATH"
cd $VPS_DEPLOY_PATH || { echo "Error: Cannot access $VPS_DEPLOY_PATH"; exit 1; }

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup current JAR if it exists
if [ -f "ggnetworks-backend.jar" ]; then
    BACKUP_NAME="ggnetworks-backend-\$(date +%Y%m%d-%H%M%S).jar"
    echo "Backing up current JAR to $BACKUP_DIR/\$BACKUP_NAME"
    cp ggnetworks-backend.jar $BACKUP_DIR/\$BACKUP_NAME
    echo "✅ Backup created: \$BACKUP_NAME"
else
    echo "⚠️  No existing JAR to backup"
fi

# Stop the service
echo ""
echo "Stopping $SERVICE_NAME service..."
sudo systemctl stop $SERVICE_NAME || echo "⚠️  Service may not be running"

# Wait a moment for service to stop
sleep 2

# Replace JAR
echo ""
echo "Replacing JAR file..."
if [ -f "$TEMP_JAR" ]; then
    cp "$TEMP_JAR" ggnetworks-backend.jar
    chmod +x ggnetworks-backend.jar
    echo "✅ JAR replaced successfully"
    echo "   Old JAR backed up, new JAR: ggnetworks-backend.jar"
else
    echo "❌ Error: Uploaded JAR not found: $TEMP_JAR"
    exit 1
fi

# Start the service
echo ""
echo "Starting $SERVICE_NAME service..."
sudo systemctl start $SERVICE_NAME

# Wait a moment for service to start
sleep 3

# Check service status
echo ""
echo "Checking service status..."
sudo systemctl status $SERVICE_NAME --no-pager -l || true

# Check if service is running
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo ""
    echo "✅ Service is running!"
else
    echo ""
    echo "❌ Service failed to start!"
    echo "Check logs with: sudo journalctl -u $SERVICE_NAME -n 50"
    exit 1
fi

# Show recent logs
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Recent Logs (last 20 lines):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sudo journalctl -u $SERVICE_NAME -n 20 --no-pager || true

EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Backend is now running on: http://$VPS_HOST:8080"
    echo ""
    echo "Next steps:"
    echo "1. Run tests: bash docs/testing/COMPLETE_MODULE_TESTING.sh"
    echo "2. Monitor logs: ssh $VPS_USER@$VPS_HOST 'sudo journalctl -u $SERVICE_NAME -f'"
    echo "3. Check health: curl http://$VPS_HOST:8080/api/v1/admin/health"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${RED}❌ DEPLOYMENT FAILED!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check SSH access: ssh $VPS_USER@$VPS_HOST"
    echo "2. Check service logs: ssh $VPS_USER@$VPS_HOST 'sudo journalctl -u $SERVICE_NAME -n 50'"
    echo "3. Check service status: ssh $VPS_USER@$VPS_HOST 'sudo systemctl status $SERVICE_NAME'"
    echo ""
    exit 1
fi

