-- FreeRADIUS SQL Configuration for GGNetworks (MySQL 8.0 Compatible)
-- This file contains the complete SQL schema for FreeRADIUS integration

-- Create FreeRADIUS database if not exists
CREATE DATABASE IF NOT EXISTS ggnetworks;
USE ggnetworks;

-- Create FreeRADIUS user if not exists
CREATE USER IF NOT EXISTS 'freeradius'@'localhost' IDENTIFIED BY 'freeradius_password';
GRANT ALL PRIVILEGES ON ggnetworks.* TO 'freeradius'@'localhost';
FLUSH PRIVILEGES;

-- Standard FreeRADIUS tables
-- radcheck table for user authentication
CREATE TABLE IF NOT EXISTS radcheck (
    id int(11) unsigned NOT NULL auto_increment,
    username varchar(64) NOT NULL default '',
    attribute varchar(64) NOT NULL default '',
    op char(2) NOT NULL default '==',
    value varchar(253) NOT NULL default '',
    PRIMARY KEY (id),
    KEY username (username(32))
);

-- radreply table for user authorization
CREATE TABLE IF NOT EXISTS radreply (
    id int(11) unsigned NOT NULL auto_increment,
    username varchar(64) NOT NULL default '',
    attribute varchar(64) NOT NULL default '',
    op char(2) NOT NULL default '=',
    value varchar(253) NOT NULL default '',
    PRIMARY KEY (id),
    KEY username (username(32))
);

-- radusergroup table for group management
CREATE TABLE IF NOT EXISTS radusergroup (
    id int(11) unsigned NOT NULL auto_increment,
    username varchar(64) NOT NULL default '',
    groupname varchar(64) NOT NULL default '',
    priority int(11) NOT NULL default '1',
    PRIMARY KEY (id),
    KEY username (username(32))
);

-- radgroupcheck table for group authorization
CREATE TABLE IF NOT EXISTS radgroupcheck (
    id int(11) unsigned NOT NULL auto_increment,
    groupname varchar(64) NOT NULL default '',
    attribute varchar(64) NOT NULL default '',
    op char(2) NOT NULL default '==',
    value varchar(253) NOT NULL default '',
    PRIMARY KEY (id),
    KEY groupname (groupname(32))
);

-- radgroupreply table for group authorization
CREATE TABLE IF NOT EXISTS radgroupreply (
    id int(11) unsigned NOT NULL auto_increment,
    groupname varchar(64) NOT NULL default '',
    attribute varchar(64) NOT NULL default '',
    op char(2) NOT NULL default '=',
    value varchar(253) NOT NULL default '',
    PRIMARY KEY (id),
    KEY groupname (groupname(32))
);

-- radacct table for accounting (MySQL 8.0 compatible)
CREATE TABLE IF NOT EXISTS radacct (
    radacctid bigint(21) NOT NULL auto_increment,
    acctsessionid varchar(64) NOT NULL default '',
    acctuniqueid varchar(32) NOT NULL default '',
    username varchar(64) NOT NULL default '',
    groupname varchar(64) NOT NULL default '',
    realm varchar(64) default '',
    nasipaddress varchar(45) NOT NULL default '',
    nasportid varchar(15) default NULL,
    nasporttype varchar(32) default NULL,
    acctstarttime datetime NULL default NULL,
    acctupdatetime datetime NULL default NULL,
    acctstoptime datetime NULL default NULL,
    acctinterval int(12) default NULL,
    acctsessiontime int(12) unsigned default NULL,
    acctauthentic varchar(32) default NULL,
    connectinfo_start varchar(50) default NULL,
    connectinfo_stop varchar(50) default NULL,
    acctinputoctets bigint(20) default NULL,
    acctoutputoctets bigint(20) default NULL,
    calledstationid varchar(50) NOT NULL default '',
    callingstationid varchar(50) NOT NULL default '',
    acctterminatecause varchar(32) NOT NULL default '',
    servicetype varchar(32) default NULL,
    framedprotocol varchar(32) default NULL,
    framedipaddress varchar(45) NOT NULL default '',
    framedipv6address varchar(45) NOT NULL default '',
    framedipv6prefix varchar(45) NOT NULL default '',
    framedinterfaceid varchar(64) default NULL,
    delegatedipv6prefix varchar(45) NOT NULL default '',
    PRIMARY KEY (radacctid),
    UNIQUE KEY acctuniqueid (acctuniqueid),
    KEY username (username),
    KEY framedipaddress (framedipaddress),
    KEY framedipv6address (framedipv6address),
    KEY framedipv6prefix (framedipv6prefix),
    KEY delegatedipv6prefix (delegatedipv6prefix),
    KEY acctsessionid (acctsessionid),
    KEY acctsessiontime (acctsessiontime),
    KEY acctstarttime (acctstarttime),
    KEY acctinterval (acctinterval),
    KEY acctstoptime (acctstoptime),
    KEY nasipaddress (nasipaddress)
);

