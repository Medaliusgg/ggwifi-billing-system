# GG-WIFI Backend - Complete API Endpoints Summary

**Base URL:** `http://139.84.241.182:8080`  
**Date:** 2025-10-27  
**Total Endpoints:** 82

---

## 📋 Table of Contents

1. [Authentication Module](#authentication-module)
2. [Admin Module](#admin-module)
3. [Customer Module](#customer-module)
4. [Package Module](#package-module)
5. [Voucher Module](#voucher-module)
6. [Transaction Module](#transaction-module)
7. [Payment Module](#payment-module)
8. [Invoice Module](#invoice-module)
9. [FreeRADIUS Module](#freeradius-module)
10. [Customer Portal Module](#customer-portal-module)
11. [Test Module](#test-module)

---

## 🔐 Authentication Module

**Base Path:** `/api/v1/auth`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| POST | `/api/v1/auth/admin-login` | Admin authentication | ❌ No | ✅ Working |
| POST | `/api/v1/auth/login` | User authentication | ❌ No | ✅ Working |

---

## 👤 Admin Module

**Base Path:** `/admin`

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/dashboard/stats` | Get dashboard statistics | ✅ Yes | ✅ Working |
| GET | `/admin/dashboard/technician` | Get technician dashboard | ✅ Yes | ✅ Working |
| GET | `/admin/dashboard/finance` | Get finance dashboard | ✅ Yes | ✅ Working |
| GET | `/admin/dashboard/marketing` | Get marketing dashboard | ✅ Yes | ✅ Working |
| GET | `/admin/dashboard` | Get system dashboard | ✅ Yes | ✅ Working |
| GET | `/admin/profile` | Get current user profile | ✅ Yes | ✅ Working |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/users` | Get all users | ✅ Yes | ✅ Working |
| GET | `/admin/users/{id}` | Get user by ID | ✅ Yes | ✅ Working |
| POST | `/admin/users` | Create new user | ✅ Yes | ✅ Working |
| PUT | `/admin/users/{id}` | Update user | ✅ Yes | ✅ Working |
| PUT | `/admin/users/{username}/role` | Update user role | ✅ Yes | ✅ Working |
| DELETE | `/admin/users/{id}` | Delete user | ✅ Yes | ✅ Working |

### Router Management Endpoints

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/routers` | Get all routers | ✅ Yes | ✅ Working |
| GET | `/admin/routers/status` | Get router status | ✅ Yes | ✅ Working |

**Total Admin Endpoints:** 15

---

## 👥 Customer Module

**Base Path:** `/admin/customers`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/customers` | Get all customers | ✅ Yes | ✅ Working |
| GET | `/admin/customers/{id}` | Get customer by ID | ✅ Yes | ✅ Working |
| GET | `/admin/customers/phone/{phoneNumber}` | Get customer by phone | ✅ Yes | ✅ Working |
| GET | `/admin/customers/email/{email}` | Get customer by email | ✅ Yes | ✅ Working |
| GET | `/admin/customers/active` | Get active customers | ✅ Yes | ✅ Working |
| GET | `/admin/customers/statistics` | Get customer statistics | ✅ Yes | ✅ Working |

**Total Customer Endpoints:** 6

---

## 📦 Package Module

**Base Path:** `/admin/packages`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/packages` | Get all packages (with pagination) | ✅ Yes | ✅ Working |
| GET | `/admin/packages/{id}` | Get package by ID | ✅ Yes | ✅ Working |
| POST | `/admin/packages` | Create new package | ✅ Yes | ✅ Working |
| PUT | `/admin/packages/{id}` | Update package | ✅ Yes | ✅ Working |
| DELETE | `/admin/packages/{id}` | Delete package | ✅ Yes | ✅ Working |
| GET | `/admin/packages/search` | Search packages | ✅ Yes | ✅ Working |
| GET | `/admin/packages/filter` | Filter packages | ✅ Yes | ✅ Working |

**Total Package Endpoints:** 7

---

## 🎫 Voucher Module

**Base Path:** `/admin/vouchers`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/vouchers` | Get all vouchers | ✅ Yes | ✅ Working |
| GET | `/admin/vouchers/{id}` | Get voucher by ID | ✅ Yes | ✅ Working |
| GET | `/admin/vouchers/code/{voucherCode}` | Get voucher by code | ✅ Yes | ✅ Working |
| GET | `/admin/vouchers/phone/{phoneNumber}` | Get vouchers by phone | ✅ Yes | ✅ Working |
| GET | `/admin/vouchers/active` | Get active vouchers | ✅ Yes | ✅ Working |
| GET | `/admin/vouchers/unused` | Get unused vouchers | ✅ Yes | ✅ Working |
| POST | `/admin/vouchers/{voucherCode}/use` | Mark voucher as used | ✅ Yes | ✅ Working |

**Total Voucher Endpoints:** 7

---

## 💳 Transaction Module

**Base Path:** `/admin/transactions`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/transactions` | Get all transactions | ✅ Yes | ✅ Working |
| GET | `/admin/transactions/{id}` | Get transaction by ID | ✅ Yes | ✅ Working |
| GET | `/admin/transactions/phone/{phoneNumber}` | Get transactions by phone | ✅ Yes | ✅ Working |
| GET | `/admin/transactions/status/{status}` | Get transactions by status | ✅ Yes | ✅ Working |
| GET | `/admin/transactions/statistics` | Get transaction statistics | ✅ Yes | ✅ Working |

**Total Transaction Endpoints:** 5

---

## 💰 Payment Module

**Base Path:** `/admin/payments`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/payments` | Get all payments | ✅ Yes | ✅ Working |
| GET | `/admin/payments/{id}` | Get payment by ID | ✅ Yes | ✅ Working |
| GET | `/admin/payments/phone/{phoneNumber}` | Get payments by phone | ✅ Yes | ✅ Working |
| GET | `/admin/payments/status/{status}` | Get payments by status | ✅ Yes | ✅ Working |
| GET | `/admin/payments/statistics` | Get payment statistics | ✅ Yes | ✅ Working |

**Total Payment Endpoints:** 5

---

## 📄 Invoice Module

**Base Path:** `/admin/invoices`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/invoices` | Get all invoices | ✅ Yes | ✅ Working |
| GET | `/admin/invoices/{id}` | Get invoice by ID | ✅ Yes | ✅ Working |
| GET | `/admin/invoices/number/{invoiceNumber}` | Get invoice by number | ✅ Yes | ✅ Working |
| GET | `/admin/invoices/customer/{customerId}` | Get invoices by customer | ✅ Yes | ✅ Working |
| GET | `/admin/invoices/status/{status}` | Get invoices by status | ✅ Yes | ✅ Working |
| GET | `/admin/invoices/paid` | Get paid invoices | ✅ Yes | ✅ Working |
| GET | `/admin/invoices/unpaid` | Get unpaid invoices | ✅ Yes | ✅ Working |
| GET | `/admin/invoices/statistics` | Get invoice statistics | ✅ Yes | ✅ Working |

**Total Invoice Endpoints:** 8

---

## 🌐 FreeRADIUS Module

**Base Path:** `/radius`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/radius/health` | Test RADIUS connection | ❌ No | ✅ Working |
| GET | `/radius/users` | Get all RADIUS users | ❌ No | ✅ Working |
| POST | `/radius/users` | Add new RADIUS user | ❌ No | ✅ Working |
| DELETE | `/radius/users/{username}` | Remove RADIUS user | ❌ No | ✅ Working |
| POST | `/radius/authenticate` | Authenticate RADIUS user | ❌ No | ✅ Working |
| GET | `/radius/sessions` | Get active RADIUS sessions | ❌ No | ✅ Working |
| GET | `/radius/statistics` | Get RADIUS statistics | ❌ No | ✅ Working |
| POST | `/radius/nas` | Configure NAS | ❌ No | ✅ Working |
| GET | `/radius/nas` | Get all NAS entries | ❌ No | ✅ Working |
| POST | `/radius/accounting/start` | Start accounting session | ❌ No | ✅ Working |
| POST | `/radius/accounting/stop` | Stop accounting session | ❌ No | ✅ Working |

**Total FreeRADIUS Endpoints:** 11

---

## 🛒 Customer Portal Module

**Base Path:** `/customer-portal`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/customer-portal/test` | Test endpoint | ❌ No | ✅ Working |
| GET | `/customer-portal/packages` | Get active packages for customers | ❌ No | ✅ Working |
| POST | `/customer-portal/payment` | Process customer payment | ❌ No | ✅ Working |
| POST | `/customer-portal/webhook/zenopay` | Handle ZenoPay webhook | ❌ No | ✅ Working |

**Total Customer Portal Endpoints:** 4

---

## 🧪 Test Module

**Base Path:** `/test`

| Method | Endpoint | Description | Auth Required | Status |
|--------|----------|-------------|---------------|--------|
| GET | `/test/**` | All test endpoints | ❌ No | ✅ Working |

---

## 📊 Summary Statistics

### By Module

| Module | Number of Endpoints | Status |
|--------|---------------------|--------|
| Admin Module | 15 | ✅ Fully Working |
| FreeRADIUS Module | 11 | ✅ Fully Working |
| Invoice Module | 8 | ✅ Fully Working |
| Package Module | 7 | ✅ Fully Working |
| Voucher Module | 7 | ✅ Fully Working |
| Customer Module | 6 | ✅ Fully Working |
| Payment Module | 5 | ✅ Fully Working |
| Transaction Module | 5 | ✅ Fully Working |
| Customer Portal Module | 4 | ✅ Fully Working |
| Authentication Module | 2 | ✅ Fully Working |
| Test Module | 1 (wildcard) | ✅ Fully Working |
| **TOTAL** | **71** | **✅ All Working** |

---

## 🔑 Authentication Requirements

### No Authentication Required (Public Endpoints)
- All `/test/**` endpoints
- All `/api/v1/auth/**` endpoints
- All `/radius/**` endpoints
- All `/customer-portal/**` endpoints

### Authentication Required (Protected Endpoints)
- All `/admin/**` endpoints
- Requires JWT token in `Authorization` header
- Format: `Bearer <token>`

---

## 📝 Request/Response Format

### Standard Success Response

```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { }
}
```

### Standard Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "error_code": "ERROR_CODE"
}
```

### Pagination Response

```json
{
  "status": "success",
  "data": [ ],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10,
    "first": true,
    "last": false
  }
}
```

---

## 🔧 Usage Examples

### Login (Admin)

```bash
curl -X POST http://139.84.241.182:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Get Dashboard Stats

```bash
curl -X GET http://139.84.241.182:8080/admin/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

### Get All Customers

```bash
curl -X GET http://139.84.241.182:8080/admin/customers \
  -H "Authorization: Bearer <token>"
```

### Get Active Packages

```bash
curl -X GET http://139.84.241.182:8080/admin/packages \
  -H "Authorization: Bearer <token>"
```

---

## 🎯 Frontend Integration Guide

### For Admin Portal Frontend

1. **Authentication Flow**
   - Use `/api/v1/auth/admin-login` for login
   - Store JWT token in localStorage
   - Include `Authorization: Bearer <token>` in all protected requests

2. **Dashboard Components**
   - Use `/admin/dashboard/stats` for main dashboard
   - Use `/admin/dashboard/technician` for technician view
   - Use `/admin/dashboard/finance` for finance view
   - Use `/admin/dashboard/marketing` for marketing view

3. **Data Management**
   - Use `/admin/customers` for customer management
   - Use `/admin/packages` for package management
   - Use `/admin/vouchers` for voucher management
   - Use `/admin/transactions` for transaction history
   - Use `/admin/payments` for payment tracking
   - Use `/admin/invoices` for invoice management

4. **User Management**
   - Use `/admin/users` for user CRUD operations
   - Use `/admin/profile` for current user info

5. **Router Management**
   - Use `/admin/routers` for router listing
   - Use `/admin/routers/status` for status monitoring

---

## ✅ Deployment Status

- **Server:** http://139.84.241.182:8080
- **Status:** ✅ Deployed and Running
- **Last Updated:** 2025-10-27
- **All APIs:** ✅ Tested and Working

---

**End of API Endpoints Summary**

