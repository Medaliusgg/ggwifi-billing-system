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
    
    Optional<Customer> findByCustomerId(String customerId);
    
    Optional<Customer> findByEmail(String email);
    
    Optional<Customer> findByPrimaryPhoneNumber(String primaryPhoneNumber);
    
    Optional<Customer> findBySecondaryPhoneNumber(String secondaryPhoneNumber);
    
    @Query("SELECT c FROM Customer c WHERE c.primaryPhoneNumber = :phoneNumber OR c.secondaryPhoneNumber = :phoneNumber")
    Optional<Customer> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    List<Customer> findByStatus(Customer.CustomerStatus status);
    
    List<Customer> findByAccountType(Customer.AccountType accountType);
    
    List<Customer> findByRegistrationDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Customer> findByLastLoginBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Customer> findByFirstNameContainingIgnoreCase(String firstName);
    
    List<Customer> findByLastNameContainingIgnoreCase(String lastName);
    
    List<Customer> findByEmailContainingIgnoreCase(String email);
    
    List<Customer> findByPrimaryPhoneNumberContaining(String phoneNumber);
    
    List<Customer> findByEmailVerified(Boolean emailVerified);
    
    List<Customer> findByPhoneVerified(Boolean phoneVerified);
    
    boolean existsByEmail(String email);
    
    boolean existsByPrimaryPhoneNumber(String primaryPhoneNumber);
    
    boolean existsBySecondaryPhoneNumber(String secondaryPhoneNumber);
    
    long countByStatus(Customer.CustomerStatus status);
    
    long countByAccountType(Customer.AccountType accountType);
    
    long countByIsActiveTrue();
    
    long countByIsActiveFalse();
    
    long countByRegistrationDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Additional methods needed by services
    List<Customer> findByIsActiveTrue();
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt >= :date")
    long countByCreatedAtAfter(@Param("date") LocalDateTime date);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}