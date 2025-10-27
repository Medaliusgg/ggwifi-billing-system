# Customer Portal API Connection Fix - COMPLETED ✅

## Issue Resolved
The customer portal was getting 403 errors and duplicate `/api/v1/api/v1/` paths when connecting to the backend.

## Root Cause
1. Wrong environment variable syntax: Using `process.env.REACT_APP_*` (Create React App) instead of `import.meta.env.VITE_*` (Vite)
2. Duplicate path construction: Base URL included `/api/v1` AND endpoints also included `/api/v1`

## Fixes Applied

### 1. Environment Variable Syntax
**Changed in all files:**
- `process.env.REACT_APP_API_URL` → `import.meta.env.VITE_API_URL`
- `process.env.REACT_APP_SELCOM_*` → `import.meta.env.VITE_SELCOM_*`

**Files updated:**
- `Frontend/customer_portal/src/services/api.js`
- `Frontend/customer_portal/src/services/apiService.js`
- `Frontend/customer_portal/src/services/selcomPayment.js`

### 2. API Path Configuration
**Fixed structure:**
- **Base URL:** `https://api.ggwifi.co.tz/api/v1` (includes context path)
- **Endpoints:** `/customer-portal/packages` (no prefix needed)
- **Final URL:** `https://api.ggwifi.co.tz/api/v1/customer-portal/packages` ✅

### 3. Cloudflare Configuration
Updated `cloudflare-pages-config.json` line 25:
```json
"VITE_API_URL": "https://api.ggwifi.co.tz/api/v1"
```

## Cloudflare Pages Environment Variables
**VERIFY THIS IS SET IN CLOUDFLARE PAGES:**

Go to Cloudflare Dashboard → Pages → ggwifi-customer-portal → Settings → Environment Variables

Set these variables:
```
VITE_API_URL=https://api.ggwifi.co.tz/api/v1
VITE_APP_NAME=GGWIFI Customer Portal
VITE_APP_DOMAIN=connect.ggwifi.co.tz
VITE_ENVIRONMENT=production
```

## Current Status

✅ Code committed: `1e958f5`  
✅ Code pushed to GitHub: `main` branch  
🔄 Cloudflare Pages: Auto-deploying now  
⏳ Expected deployment: 2-5 minutes

## Testing After Deployment

1. Visit: https://connect.ggwifi.co.tz
2. Open browser console (F12)
3. Check Network tab for API requests
4. Verify URLs are: `https://api.ggwifi.co.tz/api/v1/customer-portal/...`
5. No more 403 errors ✅
6. No more duplicate `/api/v1/api/v1/` paths ✅

## Expected Behavior

- Login: Should work without errors
- Package loading: Packages should load from backend
- Payment initiation: Should connect to backend API
- All API calls: Should use correct URL structure

## Next Steps

1. Wait for Cloudflare Pages to complete deployment (check dashboard)
2. Clear browser cache for connect.ggwifi.co.tz
3. Test the customer portal functionality
4. Verify backend connectivity from browser console

## Troubleshooting

If still getting errors after deployment:

1. **Check Cloudflare Pages Environment Variables:**
   - Ensure `VITE_API_URL=https://api.ggwifi.co.tz/api/v1` is set
   - Rebuild the project if needed

2. **Clear Cloudflare Cache:**
   - Cloudflare Dashboard → Caching → Purge Everything

3. **Verify Backend is Running:**
   - Test: `curl https://api.ggwifi.co.tz/api/v1/health`

4. **Check Browser Console:**
   - Look for exact error messages
   - Verify the API URLs being called

---

**Deployment Commit:** 1e958f5  
**Date:** $(date)  
**Status:** ✅ COMPLETED - Ready for testing

