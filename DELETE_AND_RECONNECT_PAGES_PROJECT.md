# 🔄 Delete Old Pages Project & Connect to New One

**Goal:** Delete the old Cloudflare Pages project using `connect.ggwifi.co.tz` and connect the domain to the updated project.

---

## 📋 **STEP 1: Delete Old Cloudflare Pages Project**

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Pages**
3. Find the OLD project that has `connect.ggwifi.co.tz` connected
   - It might be named differently (check custom domains)
   - Look for projects with `connect.ggwifi.co.tz` in their custom domains list
4. Click on that project
5. Go to: **Settings** → Scroll down to **Delete project**
6. Click: **Delete project**
7. Confirm deletion
8. ⚠️ This will remove the project but the domain might still be reserved

---

## 🔗 **STEP 2: Disconnect Domain (if still reserved)**

If the domain is still showing as "in use" after deleting the project:

1. Go to: **DNS** → **Records** (for `ggwifi.co.tz`)
2. Look for `connect` CNAME or A record
3. Delete that record
4. Wait 1-2 minutes

---

## 🆕 **STEP 3: Connect Domain to New Project**

1. Go to: **Pages** → **ggwifi-customer-portal** (your updated project)
2. Click: **Custom domains** tab
3. Click: **Set up a custom domain**
4. Enter: `connect.ggwifi.co.tz`
5. Click: **Continue**
6. Cloudflare will:
   - Create DNS CNAME record automatically
   - Provision SSL certificate automatically
   - Activate the domain (1-5 minutes)

---

## ✅ **VERIFICATION**

After completing steps:

1. Check: **Pages** → **ggwifi-customer-portal** → **Custom domains**
   - Should show: `connect.ggwifi.co.tz` as "Active"
2. Visit: https://connect.ggwifi.co.tz
   - Should show your updated customer portal
3. Check deployment:
   - Latest deployment should be from your updated code
   - Should show successful build

---

## 📝 **QUICK CHECKLIST**

- [ ] Found old Pages project with `connect.ggwifi.co.tz`
- [ ] Deleted old Pages project
- [ ] Removed DNS record (if needed)
- [ ] Waited 1-2 minutes
- [ ] Added domain to `ggwifi-customer-portal` project
- [ ] Verified domain is "Active"
- [ ] Tested https://connect.ggwifi.co.tz

---

## 🚨 **TROUBLESHOOTING**

### **Still says "domain in use" after deleting project:**
- Wait 5-10 minutes for Cloudflare to release the domain
- Check DNS records - delete any `connect` records
- Try again

### **Can't find the old project:**
- Check all Pages projects
- Look in "Archived" or "Deleted" projects
- Check if domain is in a different Cloudflare account

### **Domain won't connect to new project:**
- Verify new project has successful deployments
- Check build settings are correct
- Wait a few minutes and try again

---

**Last Updated:** 2025-01-27

