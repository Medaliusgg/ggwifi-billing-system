# 🔧 Resolve Domain Conflict: connect.ggwifi.co.tz

**Issue:** Domain is already in use when trying to add to Cloudflare Pages

---

## 🔍 **STEP 1: Find Where Domain is Currently Used**

### **Option A: Check All Cloudflare Pages Projects**

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Pages** (main menu)
3. Check **ALL** Pages projects:
   - `ggwifi-admin-portal`
   - `ggwifi-customer-portal`
   - `ggwifi-main-website`
   - Any other projects
4. For each project, check:
   - **Custom domains** tab
   - See if `connect.ggwifi.co.tz` is listed

### **Option B: Check Cloudflare DNS**

1. Go to: https://dash.cloudflare.com
2. Select domain: `ggwifi.co.tz`
3. Go to: **DNS** → **Records**
4. Look for:
   - `connect` (CNAME or A record)
   - `connect.ggwifi` (CNAME or A record)
5. Check what it's pointing to

### **Option C: Check Cloudflare Workers/Other Services**

1. Go to: **Workers & Pages** → **Workers**
2. Check if any Worker has this domain
3. Check: **Stream**, **R2**, etc.

---

## 🔧 **STEP 2: Resolve the Conflict**

### **Scenario 1: Domain Connected to Another Pages Project**

**Solution:**
1. Go to the other Pages project
2. Navigate to: **Custom domains**
3. Find `connect.ggwifi.co.tz`
4. Click **Remove** or **Delete**
5. Wait 1-2 minutes
6. Then add it to `ggwifi-customer-portal`

### **Scenario 2: Domain in DNS but Not Connected to Pages**

**Solution:**
1. Go to: **DNS** → **Records**
2. Find the `connect` record
3. Check what it's pointing to:
   - If pointing to old service → Delete the record
   - If pointing to wrong Pages project → Update target
4. Wait 1-2 minutes
5. Then add domain in Pages project

### **Scenario 3: Domain Connected to Cloudflare Worker**

**Solution:**
1. Go to: **Workers & Pages** → **Workers**
2. Find the Worker using this domain
3. Remove the route/domain from Worker
4. Wait 1-2 minutes
5. Then add domain to Pages project

---

## 📋 **STEP 3: Add Domain to Customer Portal**

After removing from old location:

1. Go to: **Pages** → **ggwifi-customer-portal**
2. Click: **Custom domains** tab
3. Click: **Set up a custom domain**
4. Enter: `connect.ggwifi.co.tz`
5. Click: **Continue**
6. Cloudflare will configure DNS and SSL automatically

---

## 🔍 **QUICK CHECKLIST**

- [ ] Checked all Pages projects for the domain
- [ ] Checked DNS records for `connect` subdomain
- [ ] Checked Workers for domain usage
- [ ] Removed domain from old location
- [ ] Waited 1-2 minutes for propagation
- [ ] Added domain to `ggwifi-customer-portal`
- [ ] Verified domain is active
- [ ] Tested https://connect.ggwifi.co.tz

---

## 💡 **ALTERNATIVE: Update Existing Configuration**

If you want to keep the domain where it is but point it to customer portal:

1. Find where domain is currently configured
2. Update the target/route to point to `ggwifi-customer-portal`
3. Or update DNS CNAME to: `ggwifi-customer-portal.pages.dev`

---

## 🚨 **TROUBLESHOOTING**

### **Still says "in use" after removing:**
- Wait 5-10 minutes for DNS propagation
- Clear Cloudflare cache
- Try again

### **Can't find where it's used:**
- Check all Cloudflare accounts (if you have multiple)
- Check if domain is in another Cloudflare zone
- Contact Cloudflare support if needed

---

**Last Updated:** 2025-01-27

