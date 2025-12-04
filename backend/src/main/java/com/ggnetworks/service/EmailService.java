package com.ggnetworks.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Email Service
 * Handles email sending functionality
 */
@Service
public class EmailService {

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private Integer mailPort;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${spring.mail.properties.mail.smtp.from:noreply@ggwifi.co.tz}")
    private String mailFrom;

    private final JavaMailSender mailSender;

    public EmailService(@org.springframework.beans.factory.annotation.Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send simple email
     */
    public Map<String, Object> sendEmail(String to, String subject, String text) {
        Map<String, Object> result = new HashMap<>();
        
        if (mailSender == null) {
            result.put("status", "error");
            result.put("message", "Email service not configured. JavaMailSender bean not available.");
            System.out.println("⚠️ Email service not configured - JavaMailSender bean not available");
            return result;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            
            result.put("status", "success");
            result.put("message", "Email sent successfully");
            result.put("to", to);
            
            System.out.println("✅ Email sent successfully to " + to);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to send email: " + e.getMessage());
            System.err.println("❌ Email sending error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return result;
    }

    /**
     * Send password reset email
     */
    public Map<String, Object> sendPasswordResetEmail(String to, String resetToken, String username) {
        String subject = "Password Reset Request - GGWi-Fi";
        String text = String.format(
            "Hello %s,\n\n" +
            "You have requested to reset your password for your GGWi-Fi account.\n\n" +
            "Your password reset token is: %s\n\n" +
            "This token will expire in 15 minutes.\n\n" +
            "If you did not request this, please ignore this email.\n\n" +
            "Best regards,\n" +
            "GGWi-Fi Support Team",
            username, resetToken
        );
        
        return sendEmail(to, subject, text);
    }

    /**
     * Send email verification email
     */
    public Map<String, Object> sendEmailVerificationEmail(String to, String verificationToken, String username) {
        String subject = "Verify Your Email - GGWi-Fi";
        String text = String.format(
            "Hello %s,\n\n" +
            "Thank you for registering with GGWi-Fi!\n\n" +
            "Please verify your email address by clicking the link below or using this token:\n\n" +
            "Verification Token: %s\n\n" +
            "This token will expire in 24 hours.\n\n" +
            "If you did not create an account, please ignore this email.\n\n" +
            "Best regards,\n" +
            "GGWi-Fi Support Team",
            username, verificationToken
        );
        
        return sendEmail(to, subject, text);
    }

    /**
     * Send welcome email
     */
    public Map<String, Object> sendWelcomeEmail(String to, String username) {
        String subject = "Welcome to GGWi-Fi!";
        String text = String.format(
            "Hello %s,\n\n" +
            "Welcome to GGWi-Fi! We're excited to have you on board.\n\n" +
            "Your account has been successfully created. You can now:\n" +
            "- Browse our internet packages\n" +
            "- Make payments securely\n" +
            "- Manage your account\n\n" +
            "If you have any questions, please contact our support team.\n\n" +
            "Best regards,\n" +
            "GGWi-Fi Team",
            username
        );
        
        return sendEmail(to, subject, text);
    }
}

