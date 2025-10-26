#!/bin/bash

echo "🔍 GGNetworks Deployment Status Check"
echo "===================================="
echo ""

# Get current timestamp
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
echo "📅 Check Time: $timestamp"
echo ""

# Test backend connectivity
echo "📡 Backend Connectivity Test:"
echo "Backend URL: http://api.ggwifi.co.tz:8080/api/v1/test"
echo ""

# Method 1: Port check
echo "1️⃣ Port Connectivity:"
timeout 5 bash -c "echo > /dev/tcp/api.ggwifi.co.tz/8080" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Port 8080 is accessible"
    port_status="✅ OPEN"
else
    echo "   ❌ Port 8080 is not accessible"
    port_status="❌ CLOSED"
fi

# Method 2: HTTP test endpoint
echo ""
echo "2️⃣ HTTP Test Endpoint:"
response=$(wget -qO- --timeout=10 http://api.ggwifi.co.tz:8080/api/v1/test 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$response" ]; then
    echo "   ✅ Test endpoint responding"
    echo "   📄 Response: ${response:0:150}..."
    http_status="✅ RESPONDING"
    
    # Check for CI/CD indicators
    if echo "$response" | grep -q "FULLY CONFIGURED"; then
        echo "   🎯 CI/CD deployment confirmed"
        cicd_status="✅ DEPLOYED"
    else
        echo "   ⚠️  CI/CD deployment not detected"
        cicd_status="⚠️  PENDING"
    fi
else
    echo "   ❌ Test endpoint not responding"
    http_status="❌ NOT RESPONDING"
    cicd_status="❌ UNKNOWN"
fi

# Method 3: Health check
echo ""
echo "3️⃣ Health Check Endpoint:"
health_response=$(wget -qO- --timeout=10 http://api.ggwifi.co.tz:8080/api/v1/health 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$health_response" ]; then
    echo "   ✅ Health endpoint responding"
    echo "   📄 Health: ${health_response:0:100}..."
    health_status="✅ HEALTHY"
else
    echo "   ❌ Health endpoint not responding"
    health_status="❌ UNHEALTHY"
fi

# Method 4: Login test
echo ""
echo "4️⃣ Login Endpoint Test:"
login_response=$(wget -qO- --timeout=10 \
  --post-data='{"phoneNumber":"0773404760","password":"Ashruha@123%"}' \
  --header='Content-Type:application/json' \
  http://api.ggwifi.co.tz:8080/api/v1/auth/login 2>/dev/null)

if [ $? -eq 0 ] && [ ! -z "$login_response" ]; then
    echo "   ✅ Login endpoint responding"
    if echo "$login_response" | grep -q "success"; then
        echo "   🔐 Authentication working"
        login_status="✅ WORKING"
    else
        echo "   ⚠️  Login responding but auth may have issues"
        login_status="⚠️  ISSUES"
    fi
    echo "   📄 Login: ${login_response:0:100}..."
else
    echo "   ❌ Login endpoint not responding"
    login_status="❌ NOT WORKING"
fi

# Summary
echo ""
echo "📊 DEPLOYMENT STATUS SUMMARY:"
echo "============================"
echo "Port 8080:        $port_status"
echo "HTTP Response:    $http_status"
echo "Health Check:     $health_status"
echo "Login Auth:       $login_status"
echo "CI/CD Deploy:     $cicd_status"
echo ""

# Overall status
if [ "$port_status" = "✅ OPEN" ] && [ "$http_status" = "✅ RESPONDING" ]; then
    if [ "$cicd_status" = "✅ DEPLOYED" ]; then
        echo "🎉 DEPLOYMENT STATUS: FULLY OPERATIONAL"
        echo "   ✅ Backend is running with latest CI/CD deployment"
    else
        echo "🔄 DEPLOYMENT STATUS: RUNNING (Old Version)"
        echo "   ⚠️  Backend is running but may not have latest changes"
    fi
else
    echo "❌ DEPLOYMENT STATUS: NOT OPERATIONAL"
    echo "   🔧 Backend is not responding properly"
fi

echo ""
echo "🔗 Monitoring Links:"
echo "==================="
echo "GitHub Actions:    https://github.com/Medaliusgg/ggwifi-billing-system/actions"
echo "Backend Test:      http://api.ggwifi.co.tz:8080/api/v1/test"
echo "Health Check:      http://api.ggwifi.co.tz:8080/api/v1/health"
echo "Admin Portal:      https://admin.ggwifi.co.tz (when deployed)"
echo ""

echo "📋 Next Steps:"
echo "=============="
if [ "$cicd_status" = "✅ DEPLOYED" ]; then
    echo "✅ Backend deployment successful!"
    echo "🔄 Check frontend deployment in GitHub Actions"
    echo "🧪 Test admin portal login functionality"
else
    echo "🔍 Check GitHub Actions for deployment status"
    echo "⏳ Wait for deployment to complete (may take 5-10 minutes)"
    echo "🔧 If stuck, check VPS logs or restart deployment"
fi

echo ""
echo "🔄 Run this script again to check updated status"
echo "   Command: ./check-deployment-status.sh"
