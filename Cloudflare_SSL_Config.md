# 🔒 Cloudflare SSL Configuration Fix

## ❌ Problem: Error 521
Cloudflare can't connect to your backend server

## ✅ Fix Cloudflare SSL Settings:

### Step 1: Open Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com
2. Select domain: `ggwifi.co.tz`

### Step 2: Update SSL/TLS Mode
1. Go to **SSL/TLS** → **Overview**
2. Change **SSL/TLS encryption mode** from "Full (strict)" to:
   - **"Flexible"** (for testing)
   - OR **"Full"** (better security)

### Step 3: Alternative - Change DNS Proxy Status
If that doesn't work:
1. Go to **DNS** → **Records**
2. Find `api` record
3. Click **Edit**
4. Toggle the proxy status to **DNS only** (gray cloud) temporarily
5. This will connect directly to your VPS

### Step 4: Wait and Test
- Wait 1-2 minutes for changes to propagate
- Test: https://api.ggwifi.co.tz/api/v1/test

---

## 🎯 Recommended Setup (Long-term):

Keep **Proxy ON** (orange cloud) with **"Full" SSL mode** once you install SSL certificate on VPS.

For now, use **"Flexible"** mode.



