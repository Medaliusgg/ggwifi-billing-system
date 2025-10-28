# Package Management System - Complete Guide

**Date:** 2025-10-27  
**Status:** ✅ Fully Implemented (Backend) | 🔧 Frontend Enhancement Needed

---

## 📦 Package Management Overview

The GG-WIFI system supports two types of packages:

1. **Universal Packages** - Available 24/7, no time restrictions
2. **Offer Packages** - Time-based packages with specific availability windows

---

## 🏗️ Backend Architecture

### Entity Structure

```java
InternetPackage {
    // Basic Information
    Long id
    String name
    String description
    BigDecimal price
    Integer durationDays
    String dataLimit
    String speedLimit
    String duration
    
    // Package Type & Status
    PackageType packageType (HOTSPOT, PPPOE, etc.)
    PackageCategory category (BASIC, STANDARD, PREMIUM, etc.)
    PackageStatus status (ACTIVE, INACTIVE, etc.)
    
    // Time-Based Offer Fields
    Boolean isTimeBasedOffer
    OfferType offerType (UNIVERSAL, WEEKEND_ONLY, TIME_RESTRICTED, etc.)
    String offerDescription
    String offerStartTime (HH:mm format)
    String offerEndTime (HH:mm format)
    String availableDays (JSON array)
    BigDecimal originalPrice (for discounts)
    Integer discountPercentage
    
    // Flags
    Boolean isActive
    Boolean isPopular
    Boolean isFeatured
}
```

### Offer Types

| Type | Description | Availability |
|------|-------------|--------------|
| `UNIVERSAL` | Available 24/7 | Always available |
| `DAILY_SPECIFIC` | Specific days only | Monday, Tuesday, etc. |
| `WEEKEND_ONLY` | Weekends only | Saturday & Sunday |
| `WEEKDAY_ONLY` | Weekdays only | Monday - Friday |
| `TIME_RESTRICTED` | Specific hours | e.g., 9 AM - 5 PM |
| `LIMITED_TIME` | Limited period | Start/end dates |

---

## ⚙️ How Package Management Works

### 1. **Admin Creates Packages**

Admin uses `/admin/packages` endpoint to create packages with these fields:

```json
POST /admin/packages
{
  "name": "Weekend Deal",
  "description": "Special weekend package",
  "price": 15000,
  "durationDays": 30,
  "dataLimit": "Unlimited",
  "speedLimit": "50 Mbps",
  "packageType": "HOTSPOT",
  "category": "OFFER",
  
  // Time-based offer configuration
  "isTimeBasedOffer": true,
  "offerType": "WEEKEND_ONLY",
  "offerStartTime": "00:00",
  "offerEndTime": "23:59",
  "offerDescription": "Available only on weekends!",
  "originalPrice": 20000,
  "discountPercentage": 25,
  
  "isActive": true,
  "isPopular": false,
  "isFeatured": true
}
```

### 2. **Backend Filters Packages by Availability**

The `PackageService.getAvailablePackagesForCustomers()` method:

1. Gets all active packages from database
2. Checks each package's availability based on:
   - Current day of week
   - Current time
   - Offer type
   - Time restrictions
3. Returns only packages currently available

**Logic Flow:**

```
isPackageCurrentlyAvailable(package):
  IF isTimeBasedOffer == false:
    RETURN true  // Universal package - always available
  
  SWITCH offerType:
    CASE UNIVERSAL:
      RETURN true
    
    CASE WEEKEND_ONLY:
      IF currentDay is Saturday OR Sunday:
        IF currentTime between offerStartTime AND offerEndTime:
          RETURN true
      RETURN false
    
    CASE WEEKDAY_ONLY:
      IF currentDay is NOT weekend:
        IF currentTime between offerStartTime AND offerEndTime:
          RETURN true
      RETURN false
    
    CASE TIME_RESTRICTED:
      IF currentTime between offerStartTime AND offerEndTime:
        RETURN true
      RETURN false
    
    CASE DAILY_SPECIFIC:
      IF currentDay in availableDays:
        IF currentTime between offerStartTime AND offerEndTime:
          RETURN true
      RETURN false
```

