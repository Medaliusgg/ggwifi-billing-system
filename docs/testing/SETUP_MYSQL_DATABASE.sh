#!/bin/bash

# MySQL Database Setup Script for GG-WIFI Production Database
# This script sets up the MySQL database for production testing

echo "=== MySQL Database Setup for GG-WIFI ==="
echo ""

# Configuration
DB_NAME="ggnetworks_radius"
DB_USER="ggnetworks"
DB_PASSWORD="ggnetworks123"
MYSQL_ROOT_USER="root"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if database exists
check_database() {
    mysql -u "$MYSQL_ROOT_USER" -e "USE $DB_NAME;" 2>/dev/null
    return $?
}

# Function to check if user exists
check_user() {
    mysql -u "$MYSQL_ROOT_USER" -e "SELECT User FROM mysql.user WHERE User='$DB_USER';" 2>/dev/null | grep -q "$DB_USER"
    return $?
}

# Step 1: Check MySQL connection
echo "1. Checking MySQL connection..."
if mysql -u "$MYSQL_ROOT_USER" -e "SELECT 1;" 2>/dev/null; then
    echo -e "${GREEN}✅ MySQL connection successful${NC}"
else
    echo -e "${RED}❌ MySQL connection failed${NC}"
    echo "Please ensure MySQL is running and you have root access"
    echo "You may need to run: sudo mysql -u root"
    exit 1
fi
echo ""

# Step 2: Create database if it doesn't exist
echo "2. Checking/Creating database '$DB_NAME'..."
if check_database; then
    echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping existing database..."
        mysql -u "$MYSQL_ROOT_USER" -e "DROP DATABASE IF EXISTS $DB_NAME;"
        echo "Creating new database..."
        mysql -u "$MYSQL_ROOT_USER" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        echo -e "${GREEN}✅ Database '$DB_NAME' created${NC}"
    else
        echo -e "${YELLOW}⚠️  Using existing database${NC}"
    fi
else
    echo "Creating database '$DB_NAME'..."
    mysql -u "$MYSQL_ROOT_USER" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database '$DB_NAME' created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create database${NC}"
        exit 1
    fi
fi
echo ""

# Step 3: Create user if it doesn't exist
echo "3. Checking/Creating user '$DB_USER'..."
if check_user; then
    echo -e "${YELLOW}⚠️  User '$DB_USER' already exists${NC}"
    read -p "Do you want to update the password? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Updating user password..."
        mysql -u "$MYSQL_ROOT_USER" -e "ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
        echo -e "${GREEN}✅ User password updated${NC}"
    else
        echo -e "${YELLOW}⚠️  Using existing user${NC}"
    fi
else
    echo "Creating user '$DB_USER'..."
    mysql -u "$MYSQL_ROOT_USER" -e "CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ User '$DB_USER' created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create user${NC}"
        exit 1
    fi
fi
echo ""

# Step 4: Grant privileges
echo "4. Granting privileges to user '$DB_USER'..."
mysql -u "$MYSQL_ROOT_USER" -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
mysql -u "$MYSQL_ROOT_USER" -e "FLUSH PRIVILEGES;"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Privileges granted successfully${NC}"
else
    echo -e "${RED}❌ Failed to grant privileges${NC}"
    exit 1
fi
echo ""

# Step 5: Verify setup
echo "5. Verifying setup..."
if mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SELECT 1;" 2>/dev/null; then
    echo -e "${GREEN}✅ Database connection test successful${NC}"
else
    echo -e "${RED}❌ Database connection test failed${NC}"
    exit 1
fi
echo ""

# Step 6: Show database info
echo "6. Database Information:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Host: localhost"
echo ""

# Step 7: Check Flyway migration files
echo "7. Checking Flyway migration files..."
MIGRATION_COUNT=$(ls -1 backend/src/main/resources/db/migration/*.sql 2>/dev/null | wc -l)
if [ "$MIGRATION_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $MIGRATION_COUNT migration files${NC}"
    echo "   Ready to run: mvn flyway:migrate"
else
    echo -e "${YELLOW}⚠️  No migration files found${NC}"
fi
echo ""

echo -e "${GREEN}=== MySQL Database Setup Complete ===${NC}"
echo ""
echo "Next steps:"
echo "1. Update application.yml if needed (credentials already match)"
echo "2. Run Flyway migrations: cd backend && mvn flyway:migrate"
echo "3. Start the application with MySQL profile"
echo "4. Run production database tests"




