package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rent_places")
public class RentPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "place_id", unique = true, nullable = false)
    private String placeId;

    @Column(name = "place_name", nullable = false)
    private String placeName;

    @Column(name = "place_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PlaceType placeType;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "region", nullable = false)
    private String region;

    @Column(name = "district")
    private String district;

    @Column(name = "ward")
    private String ward;

    @Column(name = "street")
    private String street;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "country")
    private String country = "Tanzania";

    // Geographic Information
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "gps_coordinates")
    private String gpsCoordinates;

    @Column(name = "google_maps_link")
    private String googleMapsLink;

    // Property Details
    @Column(name = "property_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Column(name = "floor_area_sqft")
    private Double floorAreaSqft;

    @Column(name = "usable_area_sqft")
    private Double usableAreaSqft;

    @Column(name = "land_area_sqft")
    private Double landAreaSqft;

    @Column(name = "floors_count")
    private Integer floorsCount;

    @Column(name = "rooms_count")
    private Integer roomsCount;

    @Column(name = "bedrooms_count")
    private Integer bedroomsCount;

    @Column(name = "bathrooms_count")
    private Integer bathroomsCount;

    @Column(name = "parking_spaces")
    private Integer parkingSpaces;

    @Column(name = "parking_type")
    @Enumerated(EnumType.STRING)
    private ParkingType parkingType;

    @Column(name = "building_age_years")
    private Integer buildingAgeYears;

    @Column(name = "construction_year")
    private Integer constructionYear;

    @Column(name = "building_material")
    private String buildingMaterial;

    @Column(name = "roof_type")
    private String roofType;

    // Infrastructure and Amenities
    @Column(name = "has_electricity")
    private Boolean hasElectricity = true;

    @Column(name = "has_water")
    private Boolean hasWater = true;

    @Column(name = "has_internet")
    private Boolean hasInternet = true;

    @Column(name = "has_sewerage")
    private Boolean hasSewerage = true;

    @Column(name = "has_security")
    private Boolean hasSecurity = false;

    @Column(name = "has_air_conditioning")
    private Boolean hasAirConditioning = false;

    @Column(name = "has_generator")
    private Boolean hasGenerator = false;

    @Column(name = "has_elevator")
    private Boolean hasElevator = false;

    @Column(name = "has_disability_access")
    private Boolean hasDisabilityAccess = false;

    @Column(name = "has_garden")
    private Boolean hasGarden = false;

    @Column(name = "has_balcony")
    private Boolean hasBalcony = false;

    @Column(name = "has_terrace")
    private Boolean hasTerrace = false;

    @Column(name = "amenities", columnDefinition = "TEXT")
    private String amenities;

    // Landlord Information
    @Column(name = "landlord_name", nullable = false)
    private String landlordName;

    @Column(name = "landlord_contact_primary", nullable = false)
    private String landlordContactPrimary;

    @Column(name = "landlord_contact_secondary")
    private String landlordContactSecondary;

    @Column(name = "landlord_email")
    private String landlordEmail;

    @Column(name = "landlord_address", columnDefinition = "TEXT")
    private String landlordAddress;

    @Column(name = "landlord_national_id")
    private String landlordNationalId;

    @Column(name = "landlord_tax_id")
    private String landlordTaxId;

    @Column(name = "landlord_bank_details", columnDefinition = "TEXT")
    private String landlordBankDetails;

    // Rental Information
    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "currency", nullable = false)
    private String currency = "TZS";

    @Column(name = "deposit_amount", precision = 10, scale = 2)
    private BigDecimal depositAmount;

    @Column(name = "utilities_included")
    private Boolean utilitiesIncluded = false;

    @Column(name = "utilities_amount", precision = 10, scale = 2)
    private BigDecimal utilitiesAmount = BigDecimal.ZERO;

    @Column(name = "total_monthly_cost", precision = 10, scale = 2)
    private BigDecimal totalMonthlyCost;

    @Column(name = "lease_start_date")
    private LocalDateTime leaseStartDate;

    @Column(name = "lease_end_date")
    private LocalDateTime leaseEndDate;

    @Column(name = "lease_duration_months")
    private Integer leaseDurationMonths;

    @Column(name = "lease_renewal_date")
    private LocalDateTime leaseRenewalDate;

    @Column(name = "notice_period_days")
    private Integer noticePeriodDays = 30;

    // Payment Terms
    @Column(name = "payment_due_day")
    private Integer paymentDueDay = 1; // Day of month

    @Column(name = "grace_period_days")
    private Integer gracePeriodDays = 5;

    @Column(name = "late_fee_percentage", precision = 5, scale = 2)
    private BigDecimal lateFeePercentage = BigDecimal.ZERO;

    @Column(name = "late_fee_fixed_amount", precision = 10, scale = 2)
    private BigDecimal lateFeeFixedAmount = BigDecimal.ZERO;

    @Column(name = "accepted_payment_methods", columnDefinition = "TEXT")
    private String acceptedPaymentMethods;

    // Business Use Information
    @Column(name = "business_type")
    private String businessType;

    @Column(name = "business_license_number")
    private String businessLicenseNumber;

    @Column(name = "business_description", columnDefinition = "TEXT")
    private String businessDescription;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "customer_capacity")
    private Integer customerCapacity;

    @Column(name = "operating_hours")
    private String operatingHours;

    // Status and Management
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private PlaceStatus status = PlaceStatus.ACTIVE;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_occupied")
    private Boolean isOccupied = false;

    @Column(name = "occupancy_start_date")
    private LocalDateTime occupancyStartDate;

    @Column(name = "last_inspection_date")
    private LocalDateTime lastInspectionDate;

    @Column(name = "next_inspection_date")
    private LocalDateTime nextInspectionDate;

    @Column(name = "maintenance_contact")
    private String maintenanceContact;

    @Column(name = "insurance_policy_number")
    private String insurancePolicyNumber;

    @Column(name = "insurance_expiry_date")
    private LocalDateTime insuranceExpiryDate;

    // Documentation
    @Column(name = "lease_document_path")
    private String leaseDocumentPath;

    @Column(name = "property_photos", columnDefinition = "TEXT")
    private String propertyPhotos;

    @Column(name = "floor_plans", columnDefinition = "TEXT")
    private String floorPlans;

    @Column(name = "legal_documents", columnDefinition = "TEXT")
    private String legalDocuments;

    // System Fields
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
    public enum PlaceType {
        MAIN_OFFICE, BRANCH_OFFICE, HOTSPOT_LOCATION, WAREHOUSE, RETAIL_SHOP, 
        DATA_CENTER, CUSTOMER_SERVICE_CENTER, TECHNICAL_CENTER, STORAGE_FACILITY
    }

    public enum PropertyType {
        OFFICE, RETAIL, WAREHOUSE, RESIDENTIAL, MIXED_USE, INDUSTRIAL, 
        COMMERCIAL, COWORKING_SPACE, DATA_CENTER, STORAGE
    }

    public enum ParkingType {
        NONE, STREET, SURFACE, UNDERGROUND, MULTI_LEVEL, RESERVED, ASSIGNED
    }

    public enum PlaceStatus {
        ACTIVE, INACTIVE, UNDER_MAINTENANCE, RENOVATION, VACANT, OCCUPIED, 
        LEASED, AVAILABLE_FOR_RENT, SOLD, DEMOLISHED
    }

    // Constructors
    public RentPlace() {}

    public RentPlace(String placeId, String placeName, PlaceType placeType, String address, 
                     String city, String region, PropertyType propertyType, 
                     String landlordName, String landlordContactPrimary, BigDecimal monthlyRent) {
        this.placeId = placeId;
        this.placeName = placeName;
        this.placeType = placeType;
        this.address = address;
        this.city = city;
        this.region = region;
        this.propertyType = propertyType;
        this.landlordName = landlordName;
        this.landlordContactPrimary = landlordContactPrimary;
        this.monthlyRent = monthlyRent;
        this.totalMonthlyCost = monthlyRent;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public PlaceType getPlaceType() { return placeType; }
    public void setPlaceType(PlaceType placeType) { this.placeType = placeType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getGpsCoordinates() { return gpsCoordinates; }
    public void setGpsCoordinates(String gpsCoordinates) { this.gpsCoordinates = gpsCoordinates; }

    public String getGoogleMapsLink() { return googleMapsLink; }
    public void setGoogleMapsLink(String googleMapsLink) { this.googleMapsLink = googleMapsLink; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public Double getFloorAreaSqft() { return floorAreaSqft; }
    public void setFloorAreaSqft(Double floorAreaSqft) { this.floorAreaSqft = floorAreaSqft; }

    public Double getUsableAreaSqft() { return usableAreaSqft; }
    public void setUsableAreaSqft(Double usableAreaSqft) { this.usableAreaSqft = usableAreaSqft; }

    public Double getLandAreaSqft() { return landAreaSqft; }
    public void setLandAreaSqft(Double landAreaSqft) { this.landAreaSqft = landAreaSqft; }

    public Integer getFloorsCount() { return floorsCount; }
    public void setFloorsCount(Integer floorsCount) { this.floorsCount = floorsCount; }

    public Integer getRoomsCount() { return roomsCount; }
    public void setRoomsCount(Integer roomsCount) { this.roomsCount = roomsCount; }

    public Integer getBedroomsCount() { return bedroomsCount; }
    public void setBedroomsCount(Integer bedroomsCount) { this.bedroomsCount = bedroomsCount; }

    public Integer getBathroomsCount() { return bathroomsCount; }
    public void setBathroomsCount(Integer bathroomsCount) { this.bathroomsCount = bathroomsCount; }

    public Integer getParkingSpaces() { return parkingSpaces; }
    public void setParkingSpaces(Integer parkingSpaces) { this.parkingSpaces = parkingSpaces; }

    public ParkingType getParkingType() { return parkingType; }
    public void setParkingType(ParkingType parkingType) { this.parkingType = parkingType; }

    public Integer getBuildingAgeYears() { return buildingAgeYears; }
    public void setBuildingAgeYears(Integer buildingAgeYears) { this.buildingAgeYears = buildingAgeYears; }

    public Integer getConstructionYear() { return constructionYear; }
    public void setConstructionYear(Integer constructionYear) { this.constructionYear = constructionYear; }

    public String getBuildingMaterial() { return buildingMaterial; }
    public void setBuildingMaterial(String buildingMaterial) { this.buildingMaterial = buildingMaterial; }

    public String getRoofType() { return roofType; }
    public void setRoofType(String roofType) { this.roofType = roofType; }

    // Infrastructure and Amenities getters/setters
    public Boolean getHasElectricity() { return hasElectricity; }
    public void setHasElectricity(Boolean hasElectricity) { this.hasElectricity = hasElectricity; }

    public Boolean getHasWater() { return hasWater; }
    public void setHasWater(Boolean hasWater) { this.hasWater = hasWater; }

    public Boolean getHasInternet() { return hasInternet; }
    public void setHasInternet(Boolean hasInternet) { this.hasInternet = hasInternet; }

    public Boolean getHasSewerage() { return hasSewerage; }
    public void setHasSewerage(Boolean hasSewerage) { this.hasSewerage = hasSewerage; }

    public Boolean getHasSecurity() { return hasSecurity; }
    public void setHasSecurity(Boolean hasSecurity) { this.hasSecurity = hasSecurity; }

    public Boolean getHasAirConditioning() { return hasAirConditioning; }
    public void setHasAirConditioning(Boolean hasAirConditioning) { this.hasAirConditioning = hasAirConditioning; }

    public Boolean getHasGenerator() { return hasGenerator; }
    public void setHasGenerator(Boolean hasGenerator) { this.hasGenerator = hasGenerator; }

    public Boolean getHasElevator() { return hasElevator; }
    public void setHasElevator(Boolean hasElevator) { this.hasElevator = hasElevator; }

    public Boolean getHasDisabilityAccess() { return hasDisabilityAccess; }
    public void setHasDisabilityAccess(Boolean hasDisabilityAccess) { this.hasDisabilityAccess = hasDisabilityAccess; }

    public Boolean getHasGarden() { return hasGarden; }
    public void setHasGarden(Boolean hasGarden) { this.hasGarden = hasGarden; }

    public Boolean getHasBalcony() { return hasBalcony; }
    public void setHasBalcony(Boolean hasBalcony) { this.hasBalcony = hasBalcony; }

    public Boolean getHasTerrace() { return hasTerrace; }
    public void setHasTerrace(Boolean hasTerrace) { this.hasTerrace = hasTerrace; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    // Landlord Information getters/setters
    public String getLandlordName() { return landlordName; }
    public void setLandlordName(String landlordName) { this.landlordName = landlordName; }

    public String getLandlordContactPrimary() { return landlordContactPrimary; }
    public void setLandlordContactPrimary(String landlordContactPrimary) { this.landlordContactPrimary = landlordContactPrimary; }

    public String getLandlordContactSecondary() { return landlordContactSecondary; }
    public void setLandlordContactSecondary(String landlordContactSecondary) { this.landlordContactSecondary = landlordContactSecondary; }

    public String getLandlordEmail() { return landlordEmail; }
    public void setLandlordEmail(String landlordEmail) { this.landlordEmail = landlordEmail; }

    public String getLandlordAddress() { return landlordAddress; }
    public void setLandlordAddress(String landlordAddress) { this.landlordAddress = landlordAddress; }

    public String getLandlordNationalId() { return landlordNationalId; }
    public void setLandlordNationalId(String landlordNationalId) { this.landlordNationalId = landlordNationalId; }

    public String getLandlordTaxId() { return landlordTaxId; }
    public void setLandlordTaxId(String landlordTaxId) { this.landlordTaxId = landlordTaxId; }

    public String getLandlordBankDetails() { return landlordBankDetails; }
    public void setLandlordBankDetails(String landlordBankDetails) { this.landlordBankDetails = landlordBankDetails; }

    // Rental Information getters/setters
    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getDepositAmount() { return depositAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public Boolean getUtilitiesIncluded() { return utilitiesIncluded; }
    public void setUtilitiesIncluded(Boolean utilitiesIncluded) { this.utilitiesIncluded = utilitiesIncluded; }

    public BigDecimal getUtilitiesAmount() { return utilitiesAmount; }
    public void setUtilitiesAmount(BigDecimal utilitiesAmount) { this.utilitiesAmount = utilitiesAmount; }

    public BigDecimal getTotalMonthlyCost() { return totalMonthlyCost; }
    public void setTotalMonthlyCost(BigDecimal totalMonthlyCost) { this.totalMonthlyCost = totalMonthlyCost; }

    public LocalDateTime getLeaseStartDate() { return leaseStartDate; }
    public void setLeaseStartDate(LocalDateTime leaseStartDate) { this.leaseStartDate = leaseStartDate; }

    public LocalDateTime getLeaseEndDate() { return leaseEndDate; }
    public void setLeaseEndDate(LocalDateTime leaseEndDate) { this.leaseEndDate = leaseEndDate; }

    public Integer getLeaseDurationMonths() { return leaseDurationMonths; }
    public void setLeaseDurationMonths(Integer leaseDurationMonths) { this.leaseDurationMonths = leaseDurationMonths; }

    public LocalDateTime getLeaseRenewalDate() { return leaseRenewalDate; }
    public void setLeaseRenewalDate(LocalDateTime leaseRenewalDate) { this.leaseRenewalDate = leaseRenewalDate; }

    public Integer getNoticePeriodDays() { return noticePeriodDays; }
    public void setNoticePeriodDays(Integer noticePeriodDays) { this.noticePeriodDays = noticePeriodDays; }

    public Integer getPaymentDueDay() { return paymentDueDay; }
    public void setPaymentDueDay(Integer paymentDueDay) { this.paymentDueDay = paymentDueDay; }

    public Integer getGracePeriodDays() { return gracePeriodDays; }
    public void setGracePeriodDays(Integer gracePeriodDays) { this.gracePeriodDays = gracePeriodDays; }

    public BigDecimal getLateFeePercentage() { return lateFeePercentage; }
    public void setLateFeePercentage(BigDecimal lateFeePercentage) { this.lateFeePercentage = lateFeePercentage; }

    public BigDecimal getLateFeeFixedAmount() { return lateFeeFixedAmount; }
    public void setLateFeeFixedAmount(BigDecimal lateFeeFixedAmount) { this.lateFeeFixedAmount = lateFeeFixedAmount; }

    public String getAcceptedPaymentMethods() { return acceptedPaymentMethods; }
    public void setAcceptedPaymentMethods(String acceptedPaymentMethods) { this.acceptedPaymentMethods = acceptedPaymentMethods; }

    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }

    public String getBusinessLicenseNumber() { return businessLicenseNumber; }
    public void setBusinessLicenseNumber(String businessLicenseNumber) { this.businessLicenseNumber = businessLicenseNumber; }

    public String getBusinessDescription() { return businessDescription; }
    public void setBusinessDescription(String businessDescription) { this.businessDescription = businessDescription; }

    public Integer getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(Integer employeeCount) { this.employeeCount = employeeCount; }

    public Integer getCustomerCapacity() { return customerCapacity; }
    public void setCustomerCapacity(Integer customerCapacity) { this.customerCapacity = customerCapacity; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public PlaceStatus getStatus() { return status; }
    public void setStatus(PlaceStatus status) { this.status = status; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsOccupied() { return isOccupied; }
    public void setIsOccupied(Boolean isOccupied) { this.isOccupied = isOccupied; }

    public LocalDateTime getOccupancyStartDate() { return occupancyStartDate; }
    public void setOccupancyStartDate(LocalDateTime occupancyStartDate) { this.occupancyStartDate = occupancyStartDate; }

    public LocalDateTime getLastInspectionDate() { return lastInspectionDate; }
    public void setLastInspectionDate(LocalDateTime lastInspectionDate) { this.lastInspectionDate = lastInspectionDate; }

    public LocalDateTime getNextInspectionDate() { return nextInspectionDate; }
    public void setNextInspectionDate(LocalDateTime nextInspectionDate) { this.nextInspectionDate = nextInspectionDate; }

    public String getMaintenanceContact() { return maintenanceContact; }
    public void setMaintenanceContact(String maintenanceContact) { this.maintenanceContact = maintenanceContact; }

    public String getInsurancePolicyNumber() { return insurancePolicyNumber; }
    public void setInsurancePolicyNumber(String insurancePolicyNumber) { this.insurancePolicyNumber = insurancePolicyNumber; }

    public LocalDateTime getInsuranceExpiryDate() { return insuranceExpiryDate; }
    public void setInsuranceExpiryDate(LocalDateTime insuranceExpiryDate) { this.insuranceExpiryDate = insuranceExpiryDate; }

    public String getLeaseDocumentPath() { return leaseDocumentPath; }
    public void setLeaseDocumentPath(String leaseDocumentPath) { this.leaseDocumentPath = leaseDocumentPath; }

    public String getPropertyPhotos() { return propertyPhotos; }
    public void setPropertyPhotos(String propertyPhotos) { this.propertyPhotos = propertyPhotos; }

    public String getFloorPlans() { return floorPlans; }
    public void setFloorPlans(String floorPlans) { this.floorPlans = floorPlans; }

    public String getLegalDocuments() { return legalDocuments; }
    public void setLegalDocuments(String legalDocuments) { this.legalDocuments = legalDocuments; }

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
