# Test Data Templates

**Date:** 2025-12-01  
**Purpose:** Correct test data templates for CRUD operations

---

## InternetPackage

### Required Fields
- `name` (String, required)
- `packageType` (Enum, required) - Values: `HOTSPOT`, `PPPOE`, `STATIC_IP`, `PREMIUM`, `STUDENT`, `ENTERPRISE`, `PAY_AS_YOU_GO`, `RECURRING`, `TIME_BASED_OFFER`
- `price` (BigDecimal, required)

### Optional Fields
- `description` (String)
- `durationDays` (Integer)
- `dataLimitMb` (Long)
- `downloadSpeedMbps` (Integer)
- `uploadSpeedMbps` (Integer)
- `isActive` (Boolean, default: true)
- `category` (Enum) - Values: `BASIC`, `STANDARD`, `PREMIUM`, `ENTERPRISE`, `STUDENT`, `FAMILY`, `BUSINESS`, `OFFER`
- `status` (Enum) - Values: `ACTIVE`, `INACTIVE`, `DISCONTINUED`, `COMING_SOON`, `MAINTENANCE`, `SCHEDULED`

### Test Template
```json
{
  "name": "Test Package",
  "description": "Test package description",
  "packageType": "PREPAID",
  "price": 10000,
  "durationDays": 30,
  "dataLimitMb": 51200,
  "downloadSpeedMbps": 10,
  "uploadSpeedMbps": 5,
  "isActive": true,
  "category": "BASIC",
  "status": "ACTIVE"
}
```

---

## Customer

### Required Fields
- `firstName` (String, required)
- `lastName` (String, required)
- `email` (String, required, unique)
- `primaryPhoneNumber` (String, required, unique)

### Optional Fields
- `status` (Enum) - Values: `ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`, `EXPIRED`, `CANCELLED`, `BLACKLISTED`, `VIP`
- `accountType` (Enum) - Values: `INDIVIDUAL`, `BUSINESS`, `ENTERPRISE`, `STUDENT`, `SENIOR_CITIZEN`
- `secondaryPhoneNumber` (String)
- `emailVerified` (Boolean)
- `phoneVerified` (Boolean)

### Test Template
```json
{
  "firstName": "Test",
  "lastName": "Customer",
  "email": "testcustomer@example.com",
  "primaryPhoneNumber": "+255742844024",
  "status": "ACTIVE",
  "accountType": "INDIVIDUAL"
}
```

**Note:** Email must be unique. Use timestamp for testing: `testcustomer$(date +%s)@example.com`

---

## Voucher

### Required Fields
- `packageId` (Long, required)
- `amount` (BigDecimal, required)
- `customerName` (String, required)
- `customerPhone` (String, required)

### Optional Fields
- `customerEmail` (String)

### Test Template
```json
{
  "packageId": 1,
  "amount": 100,
  "customerName": "Test Customer",
  "customerPhone": "+255742844024",
  "customerEmail": "test@example.com"
}
```

---

## Router

### Required Fields
- `routerName` (String, required)
- `routerIp` (String, required)
- `routerType` (Enum, required)

### Test Template
```json
{
  "routerName": "Test Router",
  "routerIp": "192.168.1.1",
  "routerType": "MIKROTIK",
  "location": "Test Location",
  "isActive": true
}
```

---

## Payment

### Required Fields
- `customerId` (Long, required)
- `amount` (BigDecimal, required)
- `paymentMethod` (Enum, required)

### Test Template
```json
{
  "customerId": 1,
  "amount": 10000,
  "paymentMethod": "MOBILE_MONEY",
  "paymentProvider": "SELCOM",
  "description": "Test payment"
}
```

---

## Common Enum Values

### PackageType
- `HOTSPOT`
- `PPPOE`
- `STATIC_IP`
- `PREMIUM`
- `STUDENT`
- `ENTERPRISE`
- `PAY_AS_YOU_GO`
- `RECURRING`
- `TIME_BASED_OFFER`

### AccountType
- `INDIVIDUAL`
- `BUSINESS`
- `ENTERPRISE`
- `STUDENT`
- `SENIOR_CITIZEN`

### CustomerStatus
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`
- `PENDING_VERIFICATION`
- `EXPIRED`
- `CANCELLED`
- `BLACKLISTED`
- `VIP`

### PaymentMethod
- `MOBILE_MONEY`
- `CASH`
- `BANK_TRANSFER`
- `CARD`
- `VOUCHER`

---

## Testing Notes

1. **Unique Fields:** Email, phone numbers must be unique. Use timestamps for testing.
2. **Enum Values:** Must match exactly (case-sensitive).
3. **Required Fields:** All required fields must be present.
4. **Data Types:** Ensure correct data types (String, Integer, BigDecimal, Boolean).

---

## Quick Test Commands

### Create Package
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Package","packageType":"PREPAID","price":10000,"durationDays":30,"dataLimitMb":51200,"downloadSpeedMbps":10,"isActive":true}' \
  http://localhost:8080/api/v1/admin/packages
```

### Create Customer
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Customer","email":"test'$(date +%s)'@example.com","primaryPhoneNumber":"+255742844024","status":"ACTIVE","accountType":"INDIVIDUAL"}' \
  http://localhost:8080/api/v1/admin/customers
```




