#!/bin/bash

echo "🚀 Manual Backend Deployment Script"
echo "==================================="
echo ""

# Check if we're on the VPS
if [ -d "/opt/ggwifi-billing-system" ]; then
    echo "✅ Running on VPS - Proceeding with deployment"
    DEPLOY_PATH="/opt/ggwifi-billing-system/backend"
else
    echo "⚠️  Not on VPS - This script needs to be run on your VPS"
    echo "   SSH to your VPS first: ssh root@your-vps-ip"
    echo "   Then run: cd /opt/ggwifi-billing-system/backend && ./manual-deploy-backend.sh"
    exit 1
fi

echo ""
echo "📂 Deployment Path: $DEPLOY_PATH"
echo ""

# Navigate to backend directory
cd $DEPLOY_PATH

echo "🔄 Step 1: Stopping existing Java processes..."
sudo pkill -f java || echo "No existing Java processes found"

echo ""
echo "🔄 Step 2: Pulling latest changes from GitHub..."
git pull origin main

echo ""
echo "🔄 Step 3: Cleaning and building application..."
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Maven build failed!"
    exit 1
fi

echo ""
echo "🔄 Step 4: Starting Spring Boot application..."
nohup java -jar target/ggnetworks-backend-1.0.0.jar > /var/log/ggwifi-backend.log 2>&1 &

# Wait for application to start
echo ""
echo "⏳ Waiting for application to start (15 seconds)..."
sleep 15

echo ""
echo "🔄 Step 5: Checking deployment status..."

# Check if Java process is running
if pgrep -f "ggnetworks-backend" > /dev/null; then
    echo "✅ Spring Boot process is running"
else
    echo "❌ Spring Boot process not found"
    echo "📋 Check logs: tail -f /var/log/ggwifi-backend.log"
    exit 1
fi

# Check if port 8080 is listening
if netstat -tlnp | grep -q ":8080"; then
    echo "✅ Port 8080 is listening"
else
    echo "❌ Port 8080 is not listening"
    echo "📋 Check logs: tail -f /var/log/ggwifi-backend.log"
    exit 1
fi

echo ""
echo "🧪 Step 6: Testing endpoints..."

# Test local endpoint
echo "Testing local endpoint..."
response=$(curl -s http://localhost:8080/api/v1/test 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$response" ]; then
    echo "✅ Local endpoint responding"
    echo "📄 Response: ${response:0:100}..."
else
    echo "❌ Local endpoint not responding"
    echo "📋 Check logs: tail -f /var/log/ggwifi-backend.log"
    exit 1
fi

echo ""
echo "🧪 Step 7: Testing external endpoint..."
external_response=$(curl -s http://api.ggwifi.co.tz:8080/api/v1/test 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$external_response" ]; then
    echo "✅ External endpoint responding"
    echo "📄 Response: ${external_response:0:100}..."
else
    echo "⚠️  External endpoint not responding (may be DNS/firewall issue)"
    echo "📋 Internal endpoint is working, check DNS and firewall settings"
fi

echo ""
echo "🎉 DEPLOYMENT SUMMARY:"
echo "====================="
echo "✅ Spring Boot application started"
echo "✅ Port 8080 is listening"
echo "✅ Local endpoint responding"
echo "📋 Logs: /var/log/ggwifi-backend.log"
echo "🌐 Test URL: http://api.ggwifi.co.tz:8080/api/v1/test"
echo ""

echo "📋 Monitoring Commands:"
echo "======================="
echo "View logs: tail -f /var/log/ggwifi-backend.log"
echo "Check process: ps aux | grep java"
echo "Test endpoint: curl http://localhost:8080/api/v1/test"
echo "Check port: netstat -tlnp | grep 8080"
echo ""

echo "🎯 Your backend is now running! Test the admin portal login."
