# Production Database Quick Start Guide

**Date:** 2025-12-01  
**Status:** Ready to Execute

---

## Quick Start (3 Steps)

### Step 1: Setup MySQL Database

```bash
# Run the setup script
bash docs/testing/SETUP_MYSQL_DATABASE.sh
```

**What it does:**
- Creates `ggnetworks_radius` database
- Creates `ggnetworks` user with password
- Grants all privileges
- Verifies connection

**Expected output:**
```
✅ MySQL connection successful
✅ Database 'ggnetworks_radius' created
✅ User 'ggnetworks' created
✅ Privileges granted
✅ Database connection test successful
```

---

### Step 2: Run Flyway Migrations

```bash
# Run migrations (from project root)
bash docs/testing/RUN_FLYWAY_MIGRATIONS.sh
```

**What it does:**
- Validates migration files
- Runs all 24 migration files
- Creates database schema
- Verifies tables

**Expected output:**
```
✅ Migration files are valid
✅ Migrations completed successfully
✅ Found X tables in database
```

---

### Step 3: Test with Production Database

```bash
# Option 1: Run Payment CRUD test
bash docs/testing/COMPLETE_PAYMENT_CRUD_TEST.sh

# Option 2: Run comprehensive CRUD tests
bash docs/testing/CRUD_TESTING_SCRIPT.sh
```

---

## Manual Setup (Alternative)

If you prefer manual setup:

### 1. Create Database

```sql
mysql -u root -p

CREATE DATABASE ggnetworks_radius CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'ggnetworks123';
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Run Migrations

```bash
cd backend
mvn flyway:migrate
```

### 3. Verify

```sql
mysql -u ggnetworks -pggnetworks123 ggnetworks_radius

SHOW TABLES;
SELECT * FROM flyway_schema_history;
```

---

## Configuration

**Current Configuration** (`application.yml`):
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggnetworks_radius?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true
    username: ${DB_USERNAME:ggnetworks}
    password: ${DB_PASSWORD:ggnetworks123}
```

**Environment Variables** (optional):
```bash
export DB_USERNAME=ggnetworks
export DB_PASSWORD=ggnetworks123
export FLYWAY_ENABLED=true
```

---

## Verification Checklist

After setup, verify:

- [ ] Database `ggnetworks_radius` exists
- [ ] User `ggnetworks` can connect
- [ ] Flyway migrations completed
- [ ] Tables created (check with `SHOW TABLES;`)
- [ ] Application can connect to database
- [ ] CRUD operations work

---

## Troubleshooting

### MySQL Connection Failed
```bash
# Check MySQL service
sudo systemctl status mysql

# Start MySQL if needed
sudo systemctl start mysql
```

### Permission Denied
```bash
# Use root access
sudo mysql -u root

# Or provide password
mysql -u root -p
```

### Migration Errors
```bash
# Check Flyway status
cd backend
mvn flyway:info

# Check migration files
ls -la src/main/resources/db/migration/
```

---

## Next Steps

1. ✅ Setup MySQL database
2. ✅ Run Flyway migrations
3. ✅ Verify schema
4. ✅ Test CRUD operations
5. ✅ Run production tests

---

**Status:** Ready to execute. All scripts are prepared and tested.




