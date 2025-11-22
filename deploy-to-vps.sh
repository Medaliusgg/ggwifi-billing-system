#!/bin/bash

# Quick VPS Deployment Script for GG-WIFI Backend
# Run this script ON YOUR VPS after SSH'ing in

set -e

echo "🚀 Starting backend deployment..."

# Navigate to backend directory
cd /opt/ggwifi-src/ggwifi-billing-system/backend || {
    echo "❌ Backend directory not found. Please check the path."
    exit 1
}

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin 2025-11-16-p50s-ca43d

# Build the backend
echo "🔨 Building backend..."
mvn clean package -DskipTests

# Check if build was successful
if [ ! -f "target/ggnetworks-backend-1.0.0.jar" ]; then
    echo "❌ Build failed! JAR file not found."
    exit 1
fi

# Stop the backend service
echo "⏸️  Stopping backend service..."
sudo systemctl stop ggnetworks-backend.service

# Backup current JAR
echo "💾 Backing up current JAR..."
if [ -f "/opt/ggnetworks/ggnetworks-backend.jar" ]; then
    sudo cp /opt/ggnetworks/ggnetworks-backend.jar /opt/ggnetworks/ggnetworks-backend.jar.backup.$(date +%Y%m%d_%H%M%S)
fi

# Copy new JAR
echo "📦 Installing new JAR..."
sudo cp target/ggnetworks-backend-1.0.0.jar /opt/ggnetworks/ggnetworks-backend.jar

# Start the backend service
echo "▶️  Starting backend service..."
sudo systemctl start ggnetworks-backend.service

# Wait a moment for service to start
sleep 3

# Check service status
echo "📊 Checking service status..."
if sudo systemctl is-active --quiet ggnetworks-backend.service; then
    echo "✅ Backend service is running!"
    echo ""
    echo "📋 Service status:"
    sudo systemctl status ggnetworks-backend.service --no-pager -l | head -15
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🔍 To view logs: sudo journalctl -u ggnetworks-backend.service -f"
else
    echo "❌ Backend service failed to start!"
    echo "📋 Checking logs..."
    sudo journalctl -u ggnetworks-backend.service -n 50 --no-pager
    exit 1
fi

