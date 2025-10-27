# 🔧 FIX ADMIN LOGIN - URGENT

## ❌ Current Problem
`ERR_NAME_NOT_RESOLVED` - DNS needs to point to your VPS

## ✅ Quick Fix (2 minutes):

1. **Open Cloudflare:** https://dash.cloudflare.com

2. **Select domain:** `ggwifi.co.tz`

3. **Go to DNS → Records**

4. **Find A record for `api`**

5. **UPDATE IT:**
   - **Name:** `api`
   - **IPv4 address:** `139.84.241.182`
   - **Proxy status:** 🟠 **Proxied** (orange cloud - MUST BE ON)
   - **TTL:** Auto

6. **SAVE**

7. **Wait 60 seconds**

8. **Test:** Go to https://admin.ggwifi.co.tz

---

## 📊 Current Status:
✅ Backend running  
✅ Nginx configured  
✅ CORS fixed  
✅ Reverse proxy working  
⏳ **WAITING FOR DNS UPDATE**

---

After DNS update, login should work immediately! 🚀

