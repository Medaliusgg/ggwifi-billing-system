# ============================================================================
# GGWIFI Enhanced MikroTik Configuration Script
# Multi-Location WiFi Hotspot Billing System
# ============================================================================
# This script configures MikroTik routers for GGWIFI hotspot billing
# Supports multiple locations with centralized RADIUS authentication
# ============================================================================

# ============================================================================
# VARIABLE CONFIGURATION (CUSTOMIZE FOR EACH LOCATION)
# ============================================================================

# Location-specific variables (modify these for each router)
:local locationName "Dar-es-Salaam-CBD"
:local radiusServerIP "192.168.1.100"
:local radiusSecret "GGWIFI2024!"
:local backendServerIP "192.168.1.100"

# Network Configuration (customize for each location)
:local hotspotNetwork "192.168.1.0/24"
:local hotspotGateway "192.168.1.1"
:local pppoeNetwork "192.168.10.0/24"
:local pppoeGateway "192.168.10.1"
:local wanNetwork "10.0.0.0/24"
:local wanGateway "10.0.0.1"

# Interface Configuration (adjust based on your router model)
:local wanInterface "ether1"
:local hotspotInterface "ether2"
:local pppoeInterface "ether3"

# ============================================================================
# RADIUS SERVER CONFIGURATION
# ============================================================================

# Remove existing RADIUS servers (cleanup)
/radius remove [find name~"GGWIFI"]

# Add RADIUS server for authentication
/radius add name="GGWIFI-Auth" address=$radiusServerIP secret=$radiusSecret service=hotspot,login,pppoe

# Add RADIUS server for accounting
/radius add name="GGWIFI-Acct" address=$radiusServerIP secret=$radiusSecret service=hotspot,login,pppoe

# ============================================================================
# HOTSPOT CONFIGURATION
# ============================================================================

# Remove existing hotspot configurations
/ip hotspot remove [find name~"GGWIFI"]
/ip hotspot profile remove [find name~"GGWIFI"]

# Configure hotspot server profile with RADIUS
/ip hotspot profile add name="GGWIFI-Hotspot-Profile" \
    hotspot-address=$hotspotNetwork \
    dns-name="connect.ggwifi.co.tz" \
    rate-limit="2M/1M" \
    session-timeout="12:00:00" \
    keepalive-timeout="5m" \
    login-timeout="5m" \
    idle-timeout="5m" \
    use-radius=yes \
    radius-accounting=yes \
    radius-interim-update="5m"

# Configure hotspot server
/ip hotspot server profile set GGWIFI-Hotspot-Profile \
    use-radius=yes \
    radius-accounting=yes \
    radius-interim-update="5m"

# Add hotspot user profile for RADIUS users
/ip hotspot user profile add name="GGWIFI-User-Profile" \
    rate-limit="2M/1M" \
    session-timeout="12:00:00" \
    keepalive-timeout="5m" \
    login-timeout="5m" \
    idle-timeout="5m"

# Configure hotspot interface
/ip hotspot add interface=$hotspotInterface profile=GGWIFI-Hotspot-Profile

# ============================================================================
# PPPoE SERVER CONFIGURATION
# ============================================================================

# Remove existing PPPoE configurations
/ppp profile remove [find name~"GGWIFI"]
/interface pppoe-server server remove [find service-name~"GGWIFI"]

# Configure PPPoE server with RADIUS
/ppp profile add name="GGWIFI-PPPoE-Profile" \
    local-address=$pppoeGateway \
    remote-address="192.168.10.2-192.168.10.254" \
    rate-limit="16M/8M" \
    session-timeout="0" \
    keepalive-timeout="10s" \
    login-timeout="10s" \
    idle-timeout="10m" \
    use-radius=yes \
    radius-accounting=yes

# Configure PPPoE server
/interface pppoe-server server add \
    service-name="GGWIFI-PPPoE" \
    authentication=pap,chap,mschap1,mschap2 \
    one-session-per-host=yes \
    max-sessions=100 \
    interface=$pppoeInterface

# ============================================================================
# NETWORK CONFIGURATION
# ============================================================================

