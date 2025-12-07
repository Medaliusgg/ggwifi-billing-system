# 🧪 Testing Insufficient Balance Response

## Phone Number: 0658823944

---

## ✅ UI Enhancements for Insufficient Balance

### What Was Improved:
1. **Immediate Response**: Polling stops immediately when insufficient balance detected
2. **Prominent Error Display**: 
   - Title changes to "💳 Insufficient Balance" (not generic "Payment Failed")
   - Orange/yellow alert with pulsing animation
   - Clear, bold error message
3. **Detailed Instructions**:
   - How to top up mobile money account
   - How to check balance (USSD codes)
   - Required amount shown
   - Next steps clearly listed
4. **Better Toast Notification**: 6-second duration, top-center position

---

## 🧪 How to Test

### Test Scenario: Insufficient Balance

1. **Ensure Account Has Low Balance**:
   - Make sure phone 0658823944 has less than the package amount
   - Or use a test account with insufficient funds

2. **Initiate Payment**:
   - Open: `https://hotspot.ggwifi.co.tz`
   - Select a package (e.g., 1000 TZS)
   - Enter:
     - Full Name: Test Customer
     - Phone: 0658823944
   - Click "Proceed to Payment"

3. **Complete Payment on Phone**:
   - USSD prompt will appear
   - Enter your PIN
   - Payment will fail due to insufficient balance

4. **Observe UI Response**:
   - **Expected**: UI should update within 2-5 seconds
   - **Title**: Should show "💳 Insufficient Balance"
   - **Alert**: Orange/yellow background with pulsing animation
   - **Message**: Clear error message about insufficient balance
   - **Instructions**: Detailed steps on what to do next
   - **Toast**: Error notification at top-center

---

## 📊 Expected UI Behavior

### When Insufficient Balance Detected:

1. **Immediate Actions** (within 500ms-2s):
   - Polling stops immediately
   - `setPaymentStatus('failed')` called
   - `setActualPaymentStep('failed')` called
   - `setPaymentMessage()` updated with error message

2. **UI Updates**:
   - Error icon appears (red)
   - Title: "💳 Insufficient Balance"
   - Alert box with orange/yellow background
   - Pulsing animation on alert
   - Clear error message displayed

3. **Instructions Shown**:
   ```
   ⚠️ Your mobile money account has insufficient balance for this payment.
   
   To complete your payment:
   • Top up your mobile money account (M-Pesa, Tigo Pesa, Airtel Money, etc.)
   • Check your account balance using *150*00# (M-Pesa) or your provider's USSD code
   • Ensure you have at least [PACKAGE_AMOUNT] TZS in your account
   • Try again after topping up
   • Contact your mobile money provider for assistance if needed
   ```

4. **Toast Notification**:
   - Message: "💳 Insufficient Balance! Please top up your mobile money account and try again."
   - Duration: 6 seconds
   - Position: Top-center
   - Color: Red/Error

---

## 🔍 What to Monitor

### Backend Logs:
```
🔔 ZENOPAY WEBHOOK RECEIVED
✅ Processing webhook for order: PKG_xxx with status: INSUFFICIENT_BALANCE
❌ Payment failed with status: INSUFFICIENT_BALANCE! Processing failure notification...
```

### Frontend Console:
```
📊 Payment status update: INSUFFICIENT_BALANCE (attempt X, Ys elapsed)
🛑 Stopping polling - payment INSUFFICIENT_BALANCE after Ys
📊 Payment status update received: {status: 'INSUFFICIENT_BALANCE', ...}
```

### Network Tab:
- Status endpoint should return: `{"payment_status": "INSUFFICIENT_BALANCE", ...}`
- Response time should be fast (< 500ms after webhook)

---

## ✅ Success Criteria

- [ ] UI updates within 2-5 seconds of webhook
- [ ] Title shows "💳 Insufficient Balance"
- [ ] Alert has orange/yellow background
- [ ] Pulsing animation visible
- [ ] Clear error message displayed
- [ ] Instructions shown with package amount
- [ ] Toast notification appears
- [ ] Polling stops immediately
- [ ] User can retry payment easily

---

## 🐛 Troubleshooting

### If UI Doesn't Update:
1. Check console for status updates
2. Verify webhook was received (backend logs)
3. Check database: `SELECT status FROM payment WHERE payment_id = ?`
4. Verify status mapping in frontend

### If Error Message Not Clear:
1. Check `paymentMessage` state is set correctly
2. Verify message includes "insufficient" or "balance"
3. Check UI conditions match message content

---

## 📝 Notes

- **Response Time**: Should be immediate (500ms-2s) after webhook
- **User Experience**: Clear, actionable error message
- **Retry**: User can easily retry after topping up
- **Visual Feedback**: Prominent, attention-grabbing error display

