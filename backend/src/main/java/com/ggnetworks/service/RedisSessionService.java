package com.ggnetworks.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ggnetworks.entity.VoucherSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Redis Session Service
 * Manages voucher sessions in Redis for ultra-fast lookups and cross-router persistence
 */
@Service
public class RedisSessionService {
    
    private static final Logger logger = LoggerFactory.getLogger(RedisSessionService.class);
    private static final String SESSION_KEY_PREFIX = "voucher:session:";
    private static final String DEVICE_KEY_PREFIX = "device:session:";
    private static final String TOKEN_KEY_PREFIX = "token:session:";
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * Store session in Redis
     */
    public void storeSession(VoucherSession session) {
        try {
            String key = SESSION_KEY_PREFIX + session.getVoucherCode();
            String deviceKey = DEVICE_KEY_PREFIX + session.getVoucherCode();
            String tokenKey = TOKEN_KEY_PREFIX + session.getSessionToken();
            
            // Store session by voucher code
            redisTemplate.opsForValue().set(key, session, 
                Duration.ofDays(session.getPackageDurationDays()));
            
            // Store device mapping (for MAC randomization handling)
            if (session.getMacAddress() != null) {
                redisTemplate.opsForValue().set(deviceKey, session.getVoucherCode(),
                    Duration.ofDays(session.getPackageDurationDays()));
            }
            
            // Store token mapping (for seamless reconnection)
            if (session.getSessionToken() != null) {
                redisTemplate.opsForValue().set(tokenKey, session.getVoucherCode(),
                    Duration.ofDays(session.getPackageDurationDays()));
            }
            
            logger.info("Stored session in Redis: {}", session.getVoucherCode());
        } catch (Exception e) {
            logger.error("Failed to store session in Redis: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Get session from Redis by voucher code
     */
    public VoucherSession getSession(String voucherCode) {
        try {
            String key = SESSION_KEY_PREFIX + voucherCode;
            Object sessionObj = redisTemplate.opsForValue().get(key);
            
            if (sessionObj != null) {
                if (sessionObj instanceof VoucherSession) {
                    return (VoucherSession) sessionObj;
                } else if (sessionObj instanceof Map) {
                    return objectMapper.convertValue(sessionObj, VoucherSession.class);
                }
            }
        } catch (Exception e) {
            logger.error("Failed to get session from Redis: {}", e.getMessage(), e);
        }
        return null;
    }
    
    /**
     * Get session by device fingerprint (for MAC randomization)
     */
    public VoucherSession getSessionByDevice(String deviceFingerprint) {
        try {
            String deviceKey = DEVICE_KEY_PREFIX + deviceFingerprint;
            String voucherCode = (String) redisTemplate.opsForValue().get(deviceKey);
            
            if (voucherCode != null) {
                return getSession(voucherCode);
            }
        } catch (Exception e) {
            logger.error("Failed to get session by device: {}", e.getMessage(), e);
        }
        return null;
    }
    
    /**
     * Get session by token (for seamless reconnection)
     */
    public VoucherSession getSessionByToken(String sessionToken) {
        try {
            String tokenKey = TOKEN_KEY_PREFIX + sessionToken;
            String voucherCode = (String) redisTemplate.opsForValue().get(tokenKey);
            
            if (voucherCode != null) {
                return getSession(voucherCode);
            }
        } catch (Exception e) {
            logger.error("Failed to get session by token: {}", e.getMessage(), e);
        }
        return null;
    }
    
    /**
     * Update session in Redis
     */
    public void updateSession(VoucherSession session) {
        storeSession(session); // Redis update is same as store
    }
    
    /**
     * Delete session from Redis
     */
    public void deleteSession(String voucherCode) {
        try {
            String key = SESSION_KEY_PREFIX + voucherCode;
            VoucherSession session = getSession(voucherCode);
            
            if (session != null) {
                // Delete all related keys
                redisTemplate.delete(key);
                
                if (session.getMacAddress() != null) {
                    String deviceKey = DEVICE_KEY_PREFIX + session.getVoucherCode();
                    redisTemplate.delete(deviceKey);
                }
                
                if (session.getSessionToken() != null) {
                    String tokenKey = TOKEN_KEY_PREFIX + session.getSessionToken();
                    redisTemplate.delete(tokenKey);
                }
            }
            
            logger.info("Deleted session from Redis: {}", voucherCode);
        } catch (Exception e) {
            logger.error("Failed to delete session from Redis: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Check if session exists in Redis
     */
    public boolean sessionExists(String voucherCode) {
        try {
            String key = SESSION_KEY_PREFIX + voucherCode;
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            logger.error("Failed to check session existence: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Extend session TTL
     */
    public void extendSession(String voucherCode, long days) {
        try {
            String key = SESSION_KEY_PREFIX + voucherCode;
            redisTemplate.expire(key, Duration.ofDays(days));
            logger.info("Extended session TTL: {} for {} days", voucherCode, days);
        } catch (Exception e) {
            logger.error("Failed to extend session TTL: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Get remaining TTL for session
     */
    public long getRemainingTTL(String voucherCode) {
        try {
            String key = SESSION_KEY_PREFIX + voucherCode;
            Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
            return ttl != null ? ttl : 0;
        } catch (Exception e) {
            logger.error("Failed to get session TTL: {}", e.getMessage(), e);
            return 0;
        }
    }

    /**
     * Generic method to set a value in Redis with TTL
     */
    public void setValue(String key, String value, long ttlSeconds) {
        try {
            redisTemplate.opsForValue().set(key, value, Duration.ofSeconds(ttlSeconds));
        } catch (Exception e) {
            logger.error("Failed to set value in Redis: {}", e.getMessage(), e);
        }
    }

    /**
     * Generic method to get a value from Redis
     */
    public String getValue(String key) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            return value != null ? value.toString() : null;
        } catch (Exception e) {
            logger.error("Failed to get value from Redis: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Generic method to delete a value from Redis
     */
    public void deleteValue(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            logger.error("Failed to delete value from Redis: {}", e.getMessage(), e);
        }
    }
}

