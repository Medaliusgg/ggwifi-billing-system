# 🚀 Deploy Updated Backend - Step by Step

## What's Waiting to Deploy

✅ Backend JAR with time-based packages: `backend/target/ggnetworks-backend-1.0.0.jar` (NEW - just built!)  
✅ Frontend changes: Already deployed to Cloudflare Pages  

❌ **Still blocking:** Cloudflare 403 error

## Deployment Steps

### Step 1: Fix Cloudflare First (CRITICAL)

**This MUST be done before deployment will work!**

Go to Cloudflare Dashboard → DNS → Records → Click "api" record → Turn OFF orange cloud (make it gray) → Save

### Step 2: Deploy Updated Backend

**Question:** Where is your backend actually deployed?

#### If Backend is on VPS:

```bash
# Copy new JAR to VPS
scp backend/target/ggnetworks-backend-1.0.0.jar user@your-vps-ip:/path/to/deployment/

# SSH into VPS
ssh user@your-vps-ip

# Stop backend
systemctl stop ggnetworks-backend

# Replace old JAR
cd /path/to/deployment
cp ggnetworks-backend-1.0.0.jar ggnetworks-backend.jar

# Start backend
systemctl start ggnetworks-backend

# Check status
systemctl status ggnetworks-backend
```

#### If Backend is on Railway:

```bash
# Railway auto-deploys from GitHub
# Just push changes (already done)
# OR manually trigger deployment in Railway dashboard
```

#### If Backend is on Render:

```bash
# Render auto-deploys from GitHub  
# OR click "Manual Deploy" in Render dashboard
```

#### If Backend is on Cloudflare Workers/Pages:

Not applicable - this is a Spring Boot app, needs VPS or platform like Railway

### Step 3: Verify Deployment

After deploying, test:

```bash
# Test if backend responds
curl https://api.ggwifi.co.tz/api/v1/customer-portal/test

# Test packages endpoint
curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages
```

**Expected:** JSON response (not 403)

### Step 4: Test Customer Portal

1. Visit: https://connect.ggwifi.co.tz
2. Should see packages loading
3. No 403 errors in browser console
4. Payment button should work

## Where is Your Backend Actually Deployed?

**Please tell me:**
1. VPS IP address?
2. Railway URL?
3. Render URL?
4. Other service?

**Once I know, I'll give you exact deployment commands!**

## Alternative: Test Locally First

If you want to test before deploying to production:

```bash
# Start backend locally
cd backend
java -jar target/ggnetworks-backend-1.0.0.jar

# Test it
curl http://localhost:8080/api/v1/customer-portal/packages

# If this works, then deploy to production
```

## Current Status

```
Frontend:  ✅ Code fixed, deployed to Cloudflare Pages
Backend:   ✅ Code fixed, JAR built locally
Cloudflare: ❌ Still blocking API requests (403)
Deployment: ❌ New backend not deployed to production yet
```

## Why You Don't See Changes

1. **Customer portal can't reach backend** (Cloudflare 403)  
2. **New backend not deployed** (JAR only on your computer)  
3. **Need both fixed** to see changes work

## Quick Action Plan

**Do this NOW:**
1. Fix Cloudflare settings (1 minute)
2. Tell me where backend is deployed
3. I'll give you exact deployment commands
4. Deploy new backend JAR
5. Test customer portal
6. See changes working! ✅

**Ready to proceed!**