-- radpostauth table for post-authentication logging
CREATE TABLE IF NOT EXISTS radpostauth (
    id int(11) NOT NULL auto_increment,
    username varchar(64) NOT NULL default '',
    pass varchar(64) NOT NULL default '',
    reply varchar(32) NOT NULL default '',
    CalledStationId varchar(50) NOT NULL default '',
    CallingStationId varchar(50) NOT NULL default '',
    authdate timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY username (username),
    KEY authdate (authdate)
);

-- Insert sample users for testing
-- Hotspot voucher user
INSERT INTO radcheck (username, attribute, op, value) VALUES
('voucher_GG12345678', 'Cleartext-Password', ':=', 'GG12345678'),
('voucher_GG12345678', 'Session-Timeout', ':=', '43200'), -- 12 hours
('voucher_GG12345678', 'Idle-Timeout', ':=', '300'), -- 5 minutes
('voucher_GG12345678', 'WISPr-Bandwidth-Max-Down', ':=', '2048'), -- 2 Mbps down
('voucher_GG12345678', 'WISPr-Bandwidth-Max-Up', ':=', '1024'), -- 1 Mbps up
('voucher_GG12345678', 'Simultaneous-Use', ':=', '1'),
('voucher_GG12345678', 'Login-Time', ':=', 'Al0800-2200');

-- PPPoE user
INSERT INTO radcheck (username, attribute, op, value) VALUES
('0712345678', 'Cleartext-Password', ':=', '5678ABCD'),
('0712345678', 'Session-Timeout', ':=', '0'), -- No timeout
('0712345678', 'Idle-Timeout', ':=', '600'), -- 10 minutes
('0712345678', 'WISPr-Bandwidth-Max-Down', ':=', '16384'), -- 16 Mbps down
('0712345678', 'WISPr-Bandwidth-Max-Up', ':=', '8192'), -- 8 Mbps up
('0712345678', 'Simultaneous-Use', ':=', '3'),
('0712345678', 'Login-Time', ':=', 'Al0800-2200');

-- Insert user groups
INSERT INTO radusergroup (username, groupname, priority) VALUES
('voucher_GG12345678', 'hotspot_users', 1),
('0712345678', 'pppoe_users', 1);

-- Insert group check attributes
INSERT INTO radgroupcheck (groupname, attribute, op, value) VALUES
('hotspot_users', 'Auth-Type', ':=', 'Local'),
('pppoe_users', 'Auth-Type', ':=', 'Local');

-- Insert group reply attributes
INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES
('hotspot_users', 'Service-Type', ':=', 'Login-User'),
('hotspot_users', 'Framed-Protocol', ':=', 'PPP'),
('pppoe_users', 'Service-Type', ':=', 'Framed-User'),
('pppoe_users', 'Framed-Protocol', ':=', 'PPP');

-- Create indexes for better performance
CREATE INDEX idx_radcheck_username ON radcheck(username);
CREATE INDEX idx_radreply_username ON radreply(username);
CREATE INDEX idx_radacct_username ON radacct(username);
CREATE INDEX idx_radacct_acctstarttime ON radacct(acctstarttime);
CREATE INDEX idx_radacct_acctstoptime ON radacct(acctstoptime);
CREATE INDEX idx_radacct_nasipaddress ON radacct(nasipaddress);

-- Create views for easier querying
CREATE VIEW active_sessions AS
SELECT 
    username,
    acctsessionid,
    acctstarttime,
    acctsessiontime,
    acctinputoctets,
    acctoutputoctets,
    nasipaddress,
    framedipaddress
FROM radacct 
WHERE acctstoptime IS NULL;

CREATE VIEW user_statistics AS
SELECT 
    username,
    COUNT(*) as total_sessions,
    SUM(acctsessiontime) as total_time,
    SUM(acctinputoctets + acctoutputoctets) as total_bytes,
    MAX(acctstarttime) as last_login
FROM radacct 
GROUP BY username;

-- Grant permissions to FreeRADIUS user
GRANT SELECT, INSERT, UPDATE, DELETE ON ggnetworks.* TO 'freeradius'@'localhost';
FLUSH PRIVILEGES;

-- Show table structure for verification
SHOW TABLES;
DESCRIBE radcheck;
DESCRIBE radacct;
