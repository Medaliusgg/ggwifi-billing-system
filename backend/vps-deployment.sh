#!/bin/bash

# GGWIFI Complete VPS Deployment Script
# Deploys Spring Boot + MySQL + FreeRADIUS on a single VPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 GGWIFI Complete VPS Deployment${NC}"
echo -e "${BLUE}Deploying: Spring Boot + MySQL + FreeRADIUS${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root: sudo $0${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing system dependencies...${NC}"

# Update system
apt update && apt upgrade -y

# Install Java 17
apt install -y openjdk-17-jdk

# Install MySQL Server
apt install -y mysql-server

# Install FreeRADIUS
apt install -y freeradius freeradius-mysql freeradius-utils

# Install Maven
apt install -y maven

# Install Git
apt install -y git

# Install Nginx (for reverse proxy)
apt install -y nginx

echo -e "${GREEN}✅ System dependencies installed${NC}"

echo -e "${BLUE}🗄️  Configuring MySQL...${NC}"

# Secure MySQL installation
mysql_secure_installation <<EOF

y
kolombo@123%
kolombo@123%
y
y
y
y
EOF

# Create database and user
mysql -u root -pkolombo@123% <<EOF
CREATE DATABASE ggwifi;
USE ggwifi;
SOURCE /root/ggwifi-billing-system/backend/src/main/resources/db/migration/V1__Create_initial_schema.sql;
SOURCE /root/ggwifi-billing-system/backend/freeradius-sql-init/01_radius_tables.sql;
INSERT INTO users (phone_number, password, role, is_active) VALUES ('0773404760', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMye/IUQpJYj8x9Qq8x9Qq8x9Qq8x9Qq8x9Q', 'ADMIN', true);
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}✅ MySQL configured${NC}"

echo -e "${BLUE}📡 Configuring FreeRADIUS...${NC}"

# Configure FreeRADIUS to use MySQL
cat > /etc/freeradius/3.0/mods-available/sql <<EOF
sql {
    driver = "rlm_sql_mysql"
    server = "localhost"
    port = 3306
    login = "root"
    password = "kolombo@123%"
    radius_db = "ggwifi"
    acct_table1 = "radacct"
    acct_table2 = "radacct"
    postauth_table = "radpostauth"
    authcheck_table = "radcheck"
    groupcheck_table = "radgroupcheck"
    usergroup_table = "radusergroup"
    reply_table = "radreply"
    groupreply_table = "radgroupreply"
    read_groups = yes
    readclients = yes
    deletestalesessions = yes
    sqltrace = yes
    sqltracefile = \${logdir}/sqltrace.sql
    num_sql_socks = 5
    connect_timeout = 3.0
    lifetime = 0
    max_queries = 0
    nas_table = "nas"
}
EOF

# Enable SQL module
ln -sf /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/

# Configure clients (MikroTik routers)
cat > /etc/freeradius/3.0/clients.conf <<EOF
client localhost {
    ipaddr = 127.0.0.1
    secret = testing123
    require_message_authenticator = no
    nas_type = other
}

client 192.168.0.0/16 {
    secret = testing123
    shortname = local-network
}

client 10.0.0.0/8 {
    secret = testing123
    shortname = private-network
}
EOF

# Configure sites
cat > /etc/freeradius/3.0/sites-available/default <<EOF
authorize {
    filter_username
    preprocess
    chap
    mschap
    digest
    suffix
    eap {
        ok = return
    }
    files
    sql
    expiration
    logintime
    pap
}

authenticate {
    Auth-Type PAP {
        pap
    }
    Auth-Type CHAP {
        chap
    }
    Auth-Type MS-CHAP {
        mschap
    }
    digest
    eap
}

preacct {
    preprocess
    acct_unique
    suffix
    files
}

accounting {
    detail
    unix
    radutmp
    sql
    attr_filter.accounting_response
}

session {
    sql
}

