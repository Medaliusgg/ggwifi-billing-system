# 📱 Frontend Payment Flow - Complete Illustration

## 🎯 Overview

This document illustrates the complete frontend payment flow for the GG Wi-Fi Customer Portal, showing all user interactions, state changes, API calls, and UI updates.

---

## 🔄 Complete Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND PAYMENT FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   STEP 1     │  User Selects Package
│  Package     │  ──────────────────
│  Selection   │  • User clicks package card
└──────┬───────┘  • setSelectedPackage(pkg)
       │          • setShowCustomerForm(true)
       │          • setPaymentStep(1)
       │          • toast.success("Package selected!")
       │
       ▼
┌──────────────┐
│   STEP 2     │  Customer Details Form
│  Customer    │  ──────────────────
│  Information │  • User enters fullName
│              │  • User enters phoneNumber
│              │  • handleCustomerDetailsChange()
│              │  • setCustomerDetails({ fullName, phoneNumber })
└──────┬───────┘
       │
       │  User clicks "Proceed to Payment"
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VALIDATION PHASE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  handleProceedToPayment()                                                    │
│  ────────────────────────────────                                           │
│  ✅ Validates: fullName (min 3 chars)                                      │
│  ✅ Validates: phoneNumber (Tanzanian format)                               │
│  ✅ Validates: selectedPackage exists                                        │
│                                                                              │
│  If validation fails:                                                        │
│    → toast.error("Validation message")                                      │
│    → Return (stop flow)                                                      │
│                                                                              │
│  If validation passes:                                                       │
│    → setPaymentStep(2)                                                       │
│    → initiateZenoPayPayment()                                               │
└─────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              PAYMENT INITIATION PHASE                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  initiateZenoPayPayment()                                                    │
│  ────────────────────────────────                                           │
│                                                                              │
│  1. Format Phone Number                                                      │
│     • Remove non-numeric: phoneNumber.replace(/[^0-9]/g, '')                │
│     • Convert to international: "0..." → "255..." → "+255..."               │
│                                                                              │
│  2. Validate Payment Data                                                    │
│     • paymentService.validatePaymentData({                                   │
│         customerName, phoneNumber, packageId, amount                        │
│       })                                                                     │
│                                                                              │
│  3. Prepare Payment Request                                                  │
│     {                                                                        │
│       customerName: "John Doe",                                              │
│       phoneNumber: "+255658823944",                                          │
│       packageId: "1",                                                        │
│       packageName: "Daily Plan",                                             │
│       amount: "2000",                                                        │
│       currency: "TZS",                                                       │
│       paymentMethod: "ZENOPAY"                                               │
│     }                                                                        │
│                                                                              │
│  4. API Call: POST /api/v1/customer-portal/payment                          │
│     • customerPortalAPI.processPayment(paymentData)                         │
│     • Loading: setIsLoading(true)                                            │
│     • Status: setPaymentStatus('processing')                                 │
│     • Toast: toast.loading('Initializing ZenoPay payment...')                 │
└─────────────────────────────────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────┐
       │                                         │
       ▼                                         ▼
