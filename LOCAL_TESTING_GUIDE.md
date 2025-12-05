# Local Testing Guide - Complete Setup

This guide helps you run and test the entire GG-WIFI system locally before deployment.

## Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** and **npm** (for frontends)
- **MySQL 8.0+** (for database)
- **Redis** (optional, for session management)

---

## Step 1: Backend Setup

### 1.1 Database Configuration

1. **Create MySQL database:**
```bash
mysql -u root -p
CREATE DATABASE ggwifi_billing;
CREATE USER 'ggwifi_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ggwifi_billing.* TO 'ggwifi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

2. **Update `backend/src/main/resources/application.yml`:**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggwifi_billing?useSSL=false&serverTimezone=UTC
    username: ggwifi_user
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 1.2 Environment Variables

Create `backend/.env` (or set in your IDE):
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ggwifi_billing
DB_USER=ggwifi_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=86400000

# SMS API (if using)
SMS_API_KEY=your_sms_api_key
SMS_API_URL=https://api.example.com/sms

# Payment Gateway (ZenoPay)
ZENOPAY_API_KEY=your_zenopay_key
ZENOPAY_API_URL=https://api.zenopay.com

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 1.3 Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Backend will run on:** `http://localhost:8080`  
**API Base URL:** `http://localhost:8080/api/v1`

---

## Step 2: Admin Portal Setup

### 2.1 Install Dependencies

```bash
cd Frontend/admin_portal
npm install
```

### 2.2 Create Environment File

Create `Frontend/admin_portal/.env.local`:
```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_DOMAIN=localhost:5173
VITE_APP_NAME=GGWIFI Admin Portal
VITE_ENVIRONMENT=development
```

### 2.3 Run Admin Portal

```bash
cd Frontend/admin_portal
npm run dev
```

**Admin Portal will run on:** `http://localhost:5173` (or next available port)

---

## Step 3: Customer Portal Setup

### 3.1 Install Dependencies

```bash
cd Frontend/customer_portal
npm install
```

### 3.2 Create Environment File

Create `Frontend/customer_portal/.env.local`:
```bash
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=GGWIFI Customer Portal
VITE_APP_DOMAIN=localhost:5174
VITE_ENVIRONMENT=development
```

### 3.3 Run Customer Portal

```bash
cd Frontend/customer_portal
npm run dev
```

**Customer Portal will run on:** `http://localhost:5174` (or next available port)

---

## Step 4: Quick Start Script

Create a script to run everything at once:

```bash
#!/bin/bash
# run-all-local.sh

# Terminal 1: Backend
cd backend && mvn spring-boot:run &

# Terminal 2: Admin Portal
cd Frontend/admin_portal && npm run dev &

# Terminal 3: Customer Portal
cd Frontend/customer_portal && npm run dev &

echo "All services starting..."
echo "Backend: http://localhost:8080"
echo "Admin Portal: http://localhost:5173"
echo "Customer Portal: http://localhost:5174"
```

---

## Step 5: Testing Checklist

### 5.1 Backend Health Check

```bash
curl http://localhost:8080/api/v1/admin/health
```

Expected: `{"status":"success","message":"Admin service is healthy"}`

### 5.2 Admin Portal Testing

1. **Login:**
   - Navigate to `http://localhost:5173/login`
   - Use admin credentials: `admin` / `0742844024` / `admin123`
   - Verify JWT token is stored

2. **Dashboard:**
   - Verify dashboard loads with stats
   - Check all API calls return 200

3. **Module Testing:**
   - Customer Management
   - Package Management
   - Voucher Management
   - Payment Management
   - Invoice Management
   - Session Management
   - Router Management
   - Loyalty Program
   - Transaction Management
   - User Management
   - Analytics
   - Settings
   - Marketing

### 5.3 Customer Portal Testing

1. **Guest Flow:**
   - Browse packages (no login)
   - Initiate payment
   - Enter voucher code

2. **Authenticated Flow:**
   - Login with phone: `0658823944`
   - Request OTP
   - Verify OTP
   - View dashboard
   - View profile
   - View vouchers
   - View payment history
   - View usage history

3. **Payment Flow:**
   - Select package
   - Initiate payment
   - Complete payment (test mode)
   - Verify voucher generation
   - Verify auto-connection

---

## Step 6: Common Issues & Solutions

### Issue 1: Backend won't start
- **Check:** MySQL is running
- **Check:** Database exists
- **Check:** Port 8080 is not in use
- **Solution:** `lsof -i :8080` to find process using port

### Issue 2: Frontend can't connect to backend
- **Check:** Backend is running on port 8080
- **Check:** CORS is enabled in backend
- **Check:** `.env.local` has correct API URL
- **Solution:** Verify `VITE_API_URL` in frontend env file

### Issue 3: Database connection error
- **Check:** MySQL service is running
- **Check:** Database credentials are correct
- **Check:** Database user has proper permissions
- **Solution:** Recreate database and user

### Issue 4: Port already in use
- **Solution:** Change port in `vite.config.js` or kill process:
  ```bash
  lsof -ti:5173 | xargs kill -9
  ```

---

## Step 7: Testing Workflow

1. **Start Backend** → Verify health endpoint
2. **Start Admin Portal** → Test login → Test all modules
3. **Start Customer Portal** → Test guest flow → Test authenticated flow
4. **Test Integration** → Full user journey (package → payment → voucher → connection)
5. **Fix Issues** → Document any bugs found
6. **Re-test** → Verify fixes work
7. **Deploy** → Only after 100% verification

---

## Step 8: Useful Commands

### Backend
```bash
# Run backend
cd backend && mvn spring-boot:run

# Run tests
cd backend && mvn test

# Build JAR
cd backend && mvn clean package
```

### Frontend
```bash
# Admin Portal
cd Frontend/admin_portal
npm install
npm run dev
npm run build

# Customer Portal
cd Frontend/customer_portal
npm install
npm run dev
npm run build
```

### Database
```bash
# Connect to MySQL
mysql -u ggwifi_user -p ggwifi_billing

# Check tables
SHOW TABLES;

# Check data
SELECT * FROM users LIMIT 5;
```

---

## Step 9: Test Data

### Admin User
- Username: `admin`
- Phone: `0742844024`
- Password: `admin123`

### Test Customer
- Phone: `0658823944` (will be normalized to `+255658823944`)
- Use OTP login flow

---

## Step 10: Browser DevTools

### Network Tab
- Monitor all API calls
- Check for 200/400/500 errors
- Verify request/response payloads

### Console Tab
- Check for JavaScript errors
- Verify API responses
- Debug authentication flow

### Application Tab
- Check localStorage for tokens
- Verify session storage
- Check cookies

---

## Next Steps

1. ✅ Set up local environment
2. ✅ Run all services
3. ✅ Test all features
4. ✅ Document any issues
5. ✅ Fix issues
6. ✅ Re-test
7. ✅ Deploy to production

---

## Notes

- **Always test locally first** before deploying
- **Use test data** (don't use production credentials)
- **Document bugs** as you find them
- **Test on multiple browsers** (Chrome, Firefox, Safari)
- **Test responsive design** (mobile, tablet, desktop)

