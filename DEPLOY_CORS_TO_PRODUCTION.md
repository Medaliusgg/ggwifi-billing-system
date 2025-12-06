# Deploy CORS Fixes to Production Backend

## Target Server
- **IP**: `139.84.241.182`
- **Port**: `8080`
- **Service**: Backend API

## Changes Being Deployed

1. ✅ **CorsFilter.java** - Servlet filter for CORS (HIGHEST_PRECEDENCE)
2. ✅ **CorsConfig.java** - Enhanced CORS configuration with origin patterns
3. ✅ **WebMvcCorsConfig.java** - Backup CORS at MVC level
4. ✅ **SecurityConfig.java** - Explicit OPTIONS request handling

## Deployment Steps

### Step 1: Build Backend (Local Machine)

```bash
cd backend
mvn clean package -DskipTests
```

**Expected Output:**
- JAR file created: `target/ggnetworks-backend-1.0.0.jar`
- Build status: `BUILD SUCCESS`

### Step 2: Deploy to Production Server

**Option A: Using SCP (Secure Copy)**

```bash
# Copy JAR to production server
scp target/ggnetworks-backend-1.0.0.jar user@139.84.241.182:/path/to/app/

# Replace:
# - user: Your SSH username
# - /path/to/app/: Path where backend JAR is located
```

**Option B: Using Git (If using Git deployment)**

```bash
# SSH into production server
ssh user@139.84.241.182

# Navigate to project directory
cd /path/to/GG-WIFI-WEB-APP/backend

# Pull latest changes
git pull origin main

# Build on server
mvn clean package -DskipTests
```

### Step 3: Restart Backend Service

**SSH into production server:**
```bash
ssh user@139.84.241.182
```

**Stop current backend:**

**If using systemd service:**
```bash
sudo systemctl stop ggnetworks-backend
# OR
sudo systemctl stop ggwifi-backend
# OR (check your service name)
sudo systemctl list-units | grep -i backend
```

**If running manually:**
```bash
# Find and kill Java process
ps aux | grep java | grep Ggnetworks
pkill -f "java.*Ggnetworks"
# OR
pkill -f "mvn.*spring-boot"
```

**Start backend with new code:**

**If using systemd service:**
```bash
sudo systemctl start ggnetworks-backend
# Check status
sudo systemctl status ggnetworks-backend
```

**If running manually:**
```bash
# Navigate to app directory
cd /path/to/app/

# Start backend
java -jar ggnetworks-backend-1.0.0.jar

# OR if using Maven
cd /path/to/GG-WIFI-WEB-APP/backend
mvn spring-boot:run
```

**If running in background:**
```bash
nohup java -jar ggnetworks-backend-1.0.0.jar > backend.log 2>&1 &
```

### Step 4: Verify CORS is Working

**Test OPTIONS preflight request:**
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v \
  http://139.84.241.182:8080/api/v1/customer-portal/payment/status/TEST
```

**Expected Response:**
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: http://localhost:3001
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD
< Access-Control-Allow-Headers: *
< Access-Control-Allow-Credentials: true
< Access-Control-Max-Age: 3600
```

**Test actual GET request:**
```bash
curl -X GET \
  -H "Origin: http://localhost:3001" \
  -v \
  http://139.84.241.182:8080/api/v1/customer-portal/payment/status/TEST
```

### Step 5: Check Backend Logs

**View startup logs:**
```bash
# If using systemd
sudo journalctl -u ggnetworks-backend -f

# If using log file
tail -f /path/to/logs/backend.log

# If using nohup
tail -f backend.log
```

**Look for:**
- ✅ Backend started successfully
- ✅ CORS filter loaded
- ✅ CORS configuration applied
- ✅ No errors during startup

### Step 6: Test from Frontend

1. Open customer portal: `http://localhost:3001`
2. Try to initiate a payment
3. Check browser console for CORS errors
4. Verify payment status polling works
5. Confirm no CORS errors

## Troubleshooting

### Issue: Backend won't start

**Check:**
```bash
# Check if port 8080 is in use
sudo lsof -i :8080

# Check Java process
ps aux | grep java

# Check logs for errors
tail -100 /path/to/logs/backend.log
```

### Issue: CORS still not working

**Verify:**
1. Backend is restarted (check logs for startup time)
2. CORS filter is loaded (check logs for "CORS: Handling OPTIONS")
3. Test OPTIONS request manually (see Step 4)
4. Check browser console for specific CORS error

**Check CORS filter is active:**
```bash
# Look for CORS log messages
grep -i "cors" /path/to/logs/backend.log
```

### Issue: Can't connect to server

**Check:**
```bash
# Test server connectivity
ping 139.84.241.182

# Test port accessibility
telnet 139.84.241.182 8080
# OR
nc -zv 139.84.241.182 8080
```

## Rollback Plan

If something goes wrong:

```bash
# Stop new backend
sudo systemctl stop ggnetworks-backend
# OR
pkill -f "java.*Ggnetworks"

# Restore previous JAR
cp ggnetworks-backend-1.0.0.jar.backup ggnetworks-backend-1.0.0.jar

# Start previous version
java -jar ggnetworks-backend-1.0.0.jar
```

## Verification Checklist

- [ ] Backend built successfully
- [ ] JAR file deployed to server
- [ ] Old backend stopped
- [ ] New backend started
- [ ] Backend logs show successful startup
- [ ] OPTIONS request returns 200 OK
- [ ] CORS headers present in response
- [ ] Frontend can connect without CORS errors
- [ ] Payment status polling works
- [ ] No errors in browser console

## Post-Deployment

After successful deployment:

1. **Monitor logs** for first few minutes
2. **Test payment flow** end-to-end
3. **Verify CORS** with multiple origins
4. **Check error rates** in monitoring
5. **Confirm** no user complaints

## Support

If you encounter issues:
1. Check backend logs
2. Verify CORS configuration
3. Test with curl commands
4. Check browser console errors
5. Review deployment steps

