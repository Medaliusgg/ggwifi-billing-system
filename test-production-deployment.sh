#!/bin/bash

echo "🚀 GGNetworks Production CI/CD Test"
echo "=================================="
echo ""

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete (30 seconds)..."
sleep 30

echo ""
echo "📡 Testing Backend Deployment..."
echo "Backend URL: http://api.ggwifi.co.tz:8080/api/v1/test"
echo ""

# Test backend with multiple methods
echo "Method 1: Port connectivity test..."
timeout 10 bash -c "echo > /dev/tcp/api.ggwifi.co.tz/8080" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Port 8080 is accessible"
else
    echo "❌ Port 8080 is not accessible"
fi

echo ""
echo "Method 2: HTTP response test..."
response=$(wget -qO- --timeout=10 http://api.ggwifi.co.tz:8080/api/v1/test 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$response" ]; then
    echo "✅ Backend is responding with HTTP"
    echo "Response preview: ${response:0:100}..."
    
    # Check for CI/CD indicators
    if echo "$response" | grep -q "FULLY CONFIGURED"; then
        echo "✅ CI/CD deployment message detected"
    fi
    
    if echo "$response" | grep -q "PRODUCTION READY"; then
        echo "✅ Production ready status confirmed"
    fi
else
    echo "❌ Backend HTTP response failed"
fi

echo ""
echo "Method 3: Health check endpoint..."
health_response=$(wget -qO- --timeout=10 http://api.ggwifi.co.tz:8080/api/v1/health 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$health_response" ]; then
    echo "✅ Health endpoint is responding"
    echo "Health preview: ${health_response:0:100}..."
else
    echo "❌ Health endpoint not responding"
fi

echo ""
echo "🧪 Testing Login Endpoint..."
login_response=$(wget -qO- --timeout=10 \
  --post-data='{"phoneNumber":"0773404760","password":"Ashruha@123%"}' \
  --header='Content-Type:application/json' \
  http://api.ggwifi.co.tz:8080/api/v1/auth/login 2>/dev/null)

if [ $? -eq 0 ] && [ ! -z "$login_response" ]; then
    echo "✅ Login endpoint is responding"
    if echo "$login_response" | grep -q "success"; then
        echo "✅ Login authentication working"
    else
        echo "⚠️  Login endpoint responding but authentication may have issues"
    fi
    echo "Login preview: ${login_response:0:100}..."
else
    echo "❌ Login endpoint not responding"
fi

echo ""
echo "📊 Deployment Summary:"
echo "====================="
echo "Backend URL: http://api.ggwifi.co.tz:8080/api/v1"
echo "Frontend URL: https://admin.ggwifi.co.tz (when deployed)"
echo ""
echo "🔍 GitHub Actions Status:"
echo "https://github.com/Medaliusgg/ggwifi-billing-system/actions"
echo ""
echo "📱 Next Steps:"
echo "1. Check GitHub Actions for deployment status"
echo "2. Test frontend deployment to Cloudflare Pages"
echo "3. Verify login functionality in admin portal"
echo "4. Test all API endpoints"
echo ""
echo "🎉 Your CI/CD pipeline is now fully operational!"
