#!/bin/bash

# Reset Admin User via Backend API
# This uses the backend's password encoder to properly hash the password

echo "🔄 Resetting admin user via backend API..."
echo ""

# Backend API URL
API_URL="https://api.ggwifi.co.tz/api/v1/testing/reset-admin"

echo "📡 Calling: $API_URL"
echo ""

# Make the API call
response=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json")

echo "📥 Response:"
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""

# Check if successful
if echo "$response" | grep -q "success"; then
  echo "✅ Admin user reset successfully!"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔐 Login Credentials"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Username: medalius"
  echo "Phone: 0742844024"
  echo "Password: Kolombo@123%"
  echo ""
else
  echo "❌ Failed to reset admin user"
  echo "Response: $response"
fi




