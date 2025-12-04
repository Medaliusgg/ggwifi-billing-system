#!/bin/bash

# Production Deployment Preparation Script
# Prepares environment, builds, and deployment configurations

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     PRODUCTION DEPLOYMENT PREPARATION                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "Project Root: $PROJECT_ROOT"
echo ""

# Create production directory
PROD_DIR="production"
mkdir -p "$PROD_DIR"
mkdir -p "$PROD_DIR/backend"
mkdir -p "$PROD_DIR/frontend/admin"
mkdir -p "$PROD_DIR/frontend/customer"
mkdir -p "$PROD_DIR/config"
mkdir -p "$PROD_DIR/scripts"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Backend Production Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend

if [ -f "pom.xml" ]; then
    echo "Building backend JAR..."
    if ./mvnw clean package -DskipTests > ../"$PROD_DIR"/backend-build.log 2>&1; then
        echo -e "${GREEN}✓ Backend build successful${NC}"
        
        # Copy JAR file
        JAR_FILE=$(find target -name "*.jar" ! -name "*-sources.jar" ! -name "*-javadoc.jar" | head -1)
        if [ -n "$JAR_FILE" ]; then
            cp "$JAR_FILE" "../$PROD_DIR/backend/ggwifi-backend.jar"
            echo -e "${GREEN}✓ JAR file copied to $PROD_DIR/backend/${NC}"
        fi
    else
        echo -e "${RED}✗ Backend build failed${NC}"
        echo "Check logs: $PROD_DIR/backend-build.log"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ pom.xml not found, skipping backend build${NC}"
fi

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Admin Portal Production Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd Frontend/admin_portal

