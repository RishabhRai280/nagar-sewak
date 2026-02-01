package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class SecurityRepositoryTests {

    @Autowired
    private LoginAttemptRepository loginAttemptRepository;

    @Autowired
    private DeviceFingerprintRepository deviceFingerprintRepository;

    @Autowired
    private SecurityAuditLogRepository securityAuditLogRepository;

    @Test
    public void testLoginAttemptRepository() {
        // Create a login attempt
        LoginAttempt attempt = LoginAttempt.builder()
                .email("test@example.com")
                .ipAddress("192.168.1.1")
                .successful(false)
                .userAgent("Mozilla/5.0")
                .location("Test Location")
                .build();

        // Save and verify
        LoginAttempt saved = loginAttemptRepository.save(attempt);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getAttemptTime()).isNotNull();

        // Test query methods
        List<LoginAttempt> attempts = loginAttemptRepository.findByEmailOrderByAttemptTimeDesc("test@example.com",
                null);
        assertThat(attempts).hasSize(1);
        assertThat(attempts.get(0).getEmail()).isEqualTo("test@example.com");
    }

    @Test
    public void testDeviceFingerprintRepository() {
        // Create a device fingerprint
        DeviceFingerprint fingerprint = DeviceFingerprint.builder()
                .userId("user123")
                .browserType("Chrome")
                .operatingSystem("Windows")
                .deviceType("Desktop")
                .ipAddress("192.168.1.1")
                .fingerprintHash("abc123def456")
                .trusted(true)
                .build();

        // Save and verify
        DeviceFingerprint saved = deviceFingerprintRepository.save(fingerprint);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getFirstSeen()).isNotNull();
        assertThat(saved.getLastSeen()).isNotNull();

        // Test query methods
        List<DeviceFingerprint> devices = deviceFingerprintRepository.findByUserId("user123");
        assertThat(devices).hasSize(1);
        assertThat(devices.get(0).getBrowserType()).isEqualTo("Chrome");

        // Test fingerprint hash lookup
        var foundDevice = deviceFingerprintRepository.findByFingerprintHash("abc123def456");
        assertThat(foundDevice).isPresent();
        assertThat(foundDevice.get().getUserId()).isEqualTo("user123");
    }

    @Test
    public void testSecurityAuditLogRepository() {
        // Create a security audit log
        SecurityAuditLog auditLog = SecurityAuditLog.builder()
                .userId("user123")
                .eventType(SecurityEventType.FAILED_LOGIN_ATTEMPT)
                .ipAddress("192.168.1.1")
                .details("{\"reason\":\"invalid_password\"}")
                .userAgent("Mozilla/5.0")
                .location("Test Location")
                .build();

        // Save and verify
        SecurityAuditLog saved = securityAuditLogRepository.save(auditLog);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTimestamp()).isNotNull();

        // Test query methods
        var logs = securityAuditLogRepository.findByUserId("user123", null);
        assertThat(logs.getContent()).hasSize(1);
        assertThat(logs.getContent().get(0).getEventType()).isEqualTo(SecurityEventType.FAILED_LOGIN_ATTEMPT);

        // Test event type filtering
        var failedLoginLogs = securityAuditLogRepository.findByEventType(SecurityEventType.FAILED_LOGIN_ATTEMPT, null);
        assertThat(failedLoginLogs.getContent()).hasSize(1);
    }
}