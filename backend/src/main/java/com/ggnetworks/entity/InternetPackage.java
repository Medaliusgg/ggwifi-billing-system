package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "internet_packages")
public class InternetPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "package_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PackageType packageType;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "data_limit_mb")
    private Long dataLimitMb;

    @Column(name = "is_unlimited_data")
    private Boolean isUnlimitedData = false;

    @Column(name = "upload_speed_mbps")
    private Integer uploadSpeedMbps;

    @Column(name = "download_speed_mbps")
    private Integer downloadSpeedMbps;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private PackageCategory category;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private PackageStatus status = PackageStatus.ACTIVE;

    @Column(name = "target_audience")
    @Enumerated(EnumType.STRING)
    private TargetAudience targetAudience;

    @Column(name = "billing_cycle")
    @Enumerated(EnumType.STRING)
    private BillingCycle billingCycle;

    @Column(name = "speed_tier")
    @Enumerated(EnumType.STRING)
    private SpeedTier speedTier;

    @Column(name = "data_limit")
    private String dataLimit;

    @Column(name = "speed_limit")
    private String speedLimit;

    @Column(name = "duration")
    private String duration;

    // Time-based offer fields
    @Column(name = "is_time_based_offer")
    private Boolean isTimeBasedOffer = false;

    @Column(name = "offer_type")
    @Enumerated(EnumType.STRING)
    private OfferType offerType;

    @Column(name = "available_days")
    private String availableDays; // JSON string: ["MONDAY", "TUESDAY"] or "WEEKEND"

    @Column(name = "offer_start_time")
    private String offerStartTime; // Format: "HH:mm" (e.g., "09:00")

    @Column(name = "offer_end_time")
    private String offerEndTime; // Format: "HH:mm" (e.g., "18:00")

    @Column(name = "offer_description")
    private String offerDescription;

    @Column(name = "original_price")
    private BigDecimal originalPrice; // Price before discount

    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public InternetPackage() {}

    public InternetPackage(String name, String description, PackageType packageType, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.packageType = packageType;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PackageType getPackageType() { return packageType; }
    public void setPackageType(PackageType packageType) { this.packageType = packageType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public Long getDataLimitMb() { return dataLimitMb; }
    public void setDataLimitMb(Long dataLimitMb) { this.dataLimitMb = dataLimitMb; }

    public Boolean getIsUnlimitedData() { return isUnlimitedData; }
    public void setIsUnlimitedData(Boolean isUnlimitedData) { this.isUnlimitedData = isUnlimitedData; }

    public Integer getUploadSpeedMbps() { return uploadSpeedMbps; }
    public void setUploadSpeedMbps(Integer uploadSpeedMbps) { this.uploadSpeedMbps = uploadSpeedMbps; }

    public Integer getDownloadSpeedMbps() { return downloadSpeedMbps; }
    public void setDownloadSpeedMbps(Integer downloadSpeedMbps) { this.downloadSpeedMbps = downloadSpeedMbps; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsPopular() { return isPopular; }
    public void setIsPopular(Boolean isPopular) { this.isPopular = isPopular; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public PackageCategory getCategory() { return category; }
    public void setCategory(PackageCategory category) { this.category = category; }

    public PackageStatus getStatus() { return status; }
    public void setStatus(PackageStatus status) { this.status = status; }

    public TargetAudience getTargetAudience() { return targetAudience; }
    public void setTargetAudience(TargetAudience targetAudience) { this.targetAudience = targetAudience; }

    public BillingCycle getBillingCycle() { return billingCycle; }
    public void setBillingCycle(BillingCycle billingCycle) { this.billingCycle = billingCycle; }

    public SpeedTier getSpeedTier() { return speedTier; }
    public void setSpeedTier(SpeedTier speedTier) { this.speedTier = speedTier; }

    public String getDataLimit() { return dataLimit; }
    public void setDataLimit(String dataLimit) { this.dataLimit = dataLimit; }

    public String getSpeedLimit() { return speedLimit; }
    public void setSpeedLimit(String speedLimit) { this.speedLimit = speedLimit; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Boolean getIsTimeBasedOffer() { return isTimeBasedOffer; }
    public void setIsTimeBasedOffer(Boolean isTimeBasedOffer) { this.isTimeBasedOffer = isTimeBasedOffer; }

    public OfferType getOfferType() { return offerType; }
    public void setOfferType(OfferType offerType) { this.offerType = offerType; }

    public String getAvailableDays() { return availableDays; }
    public void setAvailableDays(String availableDays) { this.availableDays = availableDays; }

    public String getOfferStartTime() { return offerStartTime; }
    public void setOfferStartTime(String offerStartTime) { this.offerStartTime = offerStartTime; }

    public String getOfferEndTime() { return offerEndTime; }
    public void setOfferEndTime(String offerEndTime) { this.offerEndTime = offerEndTime; }

    public String getOfferDescription() { return offerDescription; }
    public void setOfferDescription(String offerDescription) { this.offerDescription = offerDescription; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Integer getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Enums
    public enum PackageType {
        HOTSPOT, PPPOE, STATIC_IP, PREMIUM, STUDENT, ENTERPRISE, 
        PAY_AS_YOU_GO, RECURRING, TIME_BASED_OFFER
    }

    public enum PackageCategory {
        BASIC, STANDARD, PREMIUM, ENTERPRISE, STUDENT, FAMILY, BUSINESS, OFFER
    }

    public enum PackageStatus {
        ACTIVE, INACTIVE, DISCONTINUED, COMING_SOON, MAINTENANCE, SCHEDULED
    }

    public enum TargetAudience {
        INDIVIDUAL, FAMILY, STUDENT, BUSINESS, ENTERPRISE, RURAL, URBAN, ALL
    }

    public enum BillingCycle {
        DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY, PAY_AS_YOU_GO
    }

    public enum SpeedTier {
        BASIC, STANDARD, HIGH, PREMIUM, ULTRA
    }

    public enum OfferType {
        UNIVERSAL, // Available anytime
        DAILY_SPECIFIC, // Available on specific days (Monday, Tuesday, etc.)
        WEEKEND_ONLY, // Available only on weekends
        WEEKDAY_ONLY, // Available only on weekdays
        TIME_RESTRICTED, // Available only during specific hours
        LIMITED_TIME // Available for a limited period
    }
}