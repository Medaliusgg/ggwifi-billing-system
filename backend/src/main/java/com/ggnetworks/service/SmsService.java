package com.ggnetworks.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    @Value("${sms.api.base-url:https://messaging-service.co.tz}")
    private String smsApiBaseUrl;

    @Value("${sms.api.username:medalius}")
    private String smsApiUsername;

    @Value("${sms.api.password:Kolombo@123}")
    private String smsApiPassword;

    @Value("${sms.api.sender-id:GGWi-Fi}")
    private String smsApiSenderId;

    private final RestTemplate restTemplate;

    public SmsService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Send SMS using NEXT SMS API
     */
    public Map<String, Object> sendSms(String phoneNumber, String message) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Format phone number to international format
            String formattedPhone = formatPhoneNumber(phoneNumber);
            
            // Create request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("from", smsApiSenderId);
            requestBody.put("to", formattedPhone);
            requestBody.put("text", message);
            requestBody.put("reference", "GGWIFI_" + System.currentTimeMillis());

            // Create headers with Basic Authentication
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String credentials = smsApiUsername + ":" + smsApiPassword;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
            headers.set("Authorization", "Basic " + encodedCredentials);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Send SMS
            String sendEndpoint = smsApiBaseUrl + "/api/sms/v1/text/single";
            ResponseEntity<Map> response = restTemplate.postForEntity(sendEndpoint, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                System.out.println("📱 SMS API Response: " + responseBody);
                
                if (responseBody != null) {
                    // Check for success indicators in the response
                    boolean isSuccess = false;
                    String successMessage = "";
                    
                    if (responseBody.containsKey("success") && "true".equals(String.valueOf(responseBody.get("success")))) {
                        isSuccess = true;
                        successMessage = "SMS sent successfully";
                    } else if (responseBody.containsKey("status") && "success".equals(String.valueOf(responseBody.get("status")))) {
                        isSuccess = true;
                        successMessage = "SMS sent successfully";
                    } else if (responseBody.containsKey("message_id") || responseBody.containsKey("messageId")) {
                        isSuccess = true;
                        successMessage = "SMS sent successfully";
                    } else if (responseBody.containsKey("messages")) {
                        // Handle NEXT SMS API response format
                        Object messagesObj = responseBody.get("messages");
                        if (messagesObj instanceof java.util.List) {
                            java.util.List<?> messages = (java.util.List<?>) messagesObj;
                            if (!messages.isEmpty()) {
                                Object firstMessage = messages.get(0);
                                if (firstMessage instanceof java.util.Map) {
                                    java.util.Map<?, ?> messageMap = (java.util.Map<?, ?>) firstMessage;
                                    if (messageMap.containsKey("messageId")) {
                                        isSuccess = true;
                                        successMessage = "SMS sent successfully";
                                    }
                                }
                            }
                        }
                    }
                    
                    if (isSuccess) {
                        result.put("status", "success");
                        result.put("message", successMessage);
                        result.put("message_id", responseBody.get("message_id") != null ? responseBody.get("message_id") : responseBody.get("messageId"));
                        result.put("phone", formattedPhone);
                        result.put("text", message);
                        result.put("api_response", responseBody);
                        
                        System.out.println("✅ SMS sent successfully to " + formattedPhone);
                    } else {
                        result.put("status", "error");
                        result.put("message", "SMS API returned error: " + responseBody);
                        result.put("api_response", responseBody);
                        System.err.println("❌ SMS API error: " + responseBody);
                    }
                } else {
                    result.put("status", "error");
                    result.put("message", "SMS API returned null response");
                    System.err.println("❌ SMS API returned null response");
                }
            } else {
                result.put("status", "error");
                result.put("message", "HTTP error: " + response.getStatusCode());
                System.err.println("❌ SMS HTTP error: " + response.getStatusCode());
            }

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            result.put("status", "error");
            result.put("message", "SMS API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            System.err.println("❌ SMS API exception: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Error sending SMS: " + e.getMessage());
            System.err.println("❌ SMS sending error: " + e.getMessage());
            e.printStackTrace();
        }

        return result;
    }

    /**
     * Send voucher notification SMS for successful payment
     */
    public Map<String, Object> sendVoucherNotificationSms(String phoneNumber, String customerName, 
                                                          String packageName, String voucherCode, 
                                                          String amount, String duration) {
        String message = String.format(
            "🎉 Welcome %s! Your payment of %s TZS for %s (%s) was successful. " +
            "Your voucher code: %s. Enjoy your internet access! " +
            "For support, contact us at 0742844024. - GGWi-Fi",
            customerName, amount, packageName, duration, voucherCode
        );
        
        return sendSms(phoneNumber, message);
    }

    /**
     * Send payment failure SMS with caring message
     */
    public Map<String, Object> sendPaymentFailureSms(String phoneNumber, String customerName) {
        String message = String.format(
            "Hi %s, we noticed your payment didn't go through. " +
            "This might be due to insufficient balance or network issues. " +
            "Please try again or contact your mobile money provider. " +
            "We're here to help! For support: 0742844024. - GGWi-Fi",
            customerName
        );
        
        return sendSms(phoneNumber, message);
    }

    /**
     * Format phone number to international format (255XXXXXXXXX)
     */
    private String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return phoneNumber;
        }
        
        // Remove any spaces, dashes, or other characters
        String cleaned = phoneNumber.replaceAll("[^0-9]", "");
        
        // If it starts with 0, replace with 255
        if (cleaned.startsWith("0")) {
            return "255" + cleaned.substring(1);
        }
        
        // If it starts with 255, return as is
        if (cleaned.startsWith("255")) {
            return cleaned;
        }
        
        // If it's 9 digits, assume it's a local number and add 255
        if (cleaned.length() == 9) {
            return "255" + cleaned;
        }
        
        // Return as is if it doesn't match any pattern
        return cleaned;
    }

    /**
     * Test SMS service
     */
    public Map<String, Object> testSmsService() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            System.out.println("🧪 Testing SMS Service...");
            
            // Test with a simple message
            String testPhone = "0742844024";
            String testMessage = "SMS service test from GGWi-Fi system. If you receive this, SMS is working!";
            
            Map<String, Object> smsResult = sendSms(testPhone, testMessage);
            
            if ("success".equals(smsResult.get("status"))) {
                result.put("status", "success");
                result.put("message", "SMS service test successful");
                result.put("test_result", smsResult);
                System.out.println("✅ SMS Service Test Successful");
            } else {
                result.put("status", "error");
                result.put("message", "SMS service test failed: " + smsResult.get("message"));
                result.put("test_result", smsResult);
                System.err.println("❌ SMS Service Test Failed: " + smsResult.get("message"));
            }
            
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "SMS service test error: " + e.getMessage());
            System.err.println("❌ SMS Service Test Error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return result;
    }
}