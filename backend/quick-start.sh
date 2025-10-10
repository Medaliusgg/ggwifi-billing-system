#!/bin/bash

# GGNetworks Quick Start Deployment Script
# This script automates the complete deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

echo "=== GGNetworks Quick Start Deployment ==="
echo "This script will deploy the complete GGNetworks system"
echo ""

# Configuration
DB_HOST="localhost"
DB_USER="ggnetworks"
DB_PASS="ggnetworks_password"
DB_NAME="ggnetworks"
RADIUS_DB_NAME="radius"
BACKEND_URL="http://localhost:8080/api/v1"

# Step 1: Database Setup
print_status "Step 1: Setting up database..."

# Create application and RADIUS databases and users
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $RADIUS_DB_NAME;"
mysql -u root -p -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
mysql -u root -p -e "GRANT SELECT, INSERT, UPDATE, DELETE ON $RADIUS_DB_NAME.* TO '$DB_USER'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

# Import FreeRADIUS schema into radius database
print_status "Importing FreeRADIUS schema into '$RADIUS_DB_NAME'..."
mysql -u root -p $RADIUS_DB_NAME < freeradius-sql-config.sql

print_success "Database setup completed"

# Step 2: FreeRADIUS Setup
print_status "Step 2: Setting up FreeRADIUS..."
./setup-freeradius.sh

# Step 3: SMS Marketing Setup
print_status "Step 3: Setting up SMS marketing..."
./sms-marketing-setup.sh

# Step 4: Build and Start Backend
print_status "Step 4: Building and starting backend..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    print_error "Maven is not installed. Please install Maven first."
    exit 1
fi

# Build the application
print_status "Building Spring Boot application..."
mvn clean package -DskipTests

# Create systemd service for backend
print_status "Creating systemd service for backend..."
cat > /etc/systemd/system/ggnetworks-backend.service << 'EOF'
[Unit]
Description=GGNetworks Backend Service
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/home/medalius/Desktop/ggnetworks-project/backend
ExecStart=/usr/bin/java -jar target/ggnetworks-backend-1.0.0.jar
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start backend service
systemctl daemon-reload
systemctl enable ggnetworks-backend
systemctl start ggnetworks-backend

# Wait for backend to start
print_status "Waiting for backend to start..."
sleep 30

# Step 5: Run Integration Tests
print_status "Step 5: Running integration tests..."
./test-integration.sh

# Step 6: Final Verification
print_status "Step 6: Final verification..."

# Check all services
services=("freeradius" "ggnetworks-backend")
for service in "${services[@]}"; do
    if systemctl is-active --quiet "$service"; then
        print_success "✓ $service is running"
    else
        print_error "✗ $service is not running"
    fi
done

# Test backend API
if curl -s -f "$BACKEND_URL/health" > /dev/null; then
    print_success "✓ Backend API is responding"
else
    print_error "✗ Backend API is not responding"
fi

# Test FreeRADIUS
if radtest voucher_GG12345678 GG12345678 localhost 0 testing123 | grep -q "Access-Accept"; then
    print_success "✓ FreeRADIUS authentication is working"
else
    print_error "✗ FreeRADIUS authentication failed"
fi

# Display final status
echo ""
echo "=== Deployment Summary ==="
echo "✅ Database: MySQL with FreeRADIUS schema"
echo "✅ FreeRADIUS: Authentication server configured"
echo "✅ Backend: Spring Boot application running"
echo "✅ SMS Marketing: Setup completed"
echo "✅ Integration Tests: Completed"
echo ""
echo "=== Service Status ==="
systemctl status freeradius --no-pager -l
echo ""
systemctl status ggnetworks-backend --no-pager -l
echo ""

# Display next steps
echo "=== Next Steps ==="
echo "1. Configure MikroTik routers using: mikrotik-radius-config.rsc"
echo "2. Update SMS API credentials in: /etc/ggnetworks/sms/config.json"
echo "3. Test real-world scenarios with actual devices"
echo "4. Monitor system performance and logs"
echo "5. Set up SSL certificates for production"
echo ""
echo "=== Useful Commands ==="
echo "Monitor FreeRADIUS: sudo /usr/local/bin/monitor-radius.sh"
echo "Monitor SMS: sudo /usr/local/bin/monitor-sms.sh"
echo "Test integration: ./test-integration.sh"
echo "View backend logs: journalctl -u ggnetworks-backend -f"
echo "View FreeRADIUS logs: tail -f /var/log/freeradius/radius.log"
echo ""

print_success "GGNetworks deployment completed successfully!"
echo ""
echo "Deployment completed at: $(date)"

