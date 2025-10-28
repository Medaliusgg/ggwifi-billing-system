# Cloudflare Setup Guide for GG-WIFI Admin Portal

**Date:** 2025-10-28  
**Purpose:** Configure Cloudflare for admin portal to work with backend API

---

## 📋 Prerequisites

1. Login to Cloudflare Dashboard: https://dash.cloudflare.com
2. Select your domain: **ggwifi.co.tz**
3. Have your API subdomain ready: **api.ggwifi.co.tz**

---

## 🔐 Step 1: Configure SSL/TLS

### Why: Ensures secure connection between Cloudflare and your backend

**Steps:**

1. In Cloudflare Dashboard, click **SSL/TLS** (left sidebar)
2. Go to **Overview** tab
3. Find **SSL/TLS encryption mode** setting
4. Change from current setting to: **Full** or **Full (strict)**
   - **Full** = Flexible SSL termination, works with self-signed certificates
   - **Full (strict)** = Requires valid SSL certificate on backend
5. Click **Save**

**⚠️ Important:** If your backend has a valid SSL cert, use "Full (strict)". If self-signed or no SSL, use "Full".

---

## 🤖 Step 2: Disable Bot Fight Mode

### Why: Prevents Cloudflare from blocking legitimate API requests

**Steps:**

1. In Cloudflare Dashboard, click **Security** (left sidebar)
2. Click **Bots** submenu
3. Look for **Bot Fight Mode** toggle
4. Set to **OFF** ⚠️
5. Click **Save**

---

## 🛡️ Step 3: Configure WAF to Allow API Requests

### Why: Prevents WAF from blocking your backend API calls

**Steps:**

### Option A: Create WAF Rule (Recommended)

1. In Cloudflare Dashboard, click **Security** → **WAF**
2. Click **Tools** tab
3. Click **Firewall events** to view blocked requests
4. Click **Create rule** or go to **Custom rules**
5. Create new rule with these settings:
   - **Rule name:** Allow API Requests
   - **Field:** URI
   - **Operator:** starts with
   - **Value:** `/api/`
   - **Action:** Skip
   - **Skip action:** WAF
6. Click **Deploy**

### Option B: Create Page Rule (Alternative)

1. In Cloudflare Dashboard, click **Rules** → **Page Rules**
2. Click **Create Page Rule**
3. Set **If the URL matches:** `api.ggwifi.co.tz/*`
4. Add these settings:
   - **Security Level:** Off
   - **Cache Level:** Bypass
   - **Browser Integrity Check:** Off
5. Click **Save and Deploy**

---

## 📄 Step 4: Create Page Rule for API Subdomain

### Why: Bypasses security checks and caching for API calls

**Steps:**

1. In Cloudflare Dashboard, click **Rules** → **Page Rules**
2. Click **Create Page Rule**
3. Enter URL pattern: `api.ggwifi.co.tz/*`
4. Click **Add a Setting** for each of these:

   **Setting 1: Security Level**
   - Click **Add a Setting**
   - Select: **Security Level**
   - Value: **Essentially Off**
   
   **Setting 2: Cache Level**
   - Click **Add a Setting**
   - Select: **Cache Level**
   - Value: **Bypass**
   
   **Setting 3: Disable Apps** (Optional)
   - Click **Add a Setting**
   - Select: **Disable Apps**
   - Value: **On**

5. Click **Save and Deploy**
6. Confirm deployment

---

## 🌐 Step 5: Verify DNS Configuration

### Why: Ensures API subdomain points to correct backend

**Steps:**

1. In Cloudflare Dashboard, click **DNS** → **Records**
2. Look for A record named **api**
3. Verify these settings:
   - **Name:** `api`
   - **Type:** A
   - **Content:** Your backend IP (e.g., `139.84.241.182`)
   - **Proxy status:** Orange cloud icon ✅ (proxied)
   - **TTL:** Auto
