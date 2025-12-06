#!/bin/bash

# Monitor payment status for real payment test
API_BASE="http://139.84.241.182:8080/api/v1/customer-portal"

# Get order ID from file or ask
if [ -f /tmp/real_payment_order_id.txt ]; then
    ORDER_ID=$(cat /tmp/real_payment_order_id.txt)
else
    read -p "Enter Order ID: " ORDER_ID
fi

if [ -z "$ORDER_ID" ]; then
    echo "❌ No order ID provided"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 Monitoring Payment Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Order ID: $ORDER_ID"
echo ""
echo "⏳ Polling every 5 seconds... (Press Ctrl+C to stop)"
echo ""

MAX_ATTEMPTS=60  # 5 minutes
ATTEMPT=0
LAST_STATUS=""

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    CURRENT_TIME=$(date '+%H:%M:%S')
    
    response=$(curl -s -X GET "${API_BASE}/payment/status/$ORDER_ID" -H "Content-Type: application/json")
    status=$(echo "$response" | grep -o '"payment_status":"[^"]*"' | cut -d'"' -f4)
    voucher_code=$(echo "$response" | grep -o '"voucher_code":"[^"]*"' | cut -d'"' -f4)
    message=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    
    # Print status update
    if [ "$status" != "$LAST_STATUS" ] || [ $ATTEMPT -eq 1 ]; then
        echo "[$CURRENT_TIME] Status: $status"
        if [ -n "$message" ]; then
            echo "   Message: $message"
        fi
        if [ -n "$voucher_code" ]; then
            echo "   ✅ Voucher Code: $voucher_code"
        fi
        echo ""
        LAST_STATUS="$status
    fi
    
    # Check if completed
    if [ "$status" = "COMPLETED" ] || [ "$status" = "SUCCESS" ] || [ "$status" = "SUCCESSFUL" ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ PAYMENT COMPLETED!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Full Response:"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
        exit 0
    fi
    
    # Check if failed
    if [ "$status" = "FAILED" ] || [ "$status" = "CANCELLED" ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "❌ PAYMENT FAILED"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Full Response:"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
        exit 1
    fi
    
    sleep 5
done

echo ""
echo "⏰ Timeout: Still waiting for webhook..."
echo "   The webhook may still arrive. Check backend logs."

