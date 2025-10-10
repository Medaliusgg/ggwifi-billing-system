# MikroTik RouterOS Configuration for GGWIFI RADIUS Integration
# This script configures MikroTik routers to use FreeRADIUS for authentication

# ============================================================================
# RADIUS SERVER CONFIGURATION
# ============================================================================

# Add RADIUS server for authentication
/radius add name="GGWIFI-RADIUS" address=192.168.1.100 secret=testing123 service=hotspot,login,pppoe

# Add RADIUS server for accounting
/radius add name="GGWIFI-RADIUS-Acct" address=192.168.1.100 secret=testing123 service=hotspot,login,pppoe

# ============================================================================
# HOTSPOT CONFIGURATION
# ============================================================================

# Configure hotspot server profile with RADIUS
/ip hotspot profile add name="GGWIFI-Hotspot" hotspot-address=192.168.1.1/24 dns-name=hotspot.ggwifi.co.tz rate-limit=2M/1M session-timeout=12:00:00 keepalive-timeout=5m login-timeout=5m idle-timeout=5m

# Configure hotspot server
/ip hotspot server profile set GGWIFI-Hotspot use-radius=yes radius-accounting=yes radius-interim-update=5m

# Add RADIUS login method
/ip hotspot user profile add name="RADIUS-User" rate-limit=2M/1M session-timeout=12:00:00 keepalive-timeout=5m login-timeout=5m idle-timeout=5m

# Configure hotspot interface
/ip hotspot add interface=ether2 profile=GGWIFI-Hotspot

# ============================================================================
# PPPoE SERVER CONFIGURATION
# ============================================================================

# Configure PPPoE server with RADIUS
/ppp profile add name="GGWIFI-PPPoE" local-address=192.168.10.1 remote-address=192.168.10.2-192.168.10.254 rate-limit=16M/8M session-timeout=0 keepalive-timeout=10s login-timeout=10s idle-timeout=10m

# Enable RADIUS for PPPoE
/ppp profile set GGWIFI-PPPoE use-radius=yes radius-accounting=yes

# Configure PPPoE server
/interface pppoe-server server add service-name=GGWIFI authentication=pap,chap,mschap1,mschap2 one-session-per-host=yes max-sessions=100

# ============================================================================
# FIREWALL RULES FOR RADIUS
# ============================================================================

# Allow RADIUS authentication traffic
/ip firewall filter add chain=input protocol=udp dst-port=1812 src-address=192.168.1.100 action=accept comment="RADIUS Authentication"

# Allow RADIUS accounting traffic
/ip firewall filter add chain=input protocol=udp dst-port=1813 src-address=192.168.1.100 action=accept comment="RADIUS Accounting"

# Allow RADIUS from backend server
/ip firewall filter add chain=input protocol=udp dst-port=1812 src-address=127.0.0.1 action=accept comment="RADIUS from Backend"

# ============================================================================
# DNS CONFIGURATION
# ============================================================================

# Configure DNS for hotspot users
/ip dns set servers=8.8.8.8,8.8.4.4

# Add DNS entries for GGWIFI services
/ip dns static add name=admin.ggwifi.co.tz address=192.168.1.100
/ip dns static add name=connect.ggwifi.co.tz address=192.168.1.100
/ip dns static add name=www.ggwifi.co.tz address=192.168.1.100

# ============================================================================
# BANDWIDTH MANAGEMENT
# ============================================================================

# Create bandwidth profiles for different user types
/queue simple add name="GGWIFI-Hotspot-Basic" target=192.168.1.0/24 max-limit=2M/1M
/queue simple add name="GGWIFI-PPPoE-Basic" target=192.168.10.0/24 max-limit=16M/8M
/queue simple add name="GGWIFI-PPPoE-Premium" target=192.168.10.0/24 max-limit=32M/16M

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

# Enable logging for RADIUS events
/system logging add topics=radius,hotspot,pppoe
/system logging add topics=info,debug

# ============================================================================
# SCHEDULER FOR MAINTENANCE
# ============================================================================

