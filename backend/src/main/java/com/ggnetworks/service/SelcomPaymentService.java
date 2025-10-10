package com.ggnetworks.service;

import com.ggnetworks.entity.Payment;
import com.ggnetworks.repository.PaymentRepository;
import com.ggnetworks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SelcomPaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository; // may be used in other flows
    private final WebClient.Builder webClientBuilder;
    private final com.ggnetworks.repository.WebhookReceiptRepository webhookReceiptRepository;

    @Value("${selcom.api.base-url}")
    private String baseUrl;

    @Value("${selcom.api.merchant-id}")
    private String merchantId;

    @Value("${selcom.api.merchant-key}")
    private String merchantKey;

    @Value("${selcom.api.api-key}")
    private String apiKey;

    @Value("${selcom.api.api-secret}")
    private String apiSecret;

    @Value("${selcom.webhook.secret}")
    private String webhookSecret;

    @Value("${selcom.payment.timeout:300000}")
    private int paymentTimeout;

    @Value("${selcom.payment.currency:TZS}")
    private String currency;

    @Value("${selcom.payment.language:en}")
    private String language;

    /**
     * Map frontend payment method to SELCOM operator
     */
    private String mapPaymentMethodToOperator(String paymentMethod) {
        switch (paymentMethod.toLowerCase()) {
            case "mpesa":
                return "MPESA-TZ";
            case "airtel":
                return "AIRTELMONEY";
            case "mixx":
                return "TIGOPESATZ";
            case "halopesa":
                return "HALOPESATZ";
            case "tpesa":
                return "TTCLMOBILE";
            default:
                log.warn("Unknown payment method: {}, defaulting to MPESA-TZ", paymentMethod);
                return "MPESA-TZ";
        }
    }

    /**
     * Initialize C2B payment with SELCOM
     */
    public Map<String, Object> initializeC2BPayment(Payment payment, String paymentMethod) {
        try {
            log.info("Initializing SELCOM C2B payment for payment ID: {} with payment method: {}", payment.getId(), paymentMethod);

            // Map payment method to SELCOM operator
            String operator = mapPaymentMethodToOperator(paymentMethod);
            log.info("Mapped payment method {} to SELCOM operator: {}", paymentMethod, operator);

            // Generate unique transaction ID
            String transactionId = generateTransactionId();
            payment.setTransactionId(transactionId);
            payment.setStatus(Payment.PaymentStatus.PENDING);
            paymentRepository.save(payment);

            // Prepare C2B payment request
            Map<String, Object> paymentRequest = new HashMap<>();
            paymentRequest.put("transid", transactionId);
            paymentRequest.put("utilityref", "GGN-" + payment.getId());
            paymentRequest.put("amount", payment.getAmount().intValue());
            paymentRequest.put("vendor", merchantId);
            paymentRequest.put("msisdn", payment.getUser().getPhoneNumber());

            // Add authentication headers
            Map<String, String> headers = generateAuthHeaders(paymentRequest);

            // Send request to SELCOM
            WebClient webClient = createWebClient();
            Map<String, Object> response = webClient.post()
                    .uri("/v1/wallet/pushussd")
                    .headers(httpHeaders -> {
                        headers.forEach(httpHeaders::add);
                    })
                    .bodyValue(paymentRequest)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(java.time.Duration.ofMillis(paymentTimeout))
                    .block();

            if (response != null && "000".equals(response.get("resultcode"))) {
                // Payment initialized successfully
                payment.setGatewayResponse(response.toString());
                paymentRepository.save(payment);

                log.info("SELCOM C2B payment initialized successfully for payment ID: {} with operator: {}", payment.getId(), operator);
                
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("transactionId", transactionId);
                result.put("reference", response.get("reference"));
                result.put("operator", operator);
                result.put("message", "Payment request sent. Please check your phone for USSD prompt.");
                
                return result;
            } else {
                // Payment initialization failed
                String errorMessage = response != null ? (String) response.get("message") : "Unknown error";
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setGatewayResponse(response != null ? response.toString() : "No response");
                paymentRepository.save(payment);

                log.error("SELCOM C2B payment initialization failed for payment ID: {} with operator: {}. Error: {}", payment.getId(), operator, errorMessage);
                
                Map<String, Object> result = new HashMap<>();
                result.put("success", false);
                result.put("error", errorMessage);
                
                return result;
            }

        } catch (Exception e) {
            log.error("Failed to initialize SELCOM C2B payment for payment ID: {}", payment.getId(), e);
            
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setGatewayResponse("Exception: " + e.getMessage());
            paymentRepository.save(payment);

            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", "Payment initialization failed: " + e.getMessage());
            
            return result;
        }
    }

    /**
     * Query C2B transaction status
     */
    public Map<String, Object> queryC2BStatus(String transactionId, String reference) {
        try {
            log.info("Querying SELCOM C2B status for transaction ID: {} or reference: {}", transactionId, reference);

            // Prepare query request
            Map<String, Object> queryRequest = new HashMap<>();
            if (transactionId != null && !transactionId.isEmpty()) {
                queryRequest.put("transid", transactionId);
            }
            if (reference != null && !reference.isEmpty()) {
                queryRequest.put("reference", reference);
            }

            // Add authentication headers
            Map<String, String> headers = generateAuthHeaders(queryRequest);

            // Send request to SELCOM
            WebClient webClient = createWebClient();
            Map<String, Object> response = webClient.get()
                    .uri("/v1/c2b/query-status")
                    .headers(httpHeaders -> {
                        headers.forEach(httpHeaders::add);
                    })
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(java.time.Duration.ofMillis(paymentTimeout))
                    .block();

            if (response != null && "000".equals(response.get("resultcode"))) {
                String status = (String) response.get("result");
                String message = (String) response.get("message");
                
                // Find payment by transaction ID or reference
                Optional<Payment> paymentOpt = Optional.empty();
                if (transactionId != null) {
                    paymentOpt = paymentRepository.findByTransactionIdAndDeletedAtIsNull(transactionId);
                } else if (reference != null) {
                    // Extract payment ID from reference
                    String paymentIdStr = reference.replace("GGN-", "");
                    try {
                        Long paymentId = Long.parseLong(paymentIdStr);
                        paymentOpt = paymentRepository.findByIdAndDeletedAtIsNull(paymentId);
                    } catch (NumberFormatException e) {
                        log.error("Invalid reference format: {}", reference);
                    }
                }

                if (paymentOpt.isPresent()) {
                    Payment payment = paymentOpt.get();
                updatePaymentStatus(payment, status, response.toString());
                }
                
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("status", status);
                result.put("message", message);
                result.put("reference", response.get("reference"));
                result.put("transid", response.get("transid"));
                
                return result;
            } else {
                String errorMessage = response != null ? (String) response.get("message") : "Unknown error";
                log.error("SELCOM C2B status query failed. Error: {}", errorMessage);
                
                return Map.of("success", false, "error", errorMessage);
            }

        } catch (Exception e) {
            log.error("Failed to query SELCOM C2B status", e);
            return Map.of("success", false, "error", "Status query failed: " + e.getMessage());
        }
    }

    /**
     * Handle SELCOM C2B webhook (lookup, validation, notification)
     */
    public boolean handleC2BWebhook(Map<String, Object> webhookData, String endpoint) {
        try {
            log.info("Processing SELCOM C2B webhook for endpoint: {} with data: {}", endpoint, webhookData);

            // Idempotency: ensure each webhook (by transid or reference) is processed once
            if (!verifyWebhookSignature(webhookData)) {
                log.warn("Invalid SELCOM webhook signature");
                return false;
            }

            if (!markWebhookReceipt(webhookData, endpoint)) {
                log.info("Duplicate webhook detected, skipping processing");
                return true; // already processed
            }

            String operator = (String) webhookData.get("operator");
            String transid = (String) webhookData.get("transid");
            String reference = (String) webhookData.get("reference");
            String utilityref = (String) webhookData.get("utilityref");
            String msisdn = (String) webhookData.get("msisdn");
            String amount = (String) webhookData.get("amount");
            String resultcode = (String) webhookData.get("resultcode");
            String message = (String) webhookData.get("message");

            // Extract payment ID from utilityref
            String paymentIdStr = utilityref.replace("GGN-", "");
            Long paymentId = Long.parseLong(paymentIdStr);

            Optional<Payment> paymentOpt = paymentRepository.findByIdAndDeletedAtIsNull(paymentId);
            if (paymentOpt.isEmpty()) {
                log.error("Payment not found for webhook: {}", paymentId);
                return false;
            }

            Payment payment = paymentOpt.get();
            
            // Handle different webhook endpoints
            switch (endpoint) {
                case "/lookup":
                    return handleLookupWebhook(payment, webhookData, resultcode, message);
                case "/validation":
                    return handleValidationWebhook(payment, webhookData, resultcode, message);
                case "/notification":
                    return handleNotificationWebhook(payment, webhookData, resultcode, message);
                default:
                    log.error("Unknown webhook endpoint: {}", endpoint);
                    return false;
            }

        } catch (Exception e) {
            log.error("Failed to process SELCOM C2B webhook", e);
            return false;
        }
    }

    /**
     * Verify webhook signature using shared secret if provided
     */
    private boolean verifyWebhookSignature(Map<String, Object> payload) {
        try {
            Object provided = payload.getOrDefault("signature", "");
            if (webhookSecret == null || webhookSecret.isBlank()) return true; // allow in dev
            // Build canonical string: sort keys alphabetically and concat key=value
            StringBuilder sb = new StringBuilder();
            payload.entrySet().stream()
                    .filter(e -> !"signature".equalsIgnoreCase(e.getKey()))
                    .sorted(Map.Entry.comparingByKey())
                    .forEach(e -> sb.append(e.getKey()).append("=").append(String.valueOf(e.getValue())).append("&"));
            if (sb.length() > 0) sb.setLength(sb.length() - 1);
            String expected = generateHmacSha256(sb.toString(), webhookSecret);
            return expected.equals(provided);
        } catch (Exception ex) {
            log.error("Webhook signature verification failed", ex);
            return false;
        }
    }

    /**
     * Record webhook receipt for idempotency. Returns false if already processed recently.
     */
    private boolean markWebhookReceipt(Map<String, Object> data, String endpoint) {
        try {
            String transid = String.valueOf(data.getOrDefault("transid", ""));
            String reference = String.valueOf(data.getOrDefault("reference", ""));
            String dedupeKey = (endpoint + ":" + transid + ":" + reference).toLowerCase();
            // Persist receipt
            com.ggnetworks.entity.WebhookReceipt receipt = new com.ggnetworks.entity.WebhookReceipt();
            receipt.setProvider("SELCOM");
            receipt.setEndpoint(endpoint);
            receipt.setDedupeKey(dedupeKey);
            receipt.setPayload(data.toString());
            receipt.setReceivedAt(LocalDateTime.now());
            // Upsert style: repository will enforce unique key
            webhookReceiptRepository.save(receipt);
            return true;
        } catch (org.springframework.dao.DataIntegrityViolationException dup) {
            return false;
        }
    }

    /**
     * Handle lookup webhook
     */
    private boolean handleLookupWebhook(Payment payment, Map<String, Object> webhookData, String resultcode, String message) {
        try {
            log.info("Processing lookup webhook for payment ID: {}", payment.getId());
            
            // Store lookup response
            payment.setGatewayResponse("LOOKUP: " + webhookData.toString());
            paymentRepository.save(payment);
            
            return "000".equals(resultcode);
        } catch (Exception e) {
            log.error("Failed to process lookup webhook", e);
            return false;
        }
    }

    /**
     * Handle validation webhook
     */
    private boolean handleValidationWebhook(Payment payment, Map<String, Object> webhookData, String resultcode, String message) {
        try {
            log.info("Processing validation webhook for payment ID: {}", payment.getId());
            
            if ("000".equals(resultcode)) {
                // Payment validated successfully
                payment.setStatus(Payment.PaymentStatus.PENDING);
                payment.setGatewayResponse("VALIDATION: " + webhookData.toString());
                paymentRepository.save(payment);
                return true;
            } else {
                // Payment validation failed
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setGatewayResponse("VALIDATION_FAILED: " + webhookData.toString());
                paymentRepository.save(payment);
                return false;
            }
        } catch (Exception e) {
            log.error("Failed to process validation webhook", e);
            return false;
        }
    }

    /**
     * Handle notification webhook
     */
    private boolean handleNotificationWebhook(Payment payment, Map<String, Object> webhookData, String resultcode, String message) {
        try {
            log.info("Processing notification webhook for payment ID: {}", payment.getId());

            if ("000".equals(resultcode)) {
                // Payment completed successfully
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setPaidAt(LocalDateTime.now());
                payment.setGatewayResponse("NOTIFICATION: " + webhookData.toString());
                paymentRepository.save(payment);

                // TODO: Send SMS confirmation to user
                log.info("Payment completed successfully for payment ID: {}", payment.getId());
                return true;
            } else {
                // Payment failed
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setGatewayResponse("NOTIFICATION_FAILED: " + webhookData.toString());
                paymentRepository.save(payment);
                return false;
            }
        } catch (Exception e) {
            log.error("Failed to process notification webhook", e);
            return false;
        }
    }

    /**
     * Generate authentication headers for SELCOM API
     */
    private Map<String, String> generateAuthHeaders(Map<String, Object> requestData) {
        Map<String, String> headers = new HashMap<>();
        
        // Generate timestamp
        String timestamp = LocalDateTime.now(ZoneId.of("Africa/Dar_es_Salaam"))
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX"));
        
        // Create signed fields string
        List<String> signedFields = new ArrayList<>(requestData.keySet());
        signedFields.add("timestamp");
        String signedFieldsStr = String.join(",", signedFields);
        
        // Create digest string
        StringBuilder digestString = new StringBuilder();
        digestString.append("timestamp=").append(timestamp);
        
        // Add request data in alphabetical order
        requestData.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    digestString.append("&").append(entry.getKey()).append("=").append(entry.getValue());
                });
        
        // Generate HMAC SHA256 digest
        String digest = generateHmacSha256(digestString.toString(), apiSecret);
        
        // Set headers
        headers.put("Authorization", "SELCOM " + Base64.getEncoder().encodeToString(apiKey.getBytes()));
        headers.put("Timestamp", timestamp);
        headers.put("Digest-Method", "HS256");
        headers.put("Digest", digest);
        headers.put("Signed-Fields", signedFieldsStr);
                
        return headers;
    }

    /**
     * Generate HMAC SHA256 signature
     */
    private String generateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            log.error("Failed to generate HMAC SHA256", e);
            return "";
        }
    }

    /**
     * Get payment methods available (Tanzanian mobile money)
     */
    public Map<String, Object> getPaymentMethods() {
        Map<String, Object> methods = new HashMap<>();
        
        // Mobile money methods with SELCOM operator mapping
        Map<String, Object> mobileMoney = new HashMap<>();
        mobileMoney.put("mpesa", Map.of(
            "name", "M-Pesa",
            "operator", "MPESA-TZ",
            "description", "Vodacom Tanzania"
        ));
        mobileMoney.put("airtel", Map.of(
            "name", "Airtel Money",
            "operator", "AIRTELMONEY", 
            "description", "Airtel Tanzania"
        ));
        mobileMoney.put("mixx", Map.of(
            "name", "Mixx",
            "operator", "TIGOPESATZ",
            "description", "Tigo Tanzania (formerly Tigo Pesa)"
        ));
        mobileMoney.put("halopesa", Map.of(
            "name", "HaloPesa",
            "operator", "HALOPESATZ",
            "description", "Halotel"
        ));
        mobileMoney.put("tpesa", Map.of(
            "name", "T-Pesa (TTCL)",
            "operator", "TTCLMOBILE",
            "description", "TTCL (Tanzania Telecommunications Company Limited)"
        ));
        
        methods.put("mobile_money", mobileMoney);
        
        return methods;
    }

    /**
     * Generate transaction ID
     */
    private String generateTransactionId() {
        return "GGN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Update payment status based on SELCOM response
     */
    private void updatePaymentStatus(Payment payment, String status, String gatewayResponse) {
        payment.setGatewayResponse(gatewayResponse);
        
        switch (status.toLowerCase()) {
            case "success":
            case "successful":
            case "completed":
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setPaidAt(LocalDateTime.now());
                break;
            case "failed":
            case "cancelled":
                payment.setStatus(Payment.PaymentStatus.FAILED);
                break;
            case "pending":
                payment.setStatus(Payment.PaymentStatus.PENDING);
                break;
            default:
                payment.setStatus(Payment.PaymentStatus.FAILED);
                break;
        }
        
        paymentRepository.save(payment);
        log.info("Payment status updated to {} for payment ID: {}", status, payment.getId());
    }

    /**
     * Create WebClient for SELCOM API
     */
    private WebClient createWebClient() {
        return webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    /**
     * Get payment statistics
     */
    public Map<String, Object> getPaymentStatistics() {
        try {
            long totalPayments = paymentRepository.countByDeletedAtIsNull();
            long completedPayments = paymentRepository.countByStatusAndDeletedAtIsNull(Payment.PaymentStatus.COMPLETED);
            long pendingPayments = paymentRepository.countByStatusAndDeletedAtIsNull(Payment.PaymentStatus.PENDING);
            long failedPayments = paymentRepository.countByStatusAndDeletedAtIsNull(Payment.PaymentStatus.FAILED);

            // Calculate total revenue
            BigDecimal totalRevenue = paymentRepository.sumAmountByStatusAndDeletedAtIsNull(Payment.PaymentStatus.COMPLETED);
            if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalPayments", totalPayments);
            stats.put("completedPayments", completedPayments);
            stats.put("pendingPayments", pendingPayments);
            stats.put("failedPayments", failedPayments);
            stats.put("totalRevenue", totalRevenue);
            stats.put("successRate", totalPayments > 0 ? (double) completedPayments / totalPayments * 100 : 0);

            return stats;
        } catch (Exception e) {
            log.error("Failed to get payment statistics", e);
            return new HashMap<>();
        }
    }
} 