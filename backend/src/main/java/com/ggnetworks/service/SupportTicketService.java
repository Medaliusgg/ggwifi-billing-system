package com.ggnetworks.service;

import com.ggnetworks.entity.SupportTicket;
import com.ggnetworks.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

/**
 * Support Ticket Service
 * Manages customer support tickets with full CRUD operations
 */
@Service
@Transactional
public class SupportTicketService {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private SmsService smsService;

    /**
     * Create a new support ticket
     */
    public SupportTicket createTicket(SupportTicket ticket) {
        // Generate unique ticket number if not provided
        if (ticket.getTicketNumber() == null || ticket.getTicketNumber().isEmpty()) {
            ticket.setTicketNumber(generateTicketNumber());
        }
        
        // Set default values
        if (ticket.getStatus() == null) {
            ticket.setStatus(SupportTicket.TicketStatus.OPEN);
        }
        if (ticket.getPriority() == null) {
            ticket.setPriority(SupportTicket.TicketPriority.MEDIUM);
        }
        
        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        
        // Send notification
        try {
            sendTicketCreatedNotification(savedTicket);
        } catch (Exception e) {
            System.err.println("Failed to send ticket notification: " + e.getMessage());
        }
        
        return savedTicket;
    }

    /**
     * Get ticket by ID
     */
    public Optional<SupportTicket> getTicketById(Long id) {
        return supportTicketRepository.findById(id);
    }

    /**
     * Get ticket by ticket number
     */
    public Optional<SupportTicket> getTicketByTicketNumber(String ticketNumber) {
        return supportTicketRepository.findAll().stream()
            .filter(t -> t.getTicketNumber().equals(ticketNumber))
            .findFirst();
    }

    /**
     * Get all tickets
     */
    public List<SupportTicket> getAllTickets() {
        return supportTicketRepository.findAll();
    }

    /**
     * Get tickets by status
     */
    public List<SupportTicket> getTicketsByStatus(SupportTicket.TicketStatus status) {
        return supportTicketRepository.findByStatus(status);
    }

    /**
     * Get tickets by priority
     */
    public List<SupportTicket> getTicketsByPriority(SupportTicket.TicketPriority priority) {
        return supportTicketRepository.findByPriority(priority);
    }

    /**
     * Get tickets by customer ID
     */
    public List<SupportTicket> getTicketsByCustomerId(Long customerId) {
        return supportTicketRepository.findByCustomerId(customerId);
    }

    /**
     * Get tickets by assigned user
     */
    public List<SupportTicket> getTicketsByAssignedTo(Long userId) {
        return supportTicketRepository.findByAssignedTo(userId);
    }

    /**
     * Get tickets by phone number
     */
    public List<SupportTicket> getTicketsByPhoneNumber(String phoneNumber) {
        return supportTicketRepository.findByPhoneNumber(phoneNumber);
    }

    /**
     * Update ticket
     */
    public SupportTicket updateTicket(SupportTicket ticket) {
        return supportTicketRepository.save(ticket);
    }

