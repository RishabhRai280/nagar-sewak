package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplianceService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final SecurityAuditLogRepository securityAuditLogRepository;
    private final DeviceFingerprintRepository deviceFingerprintRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final EmailHistoryRepository emailHistoryRepository;
    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityAuditService securityAuditService;

    /**
     * Export all user data in a structured format (GDPR compliance)
     */
    public Map<String, Object> exportUserData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> userData = new HashMap<>();
        
        // Basic user information
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("fullName", user.getFullName());
        profile.put("roles", user.getRoles());
        userData.put("profile", profile);

        // Complaints data
        List<Map<String, Object>> complaints = complaintRepository.findByUserUsername(user.getUsername())
                .stream()
                .map(this::sanitizeComplaintData)
                .collect(Collectors.toList());
        userData.put("complaints", complaints);

        // Security audit logs
        List<Map<String, Object>> auditLogs = securityAuditLogRepository.findByUserId(user.getId().toString(), null)
                .getContent()
                .stream()
                .map(this::sanitizeAuditLogData)
                .collect(Collectors.toList());
        userData.put("securityAuditLogs", auditLogs);

        // Device fingerprints
        List<Map<String, Object>> devices = deviceFingerprintRepository.findByUserId(user.getId().toString())
                .stream()
                .map(this::sanitizeDeviceData)
                .collect(Collectors.toList());
        userData.put("devices", devices);

        // Login attempts
        List<Map<String, Object>> loginAttempts = loginAttemptRepository.findByEmailOrderByAttemptTimeDesc(user.getEmail(), null)
                .stream()
                .map(this::sanitizeLoginAttemptData)
                .collect(Collectors.toList());
        userData.put("loginAttempts", loginAttempts);

        // Email history
        List<Map<String, Object>> emailHistory = emailHistoryRepository.findByRecipientEmailOrderBySentAtDesc(user.getEmail(), null)
                .getContent()
                .stream()
                .map(this::sanitizeEmailHistoryData)
                .collect(Collectors.toList());
        userData.put("emailHistory", emailHistory);

        // Notification preferences
        List<Map<String, Object>> preferences = notificationPreferenceRepository.findByUser(user)
                .stream()
                .map(this::sanitizeNotificationPreferenceData)
                .collect(Collectors.toList());
        userData.put("notificationPreferences", preferences);

        // Export metadata
        Map<String, Object> exportInfo = new HashMap<>();
        exportInfo.put("exportedAt", LocalDateTime.now());
        exportInfo.put("exportedBy", "ComplianceService");
        exportInfo.put("dataVersion", "1.0");
        userData.put("exportInfo", exportInfo);

        // Log the data export event
        securityAuditService.logSecurityEvent(
                SecurityEventType.DATA_EXPORT_REQUESTED, 
                user.getId().toString(), 
                "system", 
                Map.of("exportedAt", LocalDateTime.now().toString())
        );

        log.info("Data export completed for user: {}", userId);
        return userData;
    }

    /**
     * Securely delete user account and anonymize data (GDPR Right to be Forgotten)
     */
    @Transactional
    public void deleteUserAccount(Long userId, boolean preserveAnonymizedRecords) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String anonymizedId = "deleted_user_" + System.currentTimeMillis();
        
        // Log the deletion request
        securityAuditService.logSecurityEvent(
                SecurityEventType.ACCOUNT_DELETION_REQUESTED, 
                user.getId().toString(), 
                "system", 
                Map.of("preserveAnonymizedRecords", preserveAnonymizedRecords)
        );

        if (preserveAnonymizedRecords) {
            // Anonymize data instead of deleting for audit trail purposes
            anonymizeUserData(user, anonymizedId);
        } else {
            // Complete data deletion
            completeDataDeletion(user);
        }

        log.info("User account deletion completed for user: {} (anonymized: {})", userId, preserveAnonymizedRecords);
    }

    /**
     * Anonymize user data while preserving system integrity
     */
    private void anonymizeUserData(User user, String anonymizedId) {
        String originalUserId = user.getId().toString();
        
        // Anonymize user profile
        user.setUsername(anonymizedId);
        user.setEmail(anonymizedId + "@deleted.local");
        user.setFullName("Deleted User");
        user.setPassword(passwordEncoder.encode("DELETED_ACCOUNT_" + System.currentTimeMillis()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        // Anonymize complaints (keep for system integrity but remove PII)
        List<Complaint> complaints = complaintRepository.findByUserUsername(user.getUsername());
        for (Complaint complaint : complaints) {
            complaint.setDescription("Content removed - user deleted");
            complaint.setPhotoUrl(null);
            complaint.setPhotoUrls(null);
        }
        complaintRepository.saveAll(complaints);

        // Update security audit logs to use anonymized ID
        List<SecurityAuditLog> auditLogs = securityAuditLogRepository.findByUserId(originalUserId, null).getContent();
        for (SecurityAuditLog log : auditLogs) {
            log.setUserId(anonymizedId);
        }
        securityAuditLogRepository.saveAll(auditLogs);

        // Update device fingerprints
        List<DeviceFingerprint> devices = deviceFingerprintRepository.findByUserId(originalUserId);
        for (DeviceFingerprint device : devices) {
            device.setUserId(anonymizedId);
        }
        deviceFingerprintRepository.saveAll(devices);

        // Delete notification preferences (no need to keep)
        notificationPreferenceRepository.deleteByUser(user);

        // Anonymize email history
        List<EmailHistory> emailHistory = emailHistoryRepository.findByRecipientEmailOrderBySentAtDesc(user.getEmail(), null).getContent();
        for (EmailHistory email : emailHistory) {
            email.setRecipientEmail(anonymizedId + "@deleted.local");
        }
        emailHistoryRepository.saveAll(emailHistory);
    }

    /**
     * Complete data deletion (use with caution)
     */
    private void completeDataDeletion(User user) {
        String userId = user.getId().toString();
        
        // Delete notification preferences
        notificationPreferenceRepository.deleteByUser(user);
        
        // Delete device fingerprints
        deviceFingerprintRepository.deleteAll(deviceFingerprintRepository.findByUserId(userId));
        
        // Delete login attempts
        loginAttemptRepository.deleteAll(loginAttemptRepository.findByEmailOrderByAttemptTimeDesc(user.getEmail(), null));
        
        // Delete email history
        emailHistoryRepository.deleteAll(emailHistoryRepository.findByRecipientEmailOrderBySentAtDesc(user.getEmail(), null).getContent());
        
        // Delete security audit logs (consider keeping for compliance)
        // securityAuditLogRepository.deleteAll(securityAuditLogRepository.findByUserId(userId, null).getContent());
        
        // Delete complaints (consider anonymizing instead)
        complaintRepository.deleteAll(complaintRepository.findByUserUsername(user.getUsername()));
        
        // Finally delete the user
        userRepository.delete(user);
    }

    /**
     * Validate password encryption compliance
     */
    public boolean validatePasswordEncryption(String rawPassword, String encodedPassword) {
        try {
            // Verify that the password is properly encoded using BCrypt/Argon2
            boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
            
            // Additional checks for password strength
            boolean isStronglyEncoded = encodedPassword.startsWith("$2a$") || // BCrypt
                                      encodedPassword.startsWith("$2b$") || // BCrypt
                                      encodedPassword.startsWith("$argon2"); // Argon2
            
            return matches && isStronglyEncoded;
        } catch (Exception e) {
            log.error("Password validation failed", e);
            return false;
        }
    }

    /**
     * Generate compliance report
     */
    public Map<String, Object> generateComplianceReport() {
        Map<String, Object> report = new HashMap<>();
        
        // User data statistics
        long totalUsers = userRepository.count();
        long totalComplaints = complaintRepository.count();
        long totalAuditLogs = securityAuditLogRepository.count();
        
        report.put("userStatistics", Map.of(
            "totalUsers", totalUsers,
            "totalComplaints", totalComplaints,
            "totalAuditLogs", totalAuditLogs
        ));
        
        // Security statistics
        LocalDateTime lastMonth = LocalDateTime.now().minusDays(30);
        List<Object[]> recentEvents = securityAuditLogRepository.countEventsByTypeInRange(lastMonth, LocalDateTime.now());
        report.put("recentSecurityEvents", recentEvents);
        
        // Data retention information
        report.put("dataRetention", Map.of(
            "auditLogRetentionDays", 365,
            "emailHistoryRetentionDays", 90,
            "loginAttemptRetentionDays", 30
        ));
        
        report.put("generatedAt", LocalDateTime.now());
        report.put("complianceVersion", "GDPR-2018");
        
        return report;
    }

    // Helper methods for data sanitization
    private Map<String, Object> sanitizeComplaintData(Complaint complaint) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", complaint.getId());
        data.put("title", complaint.getTitle());
        data.put("description", complaint.getDescription());
        data.put("severity", complaint.getSeverity());
        data.put("status", complaint.getStatus());
        data.put("createdAt", complaint.getCreatedAt());
        data.put("resolvedAt", complaint.getResolvedAt());
        // Exclude sensitive location data if needed
        return data;
    }

    private Map<String, Object> sanitizeAuditLogData(SecurityAuditLog log) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", log.getId());
        data.put("eventType", log.getEventType());
        data.put("timestamp", log.getTimestamp());
        data.put("ipAddress", log.getIpAddress());
        // Exclude sensitive details if needed
        return data;
    }

    private Map<String, Object> sanitizeDeviceData(DeviceFingerprint device) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", device.getId());
        data.put("browserType", device.getBrowserType());
        data.put("operatingSystem", device.getOperatingSystem());
        data.put("deviceType", device.getDeviceType());
        data.put("firstSeen", device.getFirstSeen());
        data.put("lastSeen", device.getLastSeen());
        data.put("trusted", device.getTrusted());
        // Exclude fingerprint hash for privacy
        return data;
    }

    private Map<String, Object> sanitizeLoginAttemptData(LoginAttempt attempt) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", attempt.getId());
        data.put("attemptTime", attempt.getAttemptTime());
        data.put("successful", attempt.getSuccessful());
        data.put("ipAddress", attempt.getIpAddress());
        return data;
    }

    private Map<String, Object> sanitizeEmailHistoryData(EmailHistory email) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", email.getId());
        data.put("templateType", email.getTemplateType());
        data.put("subject", email.getSubject());
        data.put("sentAt", email.getSentAt());
        data.put("status", email.getStatus());
        return data;
    }

    private Map<String, Object> sanitizeNotificationPreferenceData(NotificationPreference pref) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", pref.getId());
        data.put("notificationType", pref.getNotificationType());
        data.put("inAppEnabled", pref.getInAppEnabled());
        data.put("emailEnabled", pref.getEmailEnabled());
        data.put("pushEnabled", pref.getPushEnabled());
        return data;
    }
}