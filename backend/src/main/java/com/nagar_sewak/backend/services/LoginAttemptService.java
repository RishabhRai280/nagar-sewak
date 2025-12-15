package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.LoginAttempt;
import com.nagar_sewak.backend.entities.SecurityEventType;
import com.nagar_sewak.backend.repositories.LoginAttemptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginAttemptService {

    private final LoginAttemptRepository loginAttemptRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final SecurityAuditService securityAuditService;
    private final EmailService emailService;

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 15;
    private static final String REDIS_KEY_PREFIX = "login_attempts:";
    private static final String REDIS_LOCK_PREFIX = "account_locked:";

    /**
     * Get the current number of failed login attempts for an email
     */
    public int getFailedAttempts(String email) {
        String key = REDIS_KEY_PREFIX + email.toLowerCase();
        Object attempts = redisTemplate.opsForValue().get(key);
        return attempts != null ? (Integer) attempts : 0;
    }

    /**
     * Record a failed login attempt
     */
    public void recordFailedAttempt(String email, String ipAddress, HttpServletRequest request) {
        String normalizedEmail = email.toLowerCase();
        
        // Save to database for audit trail
        LoginAttempt attempt = LoginAttempt.builder()
                .email(normalizedEmail)
                .ipAddress(ipAddress)
                .successful(false)
                .userAgent(request.getHeader("User-Agent"))
                .location(getLocationFromRequest(request))
                .build();
        
        loginAttemptRepository.save(attempt);
        
        // Update Redis counter
        String key = REDIS_KEY_PREFIX + normalizedEmail;
        Integer currentAttempts = (Integer) redisTemplate.opsForValue().get(key);
        int newAttempts = (currentAttempts != null ? currentAttempts : 0) + 1;
        
        // Set expiry to reset counter after lock duration
        redisTemplate.opsForValue().set(key, newAttempts, LOCK_DURATION_MINUTES, TimeUnit.MINUTES);
        
        log.info("Failed login attempt recorded for email: {} from IP: {}. Total attempts: {}", 
                normalizedEmail, ipAddress, newAttempts);
        
        // Log security event
        Map<String, Object> details = Map.of(
            "attemptCount", newAttempts,
            "maxAttempts", MAX_ATTEMPTS
        );
        securityAuditService.logSecurityEvent(SecurityEventType.FAILED_LOGIN_ATTEMPT, normalizedEmail, request, details);

        // Lock account if max attempts reached
        if (newAttempts >= MAX_ATTEMPTS) {
            lockAccount(normalizedEmail, request);
        }
    }

    /**
     * Record a successful login attempt
     */
    public void recordSuccessfulAttempt(String email, String ipAddress, HttpServletRequest request) {
        String normalizedEmail = email.toLowerCase();
        
        // Save to database for audit trail
        LoginAttempt attempt = LoginAttempt.builder()
                .email(normalizedEmail)
                .ipAddress(ipAddress)
                .successful(true)
                .userAgent(request.getHeader("User-Agent"))
                .location(getLocationFromRequest(request))
                .build();
        
        loginAttemptRepository.save(attempt);
        
        // Reset failed attempts counter
        resetFailedAttempts(normalizedEmail);
        
        // Log security event
        securityAuditService.logSecurityEvent(SecurityEventType.SUCCESSFUL_LOGIN, normalizedEmail, request, null);
        
        log.info("Successful login recorded for email: {} from IP: {}", normalizedEmail, ipAddress);
    }

    /**
     * Reset failed attempts counter for an email
     */
    public void resetFailedAttempts(String email) {
        String normalizedEmail = email.toLowerCase();
        String key = REDIS_KEY_PREFIX + normalizedEmail;
        redisTemplate.delete(key);
        
        // Also remove account lock if it exists
        String lockKey = REDIS_LOCK_PREFIX + normalizedEmail;
        redisTemplate.delete(lockKey);
        
        log.info("Failed attempts counter reset for email: {}", normalizedEmail);
    }

    /**
     * Check if an account is currently locked
     */
    public boolean isAccountLocked(String email) {
        String normalizedEmail = email.toLowerCase();
        String lockKey = REDIS_LOCK_PREFIX + normalizedEmail;
        return Boolean.TRUE.equals(redisTemplate.hasKey(lockKey));
    }

    /**
     * Lock an account for the specified duration
     */
    public void lockAccount(String email, HttpServletRequest request) {
        String normalizedEmail = email.toLowerCase();
        String lockKey = REDIS_LOCK_PREFIX + normalizedEmail;
        LocalDateTime lockTime = LocalDateTime.now();
        
        // Set lock with expiry
        redisTemplate.opsForValue().set(lockKey, lockTime.toString(), 
                LOCK_DURATION_MINUTES, TimeUnit.MINUTES);
        
        // Log security event
        Map<String, Object> details = Map.of(
            "lockDurationMinutes", LOCK_DURATION_MINUTES,
            "reason", "Maximum failed login attempts exceeded"
        );
        securityAuditService.logSecurityEvent(SecurityEventType.ACCOUNT_LOCKED, normalizedEmail, request, details);
        
        // Send account locked email notification
        String ipAddress = getClientIpAddress(request);
        String location = getLocationFromRequest(request);
        emailService.sendAccountLockedAlert(normalizedEmail, ipAddress, location, lockTime, LOCK_DURATION_MINUTES);
        
        log.warn("Account locked for email: {} due to {} failed login attempts", 
                normalizedEmail, MAX_ATTEMPTS);
    }

    /**
     * Lock an account for the specified duration (fallback method)
     */
    public void lockAccount(String email) {
        String normalizedEmail = email.toLowerCase();
        String lockKey = REDIS_LOCK_PREFIX + normalizedEmail;
        LocalDateTime lockTime = LocalDateTime.now();
        
        // Set lock with expiry
        redisTemplate.opsForValue().set(lockKey, lockTime.toString(), 
                LOCK_DURATION_MINUTES, TimeUnit.MINUTES);
        
        log.warn("Account locked for email: {} due to {} failed login attempts", 
                normalizedEmail, MAX_ATTEMPTS);
    }

    /**
     * Get remaining lock time in minutes
     */
    public long getRemainingLockTimeMinutes(String email) {
        String normalizedEmail = email.toLowerCase();
        String lockKey = REDIS_LOCK_PREFIX + normalizedEmail;
        Long ttl = redisTemplate.getExpire(lockKey, TimeUnit.MINUTES);
        return ttl != null && ttl > 0 ? ttl : 0;
    }

    /**
     * Check if warning should be displayed based on attempt count
     */
    public boolean shouldShowWarning(String email) {
        int attempts = getFailedAttempts(email);
        return attempts >= 3 && attempts < MAX_ATTEMPTS;
    }

    /**
     * Get warning message for user
     */
    public String getWarningMessage(String email) {
        int attempts = getFailedAttempts(email);
        int remaining = MAX_ATTEMPTS - attempts;
        
        if (attempts >= 3 && attempts < MAX_ATTEMPTS) {
            return String.format("Warning: %d failed login attempt(s). Account will be locked after %d more failed attempt(s).", 
                    attempts, remaining);
        }
        
        return null;
    }

    /**
     * Extract location information from request (simplified implementation)
     */
    private String getLocationFromRequest(HttpServletRequest request) {
        // In a real implementation, you would use a GeoIP service
        // For now, just return the IP address
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return "IP: " + xForwardedFor.split(",")[0].trim();
        }
        return "IP: " + request.getRemoteAddr();
    }

    /**
     * Get client IP address from request
     */
    public String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}