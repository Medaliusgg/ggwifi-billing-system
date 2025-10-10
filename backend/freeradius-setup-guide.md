# FreeRADIUS Setup Guide for GGNetworks

## Prerequisites
- Ubuntu 20.04+ server
- MySQL 8.0+ installed
- GGNetworks backend running
- MikroTik routers configured

## Step 1: Install FreeRADIUS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install FreeRADIUS and MySQL modules
sudo apt install freeradius freeradius-mysql freeradius-utils -y

# Start and enable FreeRADIUS
sudo systemctl start freeradius
sudo systemctl enable freeradius
```

## Step 2: Configure FreeRADIUS Database

```bash
# Access MySQL as root
sudo mysql -u root -p

# Create FreeRADIUS database (if not exists)
CREATE DATABASE IF NOT EXISTS ggnetworks;
USE ggnetworks;

# Grant permissions to FreeRADIUS user
CREATE USER 'freeradius'@'localhost' IDENTIFIED BY 'freeradius_password';
GRANT ALL PRIVILEGES ON ggnetworks.* TO 'freeradius'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Configure FreeRADIUS SQL Module

```bash
# Edit SQL configuration
sudo nano /etc/freeradius/3.0/mods-available/sql
```

Add the following configuration:

```sql
sql {
    driver = "mysql"
    server = "localhost"
    login = "freeradius"
    password = "freeradius_password"
    radius_db = "ggnetworks"
    
    # Connection info
    acct_table1 = "radacct"
    acct_table2 = "radacct"
    
    # Authentication
    postauth_table = "radpostauth"
    
    # Authorization
    authcheck_table = "radcheck"
    authreply_table = "radreply"
    
    # Group management
    groupcheck_table = "radgroupcheck"
    groupreply_table = "radgroupreply"
    usergroup_table = "radusergroup"
    
    # Remove stale session if checkrad does not see a double login
    delete_stale_sessions = yes
    
    # Print all SQL statements when in debug mode (-x)
    sqltrace = yes
    sqltracefile = ${logdir}/sqltrace.sql
    
    # number of sql connections to make to server
    num_sql_socks = 5
    
    # lifetime of an "idle" DB connection, in seconds, 0 to disable
    connect_timeout = 60
    
    # lifetime of an "active" DB connection, in seconds, 0 to disable
    lifetime = 0
    
    # maximum number of uses of an "active" DB connection, 0 to disable
    max_queries = 0
    
    # remove stale session if checkrad does not see a double login
    remove_stale_sessions = yes
}
```

## Step 4: Enable SQL Module

```bash
# Enable SQL module
sudo ln -s /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/

# Edit default site configuration
sudo nano /etc/freeradius/3.0/sites-enabled/default
```

Add `sql` to the following sections:
- `authorize` section
- `accounting` section  
- `post-auth` section

## Step 5: Configure Clients

```bash
# Edit clients configuration
sudo nano /etc/freeradius/3.0/clients.conf
```

Add your MikroTik routers:

```
client mikrotik_router1 {
    ipaddr = 192.168.1.1
    secret = testing123
    shortname = Router1
}

client mikrotik_router2 {
    ipaddr = 192.168.1.2
    secret = testing123
    shortname = Router2
}
```

## Step 6: Test Configuration

```bash
# Test configuration
sudo freeradius -X

# In another terminal, test authentication
radtest voucher_GG12345678 GG12345678 localhost 0 testing123

# Test PPPoE authentication
radtest 0712345678 5678ABCD localhost 0 testing123
```

## Step 7: Configure MikroTik Router

### For Hotspot:
1. Go to IP → Hotspot → Server Profiles
2. Create new profile with RADIUS authentication
3. Set RADIUS server IP and secret
4. Enable RADIUS accounting

### For PPPoE:
1. Go to PPP → PPPoE Server → Settings
2. Enable RADIUS authentication
3. Set RADIUS server IP and secret
4. Enable RADIUS accounting

## Step 8: Monitor Integration

```bash
# Monitor FreeRADIUS logs
sudo tail -f /var/log/freeradius/radius.log

# Check database entries
mysql -u root -p ggnetworks -e "SELECT * FROM radcheck LIMIT 10;"
mysql -u root -p ggnetworks -e "SELECT * FROM radacct ORDER BY acctstarttime DESC LIMIT 10;"
```

## Step 9: Backend Integration Test

Use the GGNetworks backend API endpoints:

```bash
# Test FreeRADIUS integration status
curl -X GET "http://localhost:8080/api/v1/radius/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test voucher generation
curl -X POST "http://localhost:8080/api/v1/vouchers/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"packageId": 1, "assignedTo": "test@example.com"}'

# Test authentication
curl -X POST "http://localhost:8080/api/v1/radius/test-auth" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"username": "voucher_GG12345678", "password": "GG12345678"}'
```

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials
   - Check firewall settings

2. **Authentication Failed**
   - Verify client configuration
   - Check RADIUS secret matches
   - Review FreeRADIUS logs

3. **No Accounting Data**
   - Enable RADIUS accounting on MikroTik
   - Check radacct table permissions
   - Verify accounting port configuration

### Debug Commands:

```bash
# Test database connection
mysql -u freeradius -p ggnetworks -e "SELECT COUNT(*) FROM radcheck;"

# Check FreeRADIUS configuration
sudo freeradius -C

# Monitor real-time authentication
sudo freeradius -X -f

# Check service status
sudo systemctl status freeradius
```

## Security Considerations

1. **Change Default Secrets**
   - Update `testing123` to a strong secret
   - Use different secrets for each router
   - Rotate secrets regularly

2. **Network Security**
   - Restrict RADIUS access to trusted networks
   - Use VPN for remote router management
   - Monitor authentication attempts

3. **Database Security**
   - Use strong MySQL passwords
   - Limit database user permissions
   - Enable SSL connections

## Performance Optimization

1. **Database Optimization**
   - Add indexes on frequently queried columns
   - Archive old accounting data
   - Monitor query performance

2. **FreeRADIUS Optimization**
   - Adjust connection pool size
   - Configure appropriate timeouts
   - Monitor resource usage

3. **Network Optimization**
   - Use dedicated RADIUS VLAN
   - Configure appropriate bandwidth limits
   - Monitor network latency
