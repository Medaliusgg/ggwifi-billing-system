# CORS Configuration - Deployment Guide

## ✅ Changes Made

### 1. Enhanced CORS Configuration (`CorsConfig.java`)
- ✅ Uses `setAllowedOriginPatterns` for flexible origin matching (supports wildcards)
- ✅ Allows all localhost ports: `http://localhost:*`
- ✅ Allows all 127.0.0.1 ports: `http://127.0.0.1:*`
- ✅ Allows production IP with any port: `http://139.84.241.182:*`
- ✅ Specific origins as fallback

### 2. Enhanced CORS Filter (`CorsFilter.java`)
- ✅ Runs at HIGHEST_PRECEDENCE (before Spring Security)
- ✅ Handles OPTIONS preflight requests explicitly
- ✅ More permissive origin checking (allows localhost/127.0.0.1 with any port)
- ✅ Logs CORS requests for debugging
- ✅ Returns immediately for OPTIONS requests (doesn't continue filter chain)

### 3. WebMvc CORS Config (`WebMvcCorsConfig.java`) - NEW
- ✅ Backup CORS configuration at MVC level
- ✅ Uses origin patterns for flexibility
- ✅ Provides additional layer of CORS support

### 4. Security Config Update (`SecurityConfig.java`)
- ✅ Explicitly allows OPTIONS requests for CORS preflight
- ✅ CORS configured before authorization

## 🚀 Deployment Steps

### Step 1: Build Backend
```bash
cd backend
mvn clean package -DskipTests
```

### Step 2: Deploy to Production Server (139.84.241.182)

**Option A: If using JAR file:**
```bash
# Copy JAR to server
scp target/ggnetworks-backend-1.0.0.jar user@139.84.241.182:/path/to/app/

# SSH into server
ssh user@139.84.241.182

# Stop current backend
sudo systemctl stop ggnetworks-backend
# OR
pkill -f "java.*Ggnetworks"

# Start new backend
java -jar /path/to/app/ggnetworks-backend-1.0.0.jar
# OR
sudo systemctl start ggnetworks-backend
```

**Option B: If using Git deployment:**
```bash
# SSH into server
ssh user@139.84.241.182

# Navigate to project
cd /path/to/GG-WIFI-WEB-APP/backend

# Pull latest changes
git pull origin main

# Build
mvn clean package -DskipTests

# Restart backend
sudo systemctl restart ggnetworks-backend
# OR
pkill -f "java.*Ggnetworks" && mvn spring-boot:run
```

### Step 3: Verify CORS is Working

**Test from your local machine:**
```bash
# Test OPTIONS preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v \
  http://139.84.241.182:8080/api/v1/customer-portal/payment/status/TEST

# Expected response:
# < HTTP/1.1 200 OK
# < Access-Control-Allow-Origin: http://localhost:3001
# < Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD
# < Access-Control-Allow-Headers: *
# < Access-Control-Allow-Credentials: true
```

**Test actual GET request:**
```bash
curl -X GET \
  -H "Origin: http://localhost:3001" \
  -v \
  http://139.84.241.182:8080/api/v1/customer-portal/payment/status/TEST
```

### Step 4: Check Backend Logs

After restart, you should see:
```
✅ CORS: Handling OPTIONS preflight request from origin: http://localhost:3001
```

If you see warnings about origins not in list, that's okay - the filter allows them for development.

## 🔍 Troubleshooting

### Issue: Still getting CORS errors

**Check 1: Backend is restarted**
```bash
# On server, check if backend is running
ps aux | grep java | grep Ggnetworks

# Check backend logs
tail -f /path/to/logs/backend.log
# OR
journalctl -u ggnetworks-backend -f
```

**Check 2: CORS Filter is loaded**
Look for these in startup logs:
- `CorsFilter` class loaded
- `CorsConfig` bean created
- `WebMvcCorsConfig` registered

**Check 3: Test OPTIONS request manually**
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -v \
  http://139.84.241.182:8080/api/v1/customer-portal/payment/status/TEST
```

If this fails, CORS is not configured correctly.

**Check 4: Verify origin is allowed**
The filter allows:
- Any `http://localhost:*` origin
- Any `http://127.0.0.1:*` origin
- Any `http://139.84.241.182:*` origin
- Production domains

### Issue: OPTIONS request returns 403

**Solution**: Make sure SecurityConfig allows OPTIONS requests:
```java
.requestMatchers(request -> "OPTIONS".equalsIgnoreCase(request.getMethod())).permitAll()
```

### Issue: CORS headers not in response

**Check**:
1. CorsFilter is running (check logs for "CORS: Handling OPTIONS")
2. Origin header is present in request
3. Filter chain order is correct

## 📋 Verification Checklist

- [ ] Backend compiled successfully
- [ ] Backend deployed to production server
- [ ] Backend restarted
- [ ] OPTIONS request returns 200 OK
- [ ] CORS headers present in response
- [ ] GET request works from browser
- [ ] Payment status polling works
- [ ] No CORS errors in browser console

## 🎯 Expected Results

### Before Deployment:
- ❌ CORS errors blocking requests
- ❌ Payment status polling fails
- ❌ Browser console shows CORS errors

### After Deployment:
- ✅ CORS headers in all responses
- ✅ OPTIONS requests handled correctly
- ✅ Payment status polling works
- ✅ No CORS errors in browser console
- ✅ Professional error handling

## 📝 Notes

1. **Backend Restart Required**: CORS changes only take effect after restart
2. **Multiple CORS Layers**: We have 3 layers of CORS:
   - CorsFilter (Servlet Filter - highest priority)
   - CorsConfig (Spring Security CORS)
   - WebMvcCorsConfig (MVC CORS - backup)
3. **Development Mode**: Filter is permissive for localhost/127.0.0.1 origins
4. **Production**: Filter allows specific production origins

## 🔐 Security Considerations

For production, consider:
- Restricting allowed origins to specific domains
- Using environment variables for allowed origins
- Implementing origin validation
- Adding rate limiting per origin

