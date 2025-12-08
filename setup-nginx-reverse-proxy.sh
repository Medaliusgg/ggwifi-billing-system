#!/bin/bash

# Setup Nginx Reverse Proxy for Backend
# This will configure Nginx to proxy requests to backend:8080

set -e

VPS_HOST="139.84.241.182"
VPS_USER="root"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 SETTING UP NGINX REVERSE PROXY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
set -e

echo "1️⃣  Checking Nginx installation..."
if ! command -v nginx &> /dev/null; then
    echo "   Installing Nginx..."
    apt update
    apt install -y nginx
else
    echo "   ✅ Nginx is installed"
    nginx -v
fi
echo ""

echo "2️⃣  Creating Nginx configuration..."
cat > /etc/nginx/sites-available/api.ggwifi.co.tz << 'NGINX_CONFIG'
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.ggwifi.co.tz;

    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - Proxy to Backend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.ggwifi.co.tz;

    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/api.ggwifi.co.tz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ggwifi.co.tz/privkey.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # CORS Headers - Add at server level
    add_header 'Access-Control-Allow-Origin' 'https://hotspot.ggwifi.co.tz' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, Cache-Control, Pragma, X-CSRF-TOKEN, X-Auth-Token, Accept-Language, Accept-Encoding' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Expose-Headers' 'Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Content-Type, Authorization, X-Requested-With' always;
    add_header 'Access-Control-Max-Age' '3600' always;

    # Handle preflight OPTIONS requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://hotspot.ggwifi.co.tz' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, Cache-Control, Pragma, X-CSRF-TOKEN, X-Auth-Token, Accept-Language, Accept-Encoding' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Max-Age' '3600' always;
        add_header 'Content-Type' 'text/plain; charset=utf-8' always;
        add_header 'Content-Length' '0' always;
        return 204;
    }

    # Proxy to Backend
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINX_CONFIG

echo "   ✅ Configuration file created"
echo ""

echo "3️⃣  Enabling site..."
# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Enable our site
ln -sf /etc/nginx/sites-available/api.ggwifi.co.tz /etc/nginx/sites-enabled/
echo "   ✅ Site enabled"
echo ""

echo "4️⃣  Testing Nginx configuration..."
if nginx -t; then
    echo "   ✅ Nginx configuration is valid"
else
    echo "   ❌ Nginx configuration has errors!"
    exit 1
fi
echo ""

echo "5️⃣  Installing SSL certificate..."
if command -v certbot &> /dev/null; then
    echo "   Certbot is installed"
else
    echo "   Installing certbot..."
    apt install -y certbot python3-certbot-nginx
fi

# Check if certificate already exists
if [ -f "/etc/letsencrypt/live/api.ggwifi.co.tz/fullchain.pem" ]; then
    echo "   ✅ SSL certificate already exists"
else
    echo "   Obtaining SSL certificate..."
    certbot --nginx -d api.ggwifi.co.tz --non-interactive --agree-tos --email admin@ggwifi.co.tz || {
        echo "   ⚠️  SSL certificate installation failed"
        echo "   You may need to run manually: certbot --nginx -d api.ggwifi.co.tz"
    }
fi
echo ""

echo "6️⃣  Reloading Nginx..."
systemctl reload nginx
systemctl status nginx --no-pager | head -5
echo "   ✅ Nginx reloaded"
echo ""

echo "7️⃣  Testing backend through Nginx..."
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/v1/customer-portal/packages 2>&1 || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "   ✅ Backend accessible through Nginx (HTTP $HTTP_CODE)"
else
    echo "   ⚠️  Backend may not be accessible (HTTP $HTTP_CODE)"
    echo "   Check: curl http://localhost/api/v1/customer-portal/packages"
fi
echo ""

echo "8️⃣  Testing CORS headers..."
CORS_TEST=$(curl -s -I -X OPTIONS http://localhost/api/v1/customer-portal/packages \
  -H "Origin: https://hotspot.ggwifi.co.tz" \
  -H "Access-Control-Request-Method: GET" 2>&1 | grep -i "access-control-allow-origin" || echo "")
if [ -n "$CORS_TEST" ]; then
    echo "   ✅ CORS headers present:"
    echo "   $CORS_TEST"
else
    echo "   ⚠️  CORS headers not found in test"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ NGINX REVERSE PROXY CONFIGURED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "   1. Ensure Cloudflare DNS points to: 139.84.241.182 (Proxied)"
echo "   2. Test from frontend: https://hotspot.ggwifi.co.tz"
echo "   3. Check Cloudflare SSL mode: Full or Full (strict)"
echo ""
echo "🧪 Test Commands:"
echo "   curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages"
echo "   curl -I -X OPTIONS https://api.ggwifi.co.tz/api/v1/customer-portal/packages \\"
echo "     -H 'Origin: https://hotspot.ggwifi.co.tz'"
echo ""

ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SETUP COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "The backend should now be accessible through Cloudflare!"
echo ""


