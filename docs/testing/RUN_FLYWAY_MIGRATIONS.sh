#!/bin/bash

# Flyway Migration Script for GG-WIFI Production Database
# This script runs Flyway migrations to set up the database schema

echo "=== Running Flyway Migrations ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "backend/pom.xml" ]; then
    echo -e "${RED}❌ Error: Must run from project root directory${NC}"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Navigate to backend directory
cd backend || exit 1

# Step 1: Check Flyway info
echo "1. Checking Flyway status..."
mvn flyway:info
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Flyway info check failed. This is normal if database is new.${NC}"
fi
echo ""

# Step 2: Validate migrations
echo "2. Validating migration files..."
mvn flyway:validate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration files are valid${NC}"
else
    echo -e "${YELLOW}⚠️  Validation warnings (may be normal for new database)${NC}"
fi
echo ""

# Step 3: Run migrations
echo "3. Running Flyway migrations..."
echo "   This will create all database tables and schema..."
read -p "Continue? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    mvn flyway:migrate
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Migrations completed successfully${NC}"
    else
        echo -e "${RED}❌ Migration failed${NC}"
        exit 1
    fi
else
    echo "Migration cancelled"
    exit 0
fi
echo ""

# Step 4: Check migration status
echo "4. Checking migration status..."
mvn flyway:info
echo ""

# Step 5: Verify tables
echo "5. Verifying database tables..."
mysql -u ggnetworks -pggnetworks123 -e "USE ggnetworks_radius; SHOW TABLES;" 2>/dev/null
if [ $? -eq 0 ]; then
    TABLE_COUNT=$(mysql -u ggnetworks -pggnetworks123 -e "USE ggnetworks_radius; SHOW TABLES;" 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ Found $((TABLE_COUNT - 1)) tables in database${NC}"
else
    echo -e "${YELLOW}⚠️  Could not verify tables (check MySQL credentials)${NC}"
fi
echo ""

echo -e "${GREEN}=== Flyway Migration Complete ===${NC}"
echo ""
echo "Next steps:"
echo "1. Verify database schema: mysql -u ggnetworks -pggnetworks123 ggnetworks_radius"
echo "2. Start application with MySQL configuration"
echo "3. Run production database tests"




