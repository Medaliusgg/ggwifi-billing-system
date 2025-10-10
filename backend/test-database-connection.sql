-- Test Database Connection Script for GGWIFI
-- Run this script to test your MySQL connection and setup

-- Test 1: Basic connection test
SELECT 'MySQL connection successful!' as status;

-- Test 2: Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ggwifi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Test 3: Use the database
USE ggwifi;

-- Test 4: Show current database
SELECT DATABASE() as current_database;

-- Test 5: Show MySQL version and configuration
SELECT VERSION() as mysql_version;
SELECT @@port as mysql_port;
SELECT @@bind_address as bind_address;

-- Test 6: Show current user and host
SELECT USER() as current_user, @@hostname as hostname;

-- Test 7: Create a simple test table
CREATE TABLE IF NOT EXISTS connection_test (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_message VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test 8: Insert test data
INSERT INTO connection_test (test_message) VALUES ('GGWIFI Database Connection Test');

-- Test 9: Query test data
SELECT * FROM connection_test;

-- Test 10: Clean up test table
DROP TABLE connection_test;

-- Success message
SELECT 'All database tests completed successfully!' as final_status;
