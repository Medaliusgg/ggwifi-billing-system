package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone_number", unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "alternate_phone")
    private String alternatePhone;

    @Column(name = "national_id", unique = true, nullable = false)
    private String nationalId;

    @Column(name = "passport_number")
    private String passportNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "marital_status")
    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "region")
    private String region;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "country")
    private String country = "Tanzania";

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "emergency_contact_relationship")
    private String emergencyContactRelationship;

    // Employment Details
    @Column(name = "employee_number", unique = true, nullable = false)
    private String employeeNumber;

    @Column(name = "position", nullable = false)
    private String position;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "employment_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    @Column(name = "employment_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private EmploymentStatus employmentStatus = EmploymentStatus.ACTIVE;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "termination_date")
    private LocalDate terminationDate;

    @Column(name = "probation_end_date")
    private LocalDate probationEndDate;

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "manager_id")
    private Long managerId;

    @Column(name = "manager_name")
    private String managerName;

    // Salary Details
    @Column(name = "base_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseSalary;

    @Column(name = "currency", nullable = false)
    private String currency = "TZS";

    @Column(name = "pay_frequency", nullable = false)
    @Enumerated(EnumType.STRING)
    private PayFrequency payFrequency = PayFrequency.MONTHLY;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "mobile_money_number")
    private String mobileMoneyNumber;

    @Column(name = "mobile_money_provider")
    private String mobileMoneyProvider;

    // Benefits and Deductions
    @Column(name = "health_insurance")
    private Boolean healthInsurance = false;

    @Column(name = "life_insurance")
    private Boolean lifeInsurance = false;

    @Column(name = "pension_contribution", precision = 5, scale = 2)
    private BigDecimal pensionContribution = BigDecimal.ZERO;

    @Column(name = "tax_deduction", precision = 5, scale = 2)
    private BigDecimal taxDeduction = BigDecimal.ZERO;

    @Column(name = "other_deductions", precision = 10, scale = 2)
    private BigDecimal otherDeductions = BigDecimal.ZERO;

    // Skills and Qualifications
    @Column(name = "education_level")
    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;

    @Column(name = "highest_degree")
    private String highestDegree;

    @Column(name = "institution")
    private String institution;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "certifications", columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "languages", columnDefinition = "TEXT")
    private String languages;

    // Performance and Reviews
    @Column(name = "last_performance_review")
    private LocalDate lastPerformanceReview;

    @Column(name = "performance_rating")
    private Integer performanceRating;

    @Column(name = "next_review_date")
    private LocalDate nextReviewDate;

    @Column(name = "promotion_eligible")
    private Boolean promotionEligible = false;

    // System Fields
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum MaritalStatus {
        SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED
    }

    public enum EmploymentType {
        FULL_TIME, PART_TIME, CONTRACT, INTERN, CONSULTANT, TEMPORARY
    }

    public enum EmploymentStatus {
        ACTIVE, INACTIVE, TERMINATED, ON_LEAVE, SUSPENDED, RETIRED
    }

    public enum PayFrequency {
        WEEKLY, BI_WEEKLY, MONTHLY, QUARTERLY, ANNUAL
    }

    public enum EducationLevel {
        PRIMARY, SECONDARY, DIPLOMA, BACHELOR, MASTER, PHD, CERTIFICATE, OTHER
    }

    // Constructors
    public Employee() {}

    public Employee(String employeeId, String firstName, String lastName, String email, 
                    String phoneNumber, String nationalId, String employeeNumber, 
                    String position, String department, BigDecimal baseSalary) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + " " + lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.nationalId = nationalId;
        this.employeeNumber = employeeNumber;
        this.position = position;
        this.department = department;
        this.baseSalary = baseSalary;
        this.hireDate = LocalDate.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { 
        this.firstName = firstName;
        this.fullName = firstName + " " + (lastName != null ? lastName : "");
    }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { 
        this.lastName = lastName;
        this.fullName = (firstName != null ? firstName : "") + " " + lastName;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAlternatePhone() { return alternatePhone; }
    public void setAlternatePhone(String alternatePhone) { this.alternatePhone = alternatePhone; }

    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }

    public String getPassportNumber() { return passportNumber; }
    public void setPassportNumber(String passportNumber) { this.passportNumber = passportNumber; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public MaritalStatus getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(MaritalStatus maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public String getEmergencyContactRelationship() { return emergencyContactRelationship; }
    public void setEmergencyContactRelationship(String emergencyContactRelationship) { this.emergencyContactRelationship = emergencyContactRelationship; }

    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }

    public EmploymentStatus getEmploymentStatus() { return employmentStatus; }
    public void setEmploymentStatus(EmploymentStatus employmentStatus) { this.employmentStatus = employmentStatus; }

    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }

    public LocalDate getTerminationDate() { return terminationDate; }
    public void setTerminationDate(LocalDate terminationDate) { this.terminationDate = terminationDate; }

    public LocalDate getProbationEndDate() { return probationEndDate; }
    public void setProbationEndDate(LocalDate probationEndDate) { this.probationEndDate = probationEndDate; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public BigDecimal getBaseSalary() { return baseSalary; }
    public void setBaseSalary(BigDecimal baseSalary) { this.baseSalary = baseSalary; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PayFrequency getPayFrequency() { return payFrequency; }
    public void setPayFrequency(PayFrequency payFrequency) { this.payFrequency = payFrequency; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getMobileMoneyNumber() { return mobileMoneyNumber; }
    public void setMobileMoneyNumber(String mobileMoneyNumber) { this.mobileMoneyNumber = mobileMoneyNumber; }

    public String getMobileMoneyProvider() { return mobileMoneyProvider; }
    public void setMobileMoneyProvider(String mobileMoneyProvider) { this.mobileMoneyProvider = mobileMoneyProvider; }

    public Boolean getHealthInsurance() { return healthInsurance; }
    public void setHealthInsurance(Boolean healthInsurance) { this.healthInsurance = healthInsurance; }

    public Boolean getLifeInsurance() { return lifeInsurance; }
    public void setLifeInsurance(Boolean lifeInsurance) { this.lifeInsurance = lifeInsurance; }

    public BigDecimal getPensionContribution() { return pensionContribution; }
    public void setPensionContribution(BigDecimal pensionContribution) { this.pensionContribution = pensionContribution; }

    public BigDecimal getTaxDeduction() { return taxDeduction; }
    public void setTaxDeduction(BigDecimal taxDeduction) { this.taxDeduction = taxDeduction; }

    public BigDecimal getOtherDeductions() { return otherDeductions; }
    public void setOtherDeductions(BigDecimal otherDeductions) { this.otherDeductions = otherDeductions; }

    public EducationLevel getEducationLevel() { return educationLevel; }
    public void setEducationLevel(EducationLevel educationLevel) { this.educationLevel = educationLevel; }

    public String getHighestDegree() { return highestDegree; }
    public void setHighestDegree(String highestDegree) { this.highestDegree = highestDegree; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public LocalDate getLastPerformanceReview() { return lastPerformanceReview; }
    public void setLastPerformanceReview(LocalDate lastPerformanceReview) { this.lastPerformanceReview = lastPerformanceReview; }

    public Integer getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(Integer performanceRating) { this.performanceRating = performanceRating; }

    public LocalDate getNextReviewDate() { return nextReviewDate; }
    public void setNextReviewDate(LocalDate nextReviewDate) { this.nextReviewDate = nextReviewDate; }

    public Boolean getPromotionEligible() { return promotionEligible; }
    public void setPromotionEligible(Boolean promotionEligible) { this.promotionEligible = promotionEligible; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
