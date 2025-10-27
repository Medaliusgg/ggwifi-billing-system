# ⚠️ Cloudflare 403 Error - Fix Instructions

## Problem Confirmed
✅ Backend is deployed  
✅ DNS configured correctly  
❌ Cloudflare is blocking ALL API requests with 403 error

## Root Cause
Cloudflare WAF or security rules are blocking all requests to `api.ggwifi.co.tz`

## Solution: Configure Cloudflare Dashboard

### Step 1: Access Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Select your domain: **ggwifi.co.tz**
3. Navigate to **DNS** → **Records**

### Step 2: Check DNS Configuration
Find the `api` A record:
- Should be pointing to your backend server IP
- Should have **orange cloud** icon (Cloudflare proxy enabled)

### Step 3: Fix Security Settings (CRITICAL)

#### A. Security → Bots
1. Go to **Security** → **Bots**
2. Set **Bot Fight Mode**: **OFF** ⚠️
3. This is likely blocking your API requests

#### B. Security → WAF
1. Go to **Security** → **WAF**
2. Click **Tools** → **Firewall events**
3. Look for blocked requests to `api.ggwifi.co.tz`
4. Create a **WAF Exception** to allow traffic to api subdomain

**OR** temporarily:
- Disable Managed Rules for the api subdomain
- Add exception rule: `URI starts with /api/` → Allow

#### C. SSL/TLS
1. Go to **SSL/TLS** → **Overview**
2. Set to **Full** or **Full (strict)** mode ⚠️ CRITICAL
3. This ensures proper connection to your backend

#### D. Rules → Page Rules
Create a new **Page Rule** or **Transform Rule**:

**Settings:**
- **Pattern**: `api.ggwifi.co.tz/*`
- **Action**: Set Security Level to **Essentially Off**
- **Action**: Cache Level to **Bypass**
- **Save**

### Step 4: Alternative - Disable Proxy (Quick Test)

**Temporary workaround:**
1. Go to **DNS** → **Records**
2. Find the `api` A record
3. Click the **orange cloud icon** to make it gray
4. This disables Cloudflare proxy
5. Backend is now directly accessible

**Test:**
```bash
curl https://api.ggwifi.co.tz/api/v1/customer-portal/test
```

If this works, the issue is Cloudflare configuration.

### Step 5: Configure Proper CORS (If Still Not Working)

Your backend SecurityConfig.java already has:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://connect.ggwifi.co.tz",  // ✅ Already added
    ...
));
```

So CORS should work once Cloudflare lets requests through.

## Quick Action Items

**Do this NOW:**

1. ✅ Login to Cloudflare Dashboard
2. ✅ Go to Security → Bots → Turn OFF Bot Fight Mode
3. ✅ Go to SSL/TLS → Set to "Full" mode  
4. ✅ Create Page Rule for `api.ggwifi.co.tz/*` → Security Level: Essentially Off
5. ✅ Test: `curl https://api.ggwifi.co.tz/api/v1/customer-portal/test`

## Expected Result

After these changes:
- ✅ 403 error disappears
- ✅ API requests work
- ✅ Customer portal connects successfully
- ✅ No more "HTTP error! status: 403"

## Need Help?

If you can't access Cloudflare dashboard or need assistance:

**Alternative Solution:**
Tell me:
1. Your backend server IP address (where the backend is actually running)
2. Then I'll help you configure DNS properly

**Or we can temporarily:**
- Use a different subdomain that bypasses Cloudflare
- Update customer portal to use direct backend URL

Let me know what you see in Cloudflare dashboard!


