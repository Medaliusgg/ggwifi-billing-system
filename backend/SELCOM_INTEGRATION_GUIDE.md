# SELCOM Payment Gateway Integration Guide

## Overview

This guide explains the comprehensive SELCOM payment gateway integration for GGNetworks, which includes:

- **C2B Payment Flow**: Push USSD payment requests to mobile money wallets
- **SMS Integration**: Automated SMS notifications for payment confirmations
- **Webhook Handling**: Secure webhook processing for payment status updates
- **Multi-Subdomain Support**: Core-centric backend that serves all frontend applications

## Architecture

### Core Components

1. **SelcomPaymentService**: Handles all SELCOM API interactions
2. **SmsService**: Manages SMS notifications and delivery tracking
3. **PaymentController**: REST API endpoints for payment operations
4. **Webhook Handlers**: Secure webhook processing for payment status updates

### Payment Flow

```
Customer → Frontend → Backend → SELCOM API → Mobile Money Provider → Customer PIN → SELCOM Webhook → Backend → SMS Notification
```

## SELCOM C2B Payment Integration

### 1. Payment Initialization

**Endpoint**: `POST /api/v1/payments/c2b/initialize`

**Request Body**:
```json
{
  "phoneNumber": "06534567891",
  "amount": 15000,
  "packageId": 1,
  "paymentMethod": "mpesa"
}
```

**Response**:
```json
{
  "success": true,
  "transactionId": "GGN-1234567890-ABC12345",
  "reference": "SELCOM-REF-123456",
  "message": "Payment request sent. Please check your phone for USSD prompt."
}
```

### 2. Webhook Endpoints

The system handles three types of SELCOM webhooks:

#### Lookup Webhook
**Endpoint**: `POST /api/v1/payments/selcom/c2b/lookup`
- Validates payment reference and amount
- Confirms customer details

#### Validation Webhook
**Endpoint**: `POST /api/v1/payments/selcom/c2b/validation`
- Validates payment before processing
- Updates payment status to PENDING

#### Notification Webhook
**Endpoint**: `POST /api/v1/payments/selcom/c2b/notification`
- Confirms successful payment
- Updates payment status to COMPLETED
- Triggers SMS notification

### 3. Payment Status Query

**Endpoint**: `GET /api/v1/payments/c2b/status?transactionId=XXX&reference=XXX`

**Response**:
```json
{
  "success": true,
  "status": "SUCCESS",
  "message": "Payment completed successfully",
  "reference": "SELCOM-REF-123456",
  "transid": "GGN-1234567890-ABC12345"
}
```

## SMS Integration

### SMS Service Features

1. **Payment Confirmations**: Automatic SMS when payment completes
2. **OTP Delivery**: Verification codes for user authentication
3. **Voucher Codes**: Internet package voucher delivery
4. **Welcome Messages**: New customer onboarding
5. **Promotional Messages**: Marketing campaigns

### SMS Endpoints

**Send SMS**:
```http
POST /api/v1/payments/sms/send
Content-Type: application/json

{
  "phoneNumber": "06534567891",
  "message": "Your payment was successful!",
  "type": "TRANSACTIONAL"
}
```

### SMS Message Types

- `TRANSACTIONAL`: Payment confirmations, voucher codes
- `OTP`: Verification codes
- `WELCOME`: New customer messages
- `PROMOTIONAL`: Marketing messages
- `NOTIFICATION`: System notifications

## Authentication & Security

### SELCOM API Authentication

The system uses SELCOM's required authentication headers:

```java
Authorization: SELCOM <base64-encoded-api-key>
Timestamp: 2025-08-03T11:00:00+03:00
Digest-Method: HS256
Digest: <hmac-sha256-signature>
Signed-Fields: transid,utilityref,amount,vendor,msisdn,timestamp
```

### Webhook Security

- All webhooks are validated using HMAC SHA256 signatures
- Webhook endpoints are secured and only accept SELCOM requests
- Payment status updates are atomic and transactional

## Configuration

### Environment Variables

```bash
# SELCOM Configuration
SELCOM_BASE_URL=https://paypoint.selcommobile.com
SELCOM_MERCHANT_ID=your_merchant_id
SELCOM_MERCHANT_KEY=your_merchant_key
SELCOM_API_KEY=your_api_key
SELCOM_API_SECRET=your_api_secret
SELCOM_WEBHOOK_SECRET=your_webhook_secret

# SMS Configuration
SMS_API_BASE_URL=https://api.smsprovider.com
SMS_API_KEY=your_sms_api_key
SMS_API_SECRET=your_sms_api_secret
SMS_SENDER_ID=GGNetworks
```

