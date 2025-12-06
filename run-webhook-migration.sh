#!/bin/bash

# Database Migration Script for Webhook Processing Table
# This script runs the migration to create the webhook_processing table

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 DATABASE MIGRATION: webhook_processing table"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Database credentials from application.yml
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="ggnetworks_radius"
DB_USER="ggnetworks"
DB_PASS="ggnetworks123"

echo "📋 Database Configuration:"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Check if MySQL client is available
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL client not found. Please install mysql-client:"
    echo "   sudo apt-get install mysql-client"
    exit 1
fi

# Test database connection
echo "🔍 Testing database connection..."
if ! mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME;" 2>/dev/null; then
    echo "❌ Failed to connect to database. Please check:"
    echo "   1. MySQL server is running"
    echo "   2. Database credentials are correct"
    echo "   3. Database '$DB_NAME' exists"
    exit 1
fi

echo "✅ Database connection successful!"
echo ""

# Check if table already exists
echo "🔍 Checking if webhook_processing table exists..."
TABLE_EXISTS=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -sN -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME' AND table_name = 'webhook_processing';" 2>/dev/null)

if [ "$TABLE_EXISTS" = "1" ]; then
    echo "⚠️  Table 'webhook_processing' already exists!"
    read -p "   Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing table..."
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "DROP TABLE IF EXISTS webhook_processing;" 2>/dev/null
        echo "✅ Table dropped."
    else
        echo "ℹ️  Skipping migration. Table already exists."
        exit 0
    fi
fi

# Run the migration
echo ""
echo "🚀 Running migration..."
echo ""

MIGRATION_SQL=$(cat <<'EOF'
CREATE TABLE IF NOT EXISTS webhook_processing (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    webhook_id VARCHAR(255) UNIQUE NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    gateway VARCHAR(50) NOT NULL DEFAULT 'ZENOPAY',
    transaction_id VARCHAR(255),
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processing_result TEXT,
    error_message TEXT,
    ip_address VARCHAR(50),
    webhook_payload TEXT,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retry_count INT DEFAULT 0,
    INDEX idx_webhook_id (webhook_id),
    INDEX idx_order_id (order_id),
    INDEX idx_processed_at (processed_at),
    INDEX idx_gateway (gateway)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
EOF
)

if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "$MIGRATION_SQL" 2>/dev/null; then
    echo "✅ Migration completed successfully!"
    echo ""
    
    # Verify table creation
    echo "🔍 Verifying table structure..."
    TABLE_COUNT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -sN -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME' AND table_name = 'webhook_processing';" 2>/dev/null)
    
    if [ "$TABLE_COUNT" = "1" ]; then
        COLUMN_COUNT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -sN -e "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = '$DB_NAME' AND table_name = 'webhook_processing';" 2>/dev/null)
        echo "   ✅ Table 'webhook_processing' created with $COLUMN_COUNT columns"
        echo ""
        echo "📊 Table structure:"
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "DESCRIBE webhook_processing;" 2>/dev/null
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ MIGRATION COMPLETE - Ready for testing!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    else
        echo "❌ Table verification failed!"
        exit 1
    fi
else
    echo "❌ Migration failed!"
    echo "   Please check the error message above."
    exit 1
fi

