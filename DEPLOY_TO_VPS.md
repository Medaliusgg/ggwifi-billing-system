# 🚀 DEPLOY BACKEND TO VPS - STEP BY STEP

## ⚠️ IMPORTANT: Backend is currently running LOCALLY, not on VPS!

The backend needs to be deployed to your VPS server (139.84.241.182) for the live customer portal to work.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [x] Code changes committed to git
- [x] Code pushed to main branch
- [x] Backend builds successfully locally
- [ ] Backend deployed to VPS
- [ ] Backend running on VPS
- [ ] CORS configured correctly on VPS
- [ ] Payment endpoints working on VPS

---

## 🔴 STEP 1: SSH TO VPS SERVER

```bash
ssh user@139.84.241.182
# Or use your SSH credentials
```

---

## 🔴 STEP 2: NAVIGATE TO BACKEND DIRECTORY

```bash
cd /path/to/backend
# Or wherever your backend code is located on the VPS
```

---

## 🔴 STEP 3: PULL LATEST CODE

```bash
git pull origin main
```

**Expected output:**
```
Updating <commit>..<commit>
Fast-forward
...
```

---

## 🔴 STEP 4: STOP EXISTING BACKEND

**Option A: If using systemd**
```bash
sudo systemctl stop ggwifi-backend
# Or whatever your service name is
```

**Option B: If using PM2**
```bash
pm2 stop ggwifi-backend
# Or
pm2 stop all
```

**Option C: If running manually**
```bash
# Find the process
ps aux | grep java | grep ggnetworks

# Kill it
kill <PID>
# Or force kill if needed
kill -9 <PID>
```

---

## 🔴 STEP 5: REBUILD BACKEND

```bash
mvn clean package -DskipTests
```

**Expected output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX.XXX s
```

---

## 🔴 STEP 6: START BACKEND

**Option A: If using systemd**
```bash
sudo systemctl start ggwifi-backend
sudo systemctl status ggwifi-backend  # Verify it's running
```

**Option B: If using PM2**
```bash
pm2 start target/ggnetworks-backend-1.0.0.jar --name ggwifi-backend
pm2 status  # Verify it's running
```

**Option C: If running manually**
```bash
nohup java -jar target/ggnetworks-backend-1.0.0.jar > logs/backend.log 2>&1 &
```

---

## 🔴 STEP 7: VERIFY DEPLOYMENT

### Test 1: Check if backend is running
```bash
ps aux | grep java | grep ggnetworks
```

### Test 2: Check if port 8080 is listening
```bash
netstat -tlnp | grep :8080
# Or
ss -tlnp | grep :8080
```

### Test 3: Test API endpoint
```bash
curl http://localhost:8080/api/v1/customer-portal/packages
```

### Test 4: Test CORS headers
```bash
curl -I -X OPTIONS http://localhost:8080/api/v1/customer-portal/payment/status/test \
  -H "Origin: https://hotspot.ggwifi.co.tz" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Expected:** Should see `Access-Control-Allow-Origin: https://hotspot.ggwifi.co.tz`

### Test 5: Test from external (your machine)
```bash
curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages
```

---

## 🔴 STEP 8: CHECK LOGS

```bash
# If using systemd
sudo journalctl -u ggwifi-backend -f

# If using PM2
pm2 logs ggwifi-backend

# If running manually
tail -f logs/backend.log
```

**Look for:**
- ✅ "Started Application" (backend started successfully)
- ✅ No CORS errors
- ✅ No database connection errors
- ✅ No port binding errors

---

## 🧪 POST-DEPLOYMENT TESTING

### Test from Customer Portal (Cloudflare Pages)

1. Go to https://hotspot.ggwifi.co.tz
2. Open browser console (F12)
3. Try to fetch packages:
   ```javascript
   fetch('https://api.ggwifi.co.tz/api/v1/customer-portal/packages')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```
4. **Expected:** No CORS errors, packages returned

### Test Payment Flow

1. Select a package
2. Fill in customer details
3. Initiate payment
4. **Expected:** Payment request succeeds, order ID returned
5. **Expected:** Status polling works
6. **Expected:** No CORS errors in console

---

## 🚨 TROUBLESHOOTING

### Backend won't start
- Check logs: `tail -f logs/backend.log`
- Check Java version: `java -version` (should be Java 21)
- Check port 8080: `netstat -tlnp | grep 8080` (should be free)

### CORS errors still happening
- Verify `CorsConfig.java` includes `hotspot.ggwifi.co.tz`
- Verify `NoSecurityConfig.java` uses `CorsConfigurationSource`
- Restart backend after changes
- Check browser console for exact CORS error

### Database connection errors
- Check database is running
- Verify `application.properties` has correct DB credentials
- Check database connection: `mysql -u user -p database_name`

### Port already in use
```bash
# Find what's using port 8080
sudo lsof -i :8080
# Or
sudo netstat -tlnp | grep 8080

# Kill the process
sudo kill <PID>
```

---

## 📋 QUICK DEPLOYMENT SCRIPT

Save this as `deploy-backend.sh` on your VPS:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying GGNetworks Backend..."

# Navigate to backend directory
cd /path/to/backend

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Stop existing backend
echo "🛑 Stopping existing backend..."
sudo systemctl stop ggwifi-backend || pm2 stop ggwifi-backend || pkill -f "java.*ggnetworks"

# Build
echo "🔨 Building backend..."
mvn clean package -DskipTests

# Start backend
echo "🚀 Starting backend..."
sudo systemctl start ggwifi-backend || pm2 start target/ggnetworks-backend-1.0.0.jar --name ggwifi-backend || nohup java -jar target/ggnetworks-backend-1.0.0.jar > logs/backend.log 2>&1 &

# Wait for startup
echo "⏳ Waiting for backend to start..."
sleep 10

# Verify
echo "✅ Verifying deployment..."
curl -s http://localhost:8080/api/v1/customer-portal/packages > /dev/null && echo "✅ Backend is responding!" || echo "❌ Backend not responding"

echo "✅ Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

---

## ✅ SUCCESS CRITERIA

- [ ] Backend responds to API requests
- [ ] CORS headers include `hotspot.ggwifi.co.tz`
- [ ] Payment endpoints work
- [ ] No errors in logs
- [ ] Customer portal can connect to backend
- [ ] Payment flow works end-to-end

---

**Status:** ⚠️ Backend needs to be deployed to VPS  
**Next Step:** SSH to VPS and follow steps above

