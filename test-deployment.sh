#!/bin/bash

echo "🚀 GGNetworks CI/CD Deployment Test"
echo "=================================="
echo ""

# Test backend connectivity
echo "📡 Testing Backend Connectivity..."
echo "Backend URL: http://api.ggwifi.co.tz:8080/api/v1/test"
echo ""

# Try different methods to test backend
echo "Method 1: Using wget..."
wget -qO- --timeout=10 http://api.ggwifi.co.tz:8080/api/v1/test 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is responding!"
else
    echo "❌ Backend not responding via wget"
fi

echo ""
echo "Method 2: Using telnet (port check)..."
timeout 5 bash -c "echo > /dev/tcp/api.ggwifi.co.tz/8080" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Port 8080 is open on api.ggwifi.co.tz"
else
    echo "❌ Port 8080 is not accessible"
fi

echo ""
echo "🔍 GitHub Actions Status Check:"
echo "Visit: https://github.com/Medaliusgg/ggwifi-billing-system/actions"
echo ""

echo "📋 Next Steps:"
echo "1. Check GitHub Actions workflow status"
echo "2. Configure GitHub secrets if deployment failed"
echo "3. Test frontend deployment to Cloudflare Pages"
echo ""

echo "🔧 Required GitHub Secrets:"
echo "- VPS_HOST: your-vps-ip-address"
echo "- VPS_USERNAME: root"
echo "- VPS_PASSWORD: your-vps-password"
echo "- VPS_PORT: 22"
echo "- CLOUDFLARE_API_TOKEN: your-cloudflare-api-token"
echo "- CLOUDFLARE_ACCOUNT_ID: your-cloudflare-account-id"
echo ""

echo "📖 Setup Guide:"
echo "https://github.com/Medaliusgg/ggwifi-billing-system/blob/main/setup-github-secrets.md"
