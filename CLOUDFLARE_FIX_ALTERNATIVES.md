# 🔧 Alternative Cloudflare Fix Methods

## Since "Bots" Section Not Visible

### Method 1: Disable Cloudflare Proxy (Easiest - 1 minute)

**Steps:**
1. Go to Cloudflare Dashboard: https://dash.cloudflare.com
2. Select your domain: **ggwifi.co.tz**
3. Click **DNS** → **Records**
4. Find the `api` A record
5. Click the **orange cloud icon** → Changes to gray (proxy disabled)
6. **Save**

**This bypasses ALL Cloudflare security and goes directly to your backend.**

### Method 2: Page Rules (If you can't find Bots)

**Steps:**
1. Go to **Rules** → **Page Rules** (or just "Rules")
2. Click **Create Rule**
3. Set URL: `api.ggwifi.co.tz/*`
4. Click **Add a Setting** → Select **Security Level**
5. Set to **Essentially Off**
6. Click **Add a Setting** → Select **Cache Level**
7. Set to **Bypass**
8. **Save and Deploy**

### Method 3: Transform Rules (Newer Interface)

**Steps:**
1. Go to **Rules** → **Transform Rules** → **Create Rule**
2. Set rule name: "Allow API"
3. Set expression: `http.host eq "api.ggwifi.co.tz"`
4. Click **Add Field** → **Request Header Modification**
5. Click **Deploy**

### Method 4: WAF Settings

**Steps:**
1. Go to **Security** → **WAF**
2. Find **Managed Rules**
3. For each rule set (OWASP, Cloudflare Managed Rules, etc.)
4. Click **Configure** → **Add Expression**
5. Expression: `(http.host eq "api.ggwifi.co.tz")`
6. Action: **Skip**
7. Save all

### Method 5: SSL/TLS Settings (Always Check This)

**Steps:**
1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full** or **Full (strict)**
3. This ensures Cloudflare can connect to your backend properly

### Method 6: Security → Settings

**Steps:**
1. Go to **Security** → **Settings**
2. Look for:
   - **Browser Integrity Check**: Set to **Off**
   - **Challenge Passage**: Set to **Easy**
   - **Security Level**: Set to **Medium** or **Low**

## Quick Test After Fix

```bash
# Test if 403 is gone
curl -v https://api.ggwifi.co.tz/api/v1/customer-portal/test
```

**Expected:** HTTP/2 200 (not 403)

## Most Likely Solution

Since you can't find "Bots" section:
- **Try Method 1** (Disable proxy) - Takes 1 minute
- **OR** look for **Security** → **Settings** for Browser Integrity Check

Let me know which method works or what you see in your Cloudflare dashboard!