4. If not found, click **Add record** and create it
5. If proxy is gray, click to make it orange (enable Cloudflare proxy)

---

## ✅ Step 6: Configure Environment Variables for Pages

### Why: Ensures admin portal knows where the API is

**Steps:**

1. In Cloudflare Dashboard, click **Workers & Pages** (left sidebar)
2. Find and click **ggwifi-billing-system** project
3. Click **Settings** tab
4. Scroll to **Environment Variables**
5. Click **Add variable** for each:

   **Variable 1:**
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://api.ggwifi.co.tz/api/v1`
   - **Environment:** Production ✅
   
   **Variable 2:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api.ggwifi.co.tz/api/v1`
   - **Environment:** Production ✅

6. Click **Save**

---

## 🚀 Step 7: Trigger Rebuild

### Why: Applies new environment variables to admin portal

**Steps:**

1. Still in **ggwifi-billing-system** project
2. Click **Deployments** tab
3. Find latest deployment
4. Click **⋮** (three dots) menu
5. Select **Retry deployment**
6. Wait for build to complete (1-2 minutes)

---

## 🔍 Step 8: Test Configuration

### Why: Verify everything works

**Steps:**

1. Open browser and go to: `https://admin.ggwifi.co.tz`
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Look for API calls to: `https://api.ggwifi.co.tz/api/v1/...`
5. Try logging in with admin credentials
6. Check for any errors in console

### Expected Results:
- ✅ No 403 errors
- ✅ API calls succeed (200 status)
- ✅ Login works
- ✅ Dashboard loads data
- ✅ All modules accessible

---

## 🆘 Troubleshooting

### Issue: Still getting 403 errors

**Solution:**
1. Check **Firewall** → **Events** for blocked requests
2. Review **Analytics** → **Web Traffic** for blocked traffic
3. Temporarily set API subdomain proxy to **gray cloud** (disable proxy)
4. Test if backend works without Cloudflare
5. Re-enable proxy and check WAF rules

### Issue: CORS errors

**Solution:**
1. Backend already configured correctly (CORS allows Cloudflare domains)
2. Verify backend is running: `curl https://api.ggwifi.co.tz/api/v1/customer-portal/test`
3. Check SSL/TLS mode is "Full" or "Full (strict)"

### Issue: Admin portal can't find API

**Solution:**
1. Check environment variables in Pages settings
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh page (Ctrl+F5)
4. Check browser console for actual API URL being called

---

## 📊 Quick Checklist

Before going live, verify:

- [ ] SSL/TLS mode set to "Full" or "Full (strict)"
- [ ] Bot Fight Mode is OFF
- [ ] WAF rule created to allow `/api/` requests
- [ ] Page Rule created for `api.ggwifi.co.tz/*`
- [ ] DNS A record exists for `api` subdomain
- [ ] Proxy is enabled (orange cloud) for API subdomain
- [ ] Environment variables set in Pages settings
- [ ] Pages deployment rebuilt with new variables
- [ ] Test login works from admin portal
- [ ] All modules load data successfully

---

## 📝 Summary

After completing these steps:

1. **SSL/TLS:** Secures connection between Cloudflare and backend
2. **Bot Fight Mode:** Off prevents API blocking
3. **WAF Rules:** Allow legitimate API requests through
4. **Page Rules:** Bypass security checks for API subdomain
5. **DNS:** Points to correct backend IP
6. **Environment Variables:** Tell admin portal where API is
7. **Rebuild:** Applies new configuration

**Time Estimate:** 5-10 minutes

---

## 🎯 Next Steps

After configuration is complete:

1. Test all admin portal modules
2. Monitor Cloudflare analytics for errors
3. Check backend logs for API calls
4. Verify all API endpoints work
5. Test customer portal connectivity

**Questions?** Check Cloudflare documentation: https://developers.cloudflare.com

---

**End of Cloudflare Setup Guide**

