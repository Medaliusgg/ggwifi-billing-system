# ⭐ Professional Signup + Trial Module - Implementation Plan

## 🎯 Complete Implementation Structure

This document outlines the complete implementation of the professional signup flow with:
- OTP-based signup verification
- Password-based login
- Free 20-minute trial
- Forgot password flow
- Enhanced customer dashboard

---

## 📋 Implementation Checklist

### Backend (Spring Boot)

- [x] Update CustomerAccount entity (add password field, isTrialUsed)
- [ ] Create SignupController with endpoints:
  - POST `/api/v1/auth/signup/request-otp`
  - POST `/api/v1/auth/signup/verify-otp`
  - POST `/api/v1/auth/signup/create`
- [ ] Create LoginController with password-based login:
  - POST `/api/v1/auth/login`
- [ ] Create ForgotPasswordController:
  - POST `/api/v1/auth/forgot-password/request-otp`
  - POST `/api/v1/auth/forgot-password/verify-otp`
  - POST `/api/v1/auth/forgot-password/reset`
- [ ] Create FreeTrialService:
  - Generate 20-minute trial voucher
  - Auto-activate on account creation
- [ ] Update CustomerPortalController:
  - Require authentication for payment
  - Link payments to authenticated customer

### Frontend (React)

- [ ] Create SignUp component (multi-step):
  - Step 1: Phone number + OTP request
  - Step 2: OTP verification
  - Step 3: Account details form
  - Step 4: Success + auto-connect to trial
- [ ] Create Login component:
  - Phone + Password login
  - Remember me option
- [ ] Create ForgotPassword component:
  - Request OTP → Verify OTP → Reset password
- [ ] Update LandingPage:
  - Sign Up button (primary)
  - Login button
  - Buy Package redirects to login if not authenticated
- [ ] Update CustomerPortal dashboard:
  - Show loyalty points
  - Show trial status
  - Purchase history
  - Active sessions

---

## 🗄️ Database Schema Updates

### CustomerAccount Table

```sql
ALTER TABLE customer_accounts
ADD COLUMN password_hash VARCHAR(255) NULL,
ADD COLUMN is_trial_used BOOLEAN DEFAULT FALSE,
ADD COLUMN trial_voucher_code VARCHAR(20) NULL,
ADD COLUMN referral_code VARCHAR(20) NULL,
ADD COLUMN referred_by VARCHAR(20) NULL;
```

### Voucher Table

```sql
ALTER TABLE vouchers
ADD COLUMN voucher_type ENUM('TRIAL', 'PAID') DEFAULT 'PAID',
ADD COLUMN is_free_trial BOOLEAN DEFAULT FALSE;
```

---

## 🔄 Complete Flow Diagrams

### Signup Flow

```
User clicks "Sign Up"
    ↓
Enter Phone Number
    ↓
POST /auth/signup/request-otp
    ↓
OTP sent to phone
    ↓
Enter OTP
    ↓
POST /auth/signup/verify-otp
    ↓
OTP verified
    ↓
Show Signup Form (Name, Email, Password)
    ↓
POST /auth/signup/create
    ↓
Account created
    ↓
Free 20-minute voucher generated
    ↓
RADIUS user created
    ↓
Auto-connect to WiFi
    ↓
Show success + dashboard
```

### Login Flow

```
User clicks "Login"
    ↓
Enter Phone + Password
    ↓
POST /auth/login
    ↓
JWT token generated
    ↓
Store token
    ↓
Redirect to dashboard
```

### Payment Flow (After Login)

```
User logged in
    ↓
Select package
    ↓
POST /customer-portal/payment (authenticated)
    ↓
Payment processed
    ↓
Voucher generated
    ↓
Loyalty points awarded
    ↓
SMS sent
    ↓
Auto-connect to WiFi
```

---

## 📝 API Endpoints Specification

### Signup Endpoints

#### 1. Request OTP for Signup
```
POST /api/v1/auth/signup/request-otp
Body: { "phoneNumber": "+255658823944" }
Response: { "status": "success", "message": "OTP sent" }
```

#### 2. Verify OTP for Signup
```
POST /api/v1/auth/signup/verify-otp
Body: { "phoneNumber": "+255658823944", "otpCode": "123456" }
Response: { "status": "success", "verified": true, "sessionToken": "..." }
```

#### 3. Create Account
```
POST /api/v1/auth/signup/create
Body: {
  "phoneNumber": "+255658823944",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "referralCode": "ABC123" (optional)
}
Response: {
  "status": "success",
  "customer": {...},
  "trialVoucher": "ABC123",
  "token": "JWT_TOKEN"
}
```

### Login Endpoints

#### 1. Password Login
```
POST /api/v1/auth/login
Body: {
  "phoneNumber": "+255658823944",
  "password": "SecurePass123!",
  "rememberMe": true (optional)
}
Response: {
  "status": "success",
  "token": "JWT_TOKEN",
  "refreshToken": "REFRESH_TOKEN",
  "customer": {...}
}
```

### Forgot Password Endpoints

#### 1. Request OTP for Password Reset
```
POST /api/v1/auth/forgot-password/request-otp
Body: { "phoneNumber": "+255658823944" }
Response: { "status": "success", "message": "OTP sent" }
```

#### 2. Verify OTP for Password Reset
```
POST /api/v1/auth/forgot-password/verify-otp
Body: { "phoneNumber": "+255658823944", "otpCode": "123456" }
Response: { "status": "success", "resetToken": "..." }
```

#### 3. Reset Password
```
POST /api/v1/auth/forgot-password/reset
Body: {
  "phoneNumber": "+255658823944",
  "resetToken": "...",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
Response: { "status": "success", "message": "Password reset successful" }
```

---

## 🔐 Security Features

- Password hashing with BCrypt
- OTP rate limiting
- Account lockout after failed attempts
- JWT token authentication
- Refresh token support
- Session management
- Device fingerprinting (optional)

---

## 🎁 Free Trial Implementation

### Trial Voucher Generation

```java
// On account creation:
1. Generate 20-minute voucher code
2. Create voucher with type=TRIAL
3. Link to customer
4. Set expiration (20 minutes from now)
5. Create RADIUS user
6. Auto-activate session
7. Send welcome SMS
```

### Trial Restrictions

- One trial per phone number
- 20 minutes duration
- Standard speed limits
- Cannot extend trial
- Must purchase package after trial

---

## 📊 Customer Dashboard Features

- **Loyalty Points**: Current balance, tier, progress
- **Trial Status**: Active/Used/Expired
- **Purchase History**: All packages purchased
- **Active Sessions**: Current WiFi connections
- **Rewards**: Available rewards and offers
- **Personalized Offers**: Based on usage and loyalty

---

## 🚀 Next Steps

1. Implement backend endpoints
2. Update database schema
3. Create frontend components
4. Integrate with existing payment flow
5. Test complete flow
6. Deploy to production

