# 🚀 Hotspot Interactivity Enhancement Plan

## **Current Status Assessment**

### ✅ **GOOD NEWS: Core Integration Exists!**

**Verified Working:**
- ✅ SessionManagementService integrates with `RadiusAcctRepository`
- ✅ DashboardService queries active sessions
- ✅ EnhancedRadiusService gets active RADIUS sessions from `radacct` table
- ✅ FreeRadiusService queries `radacct` for active sessions
- ✅ Payment → Voucher → RADIUS user creation flow works
- ✅ Loyalty points awarded automatically

### ⚠️ **GAPS: Interactivity & Real-time Features**

**Missing/Incomplete:**
1. ❌ Real-time session updates (WebSocket)
2. ❌ Live router health monitoring (scheduled checks)
3. ⚠️ Dashboard metrics not fully hotspot-optimized
4. ⚠️ Session termination not integrated with RADIUS CoA
5. ⚠️ Router status not updated in real-time

---

## **🔧 ENHANCEMENT PLAN**

### **Phase 1: Real-time Session Management** (Priority: CRITICAL)

#### **1.1 Enhance SessionManagementService with Real-time RADIUS Integration**

**Current State:**
```java
// SessionManagementService already uses RadiusAcctRepository ✅
// But needs better real-time integration
```

**Enhancements Needed:**

1. **Add Real-time Session Query:**
   ```java
   // Add to SessionManagementService.java
   public List<Map<String, Object>> getRealTimeActiveSessions() {
       // Query radacct table for active sessions (acctstoptime IS NULL)
       // Include: username, mac, ip, router, bandwidth, duration
       // Return formatted for dashboard
   }
   ```

2. **Add Session Termination with RADIUS CoA:**
   ```java
   // Add to SessionManagementService.java
   public boolean terminateSession(String sessionId, String reason) {
       // 1. Find session in radacct
       // 2. Send CoA (Change of Authorization) to disconnect
       // 3. Update session status
       // 4. Log termination
   }
   ```

3. **Add Automatic Session Cleanup:**
   ```java
   // Add scheduled job
   @Scheduled(fixedRate = 60000) // Every minute
   public void cleanupExpiredSessions() {
       // Find sessions that expired but still show as active
       // Update status, remove from RADIUS if needed
   }
   ```

---

### **Phase 2: Router Health Monitoring** (Priority: CRITICAL)

#### **2.1 Add Scheduled Router Health Checks**

**Create:** `RouterHealthMonitoringService.java`

```java
@Service
public class RouterHealthMonitoringService {
    
    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void checkRouterHealth() {
        // 1. Get all routers
        // 2. Ping each router / check API connection
        // 3. Update router status (ONLINE/OFFLINE)
        // 4. Log health status
        // 5. Send alerts for offline routers
    }
    
    public Map<String, Object> getRouterHealthStatus(Long routerId) {
        // Return: status, lastCheck, responseTime, activeSessions
    }
}
```

#### **2.2 Enhance RouterService with Live Metrics**

```java
// Add to RouterService.java
public Map<String, Object> getRouterLiveMetrics(Long routerId) {
    // 1. Get router status
    // 2. Get active sessions from radacct (filter by router IP)
    // 3. Get bandwidth usage
    // 4. Get uptime
    // 5. Return formatted metrics
}
```

---

### **Phase 3: Enhanced Dashboard** (Priority: HIGH)

#### **3.1 Add Hotspot-Specific Metrics**

**Enhance:** `DashboardService.java`

```java
// Add to getDashboardMetrics()
metrics.put("activeHotspotSessions", getActiveHotspotSessionsCount());
metrics.put("activePPPoESessions", getActivePPPoESessionsCount());
metrics.put("failedLoginAttempts", getFailedLoginAttemptsFromRadius());
metrics.put("routerHealthStatus", getRouterHealthStatus());
metrics.put("realTimeBandwidthUsage", getRealTimeBandwidthUsage());
metrics.put("topActiveRouters", getTopActiveRouters());
metrics.put("sessionDurationAverage", getAverageSessionDuration());
```

#### **3.2 Add Real-time Session List**

```java
// Add to DashboardService.java
public List<Map<String, Object>> getRealTimeActiveSessions() {
    // Query radacct for active sessions
    // Include: username, phone, mac, ip, router, bandwidth, duration
    // Format for dashboard display
}
```

---

### **Phase 4: WebSocket Integration** (Priority: MEDIUM)

#### **4.1 Add WebSocket Controller for Live Updates**

**Enhance:** `WebSocketController.java` (already exists)

```java
@MessageMapping("/dashboard/updates")
public void sendDashboardUpdates() {
    // Send real-time updates:
    // - Active session count
    // - Router status changes
    // - New payments
    // - Failed login attempts
}
```

#### **4.2 Frontend Integration**

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://api.ggwifi.co.tz/ws/dashboard');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update dashboard metrics in real-time
    updateDashboard(data);
};
```

---

### **Phase 5: Session Termination UI** (Priority: HIGH)

#### **5.1 Add Session Termination Endpoint**

**Enhance:** `SessionManagementController.java` (create if doesn't exist)

```java
@PostMapping("/sessions/{sessionId}/terminate")
public ResponseEntity<Map<String, Object>> terminateSession(
    @PathVariable String sessionId,
    @RequestParam(required = false) String reason) {
    
    // 1. Find session in radacct
    // 2. Send CoA to disconnect
    // 3. Update session status
    // 4. Return success
}
```

#### **5.2 Add Bulk Session Termination**

```java
@PostMapping("/sessions/terminate-bulk")
public ResponseEntity<Map<String, Object>> terminateBulkSessions(
    @RequestBody List<String> sessionIds) {
    
    // Terminate multiple sessions
    // Return results
}
```

---

### **Phase 6: Analytics Enhancement** (Priority: MEDIUM)

#### **6.1 Add Hotspot-Specific Analytics**

**Enhance:** `ReportsAnalyticsController.java`

```java
// Add endpoints:
- GET /analytics/usage-per-plan (hotspot vs PPPoE)
- GET /analytics/top-customers-by-usage
- GET /analytics/router-uptime
- GET /analytics/session-duration-distribution
- GET /analytics/peak-usage-times
- GET /analytics/failed-login-trends
- GET /analytics/device-type-distribution
```

---

## **📋 IMPLEMENTATION CHECKLIST**

### **Immediate (This Week):**
- [ ] Enhance SessionManagementService with real-time RADIUS queries
- [ ] Add router health monitoring service
- [ ] Update DashboardService with hotspot metrics
- [ ] Add session termination with CoA

### **Short-term (Next 2 Weeks):**
- [ ] Implement WebSocket for live updates
- [ ] Add session termination UI
- [ ] Enhance analytics with hotspot reports
- [ ] Add router health alerts

### **Long-term (Next Month):**
- [ ] Advanced fraud detection
- [ ] Predictive analytics
- [ ] Automated router configuration sync
- [ ] Mobile app integration

---

## **🎯 SUCCESS METRICS**

**After Implementation:**
- ✅ Real-time session monitoring (updated every 30 seconds)
- ✅ Router health status (checked every 30 seconds)
- ✅ Live dashboard metrics (WebSocket updates)
- ✅ One-click session termination
- ✅ Hotspot-specific analytics
- ✅ Automatic alerts for router failures

---

**Last Updated:** 2025-01-27
**Status:** 📋 **READY FOR IMPLEMENTATION**





