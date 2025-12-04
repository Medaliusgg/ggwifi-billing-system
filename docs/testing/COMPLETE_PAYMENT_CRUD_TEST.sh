#!/bin/bash

# Complete Payment CRUD Testing Script
# This script tests the full Payment CRUD flow with invoice creation

BASE_URL="http://localhost:8080/api/v1"
TOKEN=""

echo "=== Complete Payment CRUD Testing ==="
echo ""

# Step 1: Get authentication token
echo "1. Authenticating..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/admin-login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"testadmin","password":"testadmin123"}')

TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.data.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Authentication failed"
  echo "$TOKEN_RESPONSE" | jq .
  exit 1
fi

echo "✅ Authentication successful"
echo ""

# Step 2: Create Customer
echo "2. Creating Customer..."
TIMESTAMP=$(date +%s)
CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Payment\",
    \"lastName\": \"Test\",
    \"email\": \"payment$TIMESTAMP@example.com\",
    \"primaryPhoneNumber\": \"+2557$TIMESTAMP\",
    \"status\": \"ACTIVE\",
    \"accountType\": \"INDIVIDUAL\"
  }")

CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | jq -r '.data.id // empty')
CUSTOMER_STATUS=$(echo "$CUSTOMER_RESPONSE" | jq -r '.status // "error"')

if [ -z "$CUSTOMER_ID" ] || [ "$CUSTOMER_ID" = "null" ]; then
  echo "❌ Customer creation failed"
  echo "$CUSTOMER_RESPONSE" | jq .
  exit 1
fi

echo "✅ Customer created: ID=$CUSTOMER_ID"
echo ""

# Step 3: Create Invoice
echo "3. Creating Invoice..."
INVOICE_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/invoices" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"customerId\": $CUSTOMER_ID,
    \"amount\": 10000,
    \"totalAmount\": 10000,
    \"currency\": \"TZS\",
    \"status\": \"PENDING\"
  }")

INVOICE_ID=$(echo "$INVOICE_RESPONSE" | jq -r '.data.id // empty')
INVOICE_STATUS=$(echo "$INVOICE_RESPONSE" | jq -r '.status // "error"')

if [ -z "$INVOICE_ID" ] || [ "$INVOICE_ID" = "null" ]; then
  echo "❌ Invoice creation failed"
  echo "$INVOICE_RESPONSE" | jq .
  echo ""
  echo "⚠️ Note: Invoice endpoint may need server restart"
  exit 1
fi

echo "✅ Invoice created: ID=$INVOICE_ID"
echo ""

# Step 4: Create Payment
echo "4. Creating Payment..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/payments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"customerId\": $CUSTOMER_ID,
    \"invoiceId\": $INVOICE_ID,
    \"amount\": 10000,
    \"paymentMethod\": \"MPESA\",
    \"paymentGateway\": \"SELCOM\",
    \"currency\": \"TZS\",
    \"description\": \"Test payment\"
  }")

PAYMENT_ID=$(echo "$PAYMENT_RESPONSE" | jq -r '.data.id // empty')
PAYMENT_STATUS=$(echo "$PAYMENT_RESPONSE" | jq -r '.status // "error"')

if [ -z "$PAYMENT_ID" ] || [ "$PAYMENT_ID" = "null" ]; then
  echo "❌ Payment creation failed"
  echo "$PAYMENT_RESPONSE" | jq .
  exit 1
fi

echo "✅ Payment created: ID=$PAYMENT_ID"
echo ""

# Step 5: Read Payment
echo "5. Reading Payment..."
READ_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/payments/$PAYMENT_ID" \
  -H "Authorization: Bearer $TOKEN")

READ_STATUS=$(echo "$READ_RESPONSE" | jq -r '.status // "error"')

if [ "$READ_STATUS" = "success" ]; then
  echo "✅ Payment read successful"
else
  echo "❌ Payment read failed"
  echo "$READ_RESPONSE" | jq .
fi
echo ""

# Step 6: Update Payment
echo "6. Updating Payment..."
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/admin/payments/$PAYMENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"customerId\": $CUSTOMER_ID,
    \"invoiceId\": $INVOICE_ID,
    \"amount\": 12000,
    \"paymentMethod\": \"MPESA\",
    \"paymentGateway\": \"SELCOM\",
    \"currency\": \"TZS\",
    \"description\": \"Updated payment\"
  }")

UPDATE_STATUS=$(echo "$UPDATE_RESPONSE" | jq -r '.status // "error"')

if [ "$UPDATE_STATUS" = "success" ]; then
  echo "✅ Payment update successful"
else
  echo "❌ Payment update failed"
  echo "$UPDATE_RESPONSE" | jq .
fi
echo ""

# Step 7: Delete Payment
echo "7. Deleting Payment..."
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/admin/payments/$PAYMENT_ID" \
  -H "Authorization: Bearer $TOKEN")

DELETE_STATUS=$(echo "$DELETE_RESPONSE" | jq -r '.status // "error"')

if [ "$DELETE_STATUS" = "success" ]; then
  echo "✅ Payment delete successful"
else
  echo "❌ Payment delete failed"
  echo "$DELETE_RESPONSE" | jq .
fi
echo ""

# Summary
echo "=== Test Summary ==="
echo "Customer ID: $CUSTOMER_ID"
echo "Invoice ID: $INVOICE_ID"
echo "Payment ID: $PAYMENT_ID"
echo ""
echo "✅ Payment CRUD Testing Complete!"




