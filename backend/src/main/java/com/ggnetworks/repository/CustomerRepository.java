package com.ggnetworks.repository;

import com.ggnetworks.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByPhoneNumber(String phoneNumber);
    
    Optional<Customer> findByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    boolean existsByEmail(String email);
    
    List<Customer> findByStatus(Customer.CustomerStatus status);
    
    List<Customer> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT c FROM Customer c WHERE c.phoneNumber = :phoneNumber AND c.status = 'ACTIVE'")
    Optional<Customer> findActiveByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt >= :startDate")
    Long countByCreatedAtAfter(@Param("startDate") LocalDateTime startDate);
}
