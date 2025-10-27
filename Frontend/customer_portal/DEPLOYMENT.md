# 🚀 GGWiFi Customer Portal - Cloudflare Pages Deployment

## ✅ READY TO DEPLOY!

Your customer portal is ready to be deployed to Cloudflare Pages at `portal.ggwifi.co.tz`.

---

## 📋 DEPLOYMENT STEPS

### 1. **Connect GitHub Repository to Cloudflare Pages**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **Pages** from the sidebar
3. Click **Create a project**
4. Choose **Connect to Git**
5. Select **GitHub** and authorize
6. Find `ggwifi-billing-system` repository
7. Click **Begin setup**

---

### 2. **Configure Build Settings**

Use these settings in Cloudflare Pages:

```
Project name: ggwifi-customer-portal

Build command: npm run build

Build output directory: dist

Root directory: Frontend/customer_portal

Node version: 18
```

---

### 3. **Add Environment Variables**

In Cloudflare Pages settings, add these environment variables:

```
VITE_API_BASE_URL = https://api.ggwifi.co.tz/api/v1
VITE_APP_NAME = GGWIFI Customer Portal  
VITE_APP_DOMAIN = portal.ggwifi.co.tz
VITE_ENVIRONMENT = production
```

---

### 4. **Custom Domain Configuration**

Your domain is already configured in `cloudflare-pages-config.json`:
- **Domain:** `portal.ggwifi.co.tz`
- **DNS:** Point to Cloudflare Pages

After deployment:
1. Go to **Custom domains** in Cloudflare Pages
2. Add `portal.ggwifi.co.tz`
3. Cloudflare will configure DNS automatically

---

## 🎯 QUICK DEPLOY

### Option 1: Via Cloudflare Dashboard (Recommended)

1. **Connect Repository:**
   - Dashboard → Pages → Create a project
   - Connect to `ggwifi-billing-system`

2. **Configure:**
   - Root directory: `Frontend/customer_portal`
   - Build command: `npm run build`
   - Output: `dist`

3. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
   ```

4. **Deploy:**
   - Click "Save and deploy"
   - Wait 2-3 minutes

5. **Add Domain:**
   - Custom domains → Add `portal.ggwifi.co.tz`
   - DNS auto-configured

---

### Option 2: Manual Build & Upload

If you need to test locally first:

```bash
cd Frontend/customer_portal
npm install
npm run build

# The dist/ folder is ready to upload
```

Upload the `dist/` folder contents to Cloudflare Pages via the dashboard.

---

## 🔧 TROUBLESHOOTING

### Build Fails
- Check Node version is 18
- Ensure `Root directory` is set to `Frontend/customer_portal`
- Verify all dependencies in `package.json`

### API Not Working
- Verify `VITE_API_BASE_URL` environment variable is set
- Check CORS settings on your backend API
- Ensure backend at `https://api.ggwifi.co.tz` is accessible

### Domain Not Loading
- Verify DNS is pointing to Cloudflare
- Check Custom domain is configured in Pages
- Wait 5-10 minutes for DNS propagation

---

## ✅ DEPLOYMENT CHECKLIST

- [x] Code pushed to GitHub
- [x] API service configured for production
- [x] Environment variables configured
- [ ] Cloudflare Pages project created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Custom domain added
- [ ] Test voucher login
- [ ] Test package purchase
- [ ] Test payment integration

---

## 🎉 AFTER DEPLOYMENT

Once deployed, test these features:

1. **Landing Page:** Visit `https://portal.ggwifi.co.tz`
2. **Voucher Login:** Try logging in with a voucher
3. **Package Purchase:** Buy a package with payment
4. **Payment Integration:** Test ZenoPay flow

---

## 📊 MONITORING

- **Cloudflare Analytics:** View traffic and performance
- **Error Logs:** Check Functions logs for API errors
- **Build Logs:** Review deployment history

---

## 🔄 AUTO-DEPLOYMENT

Once configured, every push to `main` branch will:
1. Trigger a new build
2. Deploy to Cloudflare Pages
3. Update `portal.ggwifi.co.tz` automatically

---

**Status:** Ready to deploy! 🚀
**Estimated Time:** 5-10 minutes
**Domain:** portal.ggwifi.co.tz