┌──────────────────────┐            ┌──────────────────────┐
│   SUCCESS RESPONSE   │            │    ERROR RESPONSE    │
│                      │            │                      │
│  {                   │            │  • Network error     │
│    status: "success"│            │  • Validation error  │
│    order_id: "PKG_.."│            │  • Server error     │
│    message: "..."    │            │                      │
│  }                   │            │  → setPaymentStatus   │
│                      │            │    ('failed')        │
│  → Extract order_id  │            │  → toast.error(...) │
│  → Start Polling     │            │  → setIsLoading     │
│                      │            │    (false)           │
└──────────┬───────────┘            └──────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POLLING INITIALIZATION                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  After Successful Payment Initiation:                                        │
│  ────────────────────────────────────────                                   │
│                                                                              │
│  1. Set Initial State                                                       │
│     • setPaymentStatus('processing')                                        │
│     • setPaymentMessage('Check your phone for USSD prompt...')              │
│     • setOrderId(result.order_id)                                           │
│     • setPaymentStep(2)                                                      │
│     • setPaymentElapsedTime(0)                                               │
│     • setPaymentPollingAttempts(0)                                           │
│     • setActualPaymentStep('request_sent')                                   │
│     • paymentStartTimeRef.current = Date.now()                               │
│                                                                              │
│  2. Show User Instructions                                                   │
│     • toast('📱 Check your phone for payment instructions!')                │
│                                                                              │
│  3. Start Polling                                                            │
│     • paymentService.pollPaymentStatus(                                      │
│         orderId,                                                            │
│         onStatusUpdate,  // Callback function                               │
│         30,                 // Max attempts                                  │
│         2000                // Initial interval: 2 seconds                   │
│       )                                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADAPTIVE POLLING MECHANISM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Polling Strategy (Adaptive Intervals):                                      │
│  ──────────────────────────────────────                                     │
│                                                                              │
│  ⏱️  0-3 seconds:  Poll every 2 seconds                                    │
│      • User just initiated payment                                           │
│      • Waiting for USSD prompt                                               │
│                                                                              │
│  ⚡ 3-10 seconds:  Poll every 500ms                                         │
│      • User likely received USSD prompt                                      │
│      • User likely entering PIN                                              │
│      • Faster detection of user actions                                      │
│                                                                              │
│  🚀 10-60 seconds: Poll every 300ms                                         │
│      • Webhook likely received                                               │
│      • Maximum responsiveness for status changes                            │
│      • Detects payment completion within 300-500ms                           │
│                                                                              │
│  ⏰ 60 seconds:    Timeout                                                  │
│      • USSD prompt expired                                                   │
│      • Stop polling                                                          │
│      • Show timeout message                                                  │
│                                                                              │
│  Polling Logic:                                                              │
│  ─────────────                                                               │
│  performPoll() {                                                             │
│    1. Calculate elapsedSeconds = (Date.now() - startTime) / 1000            │
│    2. Check timeout (60s limit)                                              │
│    3. API Call: GET /api/v1/customer-portal/payment/status/{orderId}         │
│    4. Process response                                                       │
│    5. Update UI via onStatusUpdate callback                                 │
│    6. Adjust polling interval based on elapsed time                           │
│    7. Continue or stop based on payment status                               │
│  }                                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STATUS UPDATE CALLBACK                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  onStatusUpdate(statusData) {                                               │
│  ────────────────────────────────                                           │
│                                                                              │
│  Input: statusData                                                           │
│  {                                                                           │
│    status: "PENDING" | "COMPLETED" | "FAILED" | ...                          │
│    message: "Payment message..."                                             │
│    orderId: "PKG_..."                                                        │
│    voucherCode: "ABC123" (if completed)                                      │
│    elapsedSeconds: 15                                                        │
│    attempt: 8                                                                │
│  }                                                                           │
│                                                                              │
│  Processing:                                                                 │
│  ───────────                                                                 │
│  1. Update Elapsed Time                                                      │
│     • Use statusData.elapsedSeconds or calculate from startTime              │
│     • setPaymentElapsedTime(elapsedToUse)                                    │
│                                                                              │
│  2. Progressive Warnings (Toast Notifications)                               │
│     • 10s:  "📱 Check your phone for the USSD prompt!"                       │
│     • 20s:  "🔐 Please enter your mobile money PIN!"                        │
│     • 30s:  "⏳ Payment processing... Please wait..."                        │
│     • 40s:  "⚠️ 20 seconds remaining!"                                       │
│     • 50s:  "🚨 10 seconds left!"                                           │
│     • 55s:  "🚨 CRITICAL: 5 seconds remaining!"                             │
│                                                                              │
│  3. Map Status to UI State                                                   │
│     • Normalize: normalizedStatus = status.toUpperCase()                     │
│     • Determine: uiStatus = 'processing' | 'success' | 'failed'              │
│     • Determine: actualPaymentStep = 'request_sent' | 'ussd_received' |     │
│                  'pin_entered' | 'processing' | 'completed' | 'failed'      │
│                                                                              │
│  4. Update UI State                                                         │
│     • setPaymentStatus(uiStatus)                                             │
│     • setPaymentMessage(statusData.message)                                  │
│     • setActualPaymentStep(step)                                             │
│     • setPaymentPollingAttempts(statusData.attempt)                         │
│                                                                              │
│  5. Handle Final States                                                      │
│     ┌─────────────────────────────────────────────────────┐                 │
│     │ SUCCESS (COMPLETED/SUCCESS/SUCCESSFUL)              │                 │
│     ├─────────────────────────────────────────────────────┤                 │
│     │ • setVoucherCode(statusData.voucherCode)            │                 │
│     │ • toast.success("Payment successful! Voucher: ...")  │                 │
│     │ • Stop polling: currentPollingStop()                 │                 │
│     │ • setCurrentPollingStop(null)                        │                 │
│     └─────────────────────────────────────────────────────┘                 │
│                                                                              │
│     ┌─────────────────────────────────────────────────────┐                 │
│     │ FAILURE (FAILED/INSUFFICIENT_BALANCE/etc.)          │                 │
│     ├─────────────────────────────────────────────────────┤                 │
│     │ • Stop polling immediately: currentPollingStop()     │                 │
│     │ • Show error toast based on failure type:            │                 │
│     │   - INSUFFICIENT_BALANCE: "💳 Insufficient Balance!" │                 │
│     │   - INVALID_PIN: "🔐 Invalid PIN!"                  │                 │
│     │   - USER_CANCELLED: "❌ Payment cancelled"            │                 │
│     │   - TIMEOUT: "⏱️ Payment timed out"                  │                 │
│     │   - NETWORK_ERROR: "🌐 Network error"                 │                 │
│     │   - Default: "❌ Payment failed"                     │                 │
│     └─────────────────────────────────────────────────────┘                 │
│                                                                              │
│  6. Continue Polling (if not final state)                                    │
│     • Wait for next interval                                                │
│     • Call performPoll() again                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
           │
           ├──────────────────────────────┬──────────────────────────────┐
           │                              │                              │
           ▼                              ▼                              ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   PAYMENT SUCCESS     │    │   PAYMENT FAILED     │    │   PAYMENT TIMEOUT    │
│                      │    │                      │    │                      │
│  Status: COMPLETED    │    │  Status: FAILED      │    │  Status: TIMEOUT    │
│  ──────────────────  │    │  ──────────────────  │    │  ──────────────────  │
│                      │    │                      │    │                      │
│  ✅ Voucher Code      │    │  ❌ Error Message     │    │  ⏰ Timeout Message  │
│     Displayed         │    │     Displayed         │    │     Displayed        │
│                      │    │                      │    │                      │
│  ✅ Success Toast     │    │  ❌ Error Toast       │    │  ⏰ Timeout Toast     │
│                      │    │                      │    │                      │
│  ✅ Polling Stopped   │    │  ❌ Polling Stopped   │    │  ⏰ Polling Stopped   │
│                      │    │                      │    │                      │
│  ✅ UI Updated        │    │  ❌ UI Updated        │    │  ⏰ UI Updated        │
│                      │    │                      │    │                      │
│  User can:            │    │  User can:            │    │  User can:           │
│  • Copy voucher code  │    │  • See error details  │    │  • See timeout msg   │
│  • Use voucher        │    │  • Try again          │    │  • Try again        │
│  • View success msg   │    │  • Contact support     │    │  • Contact support   │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

---

## 📊 State Management Flow

### React State Variables

```javascript
// Package Selection
const [selectedPackage, setSelectedPackage] = useState(null);
const [showCustomerForm, setShowCustomerForm] = useState(false);

// Customer Details
const [customerDetails, setCustomerDetails] = useState({
  fullName: '',
  phoneNumber: ''
});

// Payment State
const [paymentStep, setPaymentStep] = useState(0);           // 0: Package, 1: Form, 2: Payment
const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' | 'processing' | 'success' | 'failed'
const [paymentMessage, setPaymentMessage] = useState('');
const [orderId, setOrderId] = useState('');
const [voucherCode, setVoucherCode] = useState('');

// Polling State
const [paymentElapsedTime, setPaymentElapsedTime] = useState(0);
const [paymentPollingAttempts, setPaymentPollingAttempts] = useState(0);
const [actualPaymentStep, setActualPaymentStep] = useState('request_sent');
const [currentPollingStop, setCurrentPollingStop] = useState(null);

// Loading State
const [isLoading, setIsLoading] = useState(false);
const [isLoadingPackages, setIsLoadingPackages] = useState(false);

// Refs
const paymentStartTimeRef = useRef(null);
```

### State Transitions

```
┌─────────────┐
│  paymentStep│
└─────────────┘
      │
      ├─ 0: Package Selection
      ├─ 1: Customer Form
      └─ 2: Payment Processing

┌─────────────┐
│paymentStatus│
└─────────────┘
      │
      ├─ 'pending'    → Initial state
      ├─ 'processing' → Payment initiated, polling active
      ├─ 'success'    → Payment completed
      └─ 'failed'     → Payment failed

┌─────────────────┐
│actualPaymentStep│
└─────────────────┘
      │
      ├─ 'request_sent'    → Payment request sent to backend
      ├─ 'ussd_received'   → User received USSD prompt (elapsed > 5s)
      ├─ 'pin_entered'      → User likely entered PIN (elapsed > 10s)
      ├─ 'processing'      → Payment being processed by gateway
      ├─ 'completed'       → Payment completed successfully
      └─ 'failed'          → Payment failed
```

---

## 🔄 API Calls Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API CALLS SEQUENCE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

1. GET /api/v1/customer-portal/packages
   ─────────────────────────────────────
   • Called: On component mount
   • Purpose: Fetch available packages
   • Response: Array of package objects
   • State: setPackages(response.data)

2. POST /api/v1/customer-portal/payment
   ─────────────────────────────────────
   • Called: initiateZenoPayPayment()
   • Request Body:
     {
       customerName: "John Doe",
       phoneNumber: "+255658823944",
       packageId: "1",
       packageName: "Daily Plan",
       amount: "2000",
       currency: "TZS",
       paymentMethod: "ZENOPAY"
     }
   • Response:
     {
       status: "success",
       order_id: "PKG_1765012540400_3944_1",
       payment_reference: "...",
       message: "Payment initiated successfully"
     }
   • State: setOrderId(response.order_id)

3. GET /api/v1/customer-portal/payment/status/{orderId}
   ─────────────────────────────────────────────────────
   • Called: Repeatedly via polling (every 2s → 500ms → 300ms)
   • Purpose: Check payment status
   • Response:
     {
       payment_status: "PENDING" | "COMPLETED" | "FAILED" | ...,
       voucher_code: "ABC123" (if completed),
       message: "Status message...",
       elapsedSeconds: 15
     }
   • State: Updated via onStatusUpdate callback
```

---

## 🎨 UI Updates Flow

### Payment Steps Display

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UI STEP INDICATOR                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Step 0: Package Selection                                                  │
│  ────────────────────────                                                   │
│  • Display package cards                                                    │
│  • User selects package                                                      │
│  • Show customer form                                                        │
│                                                                              │
│  Step 1: Customer Information                                               │
│  ───────────────────────────                                                │
│  • Display form fields (fullName, phoneNumber)                               │
│  • "Proceed to Payment" button                                              │
│  • Validation messages                                                       │
│                                                                              │
│  Step 2: Payment Processing                                                 │
│  ─────────────────────────                                                  │
│  • Show payment status based on actualPaymentStep:                          │
│                                                                              │
│    ┌────────────────────────────────────────────────────┐                  │
│    │ request_sent                                       │                  │
│    │ • "Payment request sent!"                          │                  │
│    │ • "Check your phone for USSD prompt"               │                  │
│    │ • Spinner animation                                │                  │
│    └────────────────────────────────────────────────────┘                  │
│                                                                              │
│    ┌────────────────────────────────────────────────────┐                  │
│    │ ussd_received (elapsed > 5s)                       │                  │
│    │ • "USSD prompt received on your phone"             │                  │
│    │ • "Please enter your mobile money PIN"              │                  │
│    │ • Spinner animation                                │                  │
│    └────────────────────────────────────────────────────┘                  │
│                                                                              │
│    ┌────────────────────────────────────────────────────┐                  │
│    │ pin_entered (elapsed > 10s)                        │                  │
│    │ • "PIN entered, processing payment..."              │                  │
│    │ • "Please wait for confirmation"                     │                  │
│    │ • Spinner animation                                │                  │
│    └────────────────────────────────────────────────────┘                  │
│                                                                              │
│    ┌────────────────────────────────────────────────────┐                  │
│    │ processing                                          │                  │
│    │ • "Payment being processed by gateway..."           │                  │
│    │ • "Please wait..."                                   │                  │
│    │ • Spinner animation                                │                  │
│    └────────────────────────────────────────────────────┘                  │
│                                                                              │
│    ┌────────────────────────────────────────────────────┐                  │
│    │ completed                                           │                  │
│    │ • ✅ Success icon                                    │                  │
│    │ • "Payment completed successfully!"                   │                  │
│    │ • Voucher code displayed                            │                  │
│    │ • "Copy Voucher" button                             │                  │
│    │ • "Use Voucher" button                              │                  │
│    └────────────────────────────────────────────────────┘                  │
│                                                                              │
│    ┌────────────────────────────────────────────────────┐                  │
│    │ failed                                              │                  │
│    │ • ❌ Error icon                                      │                  │
│    │ • Error message displayed                           │                  │
│    │ • "Try Again" button                                │                  │
│    │ • Specific error based on failure type:             │                  │
│    │   - Insufficient Balance: Orange/yellow alert       │                  │
│    │   - Invalid PIN: Red alert                           │                  │
│    │   - Network Error: Red alert                        │                  │
│    └────────────────────────────────────────────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Elapsed Time Display

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ELAPSED TIME TRACKER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Display: "⏱️ {paymentElapsedTime}s / 60s"                                │
│                                                                              │
│  Updates:                                                                    │
│  • Every polling interval (2s → 500ms → 300ms)                              │
│  • Calculated from paymentStartTimeRef.current                               │
│  • Falls back to statusData.elapsedSeconds if available                      │
│                                                                              │
│  Visual Indicator:                                                          │
│  • Progress bar showing elapsed time / 60 seconds                            │
│  • Color changes:                                                            │
│    - Green: 0-30s (normal)                                                   │
│    - Yellow: 30-50s (warning)                                                │
│    - Red: 50-60s (critical)                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ERROR HANDLING                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  Validation Errors    │
│  ─────────────────── │
│  • Full name < 3 chars                                                      │
│  • Invalid phone format                                                     │
│  • Package not selected                                                     │
│  → toast.error("Error message")                                              │
│  → Return (stop flow)                                                       │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Network Errors       │
│  ─────────────────── │
│  • CORS error                                                                 │
│  • Connection timeout                                                        │
│  • Server unreachable                                                         │
│  → setPaymentStatus('failed')                                                 │
│  → setPaymentMessage("Network error...")                                      │
│  → toast.error("Network error. Check connection.")                           │
│  → setIsLoading(false)                                                      │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Payment Errors       │
│  ─────────────────── │
│  • INSUFFICIENT_BALANCE                                                      │
│    → Orange/yellow pulsing alert                                             │
│    → "💳 Insufficient Balance! Top up and try again."                       │
│    → Stop polling immediately                                                │
│                                                                              │
│  • INVALID_PIN                                                               │
│    → Red alert                                                               │
│    → "🔐 Invalid PIN! Try again with correct PIN."                          │
│    → Stop polling immediately                                                │
│                                                                              │
│  • USER_CANCELLED                                                            │
│    → Red alert                                                               │
│    → "❌ Payment cancelled. Try again."                                     │
│    → Stop polling immediately                                                │
│                                                                              │
│  • TIMEOUT                                                                   │
│    → Red alert                                                               │
│    → "⏱️ Payment timed out. USSD prompt expired."                          │
│    → Stop polling                                                            │
│                                                                              │
│  • NETWORK_ERROR                                                             │
│    → Red alert                                                               │
│    → "🌐 Network error. Check connection and try again."                    │
│    → Stop polling immediately                                                │
│                                                                              │
│  • Generic FAILED                                                            │
│    → Red alert                                                               │
│    → "❌ Payment failed. Please try again."                                  │
│    → Stop polling immediately                                                │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Polling Errors       │
│  ─────────────────── │
│  • API call fails                                                            │
│  • Response parsing error                                                    │
│  • Timeout after 60s                                                         │
│  → Continue polling (retry)                                                  │
│  → If 60s elapsed: Stop and show timeout                                     │
│  → If max attempts: Stop and show timeout                                    │
└──────────────────────┘
```

---

## ⚡ Performance Optimizations

### Adaptive Polling

```
Time Elapsed    Polling Interval    Reason
─────────────   ─────────────────   ──────────────────────────────────────
0-3 seconds     2 seconds           Initial wait for USSD prompt
3-10 seconds    500ms               User likely entering PIN (faster detection)
10-60 seconds    300ms               Webhook likely received (maximum responsiveness)
60+ seconds      Stop                USSD prompt expired
```

### State Update Optimization

- **Elapsed Time**: Always calculated from `paymentStartTimeRef` to ensure accuracy
- **Status Updates**: Only update state if value changed (prevents unnecessary re-renders)
- **Polling Cleanup**: Stop polling immediately on final states (success/failure)
- **Memory Management**: Clear intervals and refs when component unmounts

---

## 📱 User Experience Features

### Progressive Warnings

```
Elapsed Time    Warning Message
─────────────   ──────────────────────────────────────────────────────────
10 seconds      📱 "Check your phone for the USSD prompt!"
20 seconds      🔐 "Please enter your mobile money PIN on your phone!"
30 seconds      ⏳ "Payment processing... Please wait for confirmation."
40 seconds      ⚠️  "20 seconds remaining! Please complete payment now!"
50 seconds      🚨 "10 seconds left! Complete payment immediately!"
55 seconds      🚨 "CRITICAL: 5 seconds remaining!"
```

### Visual Feedback

- **Spinner Animation**: Shows during payment processing
- **Progress Bar**: Visual indicator of elapsed time (0-60s)
- **Color Coding**: Green (normal) → Yellow (warning) → Red (critical)
- **Icons**: ✅ Success, ❌ Error, ⏱️ Timeout, 📱 Phone, 🔐 PIN
- **Toast Notifications**: Non-intrusive status updates

---

## 🔐 Security Considerations

1. **Input Validation**: All user inputs validated before API calls
2. **Phone Number Formatting**: Normalized to international format
3. **Error Messages**: Generic messages to prevent information leakage
4. **Polling Limits**: Maximum 60 seconds to prevent infinite polling
5. **State Cleanup**: Proper cleanup of intervals and refs

---

## 📊 Complete Flow Summary

```
1. User selects package
   ↓
2. User enters customer details
   ↓
3. User clicks "Proceed to Payment"
   ↓
4. Frontend validates input
   ↓
5. Frontend formats phone number
   ↓
6. Frontend calls: POST /payment
   ↓
7. Backend processes payment
   ↓
8. Backend returns: order_id
   ↓
9. Frontend starts polling: GET /payment/status/{orderId}
   ↓
10. User receives USSD prompt on phone
    ↓
11. User enters PIN on phone
    ↓
12. ZenoPay processes payment
    ↓
13. ZenoPay sends webhook to backend
    ↓
14. Backend updates payment status
    ↓
15. Frontend polling detects status change (within 300-500ms)
    ↓
16. Frontend updates UI:
    - If SUCCESS: Show voucher code, success message
    - If FAILED: Show error message, "Try Again" button
    - If TIMEOUT: Show timeout message, "Try Again" button
    ↓
17. Frontend stops polling
    ↓
18. User can copy voucher code or try again
```

---

## 🎯 Key Features

✅ **Real-time Status Updates**: Adaptive polling detects status changes within 300-500ms  
✅ **Progressive Warnings**: User-friendly notifications at key intervals  
✅ **Comprehensive Error Handling**: Specific messages for different error types  
✅ **Visual Feedback**: Progress bars, spinners, and color-coded indicators  
✅ **Timeout Protection**: Automatic timeout after 60 seconds  
✅ **State Management**: Proper cleanup and memory management  
✅ **User Experience**: Clear instructions and intuitive flow  

---

**This flow ensures a smooth, responsive, and user-friendly payment experience!** 🚀