### Application Properties

```yaml
selcom:
  api:
    base-url: ${SELCOM_BASE_URL}
    merchant-id: ${SELCOM_MERCHANT_ID}
    merchant-key: ${SELCOM_MERCHANT_KEY}
    api-key: ${SELCOM_API_KEY}
    api-secret: ${SELCOM_API_SECRET}
  webhook:
    secret: ${SELCOM_WEBHOOK_SECRET}
  payment:
    timeout: 300000
    currency: TZS
    language: en

sms:
  api:
    base-url: ${SMS_API_BASE_URL}
    key: ${SMS_API_KEY}
    secret: ${SMS_API_SECRET}
  sender-id: ${SMS_SENDER_ID}
  timeout: 30000
```

## Mobile Money Providers

The system supports all major Tanzanian mobile money providers:

- **M-Pesa**: Vodacom Tanzania
- **Airtel Money**: Airtel Tanzania
- **Mixx**: Tigo Tanzania (formerly Tigo Pesa)
- **HaloPesa**: Halotel
- **T-Pesa**: TTCL (Tanzania Telecommunications Company Limited)

## Frontend Integration

### Customer Portal

```javascript
// Initialize payment
const paymentResponse = await fetch('/api/v1/payments/c2b/initialize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '06534567891',
    amount: 15000,
    packageId: 1,
    paymentMethod: 'mpesa'
  })
});

// Check payment status
const statusResponse = await fetch('/api/v1/payments/c2b/status?transactionId=GGN-1234567890-ABC12345');
```

### Admin Portal

```javascript
// Get payment statistics
const statsResponse = await fetch('/api/v1/payments/statistics');

// Get SMS statistics
const smsStatsResponse = await fetch('/api/v1/payments/sms/statistics');
```

## Error Handling

### Common Error Codes

- `000`: Success
- `010`: Invalid account or payment reference
- `012`: Invalid amount
- `014`: Amount too high
- `015`: Amount too low
- `4XX`: System-specific errors

### Error Response Format

```json
{
  "success": false,
  "error": "Payment failed: Invalid amount",
  "errorCode": "012"
}
```

## Security Best Practices

1. **API Key Management**: Store API keys securely in environment variables
2. **Webhook Validation**: Always validate webhook signatures
3. **HTTPS Only**: Use HTTPS for all API communications
4. **Rate Limiting**: Implement rate limiting on payment endpoints
5. **Logging**: Comprehensive logging for audit trails
6. **Error Handling**: Graceful error handling and user feedback

## Testing

### Test Environment

```bash
# Test payment initialization
curl -X POST http://localhost:8080/api/v1/payments/c2b/initialize \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"06534567891","amount":15000,"packageId":1,"paymentMethod":"mpesa"}'

# Test SMS sending
curl -X POST http://localhost:8080/api/v1/payments/sms/send \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"06534567891","message":"Test SMS","type":"TRANSACTIONAL"}'
```

### Webhook Testing

Use tools like ngrok to test webhooks locally:

```bash
# Expose local server
ngrok http 8080

# Test webhook
curl -X POST https://your-ngrok-url.ngrok.io/api/v1/payments/selcom/c2b/notification \
  -H "Content-Type: application/json" \
  -d '{"operator":"MPESA-TZ","transid":"TEST-123","reference":"TEST-REF","utilityref":"GGN-1","amount":"15000","msisdn":"06534567891","resultcode":"000","message":"Success"}'
```

## Monitoring & Analytics

### Payment Statistics

- Total payments processed
- Success/failure rates
- Revenue tracking
- Payment method distribution

### SMS Statistics

- Messages sent/delivered
- Delivery rates
- Cost tracking
- Error analysis

## Deployment

### Production Checklist

1. ✅ Configure production SELCOM credentials
2. ✅ Set up SMS provider credentials
3. ✅ Configure webhook URLs in SELCOM dashboard
4. ✅ Enable HTTPS for all endpoints
5. ✅ Set up monitoring and alerting
6. ✅ Test payment flow end-to-end
7. ✅ Verify SMS delivery
8. ✅ Monitor error rates

### Health Checks

```bash
# Check payment service health
curl http://localhost:8080/api/v1/actuator/health

# Check SMS service
curl http://localhost:8080/api/v1/payments/sms/health
```

## Support

For technical support or questions about the SELCOM integration:

- **Email**: support@ggnetworks.co.tz
- **Documentation**: This guide and API documentation
- **Logs**: Check application logs for detailed error information
- **SELCOM Support**: Contact SELCOM for API-specific issues

---

*This integration provides a secure, scalable, and user-friendly payment solution for GGNetworks customers across all platforms.* 