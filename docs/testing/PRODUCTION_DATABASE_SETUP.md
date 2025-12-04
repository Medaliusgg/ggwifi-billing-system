# Production Database Testing Setup

**Date:** 2025-12-01  
**Status:** Ready to Begin

---

## Prerequisites

✅ **Completed:**
- CRUD testing: 90% complete
- Error handling: 75% complete
- Test data templates: Created
- Validation improvements: Added

---

## Production Database Configuration

### Current Setup

**Testing Environment (application-testing.yml):**
- Database: H2 (in-memory)
- Flyway: Disabled
- Schema: Auto-created by Hibernate

**Production Environment (application.yml):**
- Database: MySQL
- Flyway: Enabled
- Schema: Managed by Flyway migrations

---

## MySQL Database Setup

### 1. Database Configuration

**File:** `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggnetworks_radius?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true
    username: ${DB_USERNAME:ggnetworks}
    password: ${DB_PASSWORD:ggnetworks123}
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 2. Create Database

```sql
CREATE DATABASE IF NOT EXISTS ggnetworks_radius;
USE ggnetworks_radius;
```

### 3. Flyway Migrations

**Location:** `backend/src/main/resources/db/migration/`

**Status:** Check if migrations exist and are up-to-date

**Commands:**
```bash
# Check Flyway status
mvn flyway:info

# Run migrations
mvn flyway:migrate

# Validate migrations
mvn flyway:validate
```

---

## Testing Plan

### Phase 1: Database Connection Testing

1. **Test MySQL Connection**
   - Verify connection string
   - Test authentication
   - Verify database exists

2. **Test Flyway Migrations**
   - Run migrations
   - Verify schema creation
   - Check migration history

### Phase 2: Schema Validation

1. **Compare Schemas**
   - H2 (testing) vs MySQL (production)
   - Verify all tables exist
   - Verify all columns match

2. **Test Constraints**
   - Primary keys
   - Foreign keys
   - Unique constraints
   - Not null constraints

### Phase 3: Data Integrity Testing

1. **CRUD Operations**
   - Test all CRUD operations with MySQL
   - Verify data persistence
   - Test transactions

2. **Relationships**
   - Test foreign key relationships
   - Test cascade operations
   - Test referential integrity

### Phase 4: Performance Testing

1. **Query Performance**
   - Test query execution times
   - Identify slow queries
   - Optimize indexes

2. **Connection Pooling**
   - Test connection pool
   - Monitor connection usage
   - Test connection timeout

---

## Test Scripts

### 1. Database Connection Test

```bash
#!/bin/bash
# Test MySQL connection

mysql -u ggnetworks -pggnetworks123 -e "SELECT 1" ggnetworks_radius
if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
else
    echo "❌ MySQL connection failed"
fi
```

### 2. Flyway Migration Test

```bash
#!/bin/bash
# Test Flyway migrations

cd backend
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

### 3. Schema Comparison Test

```sql
-- Compare table structures
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ggnetworks_radius'
ORDER BY TABLE_NAME, ORDINAL_POSITION;
```

---

## Environment Variables

**Required:**
- `DB_USERNAME`: MySQL username (default: ggnetworks)
- `DB_PASSWORD`: MySQL password (default: ggnetworks123)
- `FLYWAY_ENABLED`: Enable Flyway (default: true)

**Optional:**
- `SERVER_PORT`: Server port (default: 8080)
- `APP_SECURITY_ENABLED`: Enable security (default: false)

---

## Migration Strategy

### Option 1: Fresh Installation
1. Create new database
2. Run all Flyway migrations
3. Test with clean database

### Option 2: Existing Database
1. Backup existing database
2. Run Flyway migrations
3. Verify data integrity
4. Test with existing data

---

## Rollback Plan

1. **Database Backup**
   - Create full backup before testing
   - Store backup in safe location

2. **Migration Rollback**
   - Flyway supports undo migrations (if configured)
   - Manual rollback scripts available

3. **Data Recovery**
   - Restore from backup if needed
   - Verify data integrity after restore

---

## Success Criteria

✅ **Database Connection:**
- MySQL connection successful
- Authentication working
- Database accessible

✅ **Flyway Migrations:**
- All migrations run successfully
- Schema created correctly
- No migration errors

✅ **Schema Validation:**
- All tables exist
- All columns match
- All constraints valid

✅ **Data Integrity:**
- CRUD operations working
- Relationships valid
- Transactions working

✅ **Performance:**
- Query performance acceptable
- Connection pool working
- No timeout issues

---

## Next Steps

1. **Setup MySQL Database**
   - Install MySQL (if not installed)
   - Create database
   - Configure user permissions

2. **Run Flyway Migrations**
   - Check migration files
   - Run migrations
   - Verify schema

3. **Test Database Connection**
   - Update application.yml if needed
   - Test connection
   - Verify access

4. **Run CRUD Tests**
   - Test all controllers
   - Verify data persistence
   - Test error handling

5. **Performance Testing**
   - Test query performance
   - Monitor connection pool
   - Optimize if needed

---

**Status:** Ready to begin production database testing once MySQL is configured and Flyway migrations are verified.




