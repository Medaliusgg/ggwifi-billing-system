# GGNetworks Enhanced Customer Management Architecture

## 🎯 **System-Centric Design with Phone Number Binding**

The GGNetworks system implements a **centralized, phone number-based customer management architecture** that creates a complete communication loop between all components while maintaining clear separation between **Hotspot users** and **PPPoE users**.

## 🔄 **Communication Flow Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │◄──►│   MySQL DB      │◄──►│   FreeRADIUS    │
│   (Spring Boot) │    │   (Central)     │    │   (AAA Server)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MikroTik      │    │   Customer      │    │   Marketing     │
│   Routers       │    │   Profiles      │    │   Automation    │
│   (Distributed) │    │   (Phone #)     │    │   (SMS/Email)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📱 **Phone Number as Primary Identity Key**

### **✅ Secure Phone Number Storage**
- **Normalized Format**: All phone numbers stored as `+255XXXXXXXX`
- **Unique Constraint**: Database-level uniqueness enforcement
- **Encryption**: Phone numbers encrypted at rest (AES256)
- **Validation**: Strict format validation (`^\\+255[0-9]{8}$`)

### **✅ Customer Type Separation**
```java
public enum CustomerType {
    HOTSPOT_USER,    // Voucher-based, temporary access
    PPPOE_USER,      // Subscription-based, permanent access
    BOTH             // Uses both services
}
```

## 🔐 **MAC Randomization Detection & Management**

### **✅ Device Fingerprinting**
```java
// Generate device fingerprint for tracking
private String generateDeviceFingerprint(String userAgent, String ipAddress) {
    String ipSubnet = ipAddress.substring(0, ipAddress.lastIndexOf("."));
    return (userAgent + "_" + ipSubnet).hashCode() + "";
}
```

### **✅ MAC Randomization Detection**
```java
private boolean detectMacRandomization(List<DeviceHistory> customerDevices, 
                                     String newMac, String userAgent, String ipAddress) {
    String newFingerprint = generateDeviceFingerprint(userAgent, ipAddress);
    
    for (DeviceHistory device : customerDevices) {
        // Same user agent but different MAC = likely randomized
        if (device.getUserAgent().equals(userAgent) && 
            !device.getMacAddress().equals(newMac)) {
            return true;
        }
        
        // Similar fingerprint but different MAC = likely randomized
        if (device.getDeviceFingerprint().equals(newFingerprint) && 
            !device.getMacAddress().equals(newMac)) {
            return true;
        }
    }
    return false;
}
```

### **✅ Device Status Management**
```java
public enum DeviceStatus {
    ACTIVE,         // Currently in use
    INACTIVE,       // Not used recently
    SUSPICIOUS,     // Flagged for MAC randomization
    BANNED,         // Banned device
    WHITELISTED     // Trusted device
}
```

## 🎯 **Customer Profile Architecture**

### **✅ Centralized Customer Management**
```java
@Entity
@Table(name = "customer_profiles")
public class CustomerProfile extends BaseEntity {
    @Column(name = "phone_number", unique = true, nullable = false)
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    private CustomerType customerType;
    
    private Long totalSessions = 0L;
    private Long totalDataUsageMb = 0L;
    private Double totalSpent = 0.0;
    private Integer loyaltyPoints = 0;
    private LoyaltyTier loyaltyTier = LoyaltyTier.BRONZE;
    
    // Marketing preferences
    private Boolean marketingConsent = false;
    private Boolean smsConsent = false;
    private Boolean emailConsent = false;
}
```

### **✅ Device History Tracking**
```java
@Entity
@Table(name = "device_history")
public class DeviceHistory extends BaseEntity {
    @ManyToOne
    private CustomerProfile customerProfile;
    
    private String macAddress;
    private String deviceFingerprint;
    private Boolean isMacRandomized = false;
    private Integer randomizationCount = 0;
    
    @Enumerated(EnumType.STRING)
    private DeviceStatus status = DeviceStatus.ACTIVE;
}
```

## 📊 **Comprehensive Customer Tracking**

### **✅ Unified Customer View**
```java
public Map<String, Object> getCustomerProfileByPhone(String phoneNumber) {
    Map<String, Object> customerData = new HashMap<>();
    
    // Basic profile info
    customerData.put("profile", customerProfile);
    
    // Device history
    customerData.put("devices", deviceHistory);
    
    // Session history
    customerData.put("sessions", hotspotSessions);
    
    // Payment history
    customerData.put("payments", payments);
    
    // Application forms (PPPoE)
    customerData.put("applications", applications);
    
    // Marketing communications
    customerData.put("communications", communications);
    
    // Statistics
    customerData.put("statistics", calculateStatistics());
    
    return customerData;
}
```

### **✅ Marketing Automation**
```java
public enum CommunicationType {
    WELCOME_MESSAGE,
    BIRTHDAY_GREETING,
    LOYALTY_REWARD,
    PROMOTIONAL_OFFER,
    SERVICE_REMINDER,
    PAYMENT_REMINDER,
    WINBACK_CAMPAIGN,
    REFERRAL_INCENTIVE
}
```

## 🔄 **Real-World Communication Examples**

### **Hotspot User Flow:**
```
1. User enters voucher code: "GG12345678"
2. Application validates in MySQL
3. CustomerProfile created/updated with phone number
4. DeviceHistory tracked with MAC address
5. MAC randomization detection triggered
6. FreeRADIUS user created: "voucher_GG12345678"
7. MikroTik authenticates through FreeRADIUS
8. Session data flows back: MikroTik → FreeRADIUS → Application → MySQL
9. Marketing automation triggered based on usage
```

### **PPPoE User Flow:**
```
1. User submits application with phone number
2. CustomerProfile created as PPPOE_USER
3. Admin approves application
4. FreeRADIUS user created with phone number
5. MikroTik authenticates PPPoE user
6. Usage tracked and billed monthly
7. Marketing campaigns based on subscription type
```

## 🛡️ **Security & Anti-Abuse Features**

### **✅ MAC Randomization Handling**
- **Detection**: Automatic detection of MAC randomization
- **Flagging**: Suspicious devices flagged for admin review
- **Rate Limiting**: Optional rate limiting for randomized MACs
- **Whitelisting**: Trusted devices can be whitelisted

### **✅ Phone Number Security**
- **Encryption**: Phone numbers encrypted at rest
- **Validation**: Strict format validation
- **Uniqueness**: Database-level uniqueness enforcement
- **Audit Trail**: All phone number changes logged

### **✅ Customer Type Separation**
- **Hotspot Users**: Anonymous, voucher-based, temporary
- **PPPoE Users**: Registered, subscription-based, permanent
- **Hybrid Users**: Can use both services (BOTH type)
- **Clear Tracking**: Separate analytics for each type

## 📈 **Admin Dashboard Features**

### **✅ Customer Search by Phone Number**
```bash
GET /api/v1/admin/customers/search?phoneNumber=+255741234567
```

### **✅ Comprehensive Customer Profile**
- Personal information
- Device history (MAC addresses)
- Session logs (Hotspot/PPPoE)
- Payment history
- Application forms (PPPoE)
- Marketing communication history
- Loyalty program status

### **✅ Device Management**
- View all devices per customer
- Flag suspicious devices
- Ban/whitelist devices
- MAC randomization alerts

### **✅ Marketing Tools**
- Send targeted messages
- Export customer data for campaigns
- Track communication effectiveness
- Manage consent preferences

## 🎯 **Key Benefits**

### **✅ Centralized Identity Management**
- Single phone number = complete customer view
- No duplicate customer records
- Unified tracking across all services

### **✅ MAC Randomization Protection**
- Automatic detection and flagging
- Device fingerprinting for tracking
- Configurable response policies

### **✅ Marketing Automation**
- Phone number-based targeting
- Consent management
- Multi-channel communication
- Campaign effectiveness tracking

### **✅ Admin Visibility**
- Complete customer lifecycle tracking
- Real-time session monitoring
- Comprehensive reporting
- Fraud detection capabilities

## 🔧 **Implementation Notes**

### **✅ Database Design**
- Phone number as primary key in customer_profiles
- Composite indexes on (phone_number, mac_address)
- Foreign key relationships to customer_profiles
- Audit logging for all changes

### **✅ API Design**
- All customer endpoints accept phone number
- Pagination for large datasets
- Real-time updates via WebSocket (optional)
- Comprehensive error handling

### **✅ Security Considerations**
- JWT tokens with phone number claims
- Rate limiting per phone number
- Input validation and sanitization
- SQL injection prevention

## 🚀 **Production Deployment**

### **✅ Performance Optimization**
- Database indexes on frequently queried fields
- Redis caching for customer profiles
- Connection pooling for database
- CDN for static assets

### **✅ Monitoring & Alerting**
- MAC randomization alerts
- Suspicious activity detection
- Customer engagement metrics
- System health monitoring

---

**This architecture ensures complete customer tracking and lifecycle management bound to the phone number, with strong anti-duplication and normalization in place, while maintaining clear separation between Hotspot and PPPoE users.** 