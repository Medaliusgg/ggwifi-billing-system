# WireGuard MikroTik Router Configuration Script
# This script configures WireGuard on MikroTik routers for encrypted communication

# ============================================================================
# WIREGUARD CONFIGURATION FOR MIKROTIK ROUTERS
# ============================================================================
# This script sets up WireGuard VPN on MikroTik routers to communicate
# securely with the GGWIFI backend server
# ============================================================================

# ============================================================================
# VARIABLE CONFIGURATION (CUSTOMIZE FOR EACH ROUTER)
# ============================================================================

# Router-specific variables (modify these for each router)
:local routerNumber "1"  # Unique number for this router (1, 2, 3, etc.)
:local serverPublicKey "YOUR_SERVER_PUBLIC_KEY_HERE"  # Replace with actual server public key
:local serverEndpoint "YOUR_VPS_IP:51820"  # Replace with your VPS IP and WireGuard port
:local routerPrivateKey "YOUR_ROUTER_PRIVATE_KEY_HERE"  # Replace with router's private key

# WireGuard network configuration
:local wgNetwork "10.0.0.0/24"
:local wgRouterIP "10.0.0." . $routerNumber . "/24"
:local wgInterface "wg1"

# ============================================================================
# WIREGUARD INTERFACE CONFIGURATION
# ============================================================================

# Remove existing WireGuard interface if it exists
/interface wireguard remove [find name=$wgInterface]

# Create WireGuard interface
/interface wireguard add name=$wgInterface listen-port=0 private-key=$routerPrivateKey

# Configure WireGuard interface IP
/ip address add address=$wgRouterIP interface=$wgInterface comment="GGWIFI WireGuard VPN"

# ============================================================================
# WIREGUARD PEER CONFIGURATION
# ============================================================================

# Add server as peer
/interface wireguard peers add interface=$wgInterface public-key=$serverPublicKey endpoint-address=$serverEndpoint allowed-address=$wgNetwork persistent-keepalive=25s comment="GGWIFI Backend Server"

# ============================================================================
# FIREWALL RULES FOR WIREGUARD
# ============================================================================

# Remove existing WireGuard firewall rules
/ip firewall filter remove [find comment~"GGWIFI-WireGuard"]

# Allow WireGuard traffic
/ip firewall filter add chain=input protocol=udp dst-port=51820 action=accept comment="GGWIFI-WireGuard Allow WireGuard Traffic"

# Allow traffic from WireGuard network to RADIUS server
/ip firewall filter add chain=input src-address=$wgNetwork dst-port=1812,1813 action=accept comment="GGWIFI-WireGuard Allow RADIUS from VPN"

# Allow traffic from WireGuard network to backend API
/ip firewall filter add chain=input src-address=$wgNetwork dst-port=8080,443,80 action=accept comment="GGWIFI-WireGuard Allow API from VPN"

# Allow traffic from WireGuard network to internet
/ip firewall filter add chain=forward src-address=$wgNetwork action=accept comment="GGWIFI-WireGuard Allow Internet from VPN"

# ============================================================================
# ROUTING CONFIGURATION
# ============================================================================

# Add route to backend server through WireGuard
/ip route add dst-address=YOUR_VPS_IP/32 gateway=$wgInterface comment="GGWIFI-WireGuard Route to Backend"

# ============================================================================
# DNS CONFIGURATION FOR WIREGUARD
# ============================================================================

# Configure DNS for WireGuard interface
/ip dns static add name="backend.ggwifi.local" address=10.0.0.1 comment="GGWIFI-WireGuard Backend DNS"

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

# Enable logging for WireGuard events
/system logging add topics=wireguard action=memory comment="GGWIFI-WireGuard Logging"

# ============================================================================
# MONITORING CONFIGURATION
# ============================================================================

# Create monitoring script for WireGuard status
/system script add name="ggwifi-wireguard-monitor" source={
    :local wgStatus [/interface wireguard get $wgInterface running]
    :if ($wgStatus = true) do={
        :log info "GGWIFI-WireGuard: Interface $wgInterface is running"
    } else={
        :log warning "GGWIFI-WireGuard: Interface $wgInterface is not running"
    }
}

# Schedule monitoring script to run every 5 minutes
/system scheduler add name="ggwifi-wireguard-monitor-schedule" interval=5m on-event="ggwifi-wireguard-monitor" comment="GGWIFI-WireGuard Monitoring"

# ============================================================================
# BACKUP CONFIGURATION
# ============================================================================

# Create backup script for WireGuard configuration
/system script add name="ggwifi-wireguard-backup" source={
    :log info "GGWIFI-WireGuard: Creating configuration backup"
    /system backup save name="ggwifi-wireguard-backup"
}

# Schedule backup to run daily at 2 AM
/system scheduler add name="ggwifi-wireguard-backup-schedule" interval=1d start-time=02:00:00 on-event="ggwifi-wireguard-backup" comment="GGWIFI-WireGuard Daily Backup"

# ============================================================================
# COMPLETION MESSAGE
# ============================================================================

:log info "GGWIFI-WireGuard: Configuration completed for router $routerNumber"
:log info "GGWIFI-WireGuard: Interface $wgInterface created with IP $wgRouterIP"
:log info "GGWIFI-WireGuard: Connected to server at $serverEndpoint"
