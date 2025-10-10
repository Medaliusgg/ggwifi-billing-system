#!/bin/bash

# GGWIFI Budget VPS Setup ($2.50/month)
# Optimized for minimal resources: 512MB RAM, 1 CPU

set -e

echo "🚀 GGWIFI Budget VPS Setup (512MB RAM)"
echo "💰 Cost: $2.50/month"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo $0"
    exit 1
fi

echo "📦 Installing minimal dependencies..."

# Update system
apt update && apt upgrade -y

# Install Java 17 (minimal)
apt install -y openjdk-17-jdk-headless

# Install MySQL (minimal configuration)
apt install -y mysql-server

# Install FreeRADIUS (minimal)
apt install -y freeradius freeradius-mysql

# Install Git
apt install -y git

echo "✅ Dependencies installed"

echo "🗄️  Configuring MySQL (optimized for 512MB RAM)..."

# Optimize MySQL for low memory
cat > /etc/mysql/mysql.conf.d/99-low-memory.cnf <<EOF
[mysqld]
innodb_buffer_pool_size = 128M
key_buffer_size = 32M
max_connections = 50
query_cache_size = 32M
query_cache_limit = 2M
tmp_table_size = 32M
max_heap_table_size = 32M
EOF

# Secure MySQL
mysql_secure_installation <<EOF

y
kolombo@123%
kolombo@123%
y
y
y
y
EOF

# Create database
mysql -u root -pkolombo@123% <<EOF
CREATE DATABASE ggwifi;
USE ggwifi;
SOURCE /root/ggwifi-billing-system/backend/src/main/resources/db/migration/V1__Create_initial_schema.sql;
SOURCE /root/ggwifi-billing-system/backend/freeradius-sql-init/01_radius_tables.sql;
INSERT INTO users (phone_number, password, role, is_active) VALUES ('0773404760', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMye/IUQpJYj8x9Qq8x9Qq8x9Qq8x9Qq8x9Q', 'ADMIN', true);
EOF

echo "✅ MySQL configured"

echo "📡 Configuring FreeRADIUS..."

# Minimal FreeRADIUS config
cat > /etc/freeradius/3.0/mods-available/sql <<EOF
sql {
    driver = "rlm_sql_mysql"
    server = "localhost"
    login = "root"
    password = "kolombo@123%"
    radius_db = "ggwifi"
    acct_table1 = "radacct"
    authcheck_table = "radcheck"
    reply_table = "radreply"
    num_sql_socks = 2
    connect_timeout = 3.0
}
EOF

ln -sf /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/

# Configure clients
cat > /etc/freeradius/3.0/clients.conf <<EOF
client 192.168.0.0/16 {
    secret = testing123
}
client 10.0.0.0/8 {
    secret = testing123
}
EOF

systemctl enable freeradius
systemctl start freeradius

echo "✅ FreeRADIUS configured"

echo "☕ Deploying Spring Boot..."

# Clone repository
cd /root
git clone https://github.com/Medaliusgg/ggwifi-billing-system.git
cd ggwifi-billing-system/backend

# Download dependencies
mvn dependency:resolve

# Create optimized systemd service
cat > /etc/systemd/system/ggwifi-backend.service <<EOF
[Unit]
Description=GGWIFI Backend
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/ggwifi-billing-system/backend
ExecStart=/usr/bin/java -Xms128m -Xmx256m -cp ".:\$(find /root/.m2/repository -name "*.jar" | tr '\n' ':')" StandaloneServer
Restart=always
RestartSec=10
Environment=JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ggwifi-backend
systemctl start ggwifi-backend

echo "✅ Spring Boot deployed"

echo "🔥 Configuring Firewall..."
ufw allow 22/tcp    # SSH
ufw allow 8082/tcp  # Spring Boot
ufw allow 1812/udp  # RADIUS Auth
ufw allow 1813/udp  # RADIUS Acct
ufw --force enable

echo "✅ Firewall configured"

echo ""
echo "🎉 Budget VPS Setup Complete!"
echo ""
echo "💰 Cost: $2.50/month"
echo "🖥️  Resources: 512MB RAM, 1 CPU, 10GB SSD"
echo "🌐 API: http://$(curl -s ifconfig.me):8082"
echo "📡 FreeRADIUS: $(curl -s ifconfig.me):1812"
echo ""
echo "🔐 Admin Login:"
echo "   Phone: 0773404760"
echo "   Password: Ashruha@123%"
echo ""
echo "📞 Support: medaliusggg@gmail.com"
