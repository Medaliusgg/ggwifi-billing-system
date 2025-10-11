package com.ggnetworks.entity;

/**
 * Enum representing different types of internet packages
 */
public enum PackageType {
    DATA_ONLY("Data Only"),
    TIME_BASED("Time Based"),
    UNLIMITED("Unlimited"),
    PREPAID("Prepaid"),
    POSTPAID("Postpaid");

    private final String displayName;

    PackageType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
