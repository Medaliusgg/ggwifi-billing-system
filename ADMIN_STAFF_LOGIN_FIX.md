# ✅ Admin/Staff Login Fix

**Date:** 2025-01-27  
**Issue:** Frontend has admin/staff login options, but backend was missing `/auth/staff-login` endpoint

---

## 🔍 Problem Identified

### Frontend Behavior:
- **Admin Login:** Calls `/auth/admin-login` with `username`, `phoneNumber`, `password`
- **Staff Login:** Calls `/auth/staff-login` with `username`, `staffId`, `password`

### Backend Status (Before Fix):
- ✅ `/auth/admin-login` - Exists, requires SUPER_ADMIN role
- ❌ `/auth/staff-login` - **MISSING** (caused 404 errors)
- ✅ `/auth/login` - Generic login, no role restriction

---

## ✅ Solution Applied

### Created `/auth/staff-login` Endpoint

**Location:** `backend/src/main/java/com/ggnetworks/controller/AuthController.java`

**Features:**
1. **Accepts:** `username`, `password`, `staffId` (optional)
2. **Validates:** User exists, is active
3. **Role Check:** Allows staff roles (TECHNICIAN, FINANCE, MARKETING, SALES)
4. **Blocks:** SUPER_ADMIN and ADMIN (they must use admin-login)
5. **Returns:** JWT token and user data

**Code:**
```java
@PostMapping("/staff-login")
public ResponseEntity<Map<String, Object>> staffLogin(@RequestBody Map<String, String> request) {
    // Validates username/password
    // Checks user is active
    // Allows staff roles only
    // Returns JWT token
}
```

---

## 📊 Login Flow Comparison

| Login Type | Endpoint | Required Fields | Allowed Roles |
|------------|----------|----------------|---------------|
| **Admin** | `/auth/admin-login` | username, password, phoneNumber | SUPER_ADMIN only |
| **Staff** | `/auth/staff-login` | username, password, staffId | TECHNICIAN, FINANCE, MARKETING, SALES |
| **Generic** | `/auth/login` | username, password | All roles |

---

## 🔐 Role Definitions

From `User.java`:
```java
public enum UserRole {
    SUPER_ADMIN,  // Full system access
    ADMIN,        // Admin access (not used in admin-login)
    TECHNICIAN,   // Technical staff
    FINANCE,      // Finance staff
    MARKETING,    // Marketing staff
    SALES         // Sales staff
}
```

---

## ✅ What's Fixed

1. ✅ **Created `/auth/staff-login` endpoint**
2. ✅ **Added role validation** (blocks admin roles from staff login)
3. ✅ **Added phone number validation** for admin login
4. ✅ **Maintained backward compatibility** with existing `/auth/login`

---

## 🧪 Testing

### Test Admin Login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "medalius",
    "password": "Kolombo@123%",
    "phoneNumber": "0742844024"
  }'
```

### Test Staff Login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/staff-login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "staffuser",
    "password": "password123",
    "staffId": "STF001"
  }'
```

---

## 📝 Notes

- **Staff ID validation:** Currently optional. Can be enhanced to validate against a `staffId` field in the User entity if needed.
- **Phone number validation:** Admin login now validates phone number if provided.
- **Role separation:** Admin and staff logins are now properly separated with appropriate role checks.

---

**Status:** ✅ **FIXED** - Backend now recognizes both admin and staff login options!



