# 🚀 Deployment Checklist - Payment System

## ⚠️ CRITICAL: Before Live Testing

### ✅ Backend Deployment

1. **CORS Configuration** ✅
   - [x] Updated `CorsConfig.java` - Added `hotspot.ggwifi.co.tz`
   - [x] Updated `WebMvcCorsConfig.java` - Added `hotspot.ggwifi.co.tz`
   - [x] Updated `CorsFilter.java` - Fixed `Access-Control-Allow-Headers` (cannot use `*` with credentials)
   - [ ] **BACKEND MUST BE RESTARTED** ⚠️

2. **Database Migration** ✅
   - [x] `webhook_processing` table created
   - [x] Migration script executed successfully

3. **Security Improvements** ✅
   - [x] Idempotency checks implemented
   - [x] Rate limiting configured (20 webhooks/minute)
   - [x] Webhook audit logging enabled

### ✅ Frontend Deployment

1. **Payment Timeout** ✅
   - [x] Reduced from 90s to 60s (matches USSD timeout)
   - [x] Max attempts: 30 (was 45)
   - [x] Updated timeout warnings

2. **Build & Deploy** 
   - [ ] Frontend built successfully
   - [ ] Deployed to Cloudflare Pages
   - [ ] Verified at https://hotspot.ggwifi.co.tz

---

## 🔧 Backend Restart Required

**The CORS fix will NOT work until the backend is restarted!**

### Steps to Restart Backend:

```bash
# SSH to backend server (139.84.241.182)
ssh user@139.84.241.182

# Navigate to backend directory
cd /path/to/backend

# Pull latest code
git pull origin main

# Rebuild (if needed)
mvn clean package -DskipTests

# Restart backend service
# Option 1: If using systemd
sudo systemctl restart ggwifi-backend

# Option 2: If using PM2
pm2 restart ggwifi-backend

# Option 3: If running manually
# Stop current process (Ctrl+C or kill)
# Start: java -jar target/ggnetworks-backend.jar
```

### Verify Backend is Running:

```bash
# Check if backend is responding
curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages

# Check CORS headers
curl -I -X OPTIONS https://api.ggwifi.co.tz/api/v1/customer-portal/payment/status/test \
  -H "Origin: https://hotspot.ggwifi.co.tz" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: https://hotspot.ggwifi.co.tz
Access-Control-Allow-Headers: Content-Type, Authorization, ...
Access-Control-Allow-Credentials: true
```

---

## 📊 Payment Timeout Configuration

### Current Settings (After Fix):

| Setting | Value | Reason |
|---------|-------|--------|
| **Max Attempts** | 30 | Matches USSD timeout |
| **Interval** | 2 seconds | Balance between responsiveness and server load |
| **Total Timeout** | 60 seconds | Matches USSD prompt timeout |
| **Warning at** | 40 seconds | Alert user payment is taking long |
| **Timeout at** | 60 seconds | USSD prompt expires |

### Timeout Flow:

```
0-20s   → Normal processing
20-40s  → Info: "Payment being processed..."
40-60s  → Warning: "Taking longer than expected..."
60s+    → Timeout: "USSD expired. Please try again."
```

---

## ✅ Pre-Deployment Verification

### Backend Checklist:
- [ ] Code pulled from repository
- [ ] Backend compiled successfully
- [ ] Database migration applied
- [ ] Backend service restarted
- [ ] CORS headers verified
- [ ] Health check endpoint responding

### Frontend Checklist:
- [ ] Code pulled from repository
- [ ] Frontend built successfully (`npm run build`)
- [ ] Build output in `dist/` folder
- [ ] `_headers` file in `dist/` folder
- [ ] Deployed to Cloudflare Pages
- [ ] Verified at https://hotspot.ggwifi.co.tz

---

## 🧪 Post-Deployment Testing

### Test 1: CORS Verification
```bash
# Test from browser console on https://hotspot.ggwifi.co.tz
fetch('https://api.ggwifi.co.tz/api/v1/customer-portal/packages')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Expected:** No CORS error, packages returned

### Test 2: Payment Flow
1. Go to https://hotspot.ggwifi.co.tz
2. Select a package
3. Fill in details
4. Initiate payment
5. **Don't enter PIN** - wait 60 seconds
6. **Expected:** Timeout message appears at 60s

### Test 3: Successful Payment
1. Initiate payment
2. Enter correct PIN on phone
3. **Expected:** Payment completes within 30-60 seconds

---

## 🚨 Common Issues

### Issue: CORS Error Still Appearing
**Solution:**
- Backend not restarted → Restart backend
- Wrong origin in request → Check browser console
- CORS config not applied → Verify backend logs

### Issue: Payment Stuck on "Processing"
**Solution:**
- Check backend logs for webhook
- Verify ZenoPay webhook URL is correct
- Check network connectivity
- Verify payment status endpoint is accessible

### Issue: Timeout Not Working
**Solution:**
- Check frontend build includes latest code
- Verify `pollPaymentStatus` is called with correct parameters
- Check browser console for errors
- Verify `paymentElapsedTime` is incrementing

---

## 📝 Deployment Commands

### Backend:
```bash
# Pull and restart
git pull origin main
mvn clean package -DskipTests
sudo systemctl restart ggwifi-backend
```

### Frontend:
```bash
# Build and verify
cd Frontend/customer_portal
npm run build
ls -la dist/

# Cloudflare Pages will auto-deploy on push
git add .
git commit -m "Fix payment timeout to 60s"
git push origin main
```

---

**Last Updated:** 2025-12-06  
**Status:** Ready for deployment after backend restart

