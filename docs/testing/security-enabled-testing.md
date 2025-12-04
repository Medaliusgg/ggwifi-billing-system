# Security-Enabled Testing Phase

**Date:** 2025-12-01  
**Status:** In Progress  
**Security:** Enabled (`app.security.enabled=true`)

---

## Test Admin User

**Username:** `testadmin`  
**Password:** `testadmin123`  
**Role:** `SUPER_ADMIN`

---

## Testing Workflow

### 1. Create Admin User (if needed)
```bash
curl -X POST http://localhost:8080/api/v1/testing/create-admin-user
```

### 2. Login to Get JWT Token
```bash
curl -X POST http://localhost:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"testadmin123"}'
```

### 3. Use Token for Protected Endpoints
```bash
TOKEN="your-jwt-token"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/admin/payments
```

---

## Test Results

### Authentication
- [ ] Admin login works
- [ ] JWT token generation works
- [ ] Token validation works
- [ ] Token refresh works

### Protected Endpoints
- [ ] Payment endpoints with JWT
- [ ] Voucher endpoints with JWT
- [ ] Package endpoints with JWT
- [ ] Customer endpoints with JWT
- [ ] Admin dashboard with JWT
- [ ] Reports with JWT
- [ ] Finance endpoints with JWT

### Permission Checks
- [ ] @PreAuthorize enforcement works
- [ ] Role-based access control works
- [ ] Permission service works correctly

---

## Notes

- Security is now enabled
- All protected endpoints require JWT token
- Test admin user has SUPER_ADMIN role (full access)
- Testing endpoints still available in testing profile




