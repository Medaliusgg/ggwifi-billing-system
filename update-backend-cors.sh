#!/bin/bash

# Quick script to update backend CORS configuration on VPS
set -e

VPS_IP="139.84.241.182"
VPS_USER="root"
APP_DIR="/opt/ggnetworks"
SERVICE_NAME="ggnetworks-backend"

echo "🚀 Updating GG-WIFI Backend on VPS..."
echo "=================================="
echo "VPS: $VPS_USER@$VPS_IP"
echo ""

# Step 1: Pull latest code from GitHub
echo "📥 Pulling latest code from GitHub..."
ssh $VPS_USER@$VPS_IP "cd /opt/ggnetworks && git pull origin main"

# Step 2: Rebuild the JAR
echo "🔨 Rebuilding backend..."
ssh $VPS_USER@$VPS_IP "cd /opt/ggnetworks && ./mvnw clean package -DskipTests || mvn clean package -DskipTests"

# Step 3: Stop service
echo "🛑 Stopping backend service..."
ssh $VPS_USER@$VPS_IP "systemctl stop $SERVICE_NAME"

# Step 4: Backup old JAR
echo "💾 Creating backup..."
ssh $VPS_USER@$VPS_IP "cp $APP_DIR/ggnetworks-backend.jar $APP_DIR/backup/ggnetworks-backend-$(date +%Y%m%d-%H%M%S).jar"

# Step 5: Copy new JAR
echo "📤 Deploying new JAR..."
ssh $VPS_USER@$VPS_IP "cp target/ggnetworks-backend-1.0.0.jar $APP_DIR/ggnetworks-backend.jar"

# Step 6: Start service
echo "🚀 Starting backend service..."
ssh $VPS_USER@$VPS_IP "systemctl start $SERVICE_NAME"

# Step 7: Wait and check status
echo "⏳ Waiting for service to start..."
sleep 10

echo "📊 Service status:"
ssh $VPS_USER@$VPS_IP "systemctl status $SERVICE_NAME --no-pager -l"

echo ""
echo "✅ Backend updated successfully!"
echo "🌐 Test: https://admin.ggwifi.co.tz"