if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install --production=false > ../../"$PROD_DIR"/admin-build.log 2>&1
    
    echo "Building admin portal..."
    if npm run build >> ../../"$PROD_DIR"/admin-build.log 2>&1; then
        echo -e "${GREEN}✓ Admin portal build successful${NC}"
        
        # Copy build files
        if [ -d "dist" ]; then
            cp -r dist/* "../../$PROD_DIR/frontend/admin/"
            echo -e "${GREEN}✓ Admin portal files copied${NC}"
        fi
    else
        echo -e "${RED}✗ Admin portal build failed${NC}"
        echo "Check logs: $PROD_DIR/admin-build.log"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ package.json not found, skipping admin portal build${NC}"
fi

cd ../..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Customer Portal Production Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd Frontend/customer_portal

if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install --production=false > ../../"$PROD_DIR"/customer-build.log 2>&1
    
    echo "Building customer portal..."
    if npm run build >> ../../"$PROD_DIR"/customer-build.log 2>&1; then
        echo -e "${GREEN}✓ Customer portal build successful${NC}"
        
        # Copy build files
        if [ -d "dist" ]; then
            cp -r dist/* "../../$PROD_DIR/frontend/customer/"
            echo -e "${GREEN}✓ Customer portal files copied${NC}"
        fi
    else
        echo -e "${RED}✗ Customer portal build failed${NC}"
        echo "Check logs: $PROD_DIR/customer-build.log"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ package.json not found, skipping customer portal build${NC}"
fi

cd ../..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create production environment template
cat > "$PROD_DIR/config/.env.production.template" << 'EOF'
# Backend Configuration
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=8080

# Database Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/ggnetworks?useSSL=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_min_256_bits
JWT_EXPIRATION=86400000

# Email Configuration (Optional)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password

# Payment Gateway Configuration
ZENOPAY_API_KEY=your_zenopay_api_key
ZENOPAY_API_SECRET=your_zenopay_api_secret

# SMS Configuration
SMS_API_KEY=your_sms_api_key
SMS_API_SECRET=your_sms_api_secret

# Frontend URLs
ADMIN_PORTAL_URL=https://admin.ggwifi.co.tz
CUSTOMER_PORTAL_URL=https://portal.ggwifi.co.tz
EOF

echo -e "${GREEN}✓ Environment template created${NC}"

# Create production application.properties template
cat > "$PROD_DIR/config/application-production.properties.template" << 'EOF'
# Production Configuration Template
# Copy this to backend/src/main/resources/application-production.properties

spring.profiles.active=production

# Server
server.port=8080
server.error.whitelabel.enabled=false

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ggnetworks?useSSL=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Flyway
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true

# Logging
logging.level.root=INFO
logging.level.com.ggnetworks=INFO
logging.file.name=logs/ggwifi-backend.log

# Security
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
EOF

echo -e "${GREEN}✓ Application properties template created${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Deployment Scripts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create deployment script
cat > "$PROD_DIR/scripts/deploy.sh" << 'EOF'
#!/bin/bash
# Production Deployment Script

set -e

echo "Starting production deployment..."

# 1. Stop existing service
echo "Stopping existing service..."
sudo systemctl stop ggwifi-backend || true

# 2. Backup current version
if [ -f "/opt/ggwifi/backend/ggwifi-backend.jar" ]; then
    echo "Backing up current version..."
    sudo cp /opt/ggwifi/backend/ggwifi-backend.jar /opt/ggwifi/backend/ggwifi-backend.jar.backup.$(date +%Y%m%d-%H%M%S)
fi

# 3. Copy new JAR
echo "Copying new JAR file..."
sudo cp backend/ggwifi-backend.jar /opt/ggwifi/backend/

# 4. Copy frontend files
echo "Copying frontend files..."
sudo cp -r frontend/admin/* /var/www/html/admin/
sudo cp -r frontend/customer/* /var/www/html/customer/

# 5. Restart service
echo "Restarting service..."
sudo systemctl start ggwifi-backend
sudo systemctl status ggwifi-backend

echo "Deployment complete!"
EOF

chmod +x "$PROD_DIR/scripts/deploy.sh"
echo -e "${GREEN}✓ Deployment script created${NC}"

# Create systemd service file template
cat > "$PROD_DIR/config/ggwifi-backend.service.template" << 'EOF'
[Unit]
Description=GG WiFi Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=ggwifi
WorkingDirectory=/opt/ggwifi/backend
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=production /opt/ggwifi/backend/ggwifi-backend.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✓ Systemd service template created${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Nginx Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create Nginx configuration template
cat > "$PROD_DIR/config/nginx.conf.template" << 'EOF'
# Nginx Configuration for GG WiFi
# Place in /etc/nginx/sites-available/ggwifi

# Admin Portal
server {
    listen 80;
    server_name admin.ggwifi.co.tz;
    
    root /var/www/html/admin;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Customer Portal
server {
    listen 80;
    server_name portal.ggwifi.co.tz;
    
    root /var/www/html/customer;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo -e "${GREEN}✓ Nginx configuration template created${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7: Database Migration Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > "$PROD_DIR/scripts/migrate-database.sh" << 'EOF'
#!/bin/bash
# Database Migration Script

set -e

echo "Running database migrations..."

# Ensure Flyway migrations are run
cd backend
./mvnw flyway:migrate

echo "Database migrations complete!"
EOF

chmod +x "$PROD_DIR/scripts/migrate-database.sh"
echo -e "${GREEN}✓ Database migration script created${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PRODUCTION PREPARATION SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${GREEN}✓ Production builds completed${NC}"
echo -e "${GREEN}✓ Configuration templates created${NC}"
echo -e "${GREEN}✓ Deployment scripts created${NC}"
echo ""
echo "Production files are in: $PROD_DIR"
echo ""
echo "Next steps:"
echo "1. Review and update configuration files in $PROD_DIR/config/"
echo "2. Set up environment variables"
echo "3. Configure database"
echo "4. Set up SSL certificates"
echo "5. Run deployment script: $PROD_DIR/scripts/deploy.sh"
echo ""

