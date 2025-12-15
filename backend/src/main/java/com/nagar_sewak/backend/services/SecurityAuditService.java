package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.SecurityAuditLog;
import com.nagar_sewak.backend.entities.SecurityEventType;
import com.nagar_sewak.backend.repositories.SecurityAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityAuditService {

    private final SecurityAuditLogRepository securityAuditLogRepository;

    /**
     * Log a security event asynchronously
     */
    @Async
    public void logSecurityEvent(SecurityEventType eventType, String userId, String ipAddress, 
                               Map<String, Object> details) {
        try {
            SecurityAuditLog auditLog = SecurityAuditLog.builder()
                    .userId(userId)
                    .eventType(eventType)
                    .ipAddress(ipAddress)
                    .details(details != null ? convertMapToJson(details) : null)
                    .build();

            securityAuditLogRepository.save(auditLog);
            log.info("Security event logged: {} for user: {} from IP: {}", eventType, userId, ipAddress);
        } catch (Exception e) {
            log.error("Failed to log security event: {} for user: {}", eventType, userId, e);
        }
    }

    /**
     * Log security event from HTTP request
     */
    @Async
    public void logSecurityEvent(SecurityEventType eventType, String userId, HttpServletRequest request, 
                               Map<String, Object> details) {
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        String location = getLocationFromRequest(request);

        // Add request details to the details map
        if (details == null) {
            details = new java.util.HashMap<>();
        }
        details.put("userAgent", userAgent);
        details.put("location", location);

        SecurityAuditLog auditLog = SecurityAuditLog.builder()
                .userId(userId)
                .eventType(eventType)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .location(location)
                .details(convertMapToJson(details))
                .build();

        try {
            securityAuditLogRepository.save(auditLog);
            log.info("Security event logged: {} for user: {} from IP: {}", eventType, userId, ipAddress);
        } catch (Exception e) {
            log.error("Failed to log security event: {} for user: {}", eventType, userId, e);
        }
    }

    /**
     * Get security logs for a specific user
     */
    public Page<SecurityAuditLog> getSecurityLogs(String userId, Pageable pageable) {
        return securityAuditLogRepository.findByUserId(userId, pageable);
    }

    /**
     * Get security logs by event type
     */
    public Page<SecurityAuditLog> getSecurityLogsByType(SecurityEventType eventType, Pageable pageable) {
        return securityAuditLogRepository.findByEventType(eventType, pageable);
    }

    /**
     * Get recent suspicious activities
     */
    public List<SecurityAuditLog> getRecentSuspiciousActivity() {
        List<SecurityEventType> suspiciousEvents = List.of(
            SecurityEventType.FAILED_LOGIN_ATTEMPT,
            SecurityEventType.ACCOUNT_LOCKED,
            SecurityEventType.SUSPICIOUS_ACTIVITY_DETECTED,
            SecurityEventType.MFA_VERIFICATION_FAILED
        );
        
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        return securityAuditLogRepository.findRecentSuspiciousActivity(suspiciousEvents, since);
    }

    /**
     * Get security logs within a time range
     */
    public Page<SecurityAuditLog> getSecurityLogsInRange(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return securityAuditLogRepository.findByTimestampBetween(start, end, pageable);
    }

    /**
     * Get security logs for a user within a time range
     */
    public Page<SecurityAuditLog> getUserSecurityLogsInRange(String userId, LocalDateTime start, 
                                                           LocalDateTime end, Pageable pageable) {
        return securityAuditLogRepository.findByUserIdAndTimestampBetween(userId, start, end, pageable);
    }

    /**
     * Get security logs by IP address
     */
    public Page<SecurityAuditLog> getSecurityLogsByIp(String ipAddress, Pageable pageable) {
        return securityAuditLogRepository.findByIpAddress(ipAddress, pageable);
    }

    /**
     * Count events by type within a time range
     */
    public List<Object[]> getEventCountsByType(LocalDateTime start, LocalDateTime end) {
        return securityAuditLogRepository.countEventsByTypeInRange(start, end);
    }

    /**
     * Extract client IP address from request
     */
    private String getClientIpAddress(HttpServletRequest request) {
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

    /**
     * Extract location information from request (simplified implementation)
     */
    private String getLocationFromRequest(HttpServletRequest request) {
        // In a real implementation, you would use a GeoIP service
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return "IP: " + xForwardedFor.split(",")[0].trim();
        }
        return "IP: " + request.getRemoteAddr();
    }

    /**
     * Convert map to JSON string (simple implementation)
     */
    private String convertMapToJson(Map<String, Object> details) {
        if (details == null || details.isEmpty()) {
            return "{}";
        }

        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : details.entrySet()) {
            if (!first) {
                json.append(",");
            }
            json.append("\"").append(entry.getKey()).append("\":\"")
                .append(String.valueOf(entry.getValue())).append("\"");
            first = false;
        }
        json.append("}");
        return json.toString();
    }
}