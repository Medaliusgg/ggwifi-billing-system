# Customer Portal Backend Configuration

## Current Status

**The customer portal is currently using the DEPLOYED BACKEND** at `http://139.84.241.182:8080/api/v1`

## Environment File Priority

Vite loads environment files in this order (highest priority first):

1. **`.env.local`** ✅ **ACTIVE** (always loaded, except in test mode)
   - `VITE_API_URL=http://139.84.241.182:8080/api/v1`
   - **This is what's currently being used**

2. `.env.production` (loaded in production mode)
   - `VITE_API_URL=https://api.ggwifi.co.tz/api/v1`

3. `.env` (default, lowest priority)
   - `VITE_API_URL=http://localhost:8080`

## Why CORS Errors Are Happening

The customer portal frontend (running on `http://localhost:3001`) is trying to connect to the deployed backend at `http://139.84.241.182:8080`, but:

- ❌ The deployed backend has **NOT been restarted** with the new CORS code
- ❌ The deployed backend doesn't have the new `CorsFilter`
- ❌ The deployed backend doesn't have the updated CORS configuration

## Solutions

### Option 1: Deploy & Restart Backend (Recommended for Production)

**Steps:**
1. Build the backend with new CORS code:
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```

2. Deploy to production server (`139.84.241.182`):
   ```bash
   # Copy JAR or pull latest code
   scp target/ggnetworks-backend-1.0.0.jar user@139.84.241.182:/path/to/app/
   ```

3. Restart backend on production server:
   ```bash
   ssh user@139.84.241.182
   sudo systemctl restart ggnetworks-backend
   # OR
   pkill -f "java.*Ggnetworks" && java -jar app.jar
   ```

4. Verify CORS is working:
   ```bash
   curl -X OPTIONS \
     -H "Origin: http://localhost:3001" \
     -H "Access-Control-Request-Method: GET" \
     -v \
     http://139.84.241.182:8080/api/v1/customer-portal/payment/status/TEST
   ```

**Result:** CORS errors will be resolved, payment processing will work.

### Option 2: Use Local Backend (For Testing/Development)

**Steps:**
1. Temporarily disable `.env.local`:
   ```bash
   cd Frontend/customer_portal
   mv .env.local .env.local.bak
   ```

2. Start local backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. Restart frontend:
   ```bash
   cd Frontend/customer_portal
   npm run dev
   ```

**Result:** Frontend will use local backend at `http://localhost:8080` (from `.env` file).

**To revert:**
```bash
mv .env.local.bak .env.local
```

### Option 3: Update .env.local to Use Local Backend

**Steps:**
1. Edit `.env.local`:
   ```bash
   cd Frontend/customer_portal
   # Change VITE_API_URL to localhost
   echo "VITE_API_URL=http://localhost:8080/api/v1" > .env.local
   ```

2. Restart frontend dev server

**Result:** Frontend will use local backend.

## Configuration Files Summary

| File | Priority | API URL | Use Case |
|------|----------|---------|----------|
| `.env.local` | Highest | `http://139.84.241.182:8080/api/v1` | **Currently Active** |
| `.env.production` | Medium | `https://api.ggwifi.co.tz/api/v1` | Production build |
| `.env` | Lowest | `http://localhost:8080/api/v1` | Default fallback |

## Quick Reference

**Check which backend is being used:**
```bash
cd Frontend/customer_portal
cat .env.local | grep VITE_API_URL
```

**Switch to local backend:**
```bash
cd Frontend/customer_portal
echo "VITE_API_URL=http://localhost:8080/api/v1" > .env.local
```

**Switch back to deployed backend:**
```bash
cd Frontend/customer_portal
echo "VITE_API_URL=http://139.84.241.182:8080/api/v1" > .env.local
```

## Important Notes

1. **`.env.local` takes precedence** - This is why the deployed backend is being used
2. **CORS must be configured on the backend** - The frontend can't fix CORS errors
3. **Backend restart required** - CORS changes only take effect after restart
4. **For production**: Deploy new CORS code to the deployed backend
5. **For testing**: Use local backend with `.env` or updated `.env.local`



