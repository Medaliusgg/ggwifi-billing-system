package com.ggnetworks.service;

import com.ggnetworks.entity.CustomerAccount;
import com.ggnetworks.entity.Voucher;
import com.ggnetworks.entity.Customer;
import com.ggnetworks.repository.CustomerAccountRepository;
import com.ggnetworks.repository.VoucherRepository;
import com.ggnetworks.repository.CustomerRepository;
import com.ggnetworks.repository.InternetPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Free Trial Service
 * Handles 20-minute free trial voucher generation and activation
 */
@Service
public class FreeTrialService {

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private InternetPackageRepository internetPackageRepository;

    @Autowired
    private EnhancedRadiusService enhancedRadiusService;

    @Autowired
    private SmsService smsService;

    private static final int TRIAL_DURATION_MINUTES = 20;
    private static final Long TRIAL_PACKAGE_ID = 0L; // Special ID for trial (or create a trial package)

    /**
     * Generate and activate free 20-minute trial for new customer
     */
    @Transactional
    public Map<String, Object> generateAndActivateTrial(CustomerAccount account) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Check if trial already used
            if (account.getIsTrialUsed() != null && account.getIsTrialUsed()) {
                response.put("status", "error");
                response.put("message", "Free trial already used");
                return response;
            }

            System.out.println("🎁 Generating free 20-minute trial for customer: " + account.getPhoneNumber());

            // Generate unique voucher code
            String voucherCode = voucherService.generateVoucherCode(TRIAL_PACKAGE_ID);
            System.out.println("🎫 Generated trial voucher code: " + voucherCode);

            // Create voucher entity
            Voucher trialVoucher = new Voucher();
            trialVoucher.setVoucherCode(voucherCode);
            trialVoucher.setOrderId("TRIAL_" + System.currentTimeMillis() + "_" + account.getPhoneNumber().substring(account.getPhoneNumber().length() - 4));
            trialVoucher.setCustomerName(account.getFullName());
            trialVoucher.setCustomerPhone(account.getPhoneNumber());
            trialVoucher.setCustomerPhoneNumber(account.getPhoneNumber());
            trialVoucher.setCustomerEmail(account.getEmail());
            trialVoucher.setPackageName("Free 20-Minute Trial");
            trialVoucher.setAmount(BigDecimal.ZERO);
            trialVoucher.setCurrency("TZS");
            trialVoucher.setPaymentChannel("TRIAL");
            trialVoucher.setVoucherType(Voucher.VoucherType.TRIAL);
            trialVoucher.setIsFreeTrial(true);
            trialVoucher.setStatus(Voucher.VoucherStatus.ACTIVE);
            trialVoucher.setUsageStatus(Voucher.UsageStatus.UNUSED);
            trialVoucher.setExpiresAt(LocalDateTime.now().plusMinutes(TRIAL_DURATION_MINUTES));
            trialVoucher.setGeneratedAt(LocalDateTime.now());
            trialVoucher.setActivatedAt(LocalDateTime.now());
            trialVoucher.setCreatedBy("system");

            // Save voucher
            trialVoucher = voucherRepository.save(trialVoucher);
            System.out.println("✅ Trial voucher created: " + voucherCode);

            // Update account
            account.setIsTrialUsed(true);
            account.setTrialVoucherCode(voucherCode);
            customerAccountRepository.save(account);

            // Create or get Customer entity
            Customer customer = customerRepository.findByPhoneNumber(account.getPhoneNumber())
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setCustomerId("CUST_" + System.currentTimeMillis());
                    newCustomer.setFirstName(account.getFullName() != null ? account.getFullName().split(" ")[0] : "Customer");
                    newCustomer.setLastName(account.getFullName() != null && account.getFullName().split(" ").length > 1 
                        ? account.getFullName().substring(account.getFullName().indexOf(" ") + 1) : "");
                    newCustomer.setEmail(account.getEmail() != null ? account.getEmail() : account.getPhoneNumber() + "@ggwifi.co.tz");
                    newCustomer.setPrimaryPhoneNumber(account.getPhoneNumber());
                    newCustomer.setStatus(Customer.CustomerStatus.ACTIVE);
                    newCustomer.setAccountType(Customer.AccountType.INDIVIDUAL);
                    newCustomer.setRegistrationDate(LocalDateTime.now());
                    newCustomer.setPhoneVerified(true);
                    newCustomer.setLoyaltyPoints(0);
                    newCustomer.setLoyaltyStatus(Customer.LoyaltyStatus.NEW_CUSTOMER);
                    newCustomer.setLoyaltyTier(Customer.LoyaltyTier.BRONZE);
                    return customerRepository.save(newCustomer);
                });

            // Link account to customer
            if (account.getCustomerId() == null) {
                account.setCustomerId(customer.getId());
                customerAccountRepository.save(account);
            }

            // Create RADIUS user for immediate WiFi access
            System.out.println("🔐 Creating RADIUS user for trial voucher...");
            boolean radiusUserCreated = enhancedRadiusService.createRadiusUserAfterPayment(
                null, // No payment ID for trial
                account.getPhoneNumber(),
                voucherCode
            );

            if (!radiusUserCreated) {
                System.out.println("⚠️ Warning: RADIUS user creation failed for trial, but voucher is created");
            }

            // Send welcome SMS with trial voucher
            try {
                smsService.sendVoucherNotificationSms(
                    account.getPhoneNumber(),
                    account.getFullName() != null ? account.getFullName().split(" ")[0] : "Customer",
                    "Free 20-Minute Trial",
                    voucherCode,
                    "0",
                    "20 minutes"
                );
                System.out.println("📱 Welcome SMS sent with trial voucher");
            } catch (Exception e) {
                System.out.println("⚠️ SMS sending failed (non-critical): " + e.getMessage());
            }

            response.put("status", "success");
            response.put("message", "Free trial activated successfully");
            response.put("voucherCode", voucherCode);
            response.put("duration", TRIAL_DURATION_MINUTES + " minutes");
            response.put("expiresAt", trialVoucher.getExpiresAt());
            response.put("radiusUserCreated", radiusUserCreated);

            System.out.println("✅ Free trial activated successfully for: " + account.getPhoneNumber());

            return response;

        } catch (Exception e) {
            System.err.println("❌ Error generating free trial: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to generate free trial: " + e.getMessage());
            return response;
        }
    }

    /**
     * Check if customer is eligible for free trial
     */
    public boolean isEligibleForTrial(String phoneNumber) {
        Optional<CustomerAccount> accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
        if (accountOpt.isEmpty()) {
            return true; // New customer is eligible
        }
        CustomerAccount account = accountOpt.get();
        return account.getIsTrialUsed() == null || !account.getIsTrialUsed();
    }
}

