package com.ggnetworks.controller;

import com.ggnetworks.entity.SupportTicket;
import com.ggnetworks.service.SupportTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Support Ticket Controller
 * Manages customer support tickets
 */
@RestController
@RequestMapping("/api/v1/support/tickets")
public class SupportTicketController {
    
    @Autowired
    private SupportTicketService supportTicketService;
    
    /**
     * Create a new support ticket
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTicket(@RequestBody Map<String, Object> ticketData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            SupportTicket ticket = new SupportTicket();
            ticket.setCustomerId(ticketData.get("customerId") != null ? 
                Long.parseLong(ticketData.get("customerId").toString()) : null);
            ticket.setPhoneNumber((String) ticketData.get("phoneNumber"));
            ticket.setSubject((String) ticketData.get("subject"));
            ticket.setDescription((String) ticketData.get("description"));
            ticket.setCategory((String) ticketData.getOrDefault("category", "GENERAL"));
            ticket.setPriority(SupportTicket.TicketPriority.valueOf(
                ((String) ticketData.getOrDefault("priority", "MEDIUM")).toUpperCase()));
            ticket.setStatus(SupportTicket.TicketStatus.OPEN);
            ticket.setCreatedBy((String) ticketData.getOrDefault("createdBy", "CUSTOMER"));
            
            ticket = supportTicketService.createTicket(ticket);
            
            response.put("status", "success");
            response.put("message", "Ticket created successfully");
            response.put("ticket", ticket);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create ticket: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Get ticket by ID
     */
    @GetMapping("/{ticketId}")
    public ResponseEntity<Map<String, Object>> getTicket(@PathVariable Long ticketId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<SupportTicket> ticketOpt = supportTicketService.getTicketById(ticketId);
            if (ticketOpt.isPresent()) {
                response.put("status", "success");
                response.put("ticket", ticketOpt.get());
            } else {
                response.put("status", "error");
                response.put("message", "Ticket not found");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get ticket: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Get all tickets
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long customerId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<SupportTicket> tickets;
            if (status != null && !status.isEmpty()) {
                tickets = supportTicketService.getTicketsByStatus(SupportTicket.TicketStatus.valueOf(status.toUpperCase()));
            } else if (priority != null && !priority.isEmpty()) {
                tickets = supportTicketService.getTicketsByPriority(SupportTicket.TicketPriority.valueOf(priority.toUpperCase()));
            } else if (customerId != null) {
                tickets = supportTicketService.getTicketsByCustomerId(customerId);
            } else {
                tickets = supportTicketService.getAllTickets();
            }
            
            response.put("status", "success");
            response.put("tickets", tickets);
            response.put("count", tickets.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get tickets: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Update ticket status
     */
    @PutMapping("/{ticketId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@PathVariable Long ticketId,
                                                             @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String newStatus = request.get("status");
            SupportTicket.TicketStatus status = SupportTicket.TicketStatus.valueOf(newStatus.toUpperCase());
            String resolution = request.get("resolution");
            
            SupportTicket ticket = supportTicketService.updateTicketStatus(ticketId, status, resolution);
            
            response.put("status", "success");
            response.put("message", "Ticket status updated");
            response.put("ticket", ticket);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Assign ticket to user
     */
    @PutMapping("/{ticketId}/assign")
    public ResponseEntity<Map<String, Object>> assignTicket(@PathVariable Long ticketId,
                                                              @RequestBody Map<String, Long> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userId = request.get("userId");
            SupportTicket ticket = supportTicketService.assignTicket(ticketId, userId);
            
            response.put("status", "success");
            response.put("message", "Ticket assigned successfully");
            response.put("ticket", ticket);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to assign ticket: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get ticket statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getTicketStatistics() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> stats = supportTicketService.getTicketStatistics();
            response.put("status", "success");
            response.put("statistics", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Resolve ticket
     */
    @PutMapping("/{ticketId}/resolve")
    public ResponseEntity<Map<String, Object>> resolveTicket(@PathVariable Long ticketId,
                                                               @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String resolution = request.get("resolution");
            SupportTicket ticket = supportTicketService.resolveTicket(ticketId, resolution);
            
            response.put("status", "success");
            response.put("message", "Ticket resolved successfully");
            response.put("ticket", ticket);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to resolve ticket: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

