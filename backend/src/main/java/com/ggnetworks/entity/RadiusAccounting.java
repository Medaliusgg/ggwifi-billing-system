package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing FreeRADIUS accounting entries in radacct table
 * This entity tracks session data, usage statistics, and billing information
 */
@Entity
@Table(name = "radacct", catalog = "radius")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RadiusAccounting extends BaseEntity {
    
    @Column(name = "acctsessionid", length = 64)
    private String acctSessionId;
    
    @Column(name = "acctuniqueid", length = 32)
    private String acctUniqueId;
    
    @Column(name = "username", length = 64)
    private String username;
    
    @Column(name = "groupname", length = 64)
    private String groupName;
    
    @Column(name = "realm", length = 64)
    private String realm;
    
    @Column(name = "nasipaddress")
    private String nasIpAddress;
    
    @Column(name = "nasportid")
    private String nasPortId;
    
    @Column(name = "nasporttype")
    private String nasPortType;
    
    @Column(name = "acctstarttime")
    private LocalDateTime acctStartTime;
    
    @Column(name = "acctupdatetime")
    private LocalDateTime acctUpdateTime;
    
    @Column(name = "acctstoptime")
    private LocalDateTime acctStopTime;
    
    @Column(name = "acctinterval")
    private Long acctInterval;
    
    @Column(name = "acctsessiontime")
    private Long acctSessionTime;
    
    @Column(name = "acctinputoctets")
    private Long acctInputOctets;
    
    @Column(name = "acctoutputoctets")
    private Long acctOutputOctets;
    
    @Column(name = "calledstationid", length = 50)
    private String calledStationId;
    
    @Column(name = "callingstationid", length = 50)
    private String callingStationId;
    
    @Column(name = "acctterminatecause", length = 32)
    private String acctTerminateCause;
    
    @Column(name = "servicetype")
    private String serviceType;
    
    @Column(name = "framedprotocol")
    private String framedProtocol;
    
    @Column(name = "framedipaddress")
    private String framedIpAddress;
    
    @Column(name = "framedipv6address")
    private String framedIpv6Address;
    
    @Column(name = "framedipv6prefix")
    private String framedIpv6Prefix;
    
    @Column(name = "framedinterfaceid")
    private String framedInterfaceId;
    
    @Column(name = "delegatedipv6prefix")
    private String delegatedIpv6Prefix;
    
    @Column(name = "class", length = 64)
    private String clazz;
    
    @Column(name = "sessiontimeout")
    private Long sessionTimeout;
    
    @Column(name = "idletimeout")
    private Long idleTimeout;
    
    @Column(name = "terminationaction", length = 32)
    private String terminationAction;
    
    @Column(name = "calledstationssid", length = 64)
    private String calledStationSsid;
    
    @Column(name = "eap_type", length = 40)
    private String eapType;
    
    @Column(name = "connection_info_start")
    private String connectionInfoStart;
    
    @Column(name = "connection_info_stop")
    private String connectionInfoStop;
    
    @Column(name = "connection_info")
    private String connectionInfo;
    
    @Column(name = "tunnel_connection")
    private String tunnelConnection;
    
    @Column(name = "tunnel_medium_type")
    private String tunnelMediumType;
    
    @Column(name = "tunnel_type")
    private String tunnelType;
    
    @Column(name = "tunnel_client_endpoint")
    private String tunnelClientEndpoint;
    
    @Column(name = "tunnel_server_endpoint")
    private String tunnelServerEndpoint;
    
    @Column(name = "tunnel_client_auth_id")
    private String tunnelClientAuthId;
    
    @Column(name = "tunnel_server_auth_id")
    private String tunnelServerAuthId;
    
    @Column(name = "tunnel_assignment_id")
    private String tunnelAssignmentId;
    
    @Column(name = "tunnel_preference")
    private String tunnelPreference;
    
    @Column(name = "tunnel_client_auth")
    private String tunnelClientAuth;
    
    @Column(name = "tunnel_server_auth")
    private String tunnelServerAuth;
    
    @Column(name = "tunnel_private_group_id")
    private String tunnelPrivateGroupId;
    
    @Column(name = "tunnel_type_id")
    private String tunnelTypeId;
    
    @Column(name = "tunnel_medium_type_id")
    private String tunnelMediumTypeId;
    
    // Custom fields for GGNetworks
    @Column(name = "location_id")
    private Long locationId;
    
    @Column(name = "router_id")
    private Long routerId;
    
    @Column(name = "package_id")
    private Long packageId;
    
    @Column(name = "voucher_id")
    private Long voucherId;
    
    @Column(name = "user_type")
    @Enumerated(EnumType.STRING)
    private UserType userType;
    
    @Column(name = "data_usage_mb")
    private Long dataUsageMb;
    
    @Column(name = "time_usage_minutes")
    private Long timeUsageMinutes;
    
    @Column(name = "rate_limit_up")
    private String rateLimitUp;
    
    @Column(name = "rate_limit_down")
    private String rateLimitDown;
    
    @Column(name = "mac_address")
    private String macAddress;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "vlan_id")
    private Integer vlanId;
    
    @Column(name = "session_cost")
    private Double sessionCost;
    
    @Column(name = "billing_status")
    @Enumerated(EnumType.STRING)
    private BillingStatus billingStatus;
    
    public enum UserType {
        PPPOE_USER,
        HOTSPOT_USER,
        ADMIN_USER,
        GUEST_USER
    }
    
    public enum BillingStatus {
        PENDING,
        BILLED,
        PAID,
        CANCELLED,
        REFUNDED
    }
} 