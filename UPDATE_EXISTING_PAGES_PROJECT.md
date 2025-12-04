# 🔄 Update Existing Cloudflare Pages Project

**Domain:** `connect.ggwifi.co.tz`  
**Action:** Update existing project instead of creating new one

---

## 📋 **STEP 1: Find the Existing Project**

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Pages**
3. Look for the project that has `connect.ggwifi.co.tz` in its custom domains
4. Most likely: **ggwifi-customer-portal**

---

## 🔧 **STEP 2: Update Build Settings**

1. Go to the project (e.g., `ggwifi-customer-portal`)
2. Click: **Settings** → **Builds & deployments**
3. Update these settings:

   **Build configuration:**
   - **Framework preset:** `Vite` (or leave blank for auto-detect)
   - **Build command:** `npm run build`
   - **Root directory:** `Frontend/customer_portal`
   - **Output directory:** `dist`
   - **Node version:** `18`

   **Environment variables:**
   - `VITE_API_URL` = `https://api.ggwifi.co.tz/api/v1`

4. Click **Save**

---

## 🔗 **STEP 3: Update Source Connection**

1. In the same project, go to: **Settings** → **Source**
2. Verify:
   - **Repository:** `Medaliusgg/ggwifi-billing-system`
   - **Branch:** `2025-11-16-p50s-ca43d` (or your main branch)
   - **Root directory:** `Frontend/customer_portal` (if available)

3. If branch is different:
   - Update to: `2025-11-16-p50s-ca43d`
   - Or merge your changes to the branch it's currently using

---

## 🚀 **STEP 4: Trigger New Deployment**

After updating settings:

1. Go to: **Deployments** tab
2. Click: **Retry deployment** on the latest deployment
   - OR
3. Click: **Create deployment** → **Deploy latest commit**
   - OR
4. Make a small commit and push (will auto-trigger)

---

## ✅ **VERIFICATION**

After deployment:

1. Check deployment status (should show "Success")
2. Visit: https://connect.ggwifi.co.tz
3. Verify:
   - ✅ Site loads correctly
   - ✅ Shows updated customer portal
   - ✅ API calls work (check browser console)
   - ✅ All features working

---

## 📝 **CURRENT SETTINGS SUMMARY**

Based on successful deployment log (Oct 28):

**What worked:**
- ✅ Build command: `npm run build`
- ✅ Root directory: `Frontend/customer_portal` (auto-detected)
- ✅ Output directory: `dist` (auto-detected)
- ✅ Node version: `18.20.8`

**What needs updating:**
- ⚠️ Build command might be set to `react-static build` (needs to be `npm run build`)
- ⚠️ Branch might be pointing to old commit
- ⚠️ Environment variables might need updating

---

## 🔍 **QUICK CHECKLIST**

- [ ] Found the project with `connect.ggwifi.co.tz`
- [ ] Updated build command to `npm run build`
- [ ] Set root directory to `Frontend/customer_portal`
- [ ] Set output directory to `dist`
- [ ] Set Node version to `18`
- [ ] Added environment variable `VITE_API_URL`
- [ ] Updated source branch (if needed)
- [ ] Triggered new deployment
- [ ] Verified site works at https://connect.ggwifi.co.tz

---

## 💡 **IMPORTANT NOTES**

- **Don't create a new project** - update the existing one
- **Domain is already connected** - no need to add it again
- **Just update build settings** - that's the main fix needed
- **The domain will automatically use the new deployment** once it's successful

---

**Last Updated:** 2025-01-27






