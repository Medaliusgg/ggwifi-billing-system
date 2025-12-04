#!/bin/bash

# Remote VPS Testing Script
# Run this from your local machine to test the VPS backend

VPS_IP=""
VPS_PORT="8080"
BASE_URL=""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# VPS IP (default to production VPS)
VPS_IP="${1:-139.84.241.182}"
echo "Using VPS IP: $VPS_IP"

BASE_URL="http://$VPS_IP:$VPS_PORT/api/v1"

echo "=== Testing VPS Backend ==="
echo "VPS: $VPS_IP"
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Health Check
echo "1. Testing health endpoint..."
HEALTH=$(curl -s "$BASE_URL/health" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Health endpoint responding${NC}"
    echo "$HEALTH" | jq . 2>/dev/null || echo "$HEALTH"
else
    echo -e "${RED}❌ Health endpoint failed${NC}"
fi
echo ""

# Test 2: Authentication
echo "2. Testing authentication..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/admin-login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"testadmin","password":"testadmin123"}')

TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.data.token // empty')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo -e "${GREEN}✅ Authentication successful${NC}"
    echo "Token: ${TOKEN:0:30}..."
else
    echo -e "${RED}❌ Authentication failed${NC}"
    echo "$TOKEN_RESPONSE" | jq . 2>/dev/null || echo "$TOKEN_RESPONSE"
    exit 1
fi
echo ""

# Test 3: CRUD Operations
echo "3. Testing CRUD operations..."

# Create Customer
TIMESTAMP=$(date +%s)
CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"VPS\",
    \"lastName\": \"Test\",
    \"email\": \"vps$TIMESTAMP@example.com\",
    \"primaryPhoneNumber\": \"+2557$TIMESTAMP\",
    \"status\": \"ACTIVE\",
    \"accountType\": \"INDIVIDUAL\"
  }")

CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | jq -r '.data.id // empty')
CUSTOMER_STATUS=$(echo "$CUSTOMER_RESPONSE" | jq -r '.status // "error"')

if [ "$CUSTOMER_STATUS" = "success" ] && [ -n "$CUSTOMER_ID" ]; then
    echo -e "${GREEN}✅ Customer created: ID=$CUSTOMER_ID${NC}"
else
    echo -e "${RED}❌ Customer creation failed${NC}"
    echo "$CUSTOMER_RESPONSE" | jq . 2>/dev/null || echo "$CUSTOMER_RESPONSE"
fi
echo ""

# Read Customer
if [ -n "$CUSTOMER_ID" ]; then
    READ_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/customers/$CUSTOMER_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    READ_STATUS=$(echo "$READ_RESPONSE" | jq -r '.status // "error"')
    if [ "$READ_STATUS" = "success" ]; then
        echo -e "${GREEN}✅ Customer read successful${NC}"
    else
        echo -e "${RED}❌ Customer read failed${NC}"
    fi
    echo ""
fi

# Test 4: Database Connection
echo "4. Testing database connection (via API)..."
# This is indirect - if CRUD works, database is connected
if [ "$CUSTOMER_STATUS" = "success" ]; then
    echo -e "${GREEN}✅ Database connection verified (CRUD operations working)${NC}"
else
    echo -e "${YELLOW}⚠️  Database connection status unknown${NC}"
fi
echo ""

# Summary
echo "=== Test Summary ==="
echo "VPS IP: $VPS_IP"
echo "Health: $([ -n "$HEALTH" ] && echo "✅" || echo "❌")"
echo "Authentication: $([ -n "$TOKEN" ] && echo "✅" || echo "❌")"
echo "CRUD Operations: $([ "$CUSTOMER_STATUS" = "success" ] && echo "✅" || echo "❌")"
echo ""

if [ -n "$TOKEN" ] && [ "$CUSTOMER_STATUS" = "success" ]; then
    echo -e "${GREEN}✅ VPS Backend is working correctly!${NC}"
else
    echo -e "${RED}❌ Some tests failed. Check VPS configuration.${NC}"
fi

