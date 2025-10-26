package com.ggnetworks.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import com.ggnetworks.entity.SystemConfiguration;
import com.ggnetworks.entity.Voucher;
import com.ggnetworks.repository.SystemConfigurationRepository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ZenoPayService {
    
    @Value("${zenopay.api.base-url:https://zenoapi.com}")
    private String zenopayBaseUrl;
    
    @Value("${zenopay.api.api-key:gUHLes8c3nVYCa7XEK8CWi-eBBNf04OCJ3JqJIU63NVj52MgevdOjFsL1tr26zgXZDvI3J6e5AjJAOflNS_EIw}")
    private String zenopayApiKey;
    
    @Value("${zenopay.endpoints.mobile-money:/api/payments/mobile_money_tanzania}")
    private String mobileMoneyEndpoint;
    
    @Value("${zenopay.endpoints.order-status:/api/payments/order-status}")
    private String orderStatusEndpoint;
    
    @Value("${zenopay.payment.currency:TZS}")
    private String currency;
    
    @Value("${zenopay.payment.country:TZ}")
    private String country;
    
    @Value("${zenopay.api.timeout:30000}") // 30 seconds
    private int apiTimeout;
    
    @Value("${zenopay.api.retries:3}") // 3 retries
    private int maxRetries;
    
    @Autowired
    private SystemConfigurationRepository systemConfigurationRepository;
    
    @Autowired
    private VoucherService voucherService;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * Create a payment order with ZenoPay Mobile Money Tanzania
     */
    public Map<String, Object> createOrder(String buyerEmail, String buyerName, String buyerPhone, 
                                          BigDecimal amount, String description, String orderId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Generate unique order ID if not provided
            if (orderId == null || orderId.isEmpty()) {
                orderId = UUID.randomUUID().toString();
            }
            
            // Prepare request headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", zenopayApiKey);
            
            // Prepare request body according to ZenoPay API specification
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("order_id", orderId);
            requestBody.put("buyer_email", buyerEmail);
            requestBody.put("buyer_name", buyerName);
            requestBody.put("buyer_phone", buyerPhone);
            requestBody.put("amount", amount.intValue()); // ZenoPay expects integer amount
            
            // Add webhook URL for payment notifications
            String webhookUrl = getWebhookUrl();
            if (webhookUrl != null) {
                requestBody.put("webhook_url", webhookUrl);
            }
            
            // Create HTTP entity
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // Make API call to ZenoPay
            ResponseEntity<Map> apiResponse = restTemplate.exchange(
                zenopayBaseUrl + mobileMoneyEndpoint,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            if (apiResponse.getStatusCode() == HttpStatus.OK) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = apiResponse.getBody();
                
                if (responseBody != null) {
                    response.put("status", "success");
                    response.put("order_id", orderId);
                    response.put("payment_reference", responseBody.get("payment_reference"));
                    response.put("payment_url", responseBody.get("payment_url"));
                    response.put("message", "Payment order created successfully");
                    response.put("zenopay_response", responseBody);
                    
                    System.out.println("✅ ZenoPay Order Created Successfully:");
                    System.out.println("   Order ID: " + orderId);
                    System.out.println("   Payment Reference: " + responseBody.get("payment_reference"));
                    System.out.println("   Amount: " + amount + " " + currency);
                    System.out.println("   Customer: " + buyerName + " (" + buyerPhone + ")");
                } else {
                    response.put("status", "error");
                    response.put("message", "Empty response from ZenoPay API");
                }
            } else {
                response.put("status", "error");
                response.put("message", "HTTP Error: " + apiResponse.getStatusCode());
            }
            
        } catch (HttpClientErrorException e) {
            response.put("status", "error");
            response.put("message", "Client Error: " + e.getMessage());
            response.put("status_code", e.getStatusCode().value());
            System.err.println("❌ ZenoPay Client Error: " + e.getMessage());
        } catch (HttpServerErrorException e) {
            response.put("status", "error");
            response.put("message", "Server Error: " + e.getMessage());
            response.put("status_code", e.getStatusCode().value());
            System.err.println("❌ ZenoPay Server Error: " + e.getMessage());
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error creating payment order: " + e.getMessage());
            System.err.println("❌ ZenoPay Error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return response;
    }
    
    /**
     * Check payment status
     */
    public Map<String, Object> checkOrderStatus(String orderId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Prepare request headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", zenopayApiKey);
            
            // Prepare request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("order_id", orderId);
            
            // Create HTTP entity
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // Make API call to ZenoPay
            ResponseEntity<Map> apiResponse = restTemplate.exchange(
                zenopayBaseUrl + orderStatusEndpoint,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            if (apiResponse.getStatusCode() == HttpStatus.OK) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = apiResponse.getBody();
                
                if (responseBody != null) {
                    response.put("status", "success");
                    response.put("order_id", orderId);
                    response.put("payment_status", responseBody.get("status"));
                    response.put("amount", responseBody.get("amount"));
                    response.put("currency", responseBody.get("currency"));
                    response.put("message", "Order status retrieved successfully");
                    response.put("zenopay_response", responseBody);
                } else {
                    response.put("status", "error");
                    response.put("message", "Empty response from ZenoPay API");
                }
            } else {
                response.put("status", "error");
                response.put("message", "HTTP Error: " + apiResponse.getStatusCode());
            }
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error checking order status: " + e.getMessage());
            System.err.println("❌ ZenoPay Status Check Error: " + e.getMessage());
        }
        
        return response;
    }
    
    /**
     * Initiate payment for customer portal
     */
    public Map<String, Object> initiatePayment(Map<String, Object> paymentData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String orderId = (String) paymentData.get("order_id");
            String amount = (String) paymentData.get("amount");
            String phoneNumber = (String) paymentData.get("msisdn");
            String customerName = (String) paymentData.get("customer_name");
            
            // Convert amount to BigDecimal
            BigDecimal amountDecimal = new BigDecimal(amount);
            
            // Generate email from phone number
            String customerEmail = phoneNumber + "@ggwifi.co.tz";
            
            // Create order with ZenoPay
            Map<String, Object> orderResult = createOrder(
                customerEmail,
                customerName,
                phoneNumber,
                amountDecimal,
                "GG WiFi Internet Package Payment",
                orderId
            );
            
            if ("success".equals(orderResult.get("status"))) {
                response.put("status", "success");
                response.put("order_id", orderId);
                response.put("payment_reference", orderResult.get("payment_reference"));
                response.put("payment_url", orderResult.get("payment_url"));
                response.put("message", "Payment initiated successfully");
                response.put("zenopay_response", orderResult);
                
                System.out.println("✅ Payment Initiated Successfully:");
                System.out.println("   Order ID: " + orderId);
                System.out.println("   Amount: " + amount + " TZS");
                System.out.println("   Customer: " + customerName + " (" + phoneNumber + ")");
                
            } else {
                response.put("status", "error");
                response.put("message", "Failed to initiate payment: " + orderResult.get("message"));
            }
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error initiating payment: " + e.getMessage());
            System.err.println("❌ Payment Initiation Error: " + e.getMessage());
        }
        
        return response;
    }
    
    /**
     * Get webhook URL from system configuration
     */
    private String getWebhookUrl() {
        try {
            Optional<SystemConfiguration> webhookConfig = systemConfigurationRepository.findByConfigKey("zenopay_webhook_url");
            if (webhookConfig.isPresent()) {
                return webhookConfig.get().getValue();
            }
        } catch (Exception e) {
            System.err.println("❌ Error getting webhook URL: " + e.getMessage());
        }
        
        // Default webhook URL
        return "http://localhost:8080/api/v1/customer-portal/webhook/zenopay";
    }
}