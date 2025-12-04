#!/bin/bash

# VPS Production Database Setup Script
# Run this script on your VPS server via SSH

echo "=== VPS Production Database Setup ==="
echo ""
echo "This script will:"
echo "  1. Create MySQL database"
echo "  2. Create database user"
echo "  3. Grant privileges"
echo "  4. Run Flyway migrations"
echo ""

# Configuration
DB_NAME="ggnetworks_radius"
DB_USER="ggnetworks"
DB_PASSWORD=""
BACKEND_DIR=""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get database password
read -sp "Enter MySQL root password: " ROOT_PASSWORD
echo ""

# Get database user password
read -sp "Enter password for database user '$DB_USER' (or press Enter to generate): " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    echo -e "${YELLOW}Generated password: $DB_PASSWORD${NC}"
    echo "Please save this password securely!"
    echo ""
fi

# Get backend directory
read -p "Enter backend directory path (default: current directory): " BACKEND_DIR
if [ -z "$BACKEND_DIR" ]; then
    BACKEND_DIR=$(pwd)
fi

# Step 1: Check MySQL connection
echo ""
echo "1. Checking MySQL connection..."
if mysql -u root -p"$ROOT_PASSWORD" -e "SELECT 1;" 2>/dev/null; then
    echo -e "${GREEN}✅ MySQL connection successful${NC}"
else
    echo -e "${RED}❌ MySQL connection failed${NC}"
    echo "Please check MySQL is running and root password is correct"
    exit 1
fi

# Step 2: Create database
echo ""
echo "2. Creating database '$DB_NAME'..."
mysql -u root -p"$ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database '$DB_NAME' created${NC}"
else
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
fi

# Step 3: Create user
echo ""
echo "3. Creating user '$DB_USER'..."
mysql -u root -p"$ROOT_PASSWORD" <<EOF
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ User '$DB_USER' created with privileges${NC}"
else
    echo -e "${RED}❌ Failed to create user${NC}"
    exit 1
fi

# Step 4: Verify connection
echo ""
echo "4. Verifying database connection..."
if mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SELECT 1;" 2>/dev/null; then
    echo -e "${GREEN}✅ Database connection verified${NC}"
else
    echo -e "${RED}❌ Database connection verification failed${NC}"
    exit 1
fi

# Step 5: Check backend directory
echo ""
echo "5. Checking backend directory..."
if [ -f "$BACKEND_DIR/pom.xml" ]; then
    echo -e "${GREEN}✅ Backend directory found: $BACKEND_DIR${NC}"
else
    echo -e "${YELLOW}⚠️  Backend directory not found or pom.xml missing${NC}"
    echo "   Skipping Flyway migrations"
    echo ""
    echo "Database setup complete. Run migrations manually:"
    echo "  cd $BACKEND_DIR"
    echo "  mvn flyway:migrate"
    exit 0
fi

# Step 6: Run Flyway migrations
echo ""
echo "6. Running Flyway migrations..."
cd "$BACKEND_DIR" || exit 1

# Set database credentials for Flyway
export FLYWAY_URL="jdbc:mysql://localhost:3306/$DB_NAME"
export FLYWAY_USER="$DB_USER"
export FLYWAY_PASSWORD="$DB_PASSWORD"

mvn flyway:migrate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Migration completed with warnings${NC}"
fi

# Step 7: Verify tables
echo ""
echo "7. Verifying database tables..."
TABLE_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null | wc -l)
if [ "$TABLE_COUNT" -gt 1 ]; then
    echo -e "${GREEN}✅ Found $((TABLE_COUNT - 1)) tables in database${NC}"
else
    echo -e "${YELLOW}⚠️  No tables found (migrations may have failed)${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}=== Database Setup Complete ===${NC}"
echo ""
echo "Database Information:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""
echo "⚠️  IMPORTANT: Save the password securely!"
echo ""
echo "Next steps:"
echo "  1. Update application.yml with database credentials"
echo "  2. Or set environment variables:"
echo "     export DB_USERNAME=$DB_USER"
echo "     export DB_PASSWORD=$DB_PASSWORD"
echo "  3. Restart backend application"
echo "  4. Verify application connects to database"




