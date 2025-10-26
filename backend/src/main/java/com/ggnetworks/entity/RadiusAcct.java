package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "radacct")
public class RadiusAcct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "radacctid")
    private Long radacctId;

    @Column(name = "acctsessionid", nullable = false, length = 64)
    private String acctSessionId;

    @Column(name = "acctuniqueid", nullable = false, length = 32, unique = true)
    private String acctUniqueId;

    @Column(name = "username", nullable = false, length = 64)
    private String username;

    @Column(name = "groupname", length = 64)
    private String groupName;

    @Column(name = "realm", length = 64)
    private String realm;

    @Column(name = "nasipaddress", nullable = false, length = 15)
    private String nasIpAddress;

    @Column(name = "nasportid", length = 15)
    private String nasPortId;

    @Column(name = "nasporttype", length = 32)
    private String nasPortType;

    @Column(name = "acctstarttime")
    private LocalDateTime acctStartTime;

    @Column(name = "acctstoptime")
    private LocalDateTime acctStopTime;

    @Column(name = "acctsessiontime")
    private Integer acctSessionTime;

    @Column(name = "acctinputoctets")
    private Long acctInputOctets;

    @Column(name = "acctoutputoctets")
    private Long acctOutputOctets;

    @Column(name = "calledstationid", nullable = false, length = 50)
    private String calledStationId;

    @Column(name = "callingstationid", nullable = false, length = 50)
    private String callingStationId;

    @Column(name = "acctterminatecause", nullable = false, length = 32)
    private String acctTerminateCause;

    @Column(name = "servicetype", length = 32)
    private String serviceType;

    @Column(name = "framedprotocol", length = 32)
    private String framedProtocol;

    @Column(name = "framedipaddress", nullable = false, length = 15)
    private String framedIpAddress;

    @Column(name = "acctstartdelay")
    private Integer acctStartDelay;

    @Column(name = "acctstopdelay")
    private Integer acctStopDelay;

    @Column(name = "xascendsessionsvrkey", length = 10)
    private String xAscendSessionSvrKey;

    @Column(name = "user_type", length = 50)
    private String userType = "HOTSPOT";

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "router_id")
    private Long routerId;

    @Column(name = "package_id")
    private Long packageId;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RadiusAcct() {}

    public RadiusAcct(String acctSessionId, String acctUniqueId, String username, String nasIpAddress, String calledStationId, String callingStationId, String framedIpAddress) {
        this.acctSessionId = acctSessionId;
        this.acctUniqueId = acctUniqueId;
        this.username = username;
        this.nasIpAddress = nasIpAddress;
        this.calledStationId = calledStationId;
        this.callingStationId = callingStationId;
        this.framedIpAddress = framedIpAddress;
        this.acctTerminateCause = "Unknown";
    }

    // Getters and Setters
    public Long getRadacctId() { return radacctId; }
    public void setRadacctId(Long radacctId) { this.radacctId = radacctId; }

    public String getAcctSessionId() { return acctSessionId; }
    public void setAcctSessionId(String acctSessionId) { this.acctSessionId = acctSessionId; }

    public String getAcctUniqueId() { return acctUniqueId; }
    public void setAcctUniqueId(String acctUniqueId) { this.acctUniqueId = acctUniqueId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public String getRealm() { return realm; }
    public void setRealm(String realm) { this.realm = realm; }

    public String getNasIpAddress() { return nasIpAddress; }
    public void setNasIpAddress(String nasIpAddress) { this.nasIpAddress = nasIpAddress; }

    public String getNasPortId() { return nasPortId; }
    public void setNasPortId(String nasPortId) { this.nasPortId = nasPortId; }

    public String getNasPortType() { return nasPortType; }
    public void setNasPortType(String nasPortType) { this.nasPortType = nasPortType; }

    public LocalDateTime getAcctStartTime() { return acctStartTime; }
    public void setAcctStartTime(LocalDateTime acctStartTime) { this.acctStartTime = acctStartTime; }

    public LocalDateTime getAcctStopTime() { return acctStopTime; }
    public void setAcctStopTime(LocalDateTime acctStopTime) { this.acctStopTime = acctStopTime; }

    public Integer getAcctSessionTime() { return acctSessionTime; }
    public void setAcctSessionTime(Integer acctSessionTime) { this.acctSessionTime = acctSessionTime; }

    public Long getAcctInputOctets() { return acctInputOctets; }
    public void setAcctInputOctets(Long acctInputOctets) { this.acctInputOctets = acctInputOctets; }

    public Long getAcctOutputOctets() { return acctOutputOctets; }
    public void setAcctOutputOctets(Long acctOutputOctets) { this.acctOutputOctets = acctOutputOctets; }

    public String getCalledStationId() { return calledStationId; }
    public void setCalledStationId(String calledStationId) { this.calledStationId = calledStationId; }

    public String getCallingStationId() { return callingStationId; }
    public void setCallingStationId(String callingStationId) { this.callingStationId = callingStationId; }

    public String getAcctTerminateCause() { return acctTerminateCause; }
    public void setAcctTerminateCause(String acctTerminateCause) { this.acctTerminateCause = acctTerminateCause; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getFramedProtocol() { return framedProtocol; }
    public void setFramedProtocol(String framedProtocol) { this.framedProtocol = framedProtocol; }

    public String getFramedIpAddress() { return framedIpAddress; }
    public void setFramedIpAddress(String framedIpAddress) { this.framedIpAddress = framedIpAddress; }

    public Integer getAcctStartDelay() { return acctStartDelay; }
    public void setAcctStartDelay(Integer acctStartDelay) { this.acctStartDelay = acctStartDelay; }

    public Integer getAcctStopDelay() { return acctStopDelay; }
    public void setAcctStopDelay(Integer acctStopDelay) { this.acctStopDelay = acctStopDelay; }

    public String getxAscendSessionSvrKey() { return xAscendSessionSvrKey; }
    public void setxAscendSessionSvrKey(String xAscendSessionSvrKey) { this.xAscendSessionSvrKey = xAscendSessionSvrKey; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public Long getRouterId() { return routerId; }
    public void setRouterId(Long routerId) { this.routerId = routerId; }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