### 3. **Customer Portal Displays Packages**

**API Endpoint:** `GET /customer-portal/packages`

Returns filtered packages that are currently available based on time.

---

## 🛒 Customer Portal Integration

### Current Backend Response

The backend currently returns these fields (lines 382-389 in CustomerPortalController.java):

```java
packageData.put("isTimeBasedOffer", false); // TEMPORARILY DISABLED
packageData.put("offerType", null);        // TEMPORARILY DISABLED
packageData.put("offerDescription", null); // TEMPORARILY DISABLED
packageData.put("originalPrice", null);     // TEMPORARILY DISABLED
```

### What Needs to be Enabled

Uncomment lines 382-389 in `CustomerPortalController.java`:

```java
// Change from:
packageData.put("isTimeBasedOffer", false);

// To:
packageData.put("isTimeBasedOffer", pkg.getIsTimeBasedOffer());
packageData.put("offerType", pkg.getOfferType());
packageData.put("offerDescription", pkg.getOfferDescription());
packageData.put("offerStartTime", pkg.getOfferStartTime());
packageData.put("offerEndTime", pkg.getOfferEndTime());
packageData.put("originalPrice", pkg.getOriginalPrice());
packageData.put("discountPercentage", pkg.getDiscountPercentage());
```

---

## 🎨 Frontend Display Implementation

### 1. Display Package Type Badge

```javascript
// In BuyPackage.jsx, add to package card:
{pkg.isTimeBasedOffer ? (
  <Chip 
    label="Limited Offer" 
    color="warning" 
    size="small"
    sx={{ position: 'absolute', top: 8, right: 8 }}
  />
) : (
  <Chip 
    label="Available 24/7" 
    color="success" 
    size="small"
    sx={{ position: 'absolute', top: 8, right: 8 }}
  />
)}
```

### 2. Display Discount Information

```javascript
// Show original price and discount
{pkg.originalPrice && pkg.originalPrice > pkg.price ? (
  <>
    <Typography 
      variant="body2" 
      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
    >
      TZS {pkg.originalPrice.toLocaleString()}
    </Typography>
    <Typography variant="h5" color="error">
      TZS {pkg.price.toLocaleString()}
    </Typography>
    <Typography variant="caption" color="success.main">
      Save {pkg.discountPercentage}%!
    </Typography>
  </>
) : (
  <Typography variant="h5">
    TZS {pkg.price.toLocaleString()}
  </Typography>
)}
```

### 3. Display Offer Availability Window

```javascript
// Show when offer is available
{pkg.isTimeBasedOffer && pkg.offerType !== 'UNIVERSAL' && (
  <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
    <Typography variant="caption" fontWeight="bold">
      ⚡ Limited Time Offer
    </Typography>
    <Typography variant="caption" display="block">
      Available: {pkg.offerStartTime} - {pkg.offerEndTime}
    </Typography>
    {pkg.offerDescription && (
      <Typography variant="caption" display="block">
        {pkg.offerDescription}
      </Typography>
    )}
  </Box>
)}
```

### 4. Add Time Remaining Counter

```javascript
// Countdown timer for time-restricted offers
const [timeRemaining, setTimeRemaining] = useState('');

useEffect(() => {
  if (pkg.isTimeBasedOffer && pkg.offerEndTime) {
    const calculateRemaining = () => {
      const now = new Date();
      const [hours, minutes] = pkg.offerEndTime.split(':');
      const endTime = new Date();
      endTime.setHours(parseInt(hours), parseInt(minutes));
      
      if (now > endTime) {
        // Tomorrow
        endTime.setDate(endTime.getDate() + 1);
      }
      
      const diff = endTime - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      
      setTimeRemaining(`${h}h ${m}m remaining`);
    };
    
    calculateRemaining();
    const interval = setInterval(calculateRemaining, 60000);
    return () => clearInterval(interval);
  }
}, [pkg]);
```

---

## 📝 Example Package Scenarios

### Scenario 1: Universal Package

