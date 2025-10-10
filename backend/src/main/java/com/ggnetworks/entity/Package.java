package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "packages")
public class Package extends BaseEntity {

    @NotBlank(message = "Package name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private PackageType type;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "bandwidth_limit_mb")
    private Long bandwidthLimitMb;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_popular", nullable = false)
    private Boolean isPopular = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum PackageType {
        HOTSPOT, PPPOE
    }
} 