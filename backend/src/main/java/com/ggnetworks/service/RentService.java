package com.ggnetworks.service;

import com.ggnetworks.entity.Rent;
import com.ggnetworks.repository.RentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

/**
 * Rent Service
 * Manages rent payments and tracking
 */
@Service
@Transactional
public class RentService {

    @Autowired
    private RentRepository rentRepository;

    /**
     * Create a new rent record
     */
    public Rent createRent(Rent rent) {
        if (rent.getRentId() == null || rent.getRentId().isEmpty()) {
            rent.setRentId("RENT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        
        // Calculate total amount if not set
        if (rent.getTotalAmount() == null) {
            BigDecimal total = rent.getMonthlyRent()
                .add(rent.getLateFee() != null ? rent.getLateFee() : BigDecimal.ZERO)
                .add(rent.getUtilitiesAmount() != null && !rent.getUtilitiesIncluded() ? 
                    rent.getUtilitiesAmount() : BigDecimal.ZERO);
            rent.setTotalAmount(total);
        }
        
        return rentRepository.save(rent);
    }

    /**
     * Get rent by ID
     */
    public Optional<Rent> getRentById(Long id) {
        return rentRepository.findById(id);
    }

    /**
     * Get rent by rent ID
     */
    public Optional<Rent> getRentByRentId(String rentId) {
        return rentRepository.findAll().stream()
            .filter(r -> r.getRentId().equals(rentId))
            .findFirst();
    }

    /**
     * Get all rents
     */
    public List<Rent> getAllRents() {
        return rentRepository.findAll();
    }

    /**
     * Get rents by location ID
     */
    public List<Rent> getRentsByLocationId(Long locationId) {
        return rentRepository.findAll().stream()
            .filter(r -> r.getLocationId().equals(locationId))
            .toList();
    }

    /**
     * Get rents by status
     */
    public List<Rent> getRentsByStatus(Rent.RentStatus status) {
        return rentRepository.findByStatus(status);
    }

    /**
     * Get rents by month
     */
    public List<Rent> getRentsByMonth(String rentMonth) {
        return rentRepository.findAll().stream()
            .filter(r -> r.getRentMonth().equals(rentMonth))
            .toList();
    }

    /**
     * Update rent
     */
    public Rent updateRent(Rent rent) {
        // Recalculate total amount
        BigDecimal total = rent.getMonthlyRent()
            .add(rent.getLateFee() != null ? rent.getLateFee() : BigDecimal.ZERO)
            .add(rent.getUtilitiesAmount() != null && !rent.getUtilitiesIncluded() ? 
                rent.getUtilitiesAmount() : BigDecimal.ZERO);
        rent.setTotalAmount(total);
        
        return rentRepository.save(rent);
    }

    /**
     * Mark rent as paid
     */
    public Rent markRentAsPaid(Long rentId, LocalDateTime paymentDate, 
                               Rent.PaymentMethod paymentMethod, String paymentReference) {
        Optional<Rent> rentOpt = rentRepository.findById(rentId);
        if (rentOpt.isEmpty()) {
            throw new RuntimeException("Rent not found");
        }
        
        Rent rent = rentOpt.get();
        rent.setStatus(Rent.RentStatus.PAID);
        rent.setPaymentDate(paymentDate != null ? paymentDate : LocalDateTime.now());
        rent.setPaymentMethod(paymentMethod);
        rent.setPaymentReference(paymentReference);
        
        return rentRepository.save(rent);
    }

    /**
     * Add late fee
     */
    public Rent addLateFee(Long rentId, BigDecimal lateFee) {
        Optional<Rent> rentOpt = rentRepository.findById(rentId);
        if (rentOpt.isEmpty()) {
            throw new RuntimeException("Rent not found");
        }
        
        Rent rent = rentOpt.get();
        rent.setLateFee(rent.getLateFee().add(lateFee));
        rent.setTotalAmount(rent.getTotalAmount().add(lateFee));
        rent.setStatus(Rent.RentStatus.OVERDUE);
        
        return rentRepository.save(rent);
    }

    /**
     * Get rent statistics
     */
    public Map<String, Object> getRentStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Rent> allRents = rentRepository.findAll();
        List<Rent> paidRents = rentRepository.findByStatus(Rent.RentStatus.PAID);
        List<Rent> pendingRents = rentRepository.findByStatus(Rent.RentStatus.PENDING);
        List<Rent> overdueRents = rentRepository.findByStatus(Rent.RentStatus.OVERDUE);
        
        BigDecimal totalMonthlyRent = allRents.stream()
            .map(Rent::getMonthlyRent)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPaid = paidRents.stream()
            .map(Rent::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPending = pendingRents.stream()
            .map(Rent::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalOverdue = overdueRents.stream()
            .map(Rent::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalRents", allRents.size());
        stats.put("paidRents", paidRents.size());
        stats.put("pendingRents", pendingRents.size());
        stats.put("overdueRents", overdueRents.size());
        stats.put("totalMonthlyRent", totalMonthlyRent);
        stats.put("totalPaid", totalPaid);
        stats.put("totalPending", totalPending);
        stats.put("totalOverdue", totalOverdue);
        
        return stats;
    }

    /**
     * Delete rent
     */
    public void deleteRent(Long id) {
        rentRepository.deleteById(id);
    }
}