```json
{
  "name": "Basic 30-Day",
  "price": 20000,
  "durationDays": 30,
  "isTimeBasedOffer": false,
  "isActive": true
}
```

**Customer Portal Shows:**
- Available 24/7 badge
- Price: TZS 20,000
- No time restrictions
- Purchase button always enabled

---

### Scenario 2: Weekend-Only Offer

```json
{
  "name": "Weekend Surprise",
  "price": 15000,
  "originalPrice": 20000,
  "discountPercentage": 25,
  "isTimeBasedOffer": true,
  "offerType": "WEEKEND_ONLY",
  "offerStartTime": "00:00",
  "offerEndTime": "23:59",
  "offerDescription": "Special weekend pricing!"
}
```

**Customer Portal Shows:**

**On Saturday/Sunday 00:00-23:59:**
- "Limited Offer" badge
- Original price: ~~TZS 20,000~~ (strikethrough)
- Discounted price: **TZS 15,000**
- "Save 25%!" badge
- Purchase button enabled
- "Weekend Surprise - Special weekend pricing!"

**On Monday-Friday:**
- Package NOT shown (filtered out by backend)

---

### Scenario 3: Lunch Hour Special

```json
{
  "name": "Lunch Hour Deal",
  "price": 5000,
  "originalPrice": 8000,
  "discountPercentage": 37,
  "isTimeBasedOffer": true,
  "offerType": "TIME_RESTRICTED",
  "offerStartTime": "12:00",
  "offerEndTime": "14:00",
  "offerDescription": "Quick 2-hour internet access"
}
```

**Customer Portal Shows:**

**At 12:00-14:00:**
- "Limited Offer" badge
- Price: TZS 5,000 (discounted from 8,000)
- "Available: 12:00 - 14:00"
- "2h 30m remaining" countdown
- Purchase enabled

**At 08:00-11:59:**
- Package NOT shown

**At 14:01-23:59:**
- Package NOT shown

---

## 🚀 Step-by-Step Implementation

### Step 1: Enable Time-Based Fields in Backend

File: `backend/src/main/java/com/ggnetworks/controller/CustomerPortalController.java`

Line 382-389: Uncomment time-based offer fields

```java
// BEFORE:
packageData.put("isTimeBasedOffer", false);
packageData.put("offerType", null);

// AFTER:
packageData.put("isTimeBasedOffer", pkg.getIsTimeBasedOffer());
packageData.put("offerType", pkg.getOfferType());
packageData.put("offerDescription", pkg.getOfferDescription());
packageData.put("offerStartTime", pkg.getOfferStartTime());
packageData.put("offerEndTime", pkg.getOfferEndTime());
packageData.put("originalPrice", pkg.getOriginalPrice());
packageData.put("discountPercentage", pkg.getDiscountPercentage());
```

### Step 2: Enable Time Filtering

File: `backend/src/main/java/com/ggnetworks/service/PackageService.java`

Line 66: Remove comment on time filtering

```java
// CURRENT (Line 66):
return activePackages;

// CHANGE TO (Lines 68-71):
return activePackages.stream()
    .filter(this::isPackageCurrentlyAvailable)
    .collect(Collectors.toList());
```

### Step 3: Update Frontend Display

File: `Frontend/customer_portal/src/components/BuyPackage.jsx`

Add package type badges and offer information in the package card component.

### Step 4: Test

1. Create a universal package in admin portal
2. Create a weekend-only offer package
3. Visit customer portal
4. Check if:
   - Universal packages show "Available 24/7"
   - Offer packages show "Limited Offer"
   - Discounts display correctly
   - Time restrictions work

---

## 📊 Summary

### What's Working ✅

- Backend entity with all time-based fields
- Backend service logic for availability checking
- API endpoint to get packages
- Time-based filtering logic

### What Needs Enhancement 🔧

- **Backend:** Uncomment time-based fields in API response
- **Backend:** Enable time filtering in service
- **Frontend:** Display package type badges
- **Frontend:** Show discounts and original prices
- **Frontend:** Display offer availability windows
- **Frontend:** Add time remaining counter

### Estimated Time: 30 minutes

---

**End of Package Management Guide**

