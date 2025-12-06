# 🔐 Production Admin Reset - Cloudflare Pages + VPS Backend

## Production Environment
- **Admin Portal**: Deployed on Cloudflare Pages
- **Backend**: Deployed on VPS (vulture)
- **Backend URL**: `https://api.ggwifi.co.tz/api/v1` (or your VPS IP)

---

## 🚀 Quick Reset (Recommended)

### Option 1: API Endpoint (Easiest)

Call the reset endpoint on your production backend:

```bash
curl -X POST https://api.ggwifi.co.tz/api/v1/testing/reset-admin
```

**Or if using VPS IP:**
```bash
curl -X POST http://139.84.241.182:8080/api/v1/testing/reset-admin
```

**Response:**
```json
{
  "status": "success",
  "message": "Admin user reset successfully",
  "username": "medalius",
  "phoneNumber": "0742844024",
  "role": "SUPER_ADMIN",
  "userId": 1
}
```

---

### Option 2: Direct Database Access (If API doesn't work)

SSH into your VPS and run:

```bash
# Connect to MySQL
mysql -u ggnetworks -p ggnetworks_radius

# Then run these SQL commands:
DELETE FROM users WHERE role IN ('ADMIN', 'SUPER_ADMIN');

INSERT INTO users (
    username,
    phone_number,
    password,
    first_name,
    last_name,
    email,
    role,
    status,
    is_active,
    is_email_verified,
    is_phone_verified,
    created_at,
    updated_at
) VALUES (
    'medalius',
    '0742844024',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'Medalius',
    'Administrator',
    'medalius@ggwifi.co.tz',
    'SUPER_ADMIN',
    'ACTIVE',
    1,
    1,
    1,
    NOW(),
    NOW()
);

# Verify the user was created
SELECT username, phone_number, role, status FROM users WHERE username = 'medalius';
```

---

## 🔑 New Admin Credentials

After reset, use these credentials to login:

```
Username: medalius
Phone Number: 0742844024
Password: Kolombo@123%
```

**Login URL:** https://admin.ggwifi.co.tz (or your Cloudflare Pages URL)

---

## 🧪 Test the Reset

### 1. Verify Backend Endpoint
```bash
# Test if backend is accessible
curl https://api.ggwifi.co.tz/api/v1/health

# Or with VPS IP
curl http://139.84.241.182:8080/api/v1/health
```

### 2. Call Reset Endpoint
```bash
curl -X POST https://api.ggwifi.co.tz/api/v1/testing/reset-admin \
  -H "Content-Type: application/json"
```

### 3. Test Login
1. Go to: https://admin.ggwifi.co.tz/login
2. Select "Admin Login"
3. Enter:
   - Username: `medalius`
   - Phone: `0742844024`
   - Password: `Kolombo@123%`

---

## 🔍 Troubleshooting

### Issue: API endpoint returns 404
- **Solution**: Check if `TestingSupportController` is enabled
- The controller requires `@Profile("testing")` - check if production profile includes "testing"
- Or use direct database method (Option 2)

### Issue: API endpoint returns 403/401
- **Solution**: The endpoint might require authentication
- Use direct database method (Option 2) instead

### Issue: Password hash doesn't work
- **Solution**: The hash `$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa` is for `Kolombo@123%`
- If it doesn't work, generate a new hash and update the database

### Issue: Can't connect to database
- **Solution**: 
  1. SSH into VPS
  2. Check MySQL is running: `systemctl status mysql`
  3. Verify database credentials in `application.yml`
  4. Check firewall rules allow MySQL connections

---

## 📝 Quick Reference

**Production Backend URLs:**
- API Base: `https://api.ggwifi.co.tz/api/v1`
- VPS IP: `http://139.84.241.182:8080/api/v1`

**Reset Endpoint:**
- `POST /api/v1/testing/reset-admin`

**New Credentials:**
- Username: `medalius`
- Phone: `0742844024`
- Password: `Kolombo@123%`

---

**Last Updated**: $(date)
**Status**: Ready for Production Reset ✅


