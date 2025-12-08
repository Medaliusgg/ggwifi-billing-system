#!/bin/bash

# Fix Backend CORS 502 Error
# This script will check and fix backend issues

set -e

VPS_HOST="139.84.241.182"
VPS_USER="root"
SERVICE_NAME="ggnetworks-backend"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 FIXING BACKEND CORS 502 ERROR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
set -e

echo "1️⃣  Checking backend service status..."
if systemctl is-active --quiet ggnetworks-backend 2>/dev/null; then
    echo "   ✅ Service is running"
    systemctl status ggnetworks-backend --no-pager | head -10
else
    echo "   ❌ Service is NOT running"
    echo ""
    echo "2️⃣  Checking if port 8080 is in use..."
    PORT_CHECK=$(netstat -tlnp | grep :8080 || ss -tlnp | grep :8080 || echo "")
    if [ -n "$PORT_CHECK" ]; then
        echo "   ⚠️  Port 8080 is in use:"
        echo "   $PORT_CHECK"
        echo ""
        echo "   Killing process on port 8080..."
        PID=$(lsof -ti:8080 || fuser 8080/tcp 2>/dev/null | awk '{print $1}' || echo "")
        if [ -n "$PID" ]; then
            kill -9 $PID 2>/dev/null || true
            echo "   ✅ Killed process $PID"
        fi
    else
        echo "   ✅ Port 8080 is free"
    fi
    echo ""
    echo "3️⃣  Starting backend service..."
    systemctl start ggnetworks-backend
    sleep 5
    systemctl status ggnetworks-backend --no-pager | head -10
fi

echo ""
echo "4️⃣  Checking backend logs for errors..."
echo "   Last 20 lines of logs:"
journalctl -u ggnetworks-backend -n 20 --no-pager | tail -20 || echo "   No logs found"

echo ""
echo "5️⃣  Testing backend locally..."
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/customer-portal/packages 2>&1 || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "   ✅ Backend is responding (HTTP $HTTP_CODE)"
else
    echo "   ❌ Backend not responding (HTTP $HTTP_CODE)"
    echo "   Check logs: journalctl -u ggnetworks-backend -f"
fi

echo ""
echo "6️⃣  Testing CORS headers..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS http://localhost:8080/api/v1/customer-portal/packages \
  -H "Origin: https://hotspot.ggwifi.co.tz" \
  -H "Access-Control-Request-Method: GET" 2>&1 | grep -i "access-control" || echo "No CORS headers")
if [ -n "$CORS_RESPONSE" ]; then
    echo "   ✅ CORS headers present:"
    echo "   $CORS_RESPONSE"
else
    echo "   ⚠️  No CORS headers found"
fi

ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DIAGNOSIS COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "   1. If backend is not running, deploy latest code:"
echo "      ./deploy-to-vps-now.sh"
echo ""
echo "   2. Check backend logs:"
echo "      ssh root@139.84.241.182 'journalctl -u ggnetworks-backend -f'"
echo ""
echo "   3. Test backend directly:"
echo "      curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages"
echo ""


