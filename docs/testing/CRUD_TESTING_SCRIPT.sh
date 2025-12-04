#!/bin/bash

# Comprehensive CRUD Testing Script
# Date: 2025-12-01

BASE_URL="http://localhost:8080"
TIMESTAMP=$(date +%s)

# Get JWT Token
echo "=== Getting JWT Token ==="
TOKEN=$(curl -s -X POST "$BASE_URL/api/v1/auth/admin-login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"testadmin","password":"testadmin123"}' | jq -r '.data.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✅ Token obtained"
echo ""

# Test Package CRUD
echo "=== Package CRUD Test ==="
echo "1. CREATE Package:"
PACKAGE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/admin/packages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"CRUD Test Package $TIMESTAMP\",
    \"description\": \"Testing CRUD operations\",
    \"packageType\": \"PREPAID\",
    \"price\": 10000,
    \"durationDays\": 30,
    \"dataLimitMb\": 51200,
    \"isUnlimitedData\": false,
    \"uploadSpeedMbps\": 5,
    \"downloadSpeedMbps\": 10,
    \"isActive\": true,
    \"isPopular\": false,
    \"isFeatured\": false,
    \"category\": \"BASIC\",
    \"status\": \"ACTIVE\",
    \"targetAudience\": \"INDIVIDUAL\",
    \"billingCycle\": \"MONTHLY\",
    \"speedTier\": \"STANDARD\"
  }")

PACKAGE_STATUS=$(echo "$PACKAGE_RESPONSE" | jq -r '.status')
PACKAGE_ID=$(echo "$PACKAGE_RESPONSE" | jq -r '.data.id // empty')

if [ "$PACKAGE_STATUS" = "success" ] && [ -n "$PACKAGE_ID" ] && [ "$PACKAGE_ID" != "null" ]; then
  echo "✅ Package created: ID=$PACKAGE_ID"
  
  echo ""
  echo "2. READ Package:"
  READ_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/admin/packages/$PACKAGE_ID")
  READ_STATUS=$(echo "$READ_RESPONSE" | jq -r '.status')
  if [ "$READ_STATUS" = "success" ]; then
    echo "✅ Package read successfully"
  else
    echo "❌ Failed to read package"
  fi
  
  echo ""
  echo "3. UPDATE Package:"
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/v1/admin/packages/$PACKAGE_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Updated CRUD Package $TIMESTAMP\",
      \"description\": \"Updated description\",
      \"packageType\": \"PREPAID\",
      \"price\": 12000,
      \"durationDays\": 30,
      \"dataLimitMb\": 51200,
      \"isUnlimitedData\": false,
      \"uploadSpeedMbps\": 5,
      \"downloadSpeedMbps\": 10,
      \"isActive\": true,
      \"category\": \"BASIC\",
      \"status\": \"ACTIVE\"
    }")
  UPDATE_STATUS=$(echo "$UPDATE_RESPONSE" | jq -r '.status')
  if [ "$UPDATE_STATUS" = "success" ]; then
    echo "✅ Package updated successfully"
  else
    echo "❌ Failed to update package"
  fi
  
  echo ""
  echo "4. DELETE Package:"
  DELETE_RESPONSE=$(curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/admin/packages/$PACKAGE_ID")
  DELETE_STATUS=$(echo "$DELETE_RESPONSE" | jq -r '.status')
  if [ "$DELETE_STATUS" = "success" ]; then
    echo "✅ Package deleted successfully"
  else
    echo "❌ Failed to delete package"
  fi
  
  echo ""
  echo "5. VERIFY DELETE:"
  VERIFY_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/admin/packages/$PACKAGE_ID")
  VERIFY_STATUS=$(echo "$VERIFY_RESPONSE" | jq -r '.status')
  if [ "$VERIFY_STATUS" = "error" ]; then
    echo "✅ Package deletion verified (404 expected)"
  else
    echo "⚠️ Package still exists"
  fi
else
  echo "❌ Failed to create package"
  echo "Response: $PACKAGE_RESPONSE"
fi

echo ""
echo "=== Customer CRUD Test ==="
echo "1. CREATE Customer:"
CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/admin/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Test\",
    \"lastName\": \"Customer\",
    \"email\": \"testcustomer$TIMESTAMP@example.com\",
    \"primaryPhoneNumber\": \"+2557$TIMESTAMP\",
    \"status\": \"ACTIVE\",
    \"accountType\": \"INDIVIDUAL\"
  }")

CUSTOMER_STATUS=$(echo "$CUSTOMER_RESPONSE" | jq -r '.status')
CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | jq -r '.data.id // empty')

if [ "$CUSTOMER_STATUS" = "success" ] && [ -n "$CUSTOMER_ID" ] && [ "$CUSTOMER_ID" != "null" ]; then
  echo "✅ Customer created: ID=$CUSTOMER_ID"
  
  echo ""
  echo "2. READ Customer:"
  READ_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/admin/customers/$CUSTOMER_ID")
  READ_STATUS=$(echo "$READ_RESPONSE" | jq -r '.status')
  if [ "$READ_STATUS" = "success" ]; then
    echo "✅ Customer read successfully"
  else
    echo "❌ Failed to read customer"
  fi
  
  echo ""
  echo "3. UPDATE Customer:"
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/v1/admin/customers/$CUSTOMER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"firstName\": \"Updated\",
      \"lastName\": \"Customer\",
      \"email\": \"updated$TIMESTAMP@example.com\",
      \"primaryPhoneNumber\": \"+2557$TIMESTAMP\",
      \"status\": \"ACTIVE\",
      \"accountType\": \"INDIVIDUAL\"
    }")
  UPDATE_STATUS=$(echo "$UPDATE_RESPONSE" | jq -r '.status')
  if [ "$UPDATE_STATUS" = "success" ]; then
    echo "✅ Customer updated successfully"
  else
    echo "❌ Failed to update customer"
  fi
  
  echo ""
  echo "4. DELETE Customer:"
  DELETE_RESPONSE=$(curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/admin/customers/$CUSTOMER_ID")
  DELETE_STATUS=$(echo "$DELETE_RESPONSE" | jq -r '.status')
  if [ "$DELETE_STATUS" = "success" ]; then
    echo "✅ Customer deleted successfully"
  else
    echo "❌ Failed to delete customer"
  fi
else
  echo "❌ Failed to create customer"
  echo "Response: $CUSTOMER_RESPONSE"
fi

echo ""
echo "=== Test Complete ==="




