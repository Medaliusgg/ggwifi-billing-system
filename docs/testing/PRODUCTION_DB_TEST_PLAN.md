# Production Database Testing Plan

**Date:** 2025-12-01  
**Status:** Ready to Begin

---

## Overview

This document outlines the comprehensive testing plan for migrating from H2 (testing) to MySQL (production) database.

---

## Prerequisites Checklist

- [ ] MySQL server installed and running
- [ ] Database `ggnetworks_radius` created
- [ ] User `ggnetworks` with password configured
- [ ] Flyway migration files reviewed
- [ ] Backup of existing data (if applicable)
- [ ] Application configured for MySQL

---

## Phase 1: Database Setup

### 1.1 MySQL Installation Verification

```bash
# Check MySQL version
mysql --version

# Check MySQL service status
sudo systemctl status mysql
# OR
sudo service mysql status
```

### 1.2 Database Creation

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS ggnetworks_radius;
USE ggnetworks_radius;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'ggnetworks'@'localhost' IDENTIFIED BY 'ggnetworks123';

-- Grant privileges
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'ggnetworks';
```

### 1.3 Connection Test

```bash
# Test connection
mysql -u ggnetworks -pggnetworks123 -e "SELECT 1" ggnetworks_radius

# Expected output: 1
```

---

## Phase 2: Flyway Migration

### 2.1 Review Migration Files

```bash
# List migration files
ls -la backend/src/main/resources/db/migration/

# Check Flyway status
cd backend
mvn flyway:info
```

### 2.2 Run Migrations

```bash
# Dry run (validate)
mvn flyway:validate

# Run migrations
mvn flyway:migrate

# Check status
mvn flyway:info
```

### 2.3 Verify Schema

```sql
-- Connect to database
mysql -u ggnetworks -pggnetworks123 ggnetworks_radius

-- List all tables
SHOW TABLES;

-- Check Flyway history
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;

-- Verify key tables exist
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'ggnetworks_radius' 
AND TABLE_NAME IN (
  'customers', 'packages', 'vouchers', 'payments', 
  'invoices', 'transactions', 'routers', 'users'
);
```

---

## Phase 3: Application Configuration

### 3.1 Update Configuration

**File:** `backend/src/main/resources/application.yml`

Verify configuration:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggnetworks_radius?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true
    username: ${DB_USERNAME:ggnetworks}
    password: ${DB_PASSWORD:ggnetworks123}
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  flyway:
    enabled: ${FLYWAY_ENABLED:true}
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true
```

### 3.2 Environment Variables

```bash
# Set environment variables (optional)
export DB_USERNAME=ggnetworks
export DB_PASSWORD=ggnetworks123
export FLYWAY_ENABLED=true
```

---

## Phase 4: Schema Validation

### 4.1 Compare Schemas

**H2 (Testing) vs MySQL (Production)**

```sql
-- MySQL: Get table structure
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  DATA_TYPE,
  IS_NULLABLE,
  COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ggnetworks_radius'
ORDER BY TABLE_NAME, ORDINAL_POSITION;
```

### 4.2 Verify Constraints

```sql
-- Check primary keys
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'ggnetworks_radius'
AND CONSTRAINT_NAME = 'PRIMARY';

-- Check foreign keys
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'ggnetworks_radius'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Check unique constraints
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'ggnetworks_radius'
AND CONSTRAINT_NAME LIKE 'UK_%';
```

---

## Phase 5: CRUD Testing with MySQL

### 5.1 Test Script

Use the existing CRUD testing scripts but with MySQL database:

```bash
# Run Payment CRUD test
bash docs/testing/COMPLETE_PAYMENT_CRUD_TEST.sh

# Run comprehensive CRUD tests
bash docs/testing/CRUD_TESTING_SCRIPT.sh
```

### 5.2 Test Scenarios

1. **Create Operations**
   - Create customer
   - Create package
   - Create invoice
   - Create payment
   - Create voucher
   - Create router

2. **Read Operations**
   - Read by ID
   - Read all
   - Read with filters
   - Read with pagination

3. **Update Operations**
   - Update customer
   - Update package
   - Update payment
   - Update router

4. **Delete Operations**
   - Delete customer
   - Delete package
   - Delete payment
   - Delete voucher
   - Delete router

5. **Relationship Testing**
   - Customer → Invoice → Payment
   - Package → Voucher
   - Customer → Transaction

---

## Phase 6: Data Integrity Testing

### 6.1 Foreign Key Constraints

```sql
-- Test foreign key violations
-- Should fail
INSERT INTO payments (customer_id, invoice_id, amount) 
VALUES (99999, 99999, 10000);
-- Expected: Foreign key constraint violation
```

### 6.2 Unique Constraints

```sql
-- Test unique constraint violations
-- Should fail
INSERT INTO customers (customer_id, email, primary_phone_number) 
VALUES ('CUST1', 'existing@example.com', '+255711111111');
-- Expected: Unique constraint violation
```

### 6.3 Not Null Constraints

```sql
-- Test NOT NULL constraints
-- Should fail
INSERT INTO customers (customer_id) VALUES ('CUST2');
-- Expected: NOT NULL constraint violation
```

---

## Phase 7: Performance Testing

### 7.1 Query Performance

```sql
-- Test query performance
EXPLAIN SELECT * FROM customers WHERE email = 'test@example.com';
EXPLAIN SELECT * FROM payments WHERE customer_id = 1;

-- Check indexes
SHOW INDEX FROM customers;
SHOW INDEX FROM payments;
```

### 7.2 Connection Pool Testing

Monitor connection pool usage:
- Check HikariCP connection pool
- Monitor active connections
- Test connection timeout

---

## Phase 8: Rollback Plan

### 8.1 Database Backup

```bash
# Create backup before testing
mysqldump -u ggnetworks -pggnetworks123 ggnetworks_radius > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -lh backup_*.sql
```

### 8.2 Restore Procedure

```bash
# Restore from backup
mysql -u ggnetworks -pggnetworks123 ggnetworks_radius < backup_YYYYMMDD_HHMMSS.sql

# Verify restore
mysql -u ggnetworks -pggnetworks123 -e "SELECT COUNT(*) FROM customers" ggnetworks_radius
```

---

## Success Criteria

✅ **Database Setup:**
- MySQL server running
- Database created
- User configured with proper permissions

✅ **Flyway Migrations:**
- All migrations run successfully
- Schema created correctly
- No migration errors

✅ **Schema Validation:**
- All tables exist
- All columns match expected structure
- All constraints valid

✅ **CRUD Operations:**
- All CREATE operations working
- All READ operations working
- All UPDATE operations working
- All DELETE operations working

✅ **Data Integrity:**
- Foreign keys working
- Unique constraints working
- NOT NULL constraints working
- Transactions working

✅ **Performance:**
- Query performance acceptable
- Connection pool working
- No timeout issues

---

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check MySQL service status
   - Verify port 3306 is open
   - Check firewall settings

2. **Authentication Failed**
   - Verify username/password
   - Check user privileges
   - Reset password if needed

3. **Migration Errors**
   - Check migration file syntax
   - Verify database state
   - Review Flyway history

4. **Schema Mismatch**
   - Compare H2 and MySQL schemas
   - Check data types
   - Verify constraints

---

## Next Steps

1. ✅ Complete database setup
2. ✅ Run Flyway migrations
3. ✅ Verify schema
4. ✅ Run CRUD tests
5. ✅ Test data integrity
6. ✅ Performance testing
7. ✅ Document results

---

**Status:** Ready to begin production database testing once MySQL is configured.