    /**
     * Update ticket status
     */
    public SupportTicket updateTicketStatus(Long ticketId, SupportTicket.TicketStatus status, String resolution) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            throw new RuntimeException("Ticket not found");
        }
        
        SupportTicket ticket = ticketOpt.get();
        ticket.setStatus(status);
        
        if (status == SupportTicket.TicketStatus.RESOLVED || status == SupportTicket.TicketStatus.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
            if (resolution != null) {
                ticket.setResolution(resolution);
            }
        }
        
        SupportTicket updatedTicket = supportTicketRepository.save(ticket);
        
        // Send notification
        try {
            sendTicketStatusUpdateNotification(updatedTicket);
        } catch (Exception e) {
            System.err.println("Failed to send status update notification: " + e.getMessage());
        }
        
        return updatedTicket;
    }

    /**
     * Assign ticket to user
     */
    public SupportTicket assignTicket(Long ticketId, Long userId) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            throw new RuntimeException("Ticket not found");
        }
        
        SupportTicket ticket = ticketOpt.get();
        ticket.setAssignedTo(userId);
        ticket.setStatus(SupportTicket.TicketStatus.IN_PROGRESS);
        
        return supportTicketRepository.save(ticket);
    }

    /**
     * Resolve ticket
     */
    public SupportTicket resolveTicket(Long ticketId, String resolution) {
        return updateTicketStatus(ticketId, SupportTicket.TicketStatus.RESOLVED, resolution);
    }

    /**
     * Close ticket
     */
    public SupportTicket closeTicket(Long ticketId, String resolution) {
        return updateTicketStatus(ticketId, SupportTicket.TicketStatus.CLOSED, resolution);
    }

    /**
     * Cancel ticket
     */
    public SupportTicket cancelTicket(Long ticketId) {
        return updateTicketStatus(ticketId, SupportTicket.TicketStatus.CANCELLED, null);
    }

    /**
     * Delete ticket
     */
    public void deleteTicket(Long id) {
        supportTicketRepository.deleteById(id);
    }

    /**
     * Get ticket statistics
     */
    public Map<String, Object> getTicketStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<SupportTicket> allTickets = supportTicketRepository.findAll();
        
        stats.put("total", allTickets.size());
        stats.put("open", supportTicketRepository.findByStatus(SupportTicket.TicketStatus.OPEN).size());
        stats.put("inProgress", supportTicketRepository.findByStatus(SupportTicket.TicketStatus.IN_PROGRESS).size());
        stats.put("resolved", supportTicketRepository.findByStatus(SupportTicket.TicketStatus.RESOLVED).size());
        stats.put("closed", supportTicketRepository.findByStatus(SupportTicket.TicketStatus.CLOSED).size());
        stats.put("cancelled", supportTicketRepository.findByStatus(SupportTicket.TicketStatus.CANCELLED).size());
        
        // Priority statistics
        stats.put("urgent", supportTicketRepository.findByPriority(SupportTicket.TicketPriority.URGENT).size());
        stats.put("high", supportTicketRepository.findByPriority(SupportTicket.TicketPriority.HIGH).size());
        stats.put("medium", supportTicketRepository.findByPriority(SupportTicket.TicketPriority.MEDIUM).size());
        stats.put("low", supportTicketRepository.findByPriority(SupportTicket.TicketPriority.LOW).size());
        
        // Calculate average resolution time
        long totalResolutionTime = 0;
        int resolvedCount = 0;
        for (SupportTicket ticket : allTickets) {
            if (ticket.getResolvedAt() != null && ticket.getCreatedAt() != null) {
                long hours = java.time.Duration.between(ticket.getCreatedAt(), ticket.getResolvedAt()).toHours();
                totalResolutionTime += hours;
                resolvedCount++;
            }
        }
        stats.put("averageResolutionHours", resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0);
        
        return stats;
    }

    /**
     * Get tickets by date range
     */
    public List<SupportTicket> getTicketsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return supportTicketRepository.findAll().stream()
            .filter(ticket -> ticket.getCreatedAt().isAfter(startDate) && ticket.getCreatedAt().isBefore(endDate))
            .toList();
    }

    /**
     * Generate unique ticket number
     */
    private String generateTicketNumber() {
        return "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * Send ticket created notification
     */
    private void sendTicketCreatedNotification(SupportTicket ticket) {
        if (ticket.getPhoneNumber() != null && !ticket.getPhoneNumber().isEmpty()) {
            String message = String.format(
                "Your support ticket %s has been created. Subject: %s. We'll get back to you soon. - GGWi-Fi",
                ticket.getTicketNumber(),
                ticket.getSubject()
            );
            smsService.sendSms(ticket.getPhoneNumber(), message);
        }
    }

    /**
     * Send ticket status update notification
     */
    private void sendTicketStatusUpdateNotification(SupportTicket ticket) {
        if (ticket.getPhoneNumber() != null && !ticket.getPhoneNumber().isEmpty()) {
            String message = String.format(
                "Your support ticket %s status has been updated to %s. - GGWi-Fi",
                ticket.getTicketNumber(),
                ticket.getStatus()
            );
            smsService.sendSms(ticket.getPhoneNumber(), message);
        }
    }
}

