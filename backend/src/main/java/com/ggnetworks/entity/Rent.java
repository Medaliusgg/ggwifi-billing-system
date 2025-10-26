package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rents")
public class Rent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rent_id", unique = true, nullable = false)
    private String rentId;

    @Column(name = "location_id", nullable = false)
    private Long locationId;

    @Column(name = "location_name", nullable = false)
    private String locationName;

    @Column(name = "building_address", nullable = false)
    private String buildingAddress;

    @Column(name = "landlord_name")
    private String landlordName;

    @Column(name = "landlord_contact")
    private String landlordContact;

    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "currency", nullable = false)
    private String currency = "TZS";

    @Column(name = "rent_month", nullable = false)
    private String rentMonth; // Format: YYYY-MM

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private RentStatus status = RentStatus.PENDING;

    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_reference")
    private String paymentReference;

    @Column(name = "late_fee", precision = 10, scale = 2)
    private BigDecimal lateFee = BigDecimal.ZERO;

    @Column(name = "deposit_amount", precision = 10, scale = 2)
    private BigDecimal depositAmount;

    @Column(name = "utilities_included")
    private Boolean utilitiesIncluded = false;

    @Column(name = "utilities_amount", precision = 10, scale = 2)
    private BigDecimal utilitiesAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "lease_start_date")
    private LocalDateTime leaseStartDate;

    @Column(name = "lease_end_date")
    private LocalDateTime leaseEndDate;

    @Column(name = "lease_terms", columnDefinition = "TEXT")
    private String leaseTerms;

    @Column(name = "property_type")
    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Column(name = "area_sqft")
    private Double areaSqft;

    @Column(name = "rooms_count")
    private Integer roomsCount;

    @Column(name = "parking_spaces")
    private Integer parkingSpaces;

    @Column(name = "is_active")
    private Boolean isActive = true;

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
    public enum RentStatus {
        PENDING, PAID, OVERDUE, LATE, CANCELLED, REFUNDED
    }

    public enum PaymentMethod {
        BANK_TRANSFER, MPESA, TIGO_PESA, AIRTEL_MONEY, HALOPESA, CASH, CHECK
    }

    public enum PropertyType {
        OFFICE, WAREHOUSE, RETAIL, RESIDENTIAL, MIXED_USE, COWORKING, DATA_CENTER
    }

    // Constructors
    public Rent() {}

    public Rent(String rentId, Long locationId, String locationName, String buildingAddress, 
                BigDecimal monthlyRent, String rentMonth) {
        this.rentId = rentId;
        this.locationId = locationId;
        this.locationName = locationName;
        this.buildingAddress = buildingAddress;
        this.monthlyRent = monthlyRent;
        this.rentMonth = rentMonth;
        this.totalAmount = monthlyRent; // Will be calculated with utilities
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRentId() { return rentId; }
    public void setRentId(String rentId) { this.rentId = rentId; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getBuildingAddress() { return buildingAddress; }
    public void setBuildingAddress(String buildingAddress) { this.buildingAddress = buildingAddress; }

    public String getLandlordName() { return landlordName; }
    public void setLandlordName(String landlordName) { this.landlordName = landlordName; }

    public String getLandlordContact() { return landlordContact; }
    public void setLandlordContact(String landlordContact) { this.landlordContact = landlordContact; }

    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getRentMonth() { return rentMonth; }
    public void setRentMonth(String rentMonth) { this.rentMonth = rentMonth; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public RentStatus getStatus() { return status; }
    public void setStatus(RentStatus status) { this.status = status; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public BigDecimal getLateFee() { return lateFee; }
    public void setLateFee(BigDecimal lateFee) { this.lateFee = lateFee; }

    public BigDecimal getDepositAmount() { return depositAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public Boolean getUtilitiesIncluded() { return utilitiesIncluded; }
    public void setUtilitiesIncluded(Boolean utilitiesIncluded) { this.utilitiesIncluded = utilitiesIncluded; }

    public BigDecimal getUtilitiesAmount() { return utilitiesAmount; }
    public void setUtilitiesAmount(BigDecimal utilitiesAmount) { this.utilitiesAmount = utilitiesAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getLeaseStartDate() { return leaseStartDate; }
    public void setLeaseStartDate(LocalDateTime leaseStartDate) { this.leaseStartDate = leaseStartDate; }

    public LocalDateTime getLeaseEndDate() { return leaseEndDate; }
    public void setLeaseEndDate(LocalDateTime leaseEndDate) { this.leaseEndDate = leaseEndDate; }

    public String getLeaseTerms() { return leaseTerms; }
    public void setLeaseTerms(String leaseTerms) { this.leaseTerms = leaseTerms; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public Double getAreaSqft() { return areaSqft; }
    public void setAreaSqft(Double areaSqft) { this.areaSqft = areaSqft; }

    public Integer getRoomsCount() { return roomsCount; }
    public void setRoomsCount(Integer roomsCount) { this.roomsCount = roomsCount; }

    public Integer getParkingSpaces() { return parkingSpaces; }
    public void setParkingSpaces(Integer parkingSpaces) { this.parkingSpaces = parkingSpaces; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

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
