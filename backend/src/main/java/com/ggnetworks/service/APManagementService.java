package com.ggnetworks.service;

import com.ggnetworks.entity.AccessPoint;
import com.ggnetworks.entity.Router;
import com.ggnetworks.repository.AccessPointRepository;
import com.ggnetworks.repository.RouterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class APManagementService {

    @Autowired
    private AccessPointRepository accessPointRepository;

    @Autowired
    private RouterRepository routerRepository;

    /**
     * Get all access points
     */
    public List<AccessPoint> getAllAccessPoints() {
        return accessPointRepository.findAll();
    }

    /**
     * Get access point by ID
     */
    public Optional<AccessPoint> getAccessPointById(Long id) {
        return accessPointRepository.findById(id);
    }

    /**
     * Get access point by AP ID
     */
    public Optional<AccessPoint> getAccessPointByApId(String apId) {
        return accessPointRepository.findByApId(apId);
    }

    /**
     * Get access points by router
     */
    public List<AccessPoint> getAccessPointsByRouter(Long routerId) {
        return accessPointRepository.findByRouterId(routerId);
    }

    /**
     * Get online access points
     */
    public List<AccessPoint> getOnlineAccessPoints() {
        return accessPointRepository.findByStatus(AccessPoint.APStatus.ONLINE);
    }

    /**
     * Get offline access points
     */
    public List<AccessPoint> getOfflineAccessPoints() {
        return accessPointRepository.findByStatus(AccessPoint.APStatus.OFFLINE);
    }

    /**
     * Create new access point
     */
    @Transactional
    public AccessPoint createAccessPoint(AccessPoint accessPoint) {
        if (accessPoint.getApId() == null || accessPoint.getApId().isEmpty()) {
            accessPoint.setApId("AP_" + System.currentTimeMillis());
        }
        accessPoint.setStatus(AccessPoint.APStatus.OFFLINE);
        accessPoint.setLastSeen(LocalDateTime.now());
        return accessPointRepository.save(accessPoint);
    }

    /**
     * Update access point
     */
    @Transactional
    public AccessPoint updateAccessPoint(String apId, AccessPoint updatedAP) {
        Optional<AccessPoint> apOpt = accessPointRepository.findByApId(apId);
        if (apOpt.isPresent()) {
            AccessPoint ap = apOpt.get();
            ap.setName(updatedAP.getName());
            ap.setIpAddress(updatedAP.getIpAddress());
            ap.setMacAddress(updatedAP.getMacAddress());
            ap.setModel(updatedAP.getModel());
            ap.setLocation(updatedAP.getLocation());
            ap.setRouterId(updatedAP.getRouterId());
            ap.setSsid(updatedAP.getSsid());
            ap.setChannel(updatedAP.getChannel());
            return accessPointRepository.save(ap);
        }
        return null;
    }

    /**
     * Update AP status (online/offline)
     */
    @Transactional
    public void updateAPStatus(String apId, AccessPoint.APStatus status) {
        Optional<AccessPoint> apOpt = accessPointRepository.findByApId(apId);
        if (apOpt.isPresent()) {
            AccessPoint ap = apOpt.get();
            ap.setStatus(status);
            ap.setLastSeen(LocalDateTime.now());
            accessPointRepository.save(ap);
        }
    }

    /**
     * Update AP health metrics
     */
    @Transactional
    public void updateAPHealth(String apId, Integer signalStrength, Integer connectedDevices, 
                               Integer channel, Integer channelInterference, Long trafficIn, Long trafficOut) {
        Optional<AccessPoint> apOpt = accessPointRepository.findByApId(apId);
        if (apOpt.isPresent()) {
            AccessPoint ap = apOpt.get();
            ap.setSignalStrengthDbm(signalStrength);
            ap.setConnectedDevicesCount(connectedDevices);
            ap.setChannel(channel);
            ap.setChannelInterference(channelInterference);
            if (trafficIn != null) ap.setTrafficBytesIn(trafficIn);
            if (trafficOut != null) ap.setTrafficBytesOut(trafficOut);
            ap.setLastSeen(LocalDateTime.now());
            ap.setStatus(AccessPoint.APStatus.ONLINE);
            accessPointRepository.save(ap);
        }
    }

    /**
     * Get AP statistics
     */
    public Map<String, Object> getAPStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalAPs = accessPointRepository.count();
        long onlineAPs = accessPointRepository.countOnlineAPs();
        long offlineAPs = accessPointRepository.countOfflineAPs();
        Long totalConnectedDevices = accessPointRepository.sumConnectedDevices();
        
        stats.put("totalAPs", totalAPs);
        stats.put("onlineAPs", onlineAPs);
        stats.put("offlineAPs", offlineAPs);
        stats.put("totalConnectedDevices", totalConnectedDevices != null ? totalConnectedDevices : 0);
        
        if (totalAPs > 0) {
            stats.put("onlinePercentage", (onlineAPs * 100.0) / totalAPs);
            stats.put("offlinePercentage", (offlineAPs * 100.0) / totalAPs);
        } else {
            stats.put("onlinePercentage", 0.0);
            stats.put("offlinePercentage", 0.0);
        }
        
        return stats;
    }

    /**
     * Get APs by location
     */
    public List<AccessPoint> getAPsByLocation(String location) {
        return accessPointRepository.findByLocation(location);
    }

    /**
     * Get APs with low signal strength
     */
    public List<AccessPoint> getAPsWithLowSignal(int thresholdDbm) {
        List<AccessPoint> allAPs = accessPointRepository.findAll();
        return allAPs.stream()
            .filter(ap -> ap.getSignalStrengthDbm() != null && ap.getSignalStrengthDbm() < thresholdDbm)
            .collect(Collectors.toList());
    }

    /**
     * Get APs with high interference
     */
    public List<AccessPoint> getAPsWithHighInterference(int threshold) {
        List<AccessPoint> allAPs = accessPointRepository.findAll();
        return allAPs.stream()
            .filter(ap -> ap.getChannelInterference() != null && ap.getChannelInterference() > threshold)
            .collect(Collectors.toList());
    }

    /**
     * Get AP health summary
     */
    public Map<String, Object> getAPHealthSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        List<AccessPoint> allAPs = accessPointRepository.findAll();
        
        long onlineCount = allAPs.stream()
            .filter(ap -> ap.getStatus() == AccessPoint.APStatus.ONLINE)
            .count();
        
        long offlineCount = allAPs.stream()
            .filter(ap -> ap.getStatus() == AccessPoint.APStatus.OFFLINE)
            .count();
        
        long lowSignalCount = allAPs.stream()
            .filter(ap -> ap.getSignalStrengthDbm() != null && ap.getSignalStrengthDbm() < -80)
            .count();
        
        long highInterferenceCount = allAPs.stream()
            .filter(ap -> ap.getChannelInterference() != null && ap.getChannelInterference() > 50)
            .count();
        
        summary.put("totalAPs", allAPs.size());
        summary.put("onlineCount", onlineCount);
        summary.put("offlineCount", offlineCount);
        summary.put("lowSignalCount", lowSignalCount);
        summary.put("highInterferenceCount", highInterferenceCount);
        summary.put("alerts", new ArrayList<>());
        
        // Add alerts
        List<Map<String, Object>> alerts = new ArrayList<>();
        if (offlineCount > 0) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("type", "AP_OFFLINE");
            alert.put("severity", "HIGH");
            alert.put("count", offlineCount);
            alerts.add(alert);
        }
        if (lowSignalCount > 0) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("type", "LOW_SIGNAL");
            alert.put("severity", "MEDIUM");
            alert.put("count", lowSignalCount);
            alerts.add(alert);
        }
        if (highInterferenceCount > 0) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("type", "HIGH_INTERFERENCE");
            alert.put("severity", "MEDIUM");
            alert.put("count", highInterferenceCount);
            alerts.add(alert);
        }
        
        summary.put("alerts", alerts);
        
        return summary;
    }

    /**
     * Delete access point
     */
    @Transactional
    public boolean deleteAccessPoint(String apId) {
        Optional<AccessPoint> apOpt = accessPointRepository.findByApId(apId);
        if (apOpt.isPresent()) {
            accessPointRepository.delete(apOpt.get());
            return true;
        }
        return false;
    }
}





