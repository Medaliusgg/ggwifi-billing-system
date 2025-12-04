# Test Admin User Setup

**Date:** 2025-12-01  
**Purpose:** Easy testing with security enabled

---

## Test Admin User Credentials

**Username:** `testadmin`  
**Password:** `testadmin123`  
**Email:** `testadmin@ggwifi.co.tz`  
**Role:** `SUPER_ADMIN`  
**Phone:** `+255742844024`

---

## Creating the Test Admin User

### Endpoint
```
POST /api/v1/testing/create-admin-user
```

### Request
```bash
curl -X POST http://localhost:8080/api/v1/testing/create-admin-user
```

### Response
```json
{
  "status": "success",
  "message": "Test admin user created successfully",
  "username": "testadmin",
  "password": "testadmin123",
  "email": "testadmin@ggwifi.co.tz",
  "role": "SUPER_ADMIN",
  "userId": 2
}
```

**Note:** If the user already exists, the endpoint returns the existing user's credentials.

---

## Using the Test Admin User

### Login Endpoint
```
POST /api/v1/auth/admin-login
```

### Request
```bash
curl -X POST http://localhost:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin",
    "password": "testadmin123"
  }'
```

### Response
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "user": {
      "id": 2,
      "username": "testadmin",
      "email": "testadmin@ggwifi.co.tz",
      "role": "SUPER_ADMIN"
    }
  }
}
```

---

## Using JWT Token for Testing

Once you have the JWT token, use it in subsequent requests:

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"testadmin123"}' \
  | jq -r '.data.token')

# Use token in requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/admin/payments
```

---

## Testing with Security Enabled

1. **Create admin user:**
   ```bash
   curl -X POST http://localhost:8080/api/v1/testing/create-admin-user
   ```

2. **Login to get JWT token:**
   ```bash
   curl -X POST http://localhost:8080/api/v1/auth/admin-login \
     -H "Content-Type: application/json" \
     -d '{"username":"testadmin","password":"testadmin123"}'
   ```

3. **Use token for authenticated requests:**
   ```bash
   curl -H "Authorization: Bearer <token>" \
     http://localhost:8080/api/v1/admin/payments
   ```

---

## Default Admin User

The system also creates a default admin user on startup:
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `SUPER_ADMIN`

This is created by `DatabaseInitializationService` if it doesn't exist.

---

## Notes

- The test admin user has `SUPER_ADMIN` role, giving full access to all endpoints
- The user is created with email and phone verification set to `true`
- The user is active and ready to use immediately
- The endpoint is only available in `testing` profile (`@Profile("testing")`)

---

## Security Considerations

⚠️ **Important:** This endpoint is only available when:
- `@Profile("testing")` is active
- Should NOT be available in production

The endpoint automatically checks if the user exists and returns credentials if it does, preventing duplicate creation.




