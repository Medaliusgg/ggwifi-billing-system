#!/bin/bash

# Quick deployment script for VPS backend
# Run this on your VPS server

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOYING LATEST BACKEND CODE TO VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Detect backend directory
if [ -d "/opt/ggwifi/backend" ]; then
    BACKEND_DIR="/opt/ggwifi/backend"
elif [ -d "/home/ggwifi/backend" ]; then
    BACKEND_DIR="/home/ggwifi/backend"
elif [ -d "./backend" ]; then
    BACKEND_DIR="./backend"
else
    echo "❌ Backend directory not found!"
    echo "Please specify backend directory:"
    read -p "Backend directory path: " BACKEND_DIR
fi

cd "$BACKEND_DIR" || exit 1

echo "📁 Backend directory: $BACKEND_DIR"
echo ""

# Step 1: Pull latest code
echo "1️⃣  Pulling latest code from repository..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Failed to pull latest code!"
    exit 1
fi
echo "✅ Code pulled successfully"
echo ""

# Step 2: Stop existing backend
echo "2️⃣  Stopping existing backend..."
if systemctl is-active --quiet ggwifi-backend 2>/dev/null; then
    sudo systemctl stop ggwifi-backend
    echo "✅ Stopped systemd service"
elif command -v pm2 &> /dev/null && pm2 list | grep -q ggwifi-backend; then
    pm2 stop ggwifi-backend
    echo "✅ Stopped PM2 process"
else
    # Try to find and kill Java process
    JAVA_PID=$(ps aux | grep "[j]ava.*ggnetworks" | awk '{print $2}' | head -1)
    if [ -n "$JAVA_PID" ]; then
        kill $JAVA_PID
        sleep 2
        echo "✅ Stopped Java process (PID: $JAVA_PID)"
    else
        echo "⚠️  No running backend process found"
    fi
fi
echo ""

# Step 3: Build backend
echo "3️⃣  Building backend..."
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 4: Start backend
echo "4️⃣  Starting backend..."
if [ -f "/etc/systemd/system/ggwifi-backend.service" ]; then
    sudo systemctl start ggwifi-backend
    sudo systemctl status ggwifi-backend --no-pager | head -5
    echo "✅ Started via systemd"
elif command -v pm2 &> /dev/null; then
    pm2 start target/ggnetworks-backend-1.0.0.jar --name ggwifi-backend
    pm2 save
    echo "✅ Started via PM2"
else
    mkdir -p logs
    nohup java -jar target/ggnetworks-backend-1.0.0.jar > logs/backend.log 2>&1 &
    echo "✅ Started manually (PID: $!)"
fi
echo ""

# Step 5: Wait for startup
echo "5️⃣  Waiting for backend to start (30 seconds)..."
sleep 30
echo ""

# Step 6: Verify deployment
echo "6️⃣  Verifying deployment..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/customer-portal/packages 2>&1 || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "✅ Backend is responding (HTTP $HTTP_CODE)"
else
    echo "⚠️  Backend may still be starting (HTTP $HTTP_CODE)"
    echo "   Check logs: tail -f $BACKEND_DIR/logs/backend.log"
fi
echo ""

# Step 7: Test CORS
echo "7️⃣  Testing CORS configuration..."
CORS_TEST=$(curl -s -I -X OPTIONS http://localhost:8080/api/v1/customer-portal/payment/status/test \
  -H "Origin: https://hotspot.ggwifi.co.tz" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" 2>&1 | grep -i "access-control-allow-origin" | head -1)

if echo "$CORS_TEST" | grep -q "hotspot.ggwifi.co.tz"; then
    echo "✅ CORS configured correctly"
    echo "   $CORS_TEST"
else
    echo "⚠️  CORS may need verification"
    echo "   Response: $CORS_TEST"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "   1. Test from customer portal: https://hotspot.ggwifi.co.tz"
echo "   2. Check browser console for errors"
echo "   3. Monitor logs: tail -f $BACKEND_DIR/logs/backend.log"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

