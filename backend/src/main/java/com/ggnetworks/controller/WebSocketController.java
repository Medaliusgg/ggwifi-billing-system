package com.ggnetworks.controller;

import com.ggnetworks.entity.VoucherSession;
import com.ggnetworks.service.SessionManagementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

/**
 * WebSocket Controller
 * Handles real-time session monitoring and control
 */
@Controller
public class WebSocketController {
    
    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private SessionManagementService sessionManagementService;
    
    /**
     * Subscribe to live sessions
     */
    @MessageMapping("/sessions/subscribe")
    @SendTo("/topic/sessions")
    public Map<String, Object> subscribeToSessions() {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "subscribed");
        response.put("message", "Subscribed to live session updates");
        return response;
    }
    
    /**
     * Request session termination
     */
    @MessageMapping("/sessions/terminate")
    public void terminateSession(Map<String, String> request) {
        String voucherCode = request.get("voucherCode");
        logger.info("WebSocket: Terminating session: {}", voucherCode);
        
        // Terminate session via service
        // sessionManagementService.terminateSession(...);
        
        // Broadcast termination event
        Map<String, Object> event = new HashMap<>();
        event.put("type", "session_terminated");
        event.put("voucherCode", voucherCode);
        event.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/sessions", event);
    }
    
    /**
     * Broadcast session update to all subscribers
     */
    public void broadcastSessionUpdate(VoucherSession session) {
        Map<String, Object> update = new HashMap<>();
        update.put("type", "session_update");
        update.put("session", session);
        update.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/sessions", update);
    }
    
    /**
     * Broadcast new session creation
     */
    public void broadcastNewSession(VoucherSession session) {
        Map<String, Object> event = new HashMap<>();
        event.put("type", "session_created");
        event.put("session", session);
        event.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/sessions", event);
    }

    /**
     * Broadcast dashboard updates
     */
    @MessageMapping("/dashboard/subscribe")
    @SendTo("/topic/dashboard")
    public Map<String, Object> subscribeToDashboard() {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "subscribed");
        response.put("message", "Subscribed to dashboard updates");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    /**
     * Broadcast router health updates
     */
    public void broadcastRouterHealthUpdate(Map<String, Object> healthData) {
        Map<String, Object> event = new HashMap<>();
        event.put("type", "router_health_update");
        event.put("data", healthData);
        event.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/routers", event);
    }

    /**
     * Broadcast session count update
     */
    public void broadcastSessionCountUpdate(int activeSessions) {
        Map<String, Object> event = new HashMap<>();
        event.put("type", "session_count_update");
        event.put("activeSessions", activeSessions);
        event.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/dashboard", event);
    }
}

