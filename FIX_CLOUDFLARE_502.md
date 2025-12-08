# 🔧 Fix Cloudflare 502 Bad Gateway

## ✅ Backend Status: WORKING

- ✅ Backend is running on VPS
- ✅ Backend started successfully
- ✅ Responding on `localhost:8080`
- ✅ CORS headers are correct
- ✅ Backend works when accessed directly

## ❌ Issue: Cloudflare 502 Bad Gateway

Cloudflare cannot reach the backend. This is a **proxy configuration issue**.

---

## 🔧 Solutions

### Solution 1: Configure Cloudflare Proxy Correctly (Recommended)

**If using Cloudflare Proxy (Orange Cloud):**

1. **Check DNS Record:**
   - Go to Cloudflare Dashboard → DNS → Records
   - Find `api.ggwifi.co.tz`
   - Ensure it points to: `139.84.241.182`
   - Proxy status: **Proxied** (Orange cloud)

2. **Configure Cloudflare Origin:**
   - Cloudflare needs to forward to: `139.84.241.182:8080`
   - Go to Cloudflare Dashboard → SSL/TLS → Origin Server
   - Or use Cloudflare Workers/Pages Functions

3. **Check Firewall:**
   - Ensure port 8080 is open on VPS
   - Cloudflare IPs should be allowed

**Problem:** Cloudflare proxy by default only forwards to ports 80/443, not 8080.

---

### Solution 2: Install Nginx Reverse Proxy (Best Practice)

**This is the recommended solution for production.**

#### Step 1: Install Nginx
```bash
ssh root@139.84.241.182
apt update
apt install -y nginx
```

#### Step 2: Configure Nginx
```bash
cat > /etc/nginx/sites-available/api.ggwifi.co.tz << 'EOF'
server {
    listen 80;
    server_name api.ggwifi.co.tz;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.ggwifi.co.tz;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.ggwifi.co.tz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ggwifi.co.tz/privkey.pem;

    # CORS headers
    add_header 'Access-Control-Allow-Origin' 'https://hotspot.ggwifi.co.tz' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;

    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://hotspot.ggwifi.co.tz' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
        add_header 'Access-Control-Max-Age' '3600' always;
        add_header 'Content-Type' 'text/plain; charset=utf-8' always;
        add_header 'Content-Length' '0' always;
        return 204;
    }

    # Proxy to backend
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/api.ggwifi.co.tz /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### Step 3: Install SSL Certificate
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.ggwifi.co.tz
```

#### Step 4: Configure Cloudflare
- DNS: `api.ggwifi.co.tz` → `139.84.241.182` (Proxied)
- SSL/TLS: Full (strict)
- Cloudflare will proxy to Nginx:443, Nginx forwards to backend:8080

---

### Solution 3: Disable Cloudflare Proxy (Quick Fix)

**Not recommended for production, but works for testing:**

1. Go to Cloudflare Dashboard → DNS → Records
2. Find `api.ggwifi.co.tz`
3. Click the orange cloud to make it gray (disable proxy)
4. Save

**Result:** Direct connection to `139.84.241.182:8080` (no Cloudflare proxy)

**Note:** This exposes your VPS IP directly and loses Cloudflare protection.

---

## 🎯 Recommended: Solution 2 (Nginx)

**Why Nginx?**
- ✅ Standard practice for production
- ✅ Handles SSL/TLS termination
- ✅ Can add additional CORS headers if needed
- ✅ Load balancing and caching capabilities
- ✅ Works perfectly with Cloudflare proxy

---

## 📋 Quick Test

After configuring, test:

```bash
# Test backend directly
curl http://139.84.241.182:8080/api/v1/customer-portal/packages

# Test through Cloudflare
curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages

# Test CORS
curl -I -X OPTIONS https://api.ggwifi.co.tz/api/v1/customer-portal/packages \
  -H "Origin: https://hotspot.ggwifi.co.tz" \
  -H "Access-Control-Request-Method: GET"
```

---

## ✅ Success Criteria

- [ ] Backend responds through Cloudflare (no 502)
- [ ] CORS headers present in responses
- [ ] Frontend can fetch packages
- [ ] Payment flow works end-to-end