# Remove existing IP addresses (cleanup)
/ip address remove [find comment~"GGWIFI"]

# Configure IP addresses
/ip address add address=$hotspotGateway/24 interface=$hotspotInterface comment="GGWIFI Hotspot Network"
/ip address add address=$pppoeGateway/24 interface=$pppoeInterface comment="GGWIFI PPPoE Network"
/ip address add address=$wanGateway/24 interface=$wanInterface comment="GGWIFI WAN Network"

# Configure NAT
/ip firewall nat remove [find comment~"GGWIFI"]
/ip firewall nat add chain=srcnat out-interface=$wanInterface action=masquerade comment="GGWIFI NAT for Internet Access"

# ============================================================================
# FIREWALL RULES FOR RADIUS AND SECURITY
# ============================================================================

# Remove existing GGWIFI firewall rules
/ip firewall filter remove [find comment~"GGWIFI"]

# Allow RADIUS authentication traffic
/ip firewall filter add chain=input \
    protocol=udp \
    dst-port=1812 \
    src-address=$radiusServerIP \
    action=accept \
    comment="GGWIFI RADIUS Authentication"

# Allow RADIUS accounting traffic
/ip firewall filter add chain=input \
    protocol=udp \
    dst-port=1813 \
    src-address=$radiusServerIP \
    action=accept \
    comment="GGWIFI RADIUS Accounting"

# Allow backend server communication
/ip firewall filter add chain=input \
    protocol=tcp \
    dst-port=8080,443,80 \
    src-address=$backendServerIP \
    action=accept \
    comment="GGWIFI Backend Communication"

# Block common attack ports
/ip firewall filter add chain=input \
    protocol=tcp \
    dst-port=23 \
    action=drop \
    comment="GGWIFI Block Telnet"

# Block SSH from WAN (only allow from management network)
/ip firewall filter add chain=input \
    protocol=tcp \
    dst-port=22 \
    src-address=!$hotspotNetwork,!127.0.0.1 \
    action=drop \
    comment="GGWIFI Block SSH from WAN"

# Allow hotspot users to access internet
/ip firewall filter add chain=forward \
    src-address=$hotspotNetwork \
    action=accept \
    comment="GGWIFI Allow Hotspot Internet Access"

# Allow PPPoE users to access internet
/ip firewall filter add chain=forward \
    src-address=$pppoeNetwork \
    action=accept \
    comment="GGWIFI Allow PPPoE Internet Access"

# ============================================================================
# DNS CONFIGURATION
# ============================================================================

# Configure DNS servers
/ip dns set servers=8.8.8.8,8.8.4.4,1.1.1.1

# Add DNS entries for GGWIFI services
/ip dns static remove [find name~"ggwifi"]
/ip dns static add name="admin.ggwifi.co.tz" address=$backendServerIP comment="GGWIFI Admin Portal"
/ip dns static add name="connect.ggwifi.co.tz" address=$backendServerIP comment="GGWIFI Customer Portal"
/ip dns static add name="www.ggwifi.co.tz" address=$backendServerIP comment="GGWIFI Website"

# ============================================================================
# BANDWIDTH MANAGEMENT (QOS)
# ============================================================================

# Remove existing GGWIFI queues
/queue simple remove [find name~"GGWIFI"]

# Create bandwidth profiles for different user types
/queue simple add name="GGWIFI-Hotspot-Basic" \
    target=$hotspotNetwork \
    max-limit="2M/1M" \
    comment="GGWIFI Basic Hotspot Users"

/queue simple add name="GGWIFI-Hotspot-Premium" \
    target=$hotspotNetwork \
    max-limit="5M/2M" \
    comment="GGWIFI Premium Hotspot Users"

/queue simple add name="GGWIFI-PPPoE-Basic" \
    target=$pppoeNetwork \
    max-limit="16M/8M" \
    comment="GGWIFI Basic PPPoE Users"

/queue simple add name="GGWIFI-PPPoE-Premium" \
    target=$pppoeNetwork \
    max-limit="32M/16M" \
    comment="GGWIFI Premium PPPoE Users"

