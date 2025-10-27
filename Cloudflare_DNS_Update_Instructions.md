# 🌐 Cloudflare DNS Configuration for Backend API

## 🎯 Problem
Your `api.ggwifi.co.tz` DNS is pointing to Cloudflare IPs instead of your VPS, causing 521 errors.

## ✅ Solution: Update Cloudflare DNS

### Step 1: Open Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com
2. Select your domain: `ggwifi.co.tz`
3. Click on **DNS** → **Records**

### Step 2: Find and Update the API Record
Look for the A record for `api.ggwifi.co.tz`:

**Current (WRONG):**
```
Type: A
Name: api
Content: (Cloudflare IPs - 104.21.x.x, 172.67.x.x)
Proxy: 🟠 Proxied ABCD
```

**Update to:**
```
Type: A
Name: api
Content: 139.84.241.182
Proxy: 🟠 Proxied (KEEP THIS)
```

OR if you want direct connection (bypass Cloudflare for API):

```
Type: A
Name: api
Content: 139.84.241.182
Proxy: ⚪ DNS only (gray cloud)
```

### Step 3: Save Changes
Click **Save** and wait 1-2 minutes for DNS propagation.

## ✅ Alternative: Keep Cloudflare Proxy (Recommended)

If you want to keep the **orange cloud (Proxied)**, that's fine! The issue is just the DNS needs to point to your VPS. Make sure the **Content** field shows your VPS IP: `139.84.241.182`

## 🔍 Verify
After updating, run:
```bash
nslookup api.ggwifi.co.tz
# Should show: 139.84.241.182
```

Then test: https://api.ggwifi.co.tz/api/v1/test

## 📝 Notes
- Nginx reverse proxy is now configured on your VPS ✅
- Backend is running on port 8080 ✅
- CORS headers are configured ✅
- Just need to update DNS ✅



