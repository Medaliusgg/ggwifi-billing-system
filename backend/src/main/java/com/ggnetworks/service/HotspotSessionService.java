package com.ggnetworks.service;

import com.ggnetworks.entity.HotspotSession;
import com.ggnetworks.entity.HotspotVoucher;
import com.ggnetworks.repository.HotspotSessionRepository;
import com.ggnetworks.entity.CustomerProfile;
import com.ggnetworks.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotspotSessionService {

    private final HotspotSessionRepository sessionRepository;
    private final CustomerProfileRepository customerProfileRepository;

    public List<HotspotSession> getActiveSessionsByUser(String phoneNumber) {
        // This is a placeholder implementation
        // In a real implementation, you would query sessions by user phone number
        return sessionRepository.findAll();
    }

    public List<HotspotSession> getActiveSessions() {
        return sessionRepository.findByStatus(HotspotSession.SessionStatus.ONLINE);
    }

    public List<HotspotSession> getSessionsByVoucherId(Long voucherId) {
        return sessionRepository.findByVoucherId(voucherId);
    }

    @Transactional
    public void endSession(Long sessionId) {
        Optional<HotspotSession> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            HotspotSession session = sessionOpt.get();
            session.setStatus(HotspotSession.SessionStatus.OFFLINE);
            session.setEndTime(LocalDateTime.now());
            sessionRepository.save(session);
        }
    }

    @Transactional
    public HotspotSession createSession(HotspotVoucher voucher, String macAddress, String ipAddress) {
        try {
            HotspotSession session = new HotspotSession();
            session.setVoucher(voucher);
            session.setMacAddress(macAddress);
            session.setIpAddress(ipAddress);
            session.setStatus(HotspotSession.SessionStatus.ONLINE);
            session.setStartTime(LocalDateTime.now());
            session.setDataUsageMb(0L);
            
            return sessionRepository.save(session);
        } catch (Exception e) {
            log.error("Failed to create session", e);
            throw new RuntimeException("Failed to create session", e);
        }
    }

    public boolean disconnectSession(String voucherCode, String macAddress) {
        try {
            Optional<HotspotSession> sessionOpt = sessionRepository.findByVoucherVoucherCodeAndMacAddress(voucherCode, macAddress);
            if (sessionOpt.isPresent()) {
                HotspotSession session = sessionOpt.get();
                session.setStatus(HotspotSession.SessionStatus.OFFLINE);
                session.setEndTime(LocalDateTime.now());
                sessionRepository.save(session);
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Failed to disconnect session", e);
            return false;
        }
    }

    public boolean forceDisconnectSession(Long sessionId) {
        try {
            Optional<HotspotSession> sessionOpt = sessionRepository.findById(sessionId);
            if (sessionOpt.isPresent()) {
                HotspotSession session = sessionOpt.get();
                session.setStatus(HotspotSession.SessionStatus.OFFLINE);
                session.setEndTime(LocalDateTime.now());
                sessionRepository.save(session);
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Failed to force disconnect session", e);
            return false;
        }
    }

    public HotspotSession getActiveSessionByVoucher(Long voucherId) {
        try {
            return sessionRepository.findByVoucherIdAndStatus(voucherId, HotspotSession.SessionStatus.ONLINE).orElse(null);
        } catch (Exception e) {
            log.error("Failed to get active session by voucher", e);
            return null;
        }
    }

    public Map<String, Object> getSessionStatistics() {
        try {
            long totalSessions = sessionRepository.count();
            long activeSessions = sessionRepository.countByStatus(HotspotSession.SessionStatus.ONLINE);
            long offlineSessions = sessionRepository.countByStatus(HotspotSession.SessionStatus.OFFLINE);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalSessions", totalSessions);
            stats.put("activeSessions", activeSessions);
            stats.put("offlineSessions", offlineSessions);
            
            return stats;
        } catch (Exception e) {
            log.error("Failed to get session statistics", e);
            return new HashMap<>();
        }
    }

    // Additional methods for AdminCustomerController
    public Page<HotspotSession> getSessionsByCustomerId(Long customerId, Pageable pageable) {
        // Find sessions through vouchers assigned to this customer
        CustomerProfile customerProfile = customerProfileRepository.findById(customerId).orElse(null);
        if (customerProfile == null) {
            return Page.empty(pageable);
        }
        return sessionRepository.findByVoucherAssignedToAndDeletedAtIsNull(customerProfile.getPhoneNumber(), pageable);
    }
} 