# ============================================================================
# DHCP SERVER CONFIGURATION
# ============================================================================

# Remove existing GGWIFI DHCP servers
/ip dhcp-server remove [find name~"GGWIFI"]

# Configure DHCP server for hotspot network
/ip dhcp-server add \
    name="GGWIFI-Hotspot-DHCP" \
    interface=$hotspotInterface \
    address-pool="GGWIFI-Hotspot-Pool" \
    lease-time="1h" \
    comment="GGWIFI Hotspot DHCP"

# Configure DHCP server for PPPoE network
/ip dhcp-server add \
    name="GGWIFI-PPPoE-DHCP" \
    interface=$pppoeInterface \
    address-pool="GGWIFI-PPPoE-Pool" \
    lease-time="12h" \
    comment="GGWIFI PPPoE DHCP"

# Create address pools
/ip pool remove [find name~"GGWIFI"]
/ip pool add name="GGWIFI-Hotspot-Pool" ranges="192.168.1.100-192.168.1.200" comment="GGWIFI Hotspot Pool"
/ip pool add name="GGWIFI-PPPoE-Pool" ranges="192.168.10.100-192.168.10.200" comment="GGWIFI PPPoE Pool"

# ============================================================================
# MONITORING AND ALERTS
# ============================================================================

# Remove existing GGWIFI scripts
/system script remove [find name~"GGWIFI"]

# Create RADIUS monitoring script
/system script add name="GGWIFI-Monitor-RADIUS" source={
    :local radiusStatus [/radius monitor GGWIFI-Auth]
    :local radiusAcctStatus [/radius monitor GGWIFI-Acct]
    
    :if ($radiusStatus = "timeout") do={
        :log error "GGWIFI RADIUS Auth Server is not responding"
    }
    
    :if ($radiusAcctStatus = "timeout") do={
        :log error "GGWIFI RADIUS Acct Server is not responding"
    }
    
    :if ($radiusStatus = "ok" && $radiusAcctStatus = "ok") do={
        :log info "GGWIFI RADIUS servers are operational"
    }
}

# Create system health monitoring script
/system script add name="GGWIFI-Monitor-Health" source={
    :local cpuLoad [/system resource get cpu-load]
    :local freeMemory [/system resource get free-memory]
    :local totalMemory [/system resource get total-memory]
    :local memoryUsage (($totalMemory - $freeMemory) * 100 / $totalMemory)
    
    :if ($cpuLoad > 80) do={
        :log warning "GGWIFI Router CPU usage is high: $cpuLoad%"
    }
    
    :if ($memoryUsage > 90) do={
        :log warning "GGWIFI Router memory usage is high: $memoryUsage%"
    }
    
    :log info "GGWIFI Router Health - CPU: $cpuLoad%, Memory: $memoryUsage%"
}

# Create backup script
/system script add name="GGWIFI-Backup-Config" source={
    :local backupName ("GGWIFI-" . $locationName . "-" . [/system clock get date] . "-" . [/system clock get time])
    /system backup save name=$backupName
    :log info "GGWIFI configuration backed up: $backupName"
}

# Create session cleanup script
/system script add name="GGWIFI-Cleanup-Sessions" source={
    :local activeSessions [/ip hotspot active print count-only]
    :log info "GGWIFI Active sessions: $activeSessions"
    
    # Remove sessions older than 24 hours
    :local cutoffTime ([/system clock get time] - 86400)
    /ip hotspot active remove [find uptime < $cutoffTime]
}

# ============================================================================
# SCHEDULER CONFIGURATION
# ============================================================================

# Remove existing GGWIFI schedulers
/scheduler remove [find name~"GGWIFI"]

# Schedule RADIUS monitoring (every 5 minutes)
/scheduler add name="GGWIFI-RADIUS-Monitor" \
    interval=5m \
    on-event="/system script run GGWIFI-Monitor-RADIUS" \
    comment="GGWIFI RADIUS Monitoring"

# Schedule health monitoring (every 10 minutes)
/scheduler add name="GGWIFI-Health-Monitor" \
    interval=10m \
    on-event="/system script run GGWIFI-Monitor-Health" \
    comment="GGWIFI Health Monitoring"