post-auth {
    if (session-state:User-Name && reply:User-Name && request:User-Name && (reply:User-Name == request:User-Name)) {
        update reply {
            Filter-Id := "%{sql:SELECT groupname FROM radusergroup WHERE username='%{request:User-Name}' ORDER BY priority}"
        }
    }
    sql
    remove_reply_message_if_eap
}

pre-proxy {
}

post-proxy {
    eap
}
EOF

# Start FreeRADIUS
systemctl enable freeradius
systemctl start freeradius

echo -e "${GREEN}✅ FreeRADIUS configured${NC}"

echo -e "${BLUE}☕ Deploying Spring Boot Application...${NC}"

# Clone repository
cd /root
git clone https://github.com/Medaliusgg/ggwifi-billing-system.git
cd ggwifi-billing-system/backend

# Download Maven dependencies
mvn dependency:resolve

# Create systemd service for Spring Boot
cat > /etc/systemd/system/ggwifi-backend.service <<EOF
[Unit]
Description=GGWIFI Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/ggwifi-billing-system/backend
ExecStart=/usr/bin/java -cp ".:\$(find /root/.m2/repository -name "*.jar" | tr '\n' ':')" StandaloneServer
Restart=always
RestartSec=10
Environment=JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

[Install]
WantedBy=multi-user.target
EOF

# Enable and start Spring Boot service
systemctl daemon-reload
systemctl enable ggwifi-backend
systemctl start ggwifi-backend

echo -e "${GREEN}✅ Spring Boot deployed${NC}"

echo -e "${BLUE}🌐 Configuring Nginx Reverse Proxy...${NC}"

# Configure Nginx
cat > /etc/nginx/sites-available/ggwifi <<EOF
server {
    listen 80;
    server_name api.ggwifi.co.tz;

    location / {
        proxy_pass http://localhost:8082;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/ggwifi /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx

echo -e "${GREEN}✅ Nginx configured${NC}"

echo -e "${BLUE}🔥 Configuring Firewall...${NC}"

# Configure UFW firewall
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8082/tcp  # Spring Boot (if direct access needed)
ufw allow 1812/udp  # RADIUS Authentication
ufw allow 1813/udp  # RADIUS Accounting
ufw --force enable

echo -e "${GREEN}✅ Firewall configured${NC}"

echo -e "${BLUE}🔍 Testing Services...${NC}"

# Test MySQL
if mysql -u root -pkolombo@123% -e "USE ggwifi; SELECT COUNT(*) FROM users;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MySQL: Working${NC}"
else
    echo -e "${RED}❌ MySQL: Failed${NC}"
fi

# Test FreeRADIUS
if systemctl is-active --quiet freeradius; then
    echo -e "${GREEN}✅ FreeRADIUS: Running${NC}"
else
    echo -e "${RED}❌ FreeRADIUS: Failed${NC}"
fi

# Test Spring Boot
if systemctl is-active --quiet ggwifi-backend; then
    echo -e "${GREEN}✅ Spring Boot: Running${NC}"
else
    echo -e "${RED}❌ Spring Boot: Failed${NC}"
fi

# Test Nginx
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx: Running${NC}"
else
    echo -e "${RED}❌ Nginx: Failed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 GGWIFI Backend Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Service Status:${NC}"
echo -e "   🌐 API Endpoint: http://$(curl -s ifconfig.me):8082"
echo -e "   🗄️  MySQL: Port 3306"
echo -e "   📡 FreeRADIUS: Port 1812/1813"
echo -e "   🔄 Nginx: Port 80/443"
echo ""
echo -e "${BLUE}🔐 Admin Credentials:${NC}"
echo -e "   📱 Phone: 0773404760"
echo -e "   🔑 Password: Ashruha@123%"
echo ""
echo -e "${BLUE}📞 Support: medaliusggg@gmail.com${NC}"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "   1. Update DNS: Point api.ggwifi.co.tz to $(curl -s ifconfig.me)"
echo "   2. Install SSL certificate (Let's Encrypt)"
echo "   3. Update Cloudflare Pages environment variables"
echo "   4. Test login from your frontend"
