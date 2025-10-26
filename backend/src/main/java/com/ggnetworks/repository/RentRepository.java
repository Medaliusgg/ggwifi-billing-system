package com.ggnetworks.repository;

import com.ggnetworks.entity.Rent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RentRepository extends JpaRepository<Rent, Long> {
    
    Optional<Rent> findByRentId(String rentId);
    
    List<Rent> findByLocationId(Long locationId);
    
    List<Rent> findByLocationName(String locationName);
    
    List<Rent> findByStatus(Rent.RentStatus status);
    
    List<Rent> findByRentMonth(String rentMonth);
    
    List<Rent> findByPaymentMethod(Rent.PaymentMethod paymentMethod);
    
    List<Rent> findByPropertyType(Rent.PropertyType propertyType);
    
    List<Rent> findByLandlordName(String landlordName);
    
    List<Rent> findByLandlordContact(String landlordContact);
    
    List<Rent> findByCreatedBy(String createdBy);
    
    List<Rent> findByIsActive(Boolean isActive);
    
    List<Rent> findByRentMonthBetween(String startMonth, String endMonth);
    
    List<Rent> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Rent> findByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Rent> findByDueDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Rent> findByLeaseStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Rent> findByLeaseEndDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    boolean existsByRentId(String rentId);
    
    boolean existsByLocationIdAndRentMonth(Long locationId, String rentMonth);
    
    long countByStatus(Rent.RentStatus status);
    
    long countByLocationId(Long locationId);
    
    long countByRentMonth(String rentMonth);
    
    long countByPropertyType(Rent.PropertyType propertyType);
    
    long countByIsActive(Boolean isActive);
    
    long countByUtilitiesIncluded(Boolean utilitiesIncluded);
}
