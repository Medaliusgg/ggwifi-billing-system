# Error Handling Testing Plan

**Date:** 2025-12-01  
**Purpose:** Test error cases, invalid inputs, and edge cases

---

## Test Categories

### 1. Validation Errors (400 Bad Request)

#### Missing Required Fields
- [ ] Package: Missing `name`
- [ ] Package: Missing `packageType`
- [ ] Package: Missing `price`
- [ ] Customer: Missing `firstName`
- [ ] Customer: Missing `lastName`
- [ ] Customer: Missing `email`
- [ ] Customer: Missing `primaryPhoneNumber`
- [ ] Voucher: Missing `packageId`
- [ ] Voucher: Missing `amount`

#### Invalid Enum Values
- [ ] Package: Invalid `packageType` (e.g., "INVALID_TYPE")
- [ ] Package: Invalid `category` (e.g., "INVALID_CATEGORY")
- [ ] Customer: Invalid `status` (e.g., "INVALID_STATUS")
- [ ] Customer: Invalid `accountType` (e.g., "PREPAID")

#### Invalid Data Types
- [ ] Package: `price` as string instead of number
- [ ] Package: `durationDays` as string instead of number
- [ ] Package: `isActive` as string instead of boolean
- [ ] Customer: `email` as number instead of string

#### Invalid Data Values
- [ ] Package: Negative `price`
- [ ] Package: Negative `durationDays`
- [ ] Package: Negative `dataLimitMb`
- [ ] Customer: Invalid email format
- [ ] Customer: Invalid phone number format

---

### 2. Not Found Errors (404)

#### Non-Existent Resources
- [ ] GET `/api/v1/admin/packages/99999` - Package not found
- [ ] GET `/api/v1/admin/customers/99999` - Customer not found
- [ ] GET `/api/v1/admin/vouchers/code/INVALID` - Voucher not found
- [ ] PUT `/api/v1/admin/packages/99999` - Update non-existent package
- [ ] DELETE `/api/v1/admin/packages/99999` - Delete non-existent package

---

### 3. Permission Errors (403)

#### Without Authentication
- [ ] GET `/api/v1/admin/packages` - No token
- [ ] POST `/api/v1/admin/packages` - No token
- [ ] PUT `/api/v1/admin/packages/1` - No token
- [ ] DELETE `/api/v1/admin/packages/1` - No token

#### Invalid Token
- [ ] GET `/api/v1/admin/packages` - Invalid token
- [ ] POST `/api/v1/admin/packages` - Invalid token
- [ ] PUT `/api/v1/admin/packages/1` - Invalid token
- [ ] DELETE `/api/v1/admin/packages/1` - Invalid token

#### Expired Token
- [ ] GET `/api/v1/admin/packages` - Expired token
- [ ] POST `/api/v1/admin/packages` - Expired token

---

### 4. Constraint Violations (409 Conflict)

#### Unique Constraint Violations
- [ ] Customer: Duplicate email
- [ ] Customer: Duplicate phone number
- [ ] Package: Duplicate name (if unique)

#### Foreign Key Violations
- [ ] Voucher: Invalid `packageId` (non-existent package)
- [ ] Payment: Invalid `customerId` (non-existent customer)
- [ ] Transaction: Invalid `customerId` (non-existent customer)

---

### 5. Edge Cases

#### Boundary Values
- [ ] Package: `price` = 0
- [ ] Package: `price` = very large number
- [ ] Package: `durationDays` = 0
- [ ] Package: `durationDays` = 365
- [ ] Package: `dataLimitMb` = 0
- [ ] Package: `dataLimitMb` = very large number

#### Null Values
- [ ] Package: `description` = null (should be allowed)
- [ ] Customer: `secondaryPhoneNumber` = null (should be allowed)
- [ ] Voucher: `customerEmail` = null (should be allowed)

#### Empty Strings
- [ ] Package: `name` = ""
- [ ] Customer: `email` = ""
- [ ] Customer: `primaryPhoneNumber` = ""

#### Special Characters
- [ ] Package: `name` with special characters
- [ ] Customer: `email` with special characters
- [ ] Customer: `firstName` with special characters

---

## Test Script Structure

```bash
#!/bin/bash

# Error Handling Test Script
BASE_URL="http://localhost:8080"
TOKEN="<get-token>"

# 1. Missing Required Fields
echo "=== Missing Required Fields ==="
curl -X POST "$BASE_URL/api/v1/admin/packages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":10000}'  # Missing name and packageType

# 2. Invalid Enum Values
echo "=== Invalid Enum Values ==="
curl -X POST "$BASE_URL/api/v1/admin/packages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","packageType":"INVALID","price":10000}'

# 3. Not Found Errors
echo "=== Not Found Errors ==="
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/v1/admin/packages/99999"

# 4. Constraint Violations
echo "=== Constraint Violations ==="
# Try to create duplicate customer
curl -X POST "$BASE_URL/api/v1/admin/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Customer","email":"existing@example.com","primaryPhoneNumber":"+255742844024","status":"ACTIVE","accountType":"INDIVIDUAL"}'
```

---

## Expected Results

### Validation Errors (400)
- Should return `400 Bad Request`
- Should include error message describing the issue
- Should not create/update resource

### Not Found Errors (404)
- Should return `404 Not Found`
- Should include "not found" message
- Should not return data

### Permission Errors (403/401)
- Should return `401 Unauthorized` or `403 Forbidden`
- Should include authentication/authorization error message
- Should not return data

### Constraint Violations (409)
- Should return `409 Conflict` or `400 Bad Request`
- Should include constraint violation message
- Should not create/update resource

---

## Test Execution Order

1. **Validation Errors** - Test invalid inputs
2. **Not Found Errors** - Test non-existent resources
3. **Permission Errors** - Test authentication/authorization
4. **Constraint Violations** - Test unique constraints and foreign keys
5. **Edge Cases** - Test boundary values and special cases

---

## Success Criteria

- ✅ All error cases return appropriate HTTP status codes
- ✅ All error cases include descriptive error messages
- ✅ No resources are created/updated when errors occur
- ✅ Error responses follow consistent format
- ✅ Error messages are user-friendly

---

## Status

**Not Started** - Ready to begin testing




