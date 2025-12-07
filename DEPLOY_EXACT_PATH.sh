#!/bin/bash

# Exact deployment script for VPS
# Backend path: /opt/ggwifi-src/ggwifi-billing-system/backend/

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOYING LATEST BACKEND CODE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BACKEND_DIR="/opt/ggwifi-src/ggwifi-billing-system/backend"
cd "$BACKEND_DIR" || exit 1

echo "📁 Backend directory: $BACKEND_DIR"
echo ""

# Step 1: Check current status
echo "1️⃣  Checking current git status..."
git status
echo ""
echo "📋 Recent commits:"
git log --oneline -5
echo ""

# Step 2: Pull latest code
echo "2️⃣  Pulling latest code from repository..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Failed to pull latest code!"
    exit 1
fi
echo "✅ Code pulled successfully"
echo ""

# Step 3: Stop existing backend
echo "3️⃣  Stopping existing backend..."
if systemctl is-active --quiet ggwifi-backend 2>/dev/null; then
    sudo systemctl stop ggwifi-backend
    echo "✅ Stopped via systemd"
elif command -v pm2 &> /dev/null && pm2 list | grep -q ggwifi-backend; then
    pm2 stop ggwifi-backend
    echo "✅ Stopped via PM2"
else
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

# Step 4: Build backend
echo "4️⃣  Building backend (this may take 1-2 minutes)..."
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 5: Start backend
echo "5️⃣  Starting backend..."
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

# Step 6: Wait for startup
echo "6️⃣  Waiting for backend to start (30 seconds)..."
sleep 30
echo ""

# Step 7: Verify deployment
echo "7️⃣  Verifying deployment..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/customer-portal/packages 2>&1 || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "✅ Backend is responding (HTTP $HTTP_CODE)"
else
    echo "⚠️  Backend may still be starting (HTTP $HTTP_CODE)"
    echo "   Check logs: tail -f $BACKEND_DIR/logs/backend.log"
fi
echo ""

# Step 8: Test CORS
echo "8️⃣  Testing CORS configuration..."
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