# Create scheduler for regular maintenance
/scheduler add name="Radius-Maintenance" interval=1d on-event="/radius monitor GGWIFI-RADIUS"

# ============================================================================
# USER MANAGEMENT
# ============================================================================

# Create local admin user (backup)
/user add name=ggwifi-admin password=admin123 group=full

# Create hotspot user for testing
/ip hotspot user add profile=RADIUS-User username=ggwifi-test password=test123

# ============================================================================
# NETWORK CONFIGURATION
# ============================================================================

# Configure IP addresses
/ip address add address=192.168.1.1/24 interface=ether2 comment="Hotspot Network"
/ip address add address=192.168.10.1/24 interface=ether3 comment="PPPoE Network"
/ip address add address=10.0.0.1/24 interface=ether1 comment="WAN Network"

# Configure NAT
/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade comment="NAT for Internet Access"

# ============================================================================
# DHCP SERVER CONFIGURATION
# ============================================================================

# Configure DHCP server for hotspot network
/ip dhcp-server setup interface=ether2 name=GGWIFI-Hotspot-DHCP

# Configure DHCP server for PPPoE network
/ip dhcp-server setup interface=ether3 name=GGWIFI-PPPoE-DHCP

# ============================================================================
# MONITORING AND ALERTS
# ============================================================================

# Create email alerts for RADIUS issues
/tool e-mail set address=smtp.gmail.com from=alerts@ggwifi.co.tz user=alerts@ggwifi.co.tz password=your_password start-tls=yes

# Create script for monitoring
/system script add name="Monitor-RADIUS" source={
    :local radiusStatus [/radius monitor GGWIFI-RADIUS]
    :if ($radiusStatus = "timeout") do={
        /tool e-mail send to=admin@ggwifi.co.tz subject="RADIUS Server Down" body="RADIUS server is not responding"
    }
}

# Schedule monitoring script
/scheduler add name="Radius-Monitor" interval=5m on-event="/system script run Monitor-RADIUS"

# ============================================================================
# BACKUP CONFIGURATION
# ============================================================================

# Create backup script
/system script add name="Backup-Config" source={
    /export file=GGWIFI-Backup
    /tool e-mail send to=admin@ggwifi.co.tz subject="Router Backup" body="Daily backup completed"
}

# Schedule daily backup
/scheduler add name="Daily-Backup" interval=1d on-event="/system script run Backup-Config"

# ============================================================================
# SECURITY CONFIGURATION
# ============================================================================

# Secure SSH access
/ip service set ssh address=192.168.1.0/24,127.0.0.1

# Secure Winbox access
/ip service set winbox address=192.168.1.0/24,127.0.0.1

# Block common attack ports
/ip firewall filter add chain=input protocol=tcp dst-port=23 action=drop comment="Block Telnet"
/ip firewall filter add chain=input protocol=tcp dst-port=22 src-address=!192.168.1.0/24 action=drop comment="Block SSH from WAN"

# ============================================================================
# QUALITY OF SERVICE (QOS)
# ============================================================================

# Create QoS rules for different traffic types
/queue simple add name="VoIP-Traffic" target=192.168.1.0/24 max-limit=1M/512k priority=1
/queue simple add name="Video-Traffic" target=192.168.1.0/24 max-limit=4M/2M priority=2
/queue simple add name="Web-Traffic" target=192.168.1.0/24 max-limit=2M/1M priority=3

# ============================================================================
# FINAL CONFIGURATION
# ============================================================================

# Enable all services
/ip service enable ssh
/ip service enable winbox
/ip service enable www

# Save configuration
/system backup save name=GGWIFI-Initial-Setup

# Display configuration summary
:put "=== GGWIFI MikroTik Configuration Complete ==="
:put "RADIUS Server: 192.168.1.100"
:put "Hotspot Network: 192.168.1.0/24"
:put "PPPoE Network: 192.168.10.0/24"
:put "WAN Network: 10.0.0.0/24"
:put "Admin Access: 192.168.1.1"
:put "Hotspot URL: http://192.168.1.1"
:put "Backup saved as: GGWIFI-Initial-Setup"
