# Voucher Session Management Module

## Overview
Comprehensive session management system to ensure vouchers last for the exact duration, handle MAC randomization, IP changes, and prevent disconnections during valid activation periods.

## Features

### 1. **Exact Duration Tracking**
- Sessions are created with exact expiration time based on package duration
- Scheduled monitoring ensures sessions last for the full duration
- Automatic termination only after exact duration expires

### 2. **MAC Randomization Handling**
- Tracks MAC address changes during session
- Allows reconnection with different MAC address
- Maintains session validity across MAC changes
- Counts and logs MAC address changes

### 3. **IP Address Change Handling**
- Tracks IP address changes during session
- Allows reconnection with different IP address
- Maintains session validity across IP changes
- Counts and logs IP address changes

### 4. **Disconnection Management**
- Records temporary disconnections without terminating session
- Auto-reconnect enabled by default
- Tracks disconnection count and timing
- Session remains valid during temporary disconnections

### 5. **Session Monitoring**
- Scheduled task runs every minute to monitor active sessions
- Scheduled task runs every 5 minutes to terminate expired sessions
- Updates last activity time for connected sessions
- Handles long disconnections gracefully

## Database Schema

### VoucherSession Entity
```sql
CREATE TABLE voucher_sessions (
    id BIGINT PRIMARY KEY,
    voucher_code VARCHAR(11) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    package_id BIGINT NOT NULL,
    package_duration_days INT NOT NULL,
    mac_address VARCHAR(17),
    ip_address VARCHAR(45),
    radius_username VARCHAR(64) NOT NULL,
    session_start_time DATETIME NOT NULL,
    session_end_time DATETIME,
    expires_at DATETIME NOT NULL,
    total_session_time_seconds BIGINT DEFAULT 0,
    last_activity_time DATETIME,
    last_mac_address VARCHAR(17),
    last_ip_address VARCHAR(45),
    mac_changes_count INT DEFAULT 0,
    ip_changes_count INT DEFAULT 0,
    session_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    is_connected BOOLEAN NOT NULL DEFAULT TRUE,
    disconnection_count INT DEFAULT 0,
    last_disconnection_time DATETIME,
    auto_reconnect_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

## API Endpoints

### 1. Activate Voucher and Create Session
```
POST /api/v1/customer-portal/voucher/{voucherCode}/activate
Body: {
    "phoneNumber": "255742844024",
    "macAddress": "00:11:22:33:44:55",
    "ipAddress": "192.168.1.100"
}
Response: {
    "status": "success",
    "message": "Voucher activated successfully",
    "sessionId": 123,
    "expiresAt": "2025-11-30T10:00:00",
    "remainingTimeSeconds": 604800
}
```

### 2. Get Session Status
```
GET /api/v1/customer-portal/voucher/{voucherCode}/session/status
Response: {
    "status": "success",
    "active": true,
    "connected": true,
    "expired": false,
    "remainingTimeSeconds": 604800,
    "elapsedTimeSeconds": 3600,
    "expiresAt": "2025-11-30T10:00:00",
    "sessionStatus": "ACTIVE",
    "macAddress": "00:11:22:33:44:55",
    "ipAddress": "192.168.1.100",
    "macChangesCount": 0,
    "ipChangesCount": 0
}
```

### 3. Update MAC Address
```
POST /api/v1/customer-portal/voucher/{voucherCode}/session/update-mac
Body: {
    "macAddress": "AA:BB:CC:DD:EE:FF"
}
Response: {
    "status": "success",
    "message": "MAC address updated successfully"
}
```

### 4. Update IP Address
```
POST /api/v1/customer-portal/voucher/{voucherCode}/session/update-ip
Body: {
    "ipAddress": "192.168.1.200"
}
Response: {
    "status": "success",
    "message": "IP address updated successfully"
}
```

### 5. Reconnect Session
```
POST /api/v1/customer-portal/voucher/{voucherCode}/session/reconnect
Body: {
    "macAddress": "00:11:22:33:44:55",
    "ipAddress": "192.168.1.100"
}
Response: {
    "status": "success",
    "message": "Session reconnected successfully"
}
```

## Session Status Types

- **ACTIVE**: Session is active and connected
- **PAUSED**: Session paused (temporary disconnection)
- **EXPIRED**: Session expired (duration reached)
- **TERMINATED**: Session manually terminated
- **SUSPENDED**: Session suspended (violation detected)
- **RECONNECTING**: Session reconnecting after disconnection

## Scheduled Tasks

### 1. Session Monitoring (Every 60 seconds)
- Checks all active sessions
- Updates last activity time for connected sessions
- Handles long disconnections (>5 minutes)
- Attempts to reconnect paused sessions

### 2. Expired Session Termination (Every 5 minutes)
- Finds all expired sessions
- Terminates expired sessions
- Removes RADIUS users
- Updates voucher status to EXPIRED

## Key Benefits

1. **Guaranteed Duration**: Users get the full duration they paid for
2. **No Premature Disconnections**: Sessions remain valid during temporary disconnections
3. **MAC Randomization Support**: Works with devices that randomize MAC addresses
4. **IP Change Support**: Handles dynamic IP assignments
5. **Automatic Reconnection**: Sessions automatically reconnect after temporary disconnections
6. **Comprehensive Tracking**: Full audit trail of session activity

## Integration Points

1. **Voucher Activation**: Creates session when voucher is activated
2. **RADIUS Integration**: Links session with RADIUS username
3. **Voucher Repository**: Updates voucher status based on session
4. **Customer Portal**: Provides session status to frontend

## Usage Flow

1. User activates voucher → Session created with exact expiration time
2. User connects to hotspot → Session marked as connected
3. MAC/IP changes → Session updated, remains valid
4. Temporary disconnection → Session paused, remains valid
5. Reconnection → Session reactivated automatically
6. Duration expires → Session terminated, RADIUS user removed

## Configuration

- **Auto-reconnect**: Enabled by default
- **Disconnection timeout**: 5 minutes before pausing
- **Monitoring interval**: 60 seconds
- **Expiration check**: 5 minutes

## Notes

- Sessions are independent of RADIUS accounting
- Multiple sessions can exist for same voucher (handled gracefully)
- Session expiration is based on exact package duration
- MAC/IP changes are logged but don't affect session validity

