package com.ggnetworks.repository;

import com.ggnetworks.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByStatus(SupportTicket.TicketStatus status);
    List<SupportTicket> findByPriority(SupportTicket.TicketPriority priority);
    List<SupportTicket> findByCustomerId(Long customerId);
    List<SupportTicket> findByAssignedTo(Long assignedTo);
    List<SupportTicket> findByPhoneNumber(String phoneNumber);
}

