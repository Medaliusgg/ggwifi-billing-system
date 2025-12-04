# GG-WIFI API Documentation

## Base URL
- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://api.ggwifi.co.tz/api/v1`

## Authentication
Most endpoints require JWT Bearer token authentication:
```
Authorization: Bearer <token>
```

---

## Customer Authentication Endpoints

### 1. Request OTP
**POST** `/customer-auth/request-otp`

Request a one-time password (OTP) for customer login.

**Request Body:**
```json
{
  "phoneNumber": "+255712345678"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "OTP sent successfully"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Too many OTP requests. Please try again in 10 minutes."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/v1/customer-auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+255712345678"}'
```

---

### 2. Verify OTP and Login
**POST** `/customer-auth/verify-otp`

Verify OTP code and complete customer login.

**Request Body:**
```json
{
  "phoneNumber": "+255712345678",
  "otpCode": "123456",
  "deviceFingerprint": "abc123..."
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "account": {
    "id": 1,
    "phoneNumber": "+255712345678",
    "fullName": "John Doe",
    "isVerified": true
  }
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Invalid or expired OTP"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/v1/customer-auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+255712345678",
    "otpCode": "123456",
    "deviceFingerprint": "abc123"
  }'
```

---

### 3. Refresh Token
**POST** `/customer-auth/refresh`

Refresh the access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "deviceFingerprint": "abc123..."
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Customer Portal Endpoints

### 4. Get Customer Dashboard
**GET** `/customer-portal/customer/{phoneNumber}/dashboard`

Get comprehensive customer dashboard data including sessions, payments, transactions, and vouchers.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "customer": {
    "phoneNumber": "+255712345678",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "status": "ACTIVE"
  },
  "statistics": {
    "totalVouchers": 5,
    "activeVouchers": 2,
    "totalPayments": 10,
    "successfulPayments": 9,
    "activeSessionsCount": 1
  },
  "vouchers": [...],
  "payments": [...],
  "transactions": [...],
  "activeSessions": [...]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/customer/+255712345678/dashboard \
  -H "Authorization: Bearer <token>"
```

---

### 5. Get Customer Profile
**GET** `/customer-portal/customer/{phoneNumber}/profile`

Get customer profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "phoneNumber": "+255712345678",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

## Loyalty Program Endpoints

### 6. Get Customer Loyalty Status
**GET** `/loyalty/progress/{phoneNumber}`

Get customer loyalty points, tier, and status.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "phoneNumber": "+255712345678",
    "points": 1500,
    "availablePoints": 1200,
    "tier": "GOLD",
    "lifetimeSpend": 50000,
    "totalRedemptions": 3
  }
}
```

---

### 7. Get Customer Snapshot (Admin)
**GET** `/loyalty/customer/phone/{phoneNumber}/snapshot`

Get comprehensive customer loyalty snapshot for admin lookup.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "customerName": "John Doe",
    "phoneNumber": "+255712345678",
    "points": 1500,
    "tier": "GOLD",
    "totalRedemptions": 3,
    "pendingRedemptions": 1,
    "recentActivity": [...]
  }
}
```

---

### 8. Get All Rewards (Admin)
**GET** `/loyalty/rewards/all`

Get all rewards with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `category` (optional): Filter by category
- `tier` (optional): Filter by tier

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "items": [...],
    "total": 25,
    "page": 1,
    "size": 10
  }
}
```

---

### 9. Create Reward (Admin)
**POST** `/loyalty/rewards`

Create a new loyalty reward.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "rewardName": "Free 1GB Data",
  "rewardCode": "DATA1GB",
  "pointsRequired": 500,
  "rewardTier": "GOLD",
  "category": "DATA",
  "deliveryMethod": "DIGITAL",
  "description": "Get 1GB of free data",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "rewardName": "Free 1GB Data",
    ...
  }
}
```

---

### 10. Update Reward (Admin)
**PUT** `/loyalty/rewards/{rewardId}`

Update an existing reward.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (Same as Create Reward)

---

### 11. Delete Reward (Admin)
**DELETE** `/loyalty/rewards/{rewardId}`

Delete a reward.

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

### 12. Get Inventory (Admin)
**GET** `/loyalty/inventory`

Get reward inventory with pagination.

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

### 13. Upsert Inventory (Admin)
**POST** `/loyalty/inventory`

Create or update inventory for a reward.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "rewardId": 1,
  "inventoryCount": 100,
  "restockThreshold": 20,
  "restockAmount": 50
}
```

---

### 14. Get Redemptions (Admin)
**GET** `/loyalty/redemptions`

Get all redemptions with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `status` (optional): Filter by status (PENDING, APPROVED, DELIVERED, REJECTED)

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

### 15. Approve Redemption (Admin)
**POST** `/loyalty/redemptions/{redemptionId}/approve`

Approve a redemption and optionally assign a technician.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "technicianAssigned": "Tech Name (optional)"
}
```

---

### 16. Mark Redemption Delivered (Admin)
**POST** `/loyalty/redemptions/{redemptionId}/deliver`

Mark a redemption as delivered.

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

### 17. Reject Redemption (Admin)
**POST** `/loyalty/redemptions/{redemptionId}/reject`

Reject a redemption with a reason.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "reason": "Insufficient points or invalid request"
}
```

---

### 18. Get Tier Configs (Admin)
**GET** `/loyalty/tiers`

Get all loyalty tier configurations.

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

### 19. Save Tier Config (Admin)
**POST** `/loyalty/tiers`

Create a new tier configuration.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "PLATINUM",
  "description": "Platinum tier benefits",
  "minPoints": 5000,
  "multiplier": 1.5,
  "benefits": "Priority support, exclusive rewards",
  "expiresInDays": 365
}
```

---

### 20. Update Tier Config (Admin)
**PUT** `/loyalty/tiers/{tierId}`

Update a tier configuration.

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

### 21. Delete Tier Config (Admin)
**DELETE** `/loyalty/tiers/{tierId}`

Delete a tier configuration.

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## Error Responses

All endpoints may return the following error format:

```json
{
  "status": "error",
  "message": "Error description",
  "errorCode": "ERROR_CODE (optional)"
}
```

**Common HTTP Status Codes:**
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

- OTP requests: Maximum 3 requests per 10 minutes per phone number
- API requests: 100 requests per minute per IP (may vary by endpoint)

---

## Notes

- All phone numbers should be in international format (e.g., +255712345678)
- OTP codes expire after 2 minutes
- JWT tokens expire after 24 hours (refresh tokens: 7 days)
- Device fingerprints are used for security and session management






