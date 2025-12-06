# 🔐 Production Admin Reset - Quick Guide

## 🌐 Your Environment
- **Admin Portal**: https://admin.ggwifi.co.tz (Cloudflare Pages)
- **Backend API**: https://api.ggwifi.co.tz/api/v1 (VPS)

---

## 🚀 Reset Admin User (Choose One Method)

### Method 1: API Endpoint (Try This First)

```bash
curl -X POST https://api.ggwifi.co.tz/api/v1/testing/reset-admin
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Admin user reset successfully",
  "username": "medalius",
  "phoneNumber": "0742844024",
  "role": "SUPER_ADMIN"
}
```

---

### Method 2: Direct Database (If API doesn't work)

**SSH into your VPS, then run:**

```bash
# Connect to MySQL
mysql -u ggnetworks -p ggnetworks_radius

# Run these SQL commands:
DELETE FROM users WHERE role IN ('ADMIN', 'SUPER_ADMIN');

INSERT INTO users (
    username, phone_number, password, first_name, last_name, 
    email, role, status, is_active, is_email_verified, 
    is_phone_verified, created_at, updated_at
) VALUES (
    'medalius',
    '0742844024',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'Medalius',
    'Administrator',
    'medalius@ggwifi.co.tz',
    'SUPER_ADMIN',
    'ACTIVE',
    1, 1, 1,
    NOW(),
    NOW()
);

# Verify
SELECT username, phone_number, role FROM users WHERE username = 'medalius';
```

---

### Method 3: Use Reset Script

**On your VPS:**

```bash
# Upload reset-production-admin.sh to your VPS
# Then run:
chmod +x reset-production-admin.sh
./reset-production-admin.sh
```

**Note:** Update database credentials in the script first!

---

## 🔑 New Admin Credentials

After reset, login with:

```
Username: medalius
Phone Number: 0742844024
Password: Kolombo@123%
```

**Login at:** https://admin.ggwifi.co.tz/login

---

## ✅ Verify Reset

1. **Check API Response** (if using Method 1)
2. **Check Database** (if using Method 2):
   ```sql
   SELECT username, phone_number, role, status FROM users WHERE username = 'medalius';
   ```
3. **Test Login** at https://admin.ggwifi.co.tz/login

---

## 🐛 Troubleshooting

### API returns 404
- The endpoint might not be available in production
- Use Method 2 (Direct Database) instead

### API returns 403
- Endpoint might require authentication
- Use Method 2 (Direct Database) instead

### Can't connect to database
- Verify MySQL is running: `systemctl status mysql`
- Check database credentials
- Ensure you're SSH'd into the VPS

---

**Quick Command Reference:**
```bash
# Test backend
curl https://api.ggwifi.co.tz/api/v1/health

# Reset admin (if endpoint works)
curl -X POST https://api.ggwifi.co.tz/api/v1/testing/reset-admin
```



