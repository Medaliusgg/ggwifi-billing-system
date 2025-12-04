# 🎨 Loyalty Program - React Admin Portal Structure

## **Component Structure**

### **1. Main Loyalty Module Page**
**Path:** `Frontend/admin_portal/src/pages/LoyaltyProgram.jsx`

**Features:**
- Dashboard overview (total points, active customers, pending redemptions)
- Quick stats cards
- Recent activity feed

---

### **2. Rewards Management Page**
**Path:** `Frontend/admin_portal/src/pages/loyalty/RewardsManagement.jsx`

**Features:**
- List all rewards (table view)
- Create new reward (modal/form)
- Edit reward
- Update inventory
- Activate/deactivate rewards
- Filter by category, tier, status

**Components:**
- `RewardCard.jsx` - Individual reward card
- `RewardForm.jsx` - Create/Edit form
- `RewardInventory.jsx` - Inventory management

---

### **3. Redemptions Management Page**
**Path:** `Frontend/admin_portal/src/pages/loyalty/RedemptionsManagement.jsx`

**Features:**
- List pending redemptions
- Approve/reject redemptions
- Assign technician for delivery
- Mark as delivered
- Filter by status, date, reward

**Components:**
- `RedemptionCard.jsx` - Redemption request card
- `RedemptionDetails.jsx` - Full redemption details modal
- `DeliveryAssignment.jsx` - Assign technician form

---

### **4. Customer Loyalty View**
**Path:** `Frontend/admin_portal/src/pages/loyalty/CustomerLoyalty.jsx`

**Features:**
- Search customer by phone/name
- View customer loyalty profile
- Transaction history
- Redemption history
- Progress tracking
- Manual point adjustment (admin)

**Components:**
- `CustomerLoyaltyProfile.jsx` - Customer loyalty dashboard
- `PointsTransactionHistory.jsx` - Transaction list
- `RedemptionHistory.jsx` - Redemption list
- `ProgressBar.jsx` - Progress visualization

---

### **5. Top Customers Page**
**Path:** `Frontend/admin_portal/src/pages/loyalty/TopCustomers.jsx`

**Features:**
- Leaderboard of top customers by points
- Filter by tier
- Export to CSV
- Customer details on click

---

### **6. Loyalty Analytics Page**
**Path:** `Frontend/admin_portal/src/pages/loyalty/LoyaltyAnalytics.jsx`

**Features:**
- Points earned/redeemed charts
- Redemption trends
- Tier distribution
- Reward popularity
- Revenue impact

**Components:**
- `PointsChart.jsx` - Points earned/redeemed over time
- `TierDistribution.jsx` - Pie chart of tier distribution
- `RewardPopularity.jsx` - Bar chart of most redeemed rewards

---

## **API Integration**

### **Service File:**
**Path:** `Frontend/admin_portal/src/services/loyaltyService.js`

```javascript
import apiClient from './api/client';

export const loyaltyAPI = {
  // Customer endpoints
  getCustomerLoyalty: (customerId) => 
    apiClient.get(`/loyalty/customer/${customerId}`),
  
  getCustomerProgress: (phoneNumber) => 
    apiClient.get(`/loyalty/progress/${phoneNumber}`),
  
  getCustomerTransactions: (customerId) => 
    apiClient.get(`/loyalty/customer/${customerId}/transactions`),
  
  getCustomerRedemptions: (customerId) => 
    apiClient.get(`/loyalty/customer/${customerId}/redemptions`),
  
  redeemReward: (customerId, redemptionData) => 
    apiClient.post(`/loyalty/customer/${customerId}/redeem`, redemptionData),
  
  // Admin endpoints
  getAllRewards: () => 
    apiClient.get('/loyalty/rewards/all'),
  
  createReward: (reward) => 
    apiClient.post('/loyalty/rewards', reward),
  
  updateReward: (rewardId, reward) => 
    apiClient.put(`/loyalty/rewards/${rewardId}`, reward),
  
  getPendingRedemptions: () => 
    apiClient.get('/loyalty/redemptions/pending'),
  
  approveRedemption: (redemptionId, technicianAssigned) => 
    apiClient.post(`/loyalty/redemptions/${redemptionId}/approve`, null, {
      params: { technicianAssigned }
    }),
  
  markDelivered: (redemptionId) => 
    apiClient.post(`/loyalty/redemptions/${redemptionId}/deliver`),
  
  getTopCustomers: (limit = 10) => 
    apiClient.get('/loyalty/top-customers', { params: { limit } }),
};
```

---

## **Customer Portal Integration**

### **Customer Loyalty Page**
**Path:** `Frontend/customer_portal/src/pages/Loyalty.jsx`

**Features:**
- Current points display
- Loyalty tier badge
- Available rewards grid
- Progress bar to next reward
- Transaction history
- Redemption history
- Redeem reward button

**Components:**
- `PointsDisplay.jsx` - Large points counter
- `TierBadge.jsx` - Tier visualization
- `RewardGrid.jsx` - Available rewards
- `ProgressTracker.jsx` - Progress to next reward
- `RedeemModal.jsx` - Redemption form

---

## **UI/UX Recommendations**

### **Color Scheme:**
- **Bronze:** #CD7F32
- **Silver:** #C0C0C0
- **Gold:** #FFD700
- **Platinum:** #E5E4E2

### **Icons:**
- Points: ⭐ or 🎁
- Tier: 🏆
- Reward: 🎁
- Progress: 📊

### **Animations:**
- Points counter animation when points increase
- Progress bar fill animation
- Tier upgrade celebration animation
- Reward unlock animation

---

## **Navigation Structure**

```
Admin Portal:
├── Dashboard
├── Loyalty Program
│   ├── Overview
│   ├── Rewards Management
│   ├── Redemptions
│   ├── Customer Loyalty
│   ├── Top Customers
│   └── Analytics
└── ...

Customer Portal:
├── Home
├── Packages
├── My Account
│   ├── Profile
│   ├── Loyalty Points ⭐
│   ├── Transactions
│   └── Redemptions
└── ...
```

---

**Last Updated:** 2025-01-27
**Status:** Ready for Frontend Implementation





