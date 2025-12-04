# 🌐 Connect Custom Domain to Cloudflare Pages

**Domain:** `connect.ggwifi.co.tz`  
**Project:** `ggwifi-customer-portal`

---

## 📋 **STEPS TO ADD CUSTOM DOMAIN**

### **Step 1: Go to Cloudflare Pages Dashboard**

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Pages** → **ggwifi-customer-portal**
3. Click on the project

### **Step 2: Add Custom Domain**

1. Click on **"Custom domains"** tab (or go to **Settings** → **Custom domains**)
2. Click **"Set up a custom domain"** or **"Add a custom domain"**
3. Enter: `connect.ggwifi.co.tz`
4. Click **"Continue"** or **"Add domain"**

### **Step 3: DNS Configuration**

Cloudflare will automatically:
- Create a CNAME record pointing to your Pages deployment
- Or provide DNS instructions if domain is not in Cloudflare

**If domain is already in Cloudflare:**
- ✅ DNS will be configured automatically
- ✅ SSL certificate will be provisioned automatically
- ✅ Wait 1-2 minutes for DNS propagation

**If domain is NOT in Cloudflare:**
- You'll need to add a CNAME record manually:
  - **Type:** CNAME
  - **Name:** `connect` (or `connect.ggwifi`)
  - **Target:** `ggwifi-customer-portal.pages.dev` (or the provided Pages URL)
  - **TTL:** Auto

### **Step 4: SSL Certificate**

- Cloudflare will automatically provision an SSL certificate
- This usually takes 1-5 minutes
- The domain will show as "Active" when ready

### **Step 5: Verify**

1. Wait for DNS propagation (1-5 minutes)
2. Check SSL status (should show "Active")
3. Visit: https://connect.ggwifi.co.tz
4. Should see your customer portal!

---

## 🔧 **ALTERNATIVE: Manual DNS Setup**

If you need to add DNS manually:

### **For Cloudflare DNS:**
```
Type: CNAME
Name: connect
Target: ggwifi-customer-portal.pages.dev
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### **For External DNS:**
```
Type: CNAME
Name: connect.ggwifi.co.tz
Target: [Your Cloudflare Pages URL]
TTL: 3600
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Custom domain added in Cloudflare Pages
- [ ] DNS record created (CNAME)
- [ ] SSL certificate provisioned
- [ ] Domain shows as "Active"
- [ ] Can access https://connect.ggwifi.co.tz
- [ ] SSL certificate is valid (green lock)

---

## 🚨 **TROUBLESHOOTING**

### **Issue: Domain not resolving**
- Check DNS records are correct
- Wait for DNS propagation (up to 24 hours, usually 1-5 minutes)
- Verify CNAME target is correct

### **Issue: SSL certificate pending**
- Wait 5-10 minutes for automatic provisioning
- Check domain is properly configured
- Verify DNS is pointing correctly

### **Issue: 404 or wrong site**
- Check which deployment is active
- Verify custom domain is connected to correct project
- Check root directory and output directory settings

---

## 📝 **NOTES**

- **Primary domain:** `connect.ggwifi.co.tz`
- **Pages URL:** `ggwifi-customer-portal.pages.dev` (still works)
- **SSL:** Automatic via Cloudflare
- **DNS:** Managed by Cloudflare (if domain is in Cloudflare)

---

**Last Updated:** 2025-01-27






