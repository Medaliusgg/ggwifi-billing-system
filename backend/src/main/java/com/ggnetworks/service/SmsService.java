package com.ggnetworks.service;

import com.ggnetworks.entity.SmsMessage;
import com.ggnetworks.entity.User;
import com.ggnetworks.repository.SmsMessageRepository;
import com.ggnetworks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsService {

    private final SmsMessageRepository smsMessageRepository;
    private final UserRepository userRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${sms.api.base-url}")
    private String smsApiBaseUrl;

    @Value("${sms.api.key}")
    private String smsApiKey;

    @Value("${sms.api.secret}")
    private String smsApiSecret;

    @Value("${sms.sender-id}")
    private String senderId;

    @Value("${sms.timeout:30000}")
    private int smsTimeout;

    /**
     * Send SMS message
     */
    @Transactional
    public Map<String, Object> sendSms(String phoneNumber, String message, SmsMessage.MessageType type) {
        try {
            log.info("Sending SMS to {}: {}", phoneNumber, message);

            // Create SMS message record
            SmsMessage smsMessage = new SmsMessage();
            smsMessage.setPhoneNumber(phoneNumber);
            smsMessage.setMessageContent(message);
            smsMessage.setType(type);
            smsMessage.setStatus(SmsMessage.MessageStatus.PENDING);
            smsMessage.setSenderId(senderId);

            SmsMessage savedMessage = smsMessageRepository.save(smsMessage);

            // Send SMS via API
            Map<String, Object> apiResponse = sendSmsViaApi(phoneNumber, message, savedMessage.getId());

            if (apiResponse.get("success").equals(true)) {
                savedMessage.setStatus(SmsMessage.MessageStatus.SENT);
                savedMessage.setSentAt(LocalDateTime.now());
                savedMessage.setMessageId((String) apiResponse.get("messageId"));
                smsMessageRepository.save(savedMessage);

                log.info("SMS sent successfully to {} with message ID: {}", phoneNumber, savedMessage.getMessageId());
                return Map.of("success", true, "messageId", savedMessage.getMessageId());
            } else {
                savedMessage.setStatus(SmsMessage.MessageStatus.FAILED);
                savedMessage.setErrorMessage((String) apiResponse.get("error"));
                smsMessageRepository.save(savedMessage);

                log.error("Failed to send SMS to {}: {}", phoneNumber, apiResponse.get("error"));
                return Map.of("success", false, "error", apiResponse.get("error"));
            }

        } catch (Exception e) {
            log.error("Failed to send SMS to {}", phoneNumber, e);
            return Map.of("success", false, "error", "SMS sending failed: " + e.getMessage());
        }
    }

    /**
     * Send payment confirmation SMS
     */
    @Transactional
    public Map<String, Object> sendPaymentConfirmation(String phoneNumber, String transactionId, 
                                                      BigDecimal amount, String voucherCode) {
        try {
            String message = String.format(
                "Payment successful! Transaction ID: %s\nAmount: TZS %s\nVoucher Code: %s\nThank you for choosing GGNetworks!",
                transactionId, amount.toString(), voucherCode
            );

            return sendSms(phoneNumber, message, SmsMessage.MessageType.TRANSACTIONAL);
        } catch (Exception e) {
            log.error("Failed to send payment confirmation SMS to {}", phoneNumber, e);
            return Map.of("success", false, "error", "Failed to send payment confirmation");
        }
    }

    /**
     * Send payment failure SMS
     */
    @Transactional
    public Map<String, Object> sendPaymentFailure(String phoneNumber, String transactionId, String reason) {
        try {
            String message = String.format(
                "Payment failed! Transaction ID: %s\nReason: %s\nPlease try again or contact support.",
                transactionId, reason
            );

            return sendSms(phoneNumber, message, SmsMessage.MessageType.TRANSACTIONAL);
        } catch (Exception e) {
            log.error("Failed to send payment failure SMS to {}", phoneNumber, e);
            return Map.of("success", false, "error", "Failed to send payment failure notification");
        }
    }

    /**
     * Send OTP SMS
     */
    @Transactional
    public Map<String, Object> sendOtp(String phoneNumber, String otpCode) {
        try {
            String message = String.format(
                "Your GGNetworks verification code is: %s\nValid for 5 minutes. Do not share this code.",
                otpCode
            );

            return sendSms(phoneNumber, message, SmsMessage.MessageType.OTP);
        } catch (Exception e) {
            log.error("Failed to send OTP SMS to {}", phoneNumber, e);
            return Map.of("success", false, "error", "Failed to send OTP");
        }
    }

    /**
     * Send voucher code SMS
     */
    @Transactional
    public Map<String, Object> sendVoucherCode(String phoneNumber, String voucherCode, 
                                               String packageName, String validity) {
        try {
            String message = String.format(
                "Your internet package is ready!\nPackage: %s\nVoucher Code: %s\nValidity: %s\nConnect to GGNetworks WiFi and enter the voucher code.",
                packageName, voucherCode, validity
            );

            return sendSms(phoneNumber, message, SmsMessage.MessageType.TRANSACTIONAL);
        } catch (Exception e) {
            log.error("Failed to send voucher code SMS to {}", phoneNumber, e);
            return Map.of("success", false, "error", "Failed to send voucher code");
        }
    }

    /**
     * Send welcome SMS
     */
    @Transactional
    public Map<String, Object> sendWelcomeSms(String phoneNumber, String customerName) {
        try {
            String message = String.format(
                "Welcome to GGNetworks, %s!\nThank you for choosing our internet services. For support, call us or visit our website.",
                customerName
            );

            return sendSms(phoneNumber, message, SmsMessage.MessageType.WELCOME);
        } catch (Exception e) {
            log.error("Failed to send welcome SMS to {}", phoneNumber, e);
            return Map.of("success", false, "error", "Failed to send welcome message");
        }
    }

    /**
     * Send promotional SMS
     */
    @Transactional
    public Map<String, Object> sendPromotionalSms(String phoneNumber, String promotionMessage) {
        try {
            return sendSms(phoneNumber, promotionMessage, SmsMessage.MessageType.PROMOTIONAL);
        } catch (Exception e) {
            log.error("Failed to send promotional SMS to {}", phoneNumber, e);
            return Map.of("success", false, "error", "Failed to send promotional message");
        }
    }

    /**
     * Send SMS via API
     */
    private Map<String, Object> sendSmsViaApi(String phoneNumber, String message, Long messageId) {
        try {
            // Prepare SMS request
            Map<String, Object> smsRequest = new HashMap<>();
            smsRequest.put("phone_number", phoneNumber);
            smsRequest.put("message", message);
            smsRequest.put("sender_id", senderId);
            smsRequest.put("message_id", messageId.toString());

            // Send request to SMS API
            WebClient webClient = createWebClient();
            Map<String, Object> response = webClient.post()
                    .uri("/send")
                    .bodyValue(smsRequest)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(java.time.Duration.ofMillis(smsTimeout))
                    .block();

            if (response != null && "success".equals(response.get("status"))) {
                return Map.of("success", true, "messageId", response.get("message_id"));
            } else {
                String error = response != null ? (String) response.get("error") : "Unknown error";
                return Map.of("success", false, "error", error);
            }

        } catch (Exception e) {
            log.error("Failed to send SMS via API", e);
            return Map.of("success", false, "error", "API call failed: " + e.getMessage());
        }
    }

    /**
     * Get SMS delivery status
     */
    public Map<String, Object> getSmsDeliveryStatus(String messageId) {
        try {
            Optional<SmsMessage> smsOpt = smsMessageRepository.findByMessageId(messageId);
            if (smsOpt.isEmpty()) {
                return Map.of("success", false, "error", "SMS message not found");
            }

            SmsMessage sms = smsOpt.get();
            Map<String, Object> status = new HashMap<>();
            status.put("success", true);
            status.put("messageId", sms.getMessageId());
            status.put("status", sms.getStatus().toString());
            status.put("sentAt", sms.getSentAt());
            status.put("deliveredAt", sms.getDeliveredAt());
            status.put("errorMessage", sms.getErrorMessage());

            return status;
        } catch (Exception e) {
            log.error("Failed to get SMS delivery status for message ID: {}", messageId, e);
            return Map.of("success", false, "error", "Failed to get delivery status");
        }
    }

    /**
     * Get SMS statistics
     */
    public Map<String, Object> getSmsStatistics() {
        try {
            long totalMessages = smsMessageRepository.count();
            long sentMessages = smsMessageRepository.countByStatus(SmsMessage.MessageStatus.SENT);
            long deliveredMessages = smsMessageRepository.countByStatus(SmsMessage.MessageStatus.DELIVERED);
            long failedMessages = smsMessageRepository.countByStatus(SmsMessage.MessageStatus.FAILED);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalMessages", totalMessages);
            stats.put("sentMessages", sentMessages);
            stats.put("deliveredMessages", deliveredMessages);
            stats.put("failedMessages", failedMessages);
            stats.put("deliveryRate", totalMessages > 0 ? (double) deliveredMessages / totalMessages * 100 : 0);

            return stats;
        } catch (Exception e) {
            log.error("Failed to get SMS statistics", e);
            return new HashMap<>();
        }
    }

    /**
     * Create WebClient for SMS API
     */
    private WebClient createWebClient() {
        return webClientBuilder
                .baseUrl(smsApiBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .defaultHeader("Authorization", "Bearer " + smsApiKey)
                .build();
    }
} 