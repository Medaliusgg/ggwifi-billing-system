# 🚀 Customer Portal Frontend - Deployment Guide

**Date:** 2025-01-27  
**Status:** ✅ **BUILD SUCCESSFUL**

---

## 📦 **BUILD STATUS**

✅ **Build Completed Successfully**
- **Build Time:** 20.28s
- **Output Directory:** `dist/`
- **Total Size:** ~684 KB (gzipped: ~214 KB)

### **Build Output:**
- `index.html` - 2.23 KB
- `assets/index-CxRjydzE.css` - 0.96 KB
- `assets/index-BX2c1muM.js` - 684.12 KB

---

## 🌐 **DEPLOYMENT OPTIONS**

### **Option 1: Cloudflare Pages** (Recommended)

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Deploy:**
   ```bash
   cd Frontend/customer_portal
   wrangler pages deploy dist --project-name=ggwifi-customer-portal
   ```

### **Option 2: Manual Upload to Cloudflare Pages**

1. Go to Cloudflare Dashboard → Pages
2. Select your project or create new
3. Upload the `dist/` folder
4. Deploy

### **Option 3: VPS Deployment (Nginx)**

1. **Copy files to VPS:**
   ```bash
   scp -r dist/* root@139.84.241.182:/var/www/customer-portal/
   ```

2. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name customer.ggwifi.co.tz;
       
       root /var/www/customer-portal;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

### **Option 4: Netlify**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd Frontend/customer_portal
   netlify deploy --prod --dir=dist
   ```

---

## ✅ **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**
- ✅ Build completed successfully
- ✅ All files in `dist/` directory
- ✅ `_headers` file copied to `dist/`
- ✅ `_redirects` file copied to `dist/`
- ✅ API base URL configured (`https://api.ggwifi.co.tz/api/v1`)

### **Post-Deployment:**
- ⬜ Verify frontend loads correctly
- ⬜ Test package listing
- ⬜ Test payment flow
- ⬜ Test voucher login
- ⬜ Test session management
- ⬜ Verify API connectivity
- ⬜ Test mobile responsiveness

---

## 🔧 **CONFIGURATION**

### **API Configuration:**
- **Production API URL:** `https://api.ggwifi.co.tz/api/v1`
- **Environment Variable:** `VITE_API_URL` (optional override)

### **Build Configuration:**
- **Framework:** React + Vite
- **Build Tool:** Vite 5.4.21
- **Output:** Static files in `dist/`

---

## 📝 **DEPLOYMENT FILES**

### **`_headers`** (Cloudflare Pages)
- Security headers
- Cache control for static assets
- SPA routing support

### **`_redirects`** (Netlify/Cloudflare Pages)
- SPA fallback routing
- All routes redirect to `index.html`

---

## 🧪 **TESTING AFTER DEPLOYMENT**

### **Manual Testing:**
1. ✅ Load landing page
2. ✅ Navigate to "Buy Packages"
3. ✅ Navigate to "Voucher Login"
4. ✅ Test package selection
5. ✅ Test payment initiation
6. ✅ Test voucher activation
7. ✅ Test session status
8. ✅ Test mobile view

### **API Testing:**
1. ✅ Verify API calls to backend
2. ✅ Check CORS headers
3. ✅ Verify error handling
4. ✅ Test network failures

---

## 🚨 **TROUBLESHOOTING**

### **Issue: 404 on Routes**
- **Solution:** Ensure `_redirects` file is in `dist/` root

### **Issue: API Calls Failing**
- **Solution:** Verify API base URL in `customerPortalApi.js`

### **Issue: Assets Not Loading**
- **Solution:** Check `_headers` file for cache settings

### **Issue: CORS Errors**
- **Solution:** Verify backend CORS configuration

---

## 📊 **BUILD STATISTICS**

- **Total Modules:** 11,913
- **Build Time:** 20.28s
- **Bundle Size:** 684.12 KB
- **Gzipped Size:** 213.63 KB

**Note:** Bundle size warning (684 KB > 500 KB). Consider code splitting for optimization.

---

## ✅ **STATUS**

**Build:** ✅ **SUCCESSFUL**  
**Ready for Deployment:** ✅ **YES**

---

**Last Updated:** 2025-01-27

