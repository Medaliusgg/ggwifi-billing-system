-- FreeRADIUS MySQL Configuration for GGWIFI
-- This script configures FreeRADIUS to use the same MySQL database as the backend
-- Database: ggwifi
-- Username: root
-- Password: kolombo@123%

-- Create FreeRADIUS database schema
USE ggwifi;

-- ============================================================================
-- FreeRADIUS Core Tables
-- ============================================================================

-- nas table - Network Access Server information
CREATE TABLE IF NOT EXISTS nas (
    id int(11) NOT NULL AUTO_INCREMENT,
    nasname varchar(128) NOT NULL,
    shortname varchar(32) NOT NULL,
    type varchar(30) DEFAULT 'other',
    ports int(5) DEFAULT NULL,
    secret varchar(60) DEFAULT 'secret',
    server varchar(64) DEFAULT NULL,
    community varchar(50) DEFAULT NULL,
    description varchar(200) DEFAULT 'RADIUS Client',
    PRIMARY KEY (id),
    KEY nasname (nasname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- radgroupcheck table - Group check attributes
CREATE TABLE IF NOT EXISTS radgroupcheck (
    id int(11) NOT NULL AUTO_INCREMENT,
    groupname varchar(64) NOT NULL DEFAULT '',
    attribute varchar(64) NOT NULL DEFAULT '',
    op char(2) NOT NULL DEFAULT '==',
    value varchar(253) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY groupname (groupname(32))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- radgroupreply table - Group reply attributes
CREATE TABLE IF NOT EXISTS radgroupreply (
    id int(11) NOT NULL AUTO_INCREMENT,
    groupname varchar(64) NOT NULL DEFAULT '',
    attribute varchar(64) NOT NULL DEFAULT '',
    op char(2) NOT NULL DEFAULT '=',
    value varchar(253) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY groupname (groupname(32))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- radreply table - User reply attributes
CREATE TABLE IF NOT EXISTS radreply (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(64) NOT NULL DEFAULT '',
    attribute varchar(64) NOT NULL DEFAULT '',
    op char(2) NOT NULL DEFAULT '=',
    value varchar(253) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY username (username(32))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- radcheck table - User check attributes (authentication)
CREATE TABLE IF NOT EXISTS radcheck (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(64) NOT NULL DEFAULT '',
    attribute varchar(64) NOT NULL DEFAULT '',
    op char(2) NOT NULL DEFAULT '==',
    value varchar(253) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY username (username(32))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- radusergroup table - User group assignments
CREATE TABLE IF NOT EXISTS radusergroup (
    username varchar(64) NOT NULL DEFAULT '',
    groupname varchar(64) NOT NULL DEFAULT '',
    priority int(11) NOT NULL DEFAULT 1,
    PRIMARY KEY (username,groupname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- radacct table - Accounting records
CREATE TABLE IF NOT EXISTS radacct (
    radacctid bigint(21) NOT NULL AUTO_INCREMENT,
    acctsessionid varchar(64) NOT NULL DEFAULT '',
    acctuniqueid varchar(32) NOT NULL DEFAULT '',
    username varchar(64) NOT NULL DEFAULT '',
    realm varchar(64) DEFAULT '',
    nasipaddress varchar(15) NOT NULL DEFAULT '',
    nasportid varchar(15) DEFAULT NULL,
    nasporttype varchar(32) DEFAULT NULL,
    acctstarttime datetime DEFAULT NULL,
    acctupdatetime datetime DEFAULT NULL,
    acctstoptime datetime DEFAULT NULL,
    acctinterval int(12) DEFAULT NULL,
    acctsessiontime int(12) DEFAULT NULL,
    acctauthentic varchar(32) DEFAULT NULL,
    connectinfo_start varchar(50) DEFAULT NULL,
    connectinfo_stop varchar(50) DEFAULT NULL,
    acctinputoctets bigint(20) DEFAULT NULL,
    acctoutputoctets bigint(20) DEFAULT NULL,
    calledstationid varchar(50) NOT NULL DEFAULT '',
    callingstationid varchar(50) NOT NULL DEFAULT '',
    acctterminatecause varchar(32) NOT NULL DEFAULT '',
    servicetype varchar(32) DEFAULT NULL,
    framedprotocol varchar(32) DEFAULT NULL,
    framedipaddress varchar(15) NOT NULL DEFAULT '',
    framedipv6address varchar(45) NOT NULL DEFAULT '',
    framedipv6prefix varchar(45) NOT NULL DEFAULT '',
    framedinterfaceid varchar(44) NOT NULL DEFAULT '',
    delegatedipv6prefix varchar(45) NOT NULL DEFAULT '',
    PRIMARY KEY (radacctid),
    UNIQUE KEY acctuniqueid (acctuniqueid),
    KEY username (username),
    KEY framedipaddress (framedipaddress),
    KEY framedipv6address (framedipv6address),
    KEY framedipv6prefix (framedipv6prefix),
    KEY framedinterfaceid (framedinterfaceid),
    KEY delegatedipv6prefix (delegatedipv6prefix),
    KEY acctsessionid (acctsessionid),
    KEY acctsessiontime (acctsessiontime),
    KEY acctstarttime (acctstarttime),
    KEY acctinterval (acctinterval),
    KEY acctstoptime (acctstoptime),
    KEY nasipaddress (nasipaddress)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- radpostauth table - Post-authentication logging
CREATE TABLE IF NOT EXISTS radpostauth (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(64) NOT NULL DEFAULT '',
    pass varchar(64) NOT NULL DEFAULT '',
    reply varchar(32) NOT NULL DEFAULT '',
    authdate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- GGWIFI Integration Tables
-- ============================================================================

-- Ensure our existing tables are compatible with FreeRADIUS
-- The radius_users table from our backend should work with FreeRADIUS

-- Create indexes for better performance
CREATE INDEX idx_radius_users_username ON radius_users(username);
CREATE INDEX idx_radius_users_active ON radius_users(active);
CREATE INDEX idx_radius_users_created_at ON radius_users(created_at);

-- ============================================================================
-- FreeRADIUS Configuration Data
-- ============================================================================

-- Insert default NAS entries for MikroTik routers
INSERT IGNORE INTO nas (nasname, shortname, type, secret, description) VALUES
('192.168.1.1', 'Main-Router', 'mikrotik', 'testing123', 'GGWIFI Main Office Router'),
('192.168.2.1', 'Branch-Router', 'mikrotik', 'testing123', 'GGWIFI Branch Office Router'),
('10.0.0.0/8', 'GGWIFI-Network', 'other', 'testing123', 'GGWIFI Internal Network'),
('172.16.0.0/12', 'GGWIFI-Network', 'other', 'testing123', 'GGWIFI Private Network');

-- Insert default group configurations
INSERT IGNORE INTO radgroupreply (groupname, attribute, op, value) VALUES
('hotspot-users', 'Service-Type', '=', 'Framed-User'),
('hotspot-users', 'Framed-Protocol', '=', 'PPP'),
('hotspot-users', 'Framed-IP-Netmask', '=', '255.255.255.255'),
('hotspot-users', 'Reply-Message', '=', 'Welcome to GGWIFI WiFi'),
('pppoe-users', 'Service-Type', '=', 'Framed-User'),
('pppoe-users', 'Framed-Protocol', '=', 'PPP'),
('pppoe-users', 'Framed-IP-Netmask', '=', '255.255.255.255'),
('pppoe-users', 'Reply-Message', '=', 'Welcome to GGWIFI PPPoE');

-- Insert bandwidth limiting groups
INSERT IGNORE INTO radgroupreply (groupname, attribute, op, value) VALUES
('basic-plan', 'Mikrotik-Rate-Limit', '=', '1M/512K'),
('standard-plan', 'Mikrotik-Rate-Limit', '=', '2M/1M'),
('premium-plan', 'Mikrotik-Rate-Limit', '=', '5M/2M'),
('business-plan', 'Mikrotik-Rate-Limit', '=', '10M/5M');

-- ============================================================================
-- Sample Test Users (Remove in production)
-- ============================================================================

-- Insert test hotspot user
INSERT IGNORE INTO radius_users (username, password, active, user_type, created_at, updated_at) VALUES
('test_user', 'test123', true, 'HOTSPOT_USER', NOW(), NOW());

INSERT IGNORE INTO radcheck (username, attribute, op, value) VALUES
('test_user', 'Cleartext-Password', ':=', 'test123');

INSERT IGNORE INTO radusergroup (username, groupname, priority) VALUES
('test_user', 'hotspot-users', 1);

-- Insert test PPPoE user
INSERT IGNORE INTO radius_users (username, password, active, user_type, created_at, updated_at) VALUES
('pppoe_test', 'pppoe123', true, 'PPPOE_USER', NOW(), NOW());

INSERT IGNORE INTO radcheck (username, attribute, op, value) VALUES
('pppoe_test', 'Cleartext-Password', ':=', 'pppoe123');

INSERT IGNORE INTO radusergroup (username, groupname, priority) VALUES
('pppoe_test', 'pppoe-users', 1);

-- ============================================================================
-- Views for easier management
-- ============================================================================

-- Create view for active users with their groups
CREATE OR REPLACE VIEW v_active_radius_users AS
SELECT 
    ru.id,
    ru.username,
    ru.user_type,
    ru.active,
    ru.created_at,
    ru.updated_at,
    rug.groupname,
    rug.priority
FROM radius_users ru
LEFT JOIN radusergroup rug ON ru.username = rug.username
WHERE ru.active = true;

-- Create view for user statistics
CREATE OR REPLACE VIEW v_radius_user_stats AS
SELECT 
    user_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN active = false THEN 1 END) as inactive_users,
    MIN(created_at) as first_user_created,
    MAX(created_at) as last_user_created
FROM radius_users
GROUP BY user_type;

-- ============================================================================
-- Stored Procedures for User Management
-- ============================================================================

DELIMITER //

-- Procedure to create a new RADIUS user
CREATE PROCEDURE IF NOT EXISTS sp_create_radius_user(
    IN p_username VARCHAR(64),
    IN p_password VARCHAR(64),
    IN p_user_type ENUM('HOTSPOT_USER', 'PPPOE_USER'),
    IN p_groupname VARCHAR(64)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insert into radius_users table
    INSERT INTO radius_users (username, password, active, user_type, created_at, updated_at)
    VALUES (p_username, p_password, true, p_user_type, NOW(), NOW());
    
    -- Insert into radcheck table
    INSERT INTO radcheck (username, attribute, op, value)
    VALUES (p_username, 'Cleartext-Password', ':=', p_password);
    
    -- Insert into radusergroup table
    INSERT INTO radusergroup (username, groupname, priority)
    VALUES (p_username, p_groupname, 1);
    
    COMMIT;
END //

-- Procedure to deactivate a RADIUS user
CREATE PROCEDURE IF NOT EXISTS sp_deactivate_radius_user(
    IN p_username VARCHAR(64)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update radius_users table
    UPDATE radius_users 
    SET active = false, updated_at = NOW() 
    WHERE username = p_username;
    
    -- Remove from radcheck table (this will prevent authentication)
    DELETE FROM radcheck WHERE username = p_username;
    
    COMMIT;
END //

-- Procedure to reactivate a RADIUS user
CREATE PROCEDURE IF NOT EXISTS sp_reactivate_radius_user(
    IN p_username VARCHAR(64),
    IN p_password VARCHAR(64)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update radius_users table
    UPDATE radius_users 
    SET active = true, updated_at = NOW() 
    WHERE username = p_username;
    
    -- Re-insert into radcheck table
    INSERT INTO radcheck (username, attribute, op, value)
    VALUES (p_username, 'Cleartext-Password', ':=', p_password)
    ON DUPLICATE KEY UPDATE value = p_password;
    
    COMMIT;
END //

DELIMITER ;

-- ============================================================================
-- Grant permissions for FreeRADIUS
-- ============================================================================

-- Create FreeRADIUS user (adjust password as needed)
CREATE USER IF NOT EXISTS 'freeradius'@'localhost' IDENTIFIED BY 'freeradius_password';
CREATE USER IF NOT EXISTS 'freeradius'@'%' IDENTIFIED BY 'freeradius_password';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON ggwifi.radcheck TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radreply TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radgroupcheck TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radgroupreply TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radusergroup TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radacct TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radpostauth TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.nas TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radius_users TO 'freeradius'@'localhost';

GRANT SELECT, INSERT, UPDATE ON ggwifi.radcheck TO 'freeradius'@'%';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radreply TO 'freeradius'@'%';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radgroupcheck TO 'freeradius'@'%';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radgroupreply TO 'freeradius'@'%';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radusergroup TO 'freeradius'@'%';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radacct TO 'freeradius'@'%';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radpostauth TO 'freeradius'@'%';
GRANT SELECT, INSERT, UPDATE ON ggwifi.nas TO 'freeradius'@'%';
GRANT SELECT, INSERT, UPDATE ON ggwifi.radius_users TO 'freeradius'@'%';

FLUSH PRIVILEGES;

-- ============================================================================
-- Configuration Summary
-- ============================================================================

SELECT 'FreeRADIUS MySQL Configuration Complete' as Status;
SELECT 'Database: ggwifi' as Database;
SELECT 'FreeRADIUS User: freeradius' as RadiusUser;
SELECT 'Backend User: root' as BackendUser;
SELECT 'All tables created and configured for GGWIFI integration' as Message;
