package com.ggnetworks.service;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;

/**
 * MFA Service
 * Provides TOTP (Time-based One-Time Password) for multi-factor authentication
 */
@Service
public class MFAService {
    
    private static final Logger logger = LoggerFactory.getLogger(MFAService.class);
    
    @Value("${app.name:GGNetworks}")
    private String appName;
    
    private final SecretGenerator secretGenerator;
    private final QrGenerator qrGenerator;
    private final CodeGenerator codeGenerator;
    private final CodeVerifier codeVerifier;
    
    public MFAService() {
        this.secretGenerator = new DefaultSecretGenerator();
        this.qrGenerator = new ZxingPngQrGenerator();
        this.codeGenerator = new DefaultCodeGenerator();
        TimeProvider timeProvider = new SystemTimeProvider();
        this.codeVerifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
    }
    
    /**
     * Generate secret key for TOTP
     */
    public String generateSecret() {
        return secretGenerator.generate();
    }
    
    /**
     * Generate QR code data URI for MFA setup
     */
    public String generateQrCodeDataUri(String secret, String email) {
        try {
            QrData data = new QrData.Builder()
                    .label(email)
                    .secret(secret)
                    .issuer(appName)
                    .algorithm(HashingAlgorithm.SHA1)
                    .digits(6)
                    .period(30)
                    .build();
            
            byte[] qrCode = qrGenerator.generate(data);
            String base64QrCode = Base64.getEncoder().encodeToString(qrCode);
            return "data:image/png;base64," + base64QrCode;
        } catch (QrGenerationException e) {
            logger.error("Failed to generate QR code: {}", e.getMessage(), e);
            throw new RuntimeException("QR code generation failed", e);
        }
    }
    
    /**
     * Verify TOTP code
     */
    public boolean verifyCode(String secret, String code) {
        try {
            return codeVerifier.isValidCode(secret, code);
        } catch (Exception e) {
            logger.error("TOTP verification failed: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Generate backup codes (8-digit codes)
     */
    public String[] generateBackupCodes(int count) {
        String[] codes = new String[count];
        for (int i = 0; i < count; i++) {
            codes[i] = String.format("%08d", (int)(Math.random() * 100000000));
        }
        return codes;
    }
}

