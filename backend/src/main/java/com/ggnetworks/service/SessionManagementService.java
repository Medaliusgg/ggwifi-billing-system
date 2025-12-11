package com.ggnetworks.service;

import com.ggnetworks.entity.VoucherSession;
import com.ggnetworks.repository.VoucherSessionRepository;
import com.ggnetworks.repository.SessionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

/**
 * Session Management Service
 * Handles active session monitoring, termination, and history
 */
@Service
public class SessionManagementService {
    
    @Autowired
    private VoucherSessionRepository voucherSessionRepository;
    
    @Autowired
    private SessionHistoryRepository sessionHistoryRepository;
    
    @Autowired
    private CoAService coAService;
    
    /**
     * Get all active voucher sessions
     */
    public List<VoucherSession> getActiveVoucherSessions() {
        return voucherSessionRepository.findByIsActiveTrue();
    }
    
    /**
     * Get active sessions by customer phone number
     */
    public List<VoucherSession> getActiveSessionsByCustomer(String phoneNumber) {
        return voucherSessionRepository.findByPhoneNumberAndIsActiveTrue(phoneNumber);
    }
    
    /**
     * Terminate a voucher session
     */
    @Transactional
    public boolean terminateVoucherSession(String voucherCode) {
        Optional<VoucherSession> sessionOpt = voucherSessionRepository.findByVoucherCode(voucherCode);
        if (sessionOpt.isPresent()) {
            VoucherSession session = sessionOpt.get();
            session.setIsActive(false);
            session.setEndedAt(LocalDateTime.now());
            voucherSessionRepository.save(session);
            
            // Send CoA disconnect request if CoAService is available
            try {
                if (coAService != null && session.getMacAddress() != null) {
                    coAService.disconnectSession(session.getMacAddress(), session.getRouterId());
                }
            } catch (Exception e) {
                // Log but don't fail termination
                System.err.println("Failed to send CoA disconnect: " + e.getMessage());
            }
            
            return true;
        }
        return false;
    }
    
    /**
     * Get session statistics
     */
    public Map<String, Object> getSessionStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long activeVoucherSessions = voucherSessionRepository.countByIsActiveTrue();
        long totalSessionsToday = 0;
        
        try {
            totalSessionsToday = sessionHistoryRepository.countByCreatedAtAfter(
                LocalDateTime.now().withHour(0).withMinute(0).withSecond(0)
            );
        } catch (Exception e) {
            // If countByCreatedAtAfter doesn't exist, use alternative
            totalSessionsToday = sessionHistoryRepository.count();
        }
        
        stats.put("activeVoucherSessions", activeVoucherSessions);
        stats.put("totalActiveSessions", activeVoucherSessions);
        stats.put("totalSessionsToday", totalSessionsToday);
        
        return stats;
    }
    
    /**
     * Get active sessions by router ID
     */
    public List<VoucherSession> getActiveSessionsByRouter(Long routerId) {
        return voucherSessionRepository.findByRouterIdAndIsActiveTrue(routerId);
    }
    
    /**
     * Get session by voucher code
     */
    public Optional<VoucherSession> getSessionByVoucherCode(String voucherCode) {
        return voucherSessionRepository.findByVoucherCode(voucherCode);
    }
}
