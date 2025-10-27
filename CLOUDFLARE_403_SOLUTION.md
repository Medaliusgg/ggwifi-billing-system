# 🔧 Cloudflare 403 Error - Backend Already Deployed

## ✅ Confirmed
- Backend IS deployed
- DNS is configured: api.ggwifi.co.tz → Cloudflare IPs
- Problem: Cloudflare returning 403 before requests reach backend

## Root Cause
Cloudflare's security/firewall is blocking requests to the backend API.

## Solution: Configure Cloudflare for API

### Step 1: Check Cloudflare Dashboard

Go to your Cloudflare dashboard for `ggwifi.co.tz`:

#### A. Security Settings
1. Navigate to **Security** → **WAF**
2. Check if WAF is blocking requests
3. Look for any custom rules blocking API

#### B. Page Rules (Most Likely Issue)
1. Navigate to **Rules** → **Transform Rules** or **Page Rules**
2. Look for any rules affecting `api.ggwifi.co.tz`

#### C. SSL/TLS Settings
1. Navigate to **SSL/TLS**
2. Set to **Full** or **Full (strict)** mode
3. This ensures Cloudflare connects properly to your backend

### Step 2: Test Backend Directly (Bypass Cloudflare)

To verify your backend is actually working, we need to access it directly.

**Do you know:**
1. Where your backend is hosted? (VPS IP, Railway URL, etc.)
2. Can you access it directly without going through Cloudflare?

**If yes**, tell me the direct URL/IP and we can test it.

**If no**, we need to find where it's deployed.

### Step 3: Quick Fix - Disable Cloudflare Proxy (Temporary)

**Option A: If you have VPS IP:**
```
In Cloudflare DNS:
1. Find the 'api' A record
2. Click the orange cloud icon (make it gray)
3. This disables Cloudflare proxy
4. Backend now directly accessible
```

**Option B: Fix Cloudflare Settings:**
The 403 is likely caused by:
- Cloudflare **Browser Integrity Check** enabled
- Cloudflare **Bot Fight Mode** blocking requests
- Missing **Origin Certificates**

## Immediate Action Items

### Check These Cloudflare Settings:

1. **Security** → **Bots** → Disable "Bot Fight Mode" for api subdomain
2. **Security** → **Settings** → Turn off "Browser Integrity Check" for api.ggwifi.co.tz
3. **SSL/TLS** → Set to "Full" mode
4. **Rules** → Create a rule to allow `/api/*` paths

### Specific Settings to Check:

```yaml
# In Cloudflare Dashboard:

1. api.ggwifi.co.tz SSL/TLS:
   Mode: Full or Full (strict) ✅

2. api.ggwifi.co.tz Security:
   Browser Integrity: Disabled ❌
   Bot Fight Mode: Disabled ❌
   WAF: Custom rules only or Managed rules for API ✅

3. api.ggwifi.co.tz Rules:
   Create Page Rule or Transform Rule:
   - Pattern: api.ggwifi.co.tz/api/*
   - Setting: Security Level = Essentially Off
   - Setting: Cache Level = Bypass
```

## Alternative: Configure Proper Origin

If Cloudflare is proxying but returning 403, the backend might not be configured as origin.

**Check:**
1. Go to **DNS** → Edit the `api` A record
2. Make sure it has orange cloud icon (proxied)
3. Value should be your backend server IP

Then:
1. Go to **SSL/TLS** → **Origin Server**
2. Create an Origin Certificate
3. Install it on your backend
4. Set SSL/TLS mode to "Full"

## Testing Commands

After fixing Cloudflare settings, test:

```bash
# Test if 403 is gone
curl -v https://api.ggwifi.co.tz/api/v1/customer-portal/test

# Test with proper headers
curl -v https://api.ggwifi.co.tz/api/v1/customer-portal/packages \
  -H "Origin: https://connect.ggwifi.co.tz" \
  -H "Accept: application/json"
```

## Quick Diagnosis Questions

**Please answer:**

1. **Where is your backend deployed?**
   - VPS at [IP]?
   - Railway at [URL]?
   - Render at [URL]?
   - Other?

2. **Can you access Cloudflare dashboard?**
   - If yes, go to Security → WAF and check for blocks
   - Look for any logs showing why 403 is returned

3. **What's your current SSL/TLS mode?**
   - Check: SSL/TLS → Overview
   - Should be "Full" for HTTPS backend

## Expected Solution Flow

Once we fix Cloudflare settings:
1. ✅ 403 error goes away
2. ✅ Requests reach your backend
3. ✅ Customer portal connects successfully
4. ✅ API responses work properly

Let me know:
- Where your backend is hosted (IP or URL)
- If you can access Cloudflare dashboard
- Current SSL/TLS mode setting

Then I'll give you exact steps to fix the 403 error!


