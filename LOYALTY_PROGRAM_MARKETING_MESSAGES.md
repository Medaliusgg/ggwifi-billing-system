# 📱 GG Points Loyalty Program - Marketing Messages

## **SMS Templates for Loyalty Program**

### **1. Points Earned After Purchase**

**Template:**
```
Congratulations! You earned {points} GG Points from your {packageName} purchase. 
Your total points: {totalPoints}. Keep buying to unlock amazing rewards!
```

**Example:**
```
Congratulations! You earned 10 GG Points from your Monthly Package purchase. 
Your total points: 45. Keep buying to unlock amazing rewards!
```

---

### **2. Reward Redemption Request**

**Template:**
```
Congratulations! You redeemed {points} GG Points for {rewardName}. 
Your request is pending approval. Remaining points: {remainingPoints}
```

**Example:**
```
Congratulations! You redeemed 30 GG Points for GG Cap. 
Your request is pending approval. Remaining points: 15
```

---

### **3. Redemption Approved**

**Template:**
```
Your reward redemption for {rewardName} has been approved! 
We'll contact you soon for delivery. Thank you for being a loyal GG Wi-Fi customer!
```

**Example:**
```
Your reward redemption for GG T-shirt has been approved! 
We'll contact you soon for delivery. Thank you for being a loyal GG Wi-Fi customer!
```

---

### **4. Reward Delivered**

**Template:**
```
Congratulations! Your {rewardName} has been delivered. 
Thank you for being a loyal GG Wi-Fi customer! Show off your reward and tag us!
```

**Example:**
```
Congratulations! Your GG Cap has been delivered. 
Thank you for being a loyal GG Wi-Fi customer! Show off your reward and tag us!
```

---

### **5. Progress Notification (Near Reward)**

**Template:**
```
You're {pointsNeeded} points away from {rewardName}! 
Keep buying GG Wi-Fi packages to unlock this amazing reward!
```

**Example:**
```
You're 10 points away from GG Cap! 
Keep buying GG Wi-Fi packages to unlock this amazing reward!
```

---

### **6. Tier Upgrade Notification**

**Template:**
```
🎉 Congratulations! You've reached {tier} tier with {points} GG Points! 
You now have access to exclusive rewards and faster support!
```

**Example:**
```
🎉 Congratulations! You've reached GOLD tier with 200 GG Points! 
You now have access to exclusive rewards and faster support!
```

---

### **7. Points Expiring Soon (30 days warning)**

**Template:**
```
⚠️ Warning: {points} of your GG Points will expire in 30 days. 
Make a purchase to keep your points active and unlock rewards!
```

**Note:** Points expire after 3 months of inactivity.

**Example:**
```
⚠️ Warning: 15 of your GG Points will expire in 30 days. 
Make a purchase to keep your points active and unlock rewards!
```

---

### **8. Points Expired**

**Template:**
```
Your {points} GG Points have expired. Don't worry! 
Keep buying GG Wi-Fi packages to earn new points and unlock rewards!
```

**Example:**
```
Your 10 GG Points have expired. Don't worry! 
Keep buying GG Wi-Fi packages to earn new points and unlock rewards!
```

---

### **9. Welcome to Loyalty Program**

**Template:**
```
Welcome to GG Points! Earn points with every purchase and unlock amazing rewards. 
Your first purchase earns you bonus points. Start earning today!
```

---

### **10. Birthday Special**

**Template:**
```
🎂 Happy Birthday! As a special gift, we've added {bonusPoints} bonus GG Points to your account. 
Enjoy your special day with GG Wi-Fi!
```

---

## **Portal Messages (Customer Portal)**

### **Progress Bar Messages:**

1. **"10 points left to get GG Cap!"**
2. **"50 points left to earn Smartwatch!"**
3. **"You're 75% there! Keep going!"**
4. **"Almost there! Just {points} more points!"**

### **Tier Badge Messages:**

- **Bronze:** "You're a Bronze member! Keep earning to unlock Silver tier."
- **Silver:** "Silver tier unlocked! You're on your way to Gold!"
- **Gold:** "Gold tier achieved! You're a VIP customer!"
- **Platinum:** "Platinum tier! You're our most valued customer!"

---

## **Marketing Campaign Messages**

### **Win-Back Campaign (Inactive Customers)**

```
Hi! We miss you at GG Wi-Fi. Come back and earn double points on your next purchase! 
Limited time offer. Use code: WELCOMEBACK
```

### **Flash Promotion**

```
⚡ FLASH SALE: Buy any package today and earn DOUBLE GG Points! 
Limited to first 100 customers. Don't miss out!
```

### **Referral Bonus**

```
Refer a friend to GG Wi-Fi and both of you earn 20 bonus GG Points! 
Share your referral code: {referralCode}
```

---

## **Implementation Notes**

All SMS messages are automatically sent via `SmsService` in:
- `EnhancedLoyaltyService.awardPointsAfterPayment()`
- `EnhancedLoyaltyService.redeemReward()`
- `EnhancedLoyaltyService.approveRedemption()`
- `EnhancedLoyaltyService.markRedemptionDelivered()`

**Last Updated:** 2025-01-27

