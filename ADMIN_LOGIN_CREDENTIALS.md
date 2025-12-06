# 🔐 Admin Portal Login Credentials

## Quick Access
**URL:** http://localhost:3000/login

---

## Available Credentials (Try in Order)

### Option 1: Default Admin (Most Common)
```
Username: admin
Phone Number: 0676591880
Password: admin123
```

### Option 2: Test Admin
```
Username: testadmin
Phone Number: 0676591880
Password: testadmin123
```

### Option 3: Medalius Admin
```
Username: medaliusgg
Phone Number: 0676591880
Password: #Kolombo@123%
```

### Option 4: Production Credentials
```
Username: admin
Phone Number: 0742844024
Password: kolombo@12
```

---

## Login Steps

1. Navigate to: **http://localhost:3000**
2. You should be redirected to `/login` if not authenticated
3. Select **"Admin Login"** (top toggle button)
4. Enter credentials:
   - **Username**: (try options above)
   - **Phone Number**: (try options above)
   - **Password**: (try options above)
5. Click **"Sign In as Admin"**

---

## If Login Fails

### Check Backend Connection
```bash
# Test if backend is running
curl http://localhost:8080/api/v1/health

# Or check backend logs
tail -f backend/logs/application.log
```

### Check Database
The admin user should exist in the database. If not, you can create one:

```bash
# Connect to MySQL
mysql -u root -p

# Use the database
USE ggnetworks_db;

# Check if admin exists
SELECT username, phone_number, role FROM users WHERE role = 'ADMIN' OR role = 'SUPER_ADMIN';
```

### Create Admin User via API
The backend has a testing endpoint to create a test admin:

```bash
curl -X POST http://localhost:8080/api/v1/testing/create-test-admin
```

This will create:
- Username: `testadmin`
- Password: `testadmin123`

---

## Troubleshooting

### Issue: "Invalid credentials"
- **Solution**: Try different credential combinations from the list above
- **Check**: Verify backend is running and database is connected

### Issue: "Account is inactive"
- **Solution**: Check database: `UPDATE users SET is_active = 1 WHERE username = 'admin';`

### Issue: "Access denied. SUPER_ADMIN required"
- **Solution**: The user must have role `SUPER_ADMIN` or `ADMIN`
- **Check**: `SELECT username, role FROM users WHERE username = 'admin';`

### Issue: Backend not responding
- **Solution**: Start the backend:
  ```bash
  cd backend
  mvn spring-boot:run
  ```

---

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:8080/api/v1/health

# Test admin login endpoint
curl -X POST http://localhost:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","phoneNumber":"0676591880","password":"admin123"}'

# Create test admin
curl -X POST http://localhost:8080/api/v1/testing/create-test-admin
```

---

## Notes

- The backend automatically creates an admin user on first startup if it doesn't exist
- Default credentials are: `admin` / `admin123`
- Phone number might vary depending on database setup
- If using production database, credentials might be different

---

**Last Updated**: $(date)
**Status**: Ready for Testing ✅
