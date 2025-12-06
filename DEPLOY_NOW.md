# 🚀 DEPLOYMENT INSTRUCTIONS - DO THIS NOW

## ⚠️ CRITICAL: Code is committed but NOT deployed to production!

---

## 🔴 BACKEND DEPLOYMENT (REQUIRED)

### Step 1: SSH to Backend Server
```bash
ssh user@139.84.241.182
# Or use your SSH credentials
```

### Step 2: Navigate to Backend Directory
```bash
cd /path/to/backend
# Or wherever your backend code is located
```

### Step 3: Pull Latest Code
```bash
git pull origin main
```

### Step 4: Rebuild (if needed)
```bash
mvn clean package -DskipTests
```

### Step 5: Restart Backend Service

**Option A: If using systemd**
```bash
sudo systemctl restart ggwifi-backend
# Or whatever your service name is
sudo systemctl status ggwifi-backend  # Verify it's running
```

**Option B: If using PM2**
```bash
pm2 restart ggwifi-backend
pm2 status  # Verify it's running
```

**Option C: If running manually**
```bash
# Find and kill existing process
ps aux | grep java
kill <PID>

# Start new instance
nohup java -jar target/ggnetworks-backend.jar > logs/backend.log 2>&1 &
```

### Step 6: Verify Backend is Running
```bash
# Check if backend responds
curl http://localhost:8080/api/v1/customer-portal/packages

# Check CORS headers
curl -I -X OPTIONS http://localhost:8080/api/v1/customer-portal/payment/status/test \
  -H "Origin: https://hotspot.ggwifi.co.tz" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Expected:** Should see `Access-Control-Allow-Origin: https://hotspot.ggwifi.co.tz`

---

## 🟡 FRONTEND DEPLOYMENT (Cloudflare Pages)

### Option 1: Auto-Deploy (If configured)
Cloudflare Pages should automatically deploy when code is pushed to `main` branch.

**Check deployment status:**
1. Go to Cloudflare Dashboard
2. Navigate to Pages → `ggwifi-customer-portal`
3. Check latest deployment status
4. Wait for build to complete (usually 2-5 minutes)

### Option 2: Manual Deploy (If auto-deploy not working)

**From your local machine:**
```bash
cd Frontend/customer_portal

# Build the project
npm run build

# Deploy using Wrangler (if you have it configured)
npx wrangler pages deploy dist --project-name=ggwifi-customer-portal
```

**Or via Cloudflare Dashboard:**
1. Go to Cloudflare Dashboard → Pages
2. Select your project
3. Click "Upload assets"
4. Upload the `dist/` folder contents

---

## ✅ VERIFICATION CHECKLIST

### Backend Verification:
- [ ] Backend code pulled from repository
- [ ] Backend compiled successfully
- [ ] Backend service restarted
- [ ] Backend responding at http://139.84.241.182:8080
- [ ] CORS headers include `hotspot.ggwifi.co.tz`
- [ ] Payment status endpoint working
- [ ] Webhook endpoint accessible

### Frontend Verification:
- [ ] Frontend code pushed to repository
- [ ] Cloudflare Pages deployment completed
- [ ] Frontend accessible at https://hotspot.ggwifi.co.tz
- [ ] No console errors
- [ ] Payment flow works

### Integration Verification:
- [ ] Frontend can call backend API (no CORS errors)
- [ ] Payment initiation works
- [ ] Payment status polling works
- [ ] Timeout works correctly (60 seconds)
- [ ] All status messages display correctly

---

## 🧪 TEST AFTER DEPLOYMENT

### Test 1: CORS Fix
```javascript
// Run in browser console on https://hotspot.ggwifi.co.tz
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
6. **Expected:** Timeout message at 60s

### Test 3: Status Check
```bash
# Test payment status endpoint
curl https://api.ggwifi.co.tz/api/v1/customer-portal/payment/status/PKG_TEST_123
```
**Expected:** JSON response with payment status

---

## 📋 QUICK DEPLOYMENT COMMANDS

### Backend (SSH to server):
```bash
cd /path/to/backend && \
git pull origin main && \
mvn clean package -DskipTests && \
sudo systemctl restart ggwifi-backend && \
sleep 5 && \
curl http://localhost:8080/api/v1/customer-portal/packages
```

### Frontend (Local):
```bash
cd Frontend/customer_portal && \
npm run build && \
# Then check Cloudflare Pages dashboard for auto-deploy
```

---

## 🚨 IMPORTANT NOTES

1. **Backend MUST be restarted** for CORS fix to work
2. **Database migration** already applied (webhook_processing table)
3. **Frontend** will auto-deploy via Cloudflare Pages (check dashboard)
4. **Test thoroughly** after deployment

---

**Status:** ⚠️ Code committed, deployment pending  
**Next Step:** Deploy backend and verify frontend auto-deployment

