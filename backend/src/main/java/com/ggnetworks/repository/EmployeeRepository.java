package com.ggnetworks.repository;

import com.ggnetworks.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    Optional<Employee> findByEmployeeNumber(String employeeNumber);
    
    Optional<Employee> findByEmail(String email);
    
    Optional<Employee> findByPhoneNumber(String phoneNumber);
    
    Optional<Employee> findByNationalId(String nationalId);
    
    List<Employee> findByFirstName(String firstName);
    
    List<Employee> findByLastName(String lastName);
    
    List<Employee> findByFullNameContainingIgnoreCase(String fullName);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByPosition(String position);
    
    List<Employee> findByEmploymentType(Employee.EmploymentType employmentType);
    
    List<Employee> findByEmploymentStatus(Employee.EmploymentStatus employmentStatus);
    
    List<Employee> findByLocationId(Long locationId);
    
    List<Employee> findByLocationName(String locationName);
    
    List<Employee> findByManagerId(Long managerId);
    
    List<Employee> findByManagerName(String managerName);
    
    List<Employee> findByGender(Employee.Gender gender);
    
    List<Employee> findByCity(String city);
    
    List<Employee> findByRegion(String region);
    
    List<Employee> findByIsActive(Boolean isActive);
    
    List<Employee> findByHireDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Employee> findByTerminationDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Employee> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Employee> findByPayFrequency(Employee.PayFrequency payFrequency);
    
    List<Employee> findByEducationLevel(Employee.EducationLevel educationLevel);
    
    List<Employee> findByPromotionEligible(Boolean promotionEligible);
    
    boolean existsByEmployeeId(String employeeId);
    
    boolean existsByEmployeeNumber(String employeeNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    boolean existsByNationalId(String nationalId);
    
    long countByDepartment(String department);
    
    long countByEmploymentType(Employee.EmploymentType employmentType);
    
    long countByEmploymentStatus(Employee.EmploymentStatus employmentStatus);
    
    long countByLocationId(Long locationId);
    
    long countByIsActive(Boolean isActive);
    
    long countByGender(Employee.Gender gender);
    
    long countByPayFrequency(Employee.PayFrequency payFrequency);
    
    long countByEducationLevel(Employee.EducationLevel educationLevel);
    
    long countByHireDateBetween(LocalDate startDate, LocalDate endDate);
}