# Schedule daily backup (at 2 AM)
/scheduler add name="GGWIFI-Daily-Backup" \
    interval=1d \
    start-time=02:00:00 \
    on-event="/system script run GGWIFI-Backup-Config" \
    comment="GGWIFI Daily Backup"

# Schedule session cleanup (every 6 hours)
/scheduler add name="GGWIFI-Session-Cleanup" \
    interval=6h \
    on-event="/system script run GGWIFI-Cleanup-Sessions" \
    comment="GGWIFI Session Cleanup"

# ============================================================================
# SECURITY CONFIGURATION
# ============================================================================

# Secure SSH access (only from management network)
/ip service set ssh \
    address=$hotspotNetwork,127.0.0.1 \
    port=22

# Secure Winbox access (only from management network)
/ip service set winbox \
    address=$hotspotNetwork,127.0.0.1 \
    port=8291

# Secure HTTP access (only from management network)
/ip service set www \
    address=$hotspotNetwork,127.0.0.1 \
    port=80

# Secure HTTPS access (only from management network)
/ip service set www-ssl \
    address=$hotspotNetwork,127.0.0.1 \
    port=443

# ============================================================================
# USER MANAGEMENT
# ============================================================================

# Create local admin user (backup access)
/user remove [find name="ggnetworks-admin"]
/user add name="ggnetworks-admin" \
    password="GGWIFI2024!" \
    group=full \
    comment="GGWIFI Local Admin"

# Create hotspot user for testing
/ip hotspot user remove [find name="ggnetworks-test"]
/ip hotspot user add name="ggnetworks-test" \
    password="test123" \
    profile="GGWIFI-User-Profile" \
    comment="GGWIFI Test User"

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

# Enable logging for GGWIFI events
/system logging remove [find topics~"radius,hotspot,pppoe"]
/system logging add topics=radius,hotspot,pppoe action=memory
/system logging add topics=info,debug action=memory
/system logging add topics=warning,error action=memory

# ============================================================================
# FINAL CONFIGURATION
# ============================================================================

# Enable all services
/ip service enable ssh
/ip service enable winbox
/ip service enable www
/ip service enable www-ssl

# Save configuration
/system backup save name="GGWIFI-Initial-Setup-$locationName"

# Display configuration summary
:put "============================================================================"
:put "GGWIFI MikroTik Configuration Complete"
:put "============================================================================"
:put "Location: $locationName"
:put "Router: [/system identity get name]"
:put "RADIUS Server: $radiusServerIP"
:put "Backend Server: $backendServerIP"
:put "Hotspot Network: $hotspotNetwork"
:put "PPPoE Network: $pppoeNetwork"
:put "WAN Network: $wanNetwork"
:put "Hotspot Gateway: $hotspotGateway"
:put "Hotspot URL: http://$hotspotGateway"
:put "Admin Access: http://$hotspotGateway"
:put "Backup saved as: GGWIFI-Initial-Setup-$locationName"
:put "============================================================================"
:put "Configuration completed successfully!"
:put "Please test RADIUS connectivity and hotspot functionality."
:put "============================================================================"

# Test RADIUS connectivity
:put "Testing RADIUS connectivity..."
:local radiusTest [/radius monitor GGWIFI-Auth]
:put "RADIUS Auth Status: $radiusTest"

:local radiusAcctTest [/radius monitor GGWIFI-Acct]
:put "RADIUS Acct Status: $radiusAcctTest"

:if ($radiusTest = "ok" && $radiusAcctTest = "ok") do={
    :put "✓ RADIUS servers are responding correctly"
} else={
    :put "✗ RADIUS servers are not responding - please check connectivity"
}

# Display system resources
:put "System Resources:"
:put "CPU Load: [/system resource get cpu-load]%"
:put "Free Memory: [/system resource get free-memory] bytes"
:put "Total Memory: [/system resource get total-memory] bytes"
:put "Uptime: [/system resource get uptime]"

:put "============================================================================"
:put "GGWIFI Router Configuration Complete!"
:put "============================================================================"
