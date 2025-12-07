#!/bin/bash

# Deploy ZenoPay Webhook Fixes to VPS

set -e

VPS_HOST="${VPS_HOST:-api.ggwifi.co.tz}"
VPS_USER="${VPS_USER:-root}"
PROJECT_DIR="${PROJECT_DIR:-/opt/ggwifi/backend}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOYING ZENOPAY WEBHOOK FIXES TO VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "VPS Host: $VPS_HOST"
echo "VPS User: $VPS_USER"
echo "Project Dir: $PROJECT_DIR"
echo ""

# Step 1: Build backend locally
echo "📦 Step 1: Building backend..."
cd backend
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
cd ..

# Step 2: Deploy to VPS
echo ""
echo "📤 Step 2: Deploying to VPS..."
echo "   This will:"
echo "   1. SSH to VPS"
echo "   2. Pull latest code"
echo "   3. Build backend"
echo "   4. Restart service"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

# SSH and deploy
ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
set -e
cd /opt/ggwifi/backend || cd ~/ggwifi-billing-system/backend

echo "📥 Pulling latest code..."
git pull origin main

echo "🔨 Building backend..."
./mvnw clean package -DskipTests

echo "🛑 Stopping backend service..."
sudo systemctl stop ggwifi-backend || systemctl stop ggwifi-backend || true

echo "💾 Backing up current JAR..."
if [ -f target/ggnetworks-backend.jar ]; then
    cp target/ggnetworks-backend.jar target/ggnetworks-backend.jar.backup.$(date +%Y%m%d_%H%M%S)
fi

echo "📦 Copying new JAR..."
cp target/ggnetworks-backend.jar /opt/ggwifi/backend/ || cp target/ggnetworks-backend.jar ~/ggwifi-backend.jar

echo "▶️  Starting backend service..."
sudo systemctl start ggwifi-backend || systemctl start ggwifi-backend

echo "⏳ Waiting for service to start..."
sleep 5

echo "✅ Deployment complete!"
ENDSSH

# Step 3: Verify deployment
echo ""
echo "🔍 Step 3: Verifying deployment..."
sleep 3

# Check if backend is responding
if curl -s -f "https://api.ggwifi.co.tz/api/v1/customer-portal/packages" > /dev/null; then
    echo "✅ Backend is responding"
else
    echo "⚠️  Backend may not be responding yet (check manually)"
fi

# Test webhook authentication
echo ""
echo "🧪 Testing webhook authentication..."
echo "   Testing without API key (should return 401)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "https://api.ggwifi.co.tz/api/v1/customer-portal/webhook/zenopay" \
  -H "Content-Type: application/json" \
  -d '{"order_id":"test"}')

if [ "$HTTP_CODE" = "401" ]; then
    echo "✅ Webhook authentication working (returns 401 without key)"
else
    echo "⚠️  Unexpected response: $HTTP_CODE (expected 401)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "   1. Test payment flow with phone: 0658823944"
echo "   2. Monitor backend logs for webhook reception"
echo "   3. Verify frontend detects status changes"
echo "   4. Test insufficient balance scenario"
echo ""
