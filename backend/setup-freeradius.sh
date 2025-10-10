#!/bin/bash

# FreeRADIUS Setup Script for GGNetworks
# This script installs and configures FreeRADIUS for GGNetworks integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

print_status "Starting FreeRADIUS setup for GGNetworks..."

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install FreeRADIUS and dependencies
print_status "Installing FreeRADIUS and dependencies..."
apt install -y freeradius freeradius-mysql freeradius-utils mysql-client

# Create backup of original configuration
print_status "Creating backup of original FreeRADIUS configuration..."
cp -r /etc/freeradius/3.0 /etc/freeradius/3.0.backup.$(date +%Y%m%d_%H%M%S)

# Configure SQL module
print_status "Configuring SQL module..."
cat > /etc/freeradius/3.0/mods-available/sql << 'EOF'
sql {
    driver = "mysql"
    server = "localhost"
    login = "freeradius"
    password = "freeradius_password"
    radius_db = "radius"
    
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
EOF

# Enable SQL module
print_status "Enabling SQL module..."
ln -sf /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/

# Configure default site
print_status "Configuring default site..."
cat > /etc/freeradius/3.0/sites-enabled/default << 'EOF'
server default {
    listen {
        type = auth
        ipaddr = *
        port = 0
        limit {
            max_connections = 16
            lifetime = 0
            idle_timeout = 30
        }
    }

    authorize {
        preprocess
        chap
        mschap
        digest
        eap
        sql
        pap
    }

    authenticate {
        Auth-Type LDAP {
            ldap
        }
        Auth-Type PAP {
            pap
        }
        Auth-Type CHAP {
            chap
        }
        Auth-Type MS-CHAP {
            mschap
        }
        Auth-Type EAP {
            eap
        }
    }

    preacct {
        preprocess
        acct_unique
        suffix
    }

    accounting {
        detail
        unix
        sql
        exec
        attr_filter.accounting_response
    }

    session {
        sql
    }

    post-auth {
        update {
            &reply: += &session-state:
        }
        -sql
        exec
        remove_reply_message_if_eap
        Post-Auth-Type REJECT {
            attr_filter.access_reject
            eap
        }
    }
}
EOF

# Configure clients
print_status "Configuring RADIUS clients..."
cat > /etc/freeradius/3.0/clients.conf << 'EOF'
client localhost {
    ipaddr = 127.0.0.1
    secret = testing123
    shortname = localhost
}

client mikrotik_main {
    ipaddr = 192.168.1.1
    secret = testing123
    shortname = MainRouter
}

client mikrotik_branch {
    ipaddr = 192.168.2.1
    secret = testing123
    shortname = BranchRouter
}

client ggnetworks_backend {
    ipaddr = 127.0.0.1
    secret = testing123
    shortname = GGNetworksBackend
}
EOF

# Configure logging
print_status "Configuring logging..."
cat > /etc/freeradius/3.0/radiusd.conf << 'EOF'
prefix = /usr
exec_prefix = /usr
sysconfdir = /etc
localstatedir = /var
sbindir = ${exec_prefix}/sbin
logdir = /var/log/freeradius
raddbdir = /etc/freeradius/3.0
radacctdir = ${logdir}/radacct

name = freeradius
confdir = ${raddbdir}
modconfdir = ${confdir}/mods-config
certdir = ${confdir}/certs
cadir   = ${confdir}/certs
run_dir = ${localstatedir}/run/${name}

db_dir = ${raddbdir}

libdir = /usr/lib/freeradius

pidfile = ${run_dir}/${name}.pid

correct_escapes = true

max_request_time = 30

hostname_lookups = no

allow_core_dumps = no

regular_expressions = yes
extended_expressions = yes

log {
    destination = files
    file = ${logdir}/radius.log
    syslog_facility = daemon
    stripped_names = no
    auth = yes
    auth_badpass = no
    auth_goodpass = no
    msg_denied = "You are already logged in - access denied"
}

checkrad = ${sbindir}/checkrad

security {
    max_attributes = 200
    reject_delay = 1
    status_server = yes
    allow_core_dumps = no
}

proxy_requests = yes

$INCLUDE clients.conf

thread pool {
    start_servers = 5
    max_servers = 32
    min_spare_servers = 3
    max_spare_servers = 10
    max_requests_per_server = 0
}

modules {
    $INCLUDE ${confdir}/mods-enabled/
}

instantiate {
    exec
    expr
    expiration
    logintime
    pap
}

$INCLUDE policy.conf

$INCLUDE sites-enabled/
EOF

# Set proper permissions
print_status "Setting proper permissions..."
chown -R freerad:freerad /etc/freeradius/3.0
chmod -R 640 /etc/freeradius/3.0
chmod 750 /etc/freeradius/3.0

# Create log directory with proper permissions
mkdir -p /var/log/freeradius
chown freerad:freerad /var/log/freeradius
chmod 755 /var/log/freeradius

# Test configuration
print_status "Testing FreeRADIUS configuration..."
if freeradius -C; then
    print_success "FreeRADIUS configuration is valid"
else
    print_error "FreeRADIUS configuration has errors"
    exit 1
fi

# Start and enable FreeRADIUS service
print_status "Starting FreeRADIUS service..."
systemctl start freeradius
systemctl enable freeradius

# Check service status
if systemctl is-active --quiet freeradius; then
    print_success "FreeRADIUS service is running"
else
    print_error "FreeRADIUS service failed to start"
    systemctl status freeradius
    exit 1
fi

# Create test script
print_status "Creating test script..."
cat > /usr/local/bin/test-radius.sh << 'EOF'
#!/bin/bash

# Test FreeRADIUS authentication
echo "Testing FreeRADIUS authentication..."

# Test hotspot voucher
echo "Testing hotspot voucher authentication..."
radtest voucher_GG12345678 GG12345678 localhost 0 testing123

# Test PPPoE user
echo "Testing PPPoE user authentication..."
radtest 0712345678 5678ABCD localhost 0 testing123

# Check active sessions
echo "Checking active sessions..."
mysql -u freeradius -pfreeradius_password radius -e "SELECT username, acctsessionid, acctstarttime FROM radacct WHERE acctstoptime IS NULL;"

echo "Test completed!"
EOF

chmod +x /usr/local/bin/test-radius.sh

# Create monitoring script
print_status "Creating monitoring script..."
cat > /usr/local/bin/monitor-radius.sh << 'EOF'
#!/bin/bash

# Monitor FreeRADIUS activity
echo "=== FreeRADIUS Status ==="
systemctl status freeradius --no-pager -l

echo -e "\n=== Active Sessions ==="
mysql -u freeradius -pfreeradius_password radius -e "SELECT username, acctsessionid, acctstarttime, acctsessiontime, acctinputoctets, acctoutputoctets FROM radacct WHERE acctstoptime IS NULL;" 2>/dev/null || echo "No active sessions or database connection failed"

echo -e "\n=== Recent Authentication Logs ==="
tail -n 20 /var/log/freeradius/radius.log | grep -E "(Login OK|Login incorrect)"

echo -e "\n=== FreeRADIUS Process Info ==="
ps aux | grep freeradius | grep -v grep
EOF

chmod +x /usr/local/bin/monitor-radius.sh

# Create firewall rules
print_status "Configuring firewall rules..."
if command -v ufw &> /dev/null; then
    ufw allow 1812/udp comment "RADIUS Authentication"
    ufw allow 1813/udp comment "RADIUS Accounting"
    print_success "Firewall rules configured"
else
    print_warning "UFW not found, please configure firewall manually"
fi

# Create systemd service for monitoring
print_status "Creating monitoring service..."
cat > /etc/systemd/system/radius-monitor.service << 'EOF'
[Unit]
Description=FreeRADIUS Monitoring Service
After=freeradius.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/monitor-radius.sh
User=root

[Install]
WantedBy=multi-user.target
EOF

# Create cron job for regular monitoring
print_status "Setting up monitoring cron job..."
echo "*/5 * * * * root /usr/local/bin/monitor-radius.sh >> /var/log/freeradius/monitor.log 2>&1" > /etc/cron.d/radius-monitor

# Final status check
print_status "Performing final status check..."
sleep 5

if systemctl is-active --quiet freeradius; then
    print_success "FreeRADIUS setup completed successfully!"
    echo ""
    echo "=== Setup Summary ==="
    echo "FreeRADIUS Service: $(systemctl is-active freeradius)"
    echo "Configuration: /etc/freeradius/3.0/"
    echo "Logs: /var/log/freeradius/"
    echo "Test Script: /usr/local/bin/test-radius.sh"
    echo "Monitor Script: /usr/local/bin/monitor-radius.sh"
    echo ""
    echo "=== Next Steps ==="
    echo "1. Import the SQL configuration: mysql -u root -p < /path/to/freeradius-sql-config.sql"
    echo "2. Test authentication: /usr/local/bin/test-radius.sh"
    echo "3. Monitor activity: /usr/local/bin/monitor-radius.sh"
    echo "4. Configure MikroTik routers to use this RADIUS server"
    echo "5. Test backend integration with GGNetworks API"
else
    print_error "FreeRADIUS setup failed. Check logs for details."
    systemctl status freeradius --no-pager -l
    exit 1
fi
