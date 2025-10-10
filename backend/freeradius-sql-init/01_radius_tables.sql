-- Minimal FreeRADIUS tables for local dev container
CREATE TABLE IF NOT EXISTS radcheck (
  id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL DEFAULT '',
  attribute VARCHAR(64) NOT NULL DEFAULT '',
  op CHAR(2) NOT NULL DEFAULT '==',
  value VARCHAR(253) NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  KEY username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS radreply (
  id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL DEFAULT '',
  attribute VARCHAR(64) NOT NULL DEFAULT '',
  op CHAR(2) NOT NULL DEFAULT '=',
  value VARCHAR(253) NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  KEY username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS radacct (
  radacctid BIGINT NOT NULL AUTO_INCREMENT,
  acctsessionid VARCHAR(64) NOT NULL,
  acctuniqueid VARCHAR(32) NOT NULL,
  username VARCHAR(64) DEFAULT '',
  realm VARCHAR(64),
  nasipaddress VARCHAR(15),
  nasportid VARCHAR(15),
  nasporttype VARCHAR(32),
  acctstarttime TIMESTAMP NULL DEFAULT NULL,
  acctupdatetime TIMESTAMP NULL DEFAULT NULL,
  acctstoptime TIMESTAMP NULL DEFAULT NULL,
  acctsessiontime INT(12) DEFAULT NULL,
  acctinputoctets BIGINT DEFAULT NULL,
  acctoutputoctets BIGINT DEFAULT NULL,
  calledstationid VARCHAR(50),
  callingstationid VARCHAR(50),
  acctterminatecause VARCHAR(32),
  servicetype VARCHAR(32),
  framedprotocol VARCHAR(32),
  framedipaddress VARCHAR(15),
  PRIMARY KEY (radacctid),
  KEY username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS radpostauth (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL DEFAULT '',
  pass VARCHAR(64) NOT NULL DEFAULT '',
  reply VARCHAR(64) NOT NULL DEFAULT '',
  authdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY username (username)
) ENGINE=InnoDB;

-- Sample user
INSERT INTO radcheck (username, attribute, op, value) VALUES
('voucher_GG12345678', 'Cleartext-Password', ':=', 'GG12345678')
ON DUPLICATE KEY UPDATE attribute=VALUES(attribute), op=VALUES(op), value=VALUES(value);

