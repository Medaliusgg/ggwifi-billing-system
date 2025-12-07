#!/bin/bash

# Diagnostic Script to Identify Frontend vs Backend Issue

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_BASE_URL="${API_BASE_URL:-https://api.ggwifi.co.tz/api/v1}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 PAYMENT ISSUE DIAGNOSTIC TOOL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will help identify if the issue is in FRONTEND or BACKEND"
echo ""

# Get order ID from user
read -p "Enter Order ID to diagnose (e.g., PKG_1765055665321_3944_1): " ORDER_ID

if [ -z "$ORDER_ID" ]; then
    echo "❌ Order ID is required"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  TESTING BACKEND STATUS ENDPOINT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test backend status endpoint
STATUS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/customer-portal/payment/status/$ORDER_ID" \
  -H "Accept: application/json" \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$STATUS_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
STATUS_BODY=$(echo "$STATUS_RESPONSE" | sed '/HTTP_CODE/d')

echo "📥 Backend Response:"
echo "$STATUS_BODY" | jq '.' 2>/dev/null || echo "$STATUS_BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    PAYMENT_STATUS=$(echo "$STATUS_BODY" | jq -r '.payment_status // "UNKNOWN"' 2>/dev/null || echo "UNKNOWN")
    VOUCHER_CODE=$(echo "$STATUS_BODY" | jq -r '.voucher_code // null' 2>/dev/null || echo "null")
    MESSAGE=$(echo "$STATUS_BODY" | jq -r '.message // ""' 2>/dev/null || echo "")
    
    echo "✅ Backend Status Endpoint: WORKING"
    echo "   HTTP Code: $HTTP_CODE"
    echo "   Payment Status: $PAYMENT_STATUS"
    echo "   Voucher Code: $VOUCHER_CODE"
    echo "   Message: $MESSAGE"
    echo ""
    
    if [ "$PAYMENT_STATUS" = "COMPLETED" ] || [ "$PAYMENT_STATUS" = "SUCCESS" ] || [ "$PAYMENT_STATUS" = "SUCCESSFUL" ]; then
        echo "✅ Backend shows payment as COMPLETED"
        echo "   → If frontend shows PENDING/processing: FRONTEND ISSUE"
        echo "   → Backend is working correctly"
    elif [ "$PAYMENT_STATUS" = "FAILED" ] || [ "$PAYMENT_STATUS" = "INSUFFICIENT_BALANCE" ] || [ "$PAYMENT_STATUS" = "INVALID_PIN" ]; then
        echo "⚠️  Backend shows payment as FAILED: $PAYMENT_STATUS"
        echo "   → If frontend shows processing: FRONTEND ISSUE"
        echo "   → Backend is working correctly"
    elif [ "$PAYMENT_STATUS" = "PENDING" ]; then
        echo "⏳ Backend shows payment as PENDING"
        echo "   → This is expected if payment not completed yet"
        echo "   → Check if webhook was received"
    else
        echo "❓ Backend shows unknown status: $PAYMENT_STATUS"
    fi
else
    echo "❌ Backend Status Endpoint: FAILED"
    echo "   HTTP Code: $HTTP_CODE"
    echo "   → BACKEND ISSUE: Status endpoint not working"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  CHECKING FRONTEND POLLING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 To check frontend polling:"
echo "   1. Open browser DevTools (F12)"
echo "   2. Go to Console tab"
echo "   3. Look for these logs:"
echo ""
echo "   Expected logs:"
echo "   🔄 Starting payment status polling for order: $ORDER_ID"
echo "   🔄 Polling attempt X/30 (Ys elapsed)"
echo "   📊 Payment status update: $PAYMENT_STATUS"
echo "   📊 Payment status update received: {...}"
echo ""
echo "   If these logs are MISSING:"
echo "   → FRONTEND ISSUE: Polling not running"
echo ""
echo "   If these logs are PRESENT but UI not updating:"
echo "   → FRONTEND ISSUE: React re-render problem"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  DIAGNOSIS SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$PAYMENT_STATUS" = "COMPLETED" ] || [ "$PAYMENT_STATUS" = "SUCCESS" ] || [ "$PAYMENT_STATUS" = "SUCCESSFUL" ]; then
    echo "🎯 LIKELY ISSUE: FRONTEND"
    echo ""
    echo "Reason:"
    echo "   • Backend shows payment as COMPLETED ✅"
    echo "   • Backend status endpoint is working ✅"
    echo "   • If UI shows PENDING/processing: Frontend not detecting status change"
    echo ""
    echo "Frontend Issues to Check:"
    echo "   1. Is polling running? (Check console logs)"
    echo "   2. Is status callback firing? (Check console logs)"
    echo "   3. Is React state updating? (Check React DevTools)"
    echo "   4. Is UI re-rendering? (Check component updates)"
elif [ "$PAYMENT_STATUS" = "FAILED" ] || [ "$PAYMENT_STATUS" = "INSUFFICIENT_BALANCE" ] || [ "$PAYMENT_STATUS" = "INVALID_PIN" ]; then
    echo "🎯 LIKELY ISSUE: FRONTEND"
    echo ""
    echo "Reason:"
    echo "   • Backend shows payment as FAILED: $PAYMENT_STATUS ✅"
    echo "   • Backend status endpoint is working ✅"
    echo "   • If UI shows processing: Frontend not detecting status change"
    echo ""
    echo "Frontend Issues to Check:"
    echo "   1. Is polling detecting failure status?"
    echo "   2. Is error message displayed?"
    echo "   3. Is UI updating to show failure?"
elif [ "$PAYMENT_STATUS" = "PENDING" ]; then
    echo "⏳ STATUS: PENDING"
    echo ""
    echo "This could be:"
    echo "   1. Payment not completed yet (normal)"
    echo "   2. Webhook not received (BACKEND issue)"
    echo "   3. Database not updated (BACKEND issue)"
    echo ""
    echo "To verify:"
    echo "   • Check backend logs for webhook reception"
    echo "   • Check database: SELECT status FROM payment WHERE payment_id = '$ORDER_ID'"
else
    echo "❓ UNKNOWN STATUS: $PAYMENT_STATUS"
    echo ""
    echo "Check:"
    echo "   • Backend logs for errors"
    echo "   • Database for payment record"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  NEXT STEPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If Backend Status = COMPLETED/FAILED but UI shows PENDING:"
echo "   → FRONTEND ISSUE"
echo "   → Check frontend console logs"
echo "   → Verify polling is running"
echo "   → Check React state updates"
echo ""
echo "If Backend Status = PENDING (but payment completed on phone):"
echo "   → BACKEND ISSUE"
echo "   → Check webhook logs"
echo "   → Verify database update"
echo "   → Check webhook URL configuration"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

