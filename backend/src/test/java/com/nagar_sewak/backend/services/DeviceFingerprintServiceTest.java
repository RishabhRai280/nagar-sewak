package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.DeviceFingerprint;
import com.nagar_sewak.backend.repositories.DeviceFingerprintRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class DeviceFingerprintServiceTest {

    @Mock
    private DeviceFingerprintRepository deviceFingerprintRepository;

    @Mock
    private SecurityAuditService securityAuditService;

    @Mock
    private EmailService emailService;

    @Mock
    private HttpServletRequest request;

    private DeviceFingerprintService deviceFingerprintService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        deviceFingerprintService = new DeviceFingerprintService(deviceFingerprintRepository, securityAuditService, emailService);
    }

    @Test
    void testCreateFingerprint_Chrome() {
        // Given
        String userId = "user123";
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        when(request.getHeader("Accept-Language")).thenReturn("en-US,en;q=0.9");
        when(request.getHeader("Accept-Encoding")).thenReturn("gzip, deflate, br");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");

        // When
        DeviceFingerprint fingerprint = deviceFingerprintService.createFingerprint(request, userId);

        // Then
        assertThat(fingerprint.getUserId()).isEqualTo(userId);
        assertThat(fingerprint.getBrowserType()).isEqualTo("Chrome");
        assertThat(fingerprint.getOperatingSystem()).isEqualTo("Windows");
        assertThat(fingerprint.getDeviceType()).isEqualTo("Desktop");
        assertThat(fingerprint.getIpAddress()).isEqualTo("192.168.1.1");
        assertThat(fingerprint.getFingerprintHash()).isNotNull();
        assertThat(fingerprint.getTrusted()).isFalse();
    }

    @Test
    void testCreateFingerprint_Safari() {
        // Given
        String userId = "user123";
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15");
        when(request.getHeader("Accept-Language")).thenReturn("en-US,en;q=0.9");
        when(request.getHeader("Accept-Encoding")).thenReturn("gzip, deflate, br");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");

        // When
        DeviceFingerprint fingerprint = deviceFingerprintService.createFingerprint(request, userId);

        // Then
        assertThat(fingerprint.getBrowserType()).isEqualTo("Safari");
        assertThat(fingerprint.getOperatingSystem()).isEqualTo("macOS");
        assertThat(fingerprint.getDeviceType()).isEqualTo("Desktop");
    }

    @Test
    void testCreateFingerprint_MobileDevice() {
        // Given
        String userId = "user123";
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1");
        when(request.getHeader("Accept-Language")).thenReturn("en-US,en;q=0.9");
        when(request.getHeader("Accept-Encoding")).thenReturn("gzip, deflate, br");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");

        // When
        DeviceFingerprint fingerprint = deviceFingerprintService.createFingerprint(request, userId);

        // Then
        assertThat(fingerprint.getBrowserType()).isEqualTo("Safari");
        assertThat(fingerprint.getOperatingSystem()).isEqualTo("iOS");
        assertThat(fingerprint.getDeviceType()).isEqualTo("Mobile");
    }

    @Test
    void testCreateFingerprint_XForwardedFor() {
        // Given
        String userId = "user123";
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.1, 192.168.1.1");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");

        // When
        DeviceFingerprint fingerprint = deviceFingerprintService.createFingerprint(request, userId);

        // Then
        assertThat(fingerprint.getIpAddress()).isEqualTo("203.0.113.1");
    }

    @Test
    void testIsKnownDevice_True() {
        // Given
        String userId = "user123";
        DeviceFingerprint fingerprint = DeviceFingerprint.builder()
                .fingerprintHash("abc123")
                .build();
        when(deviceFingerprintRepository.existsByUserIdAndFingerprintHash(userId, "abc123")).thenReturn(true);

        // When
        boolean isKnown = deviceFingerprintService.isKnownDevice(userId, fingerprint);

        // Then
        assertThat(isKnown).isTrue();
    }

    @Test
    void testIsKnownDevice_False() {
        // Given
        String userId = "user123";
        DeviceFingerprint fingerprint = DeviceFingerprint.builder()
                .fingerprintHash("abc123")
                .build();
        when(deviceFingerprintRepository.existsByUserIdAndFingerprintHash(userId, "abc123")).thenReturn(false);

        // When
        boolean isKnown = deviceFingerprintService.isKnownDevice(userId, fingerprint);

        // Then
        assertThat(isKnown).isFalse();
    }

    @Test
    void testRegisterDevice_NewDevice() {
        // Given
        String userId = "user123";
        DeviceFingerprint fingerprint = DeviceFingerprint.builder()
                .userId(userId)
                .fingerprintHash("abc123")
                .browserType("Chrome")
                .operatingSystem("Windows")
                .deviceType("Desktop")
                .ipAddress("192.168.1.1")
                .trusted(false)
                .build();

        when(deviceFingerprintRepository.findByFingerprintHash("abc123")).thenReturn(Optional.empty());
        when(deviceFingerprintRepository.save(any(DeviceFingerprint.class))).thenReturn(fingerprint);

        // When
        DeviceFingerprint result = deviceFingerprintService.registerDevice(userId, fingerprint);

        // Then
        assertThat(result).isEqualTo(fingerprint);
        verify(deviceFingerprintRepository).save(fingerprint);
    }

    @Test
    void testRegisterDevice_ExistingDevice() {
        // Given
        String userId = "user123";
        DeviceFingerprint existingDevice = DeviceFingerprint.builder()
                .id(1L)
                .userId(userId)
                .fingerprintHash("abc123")
                .browserType("Chrome")
                .operatingSystem("Windows")
                .deviceType("Desktop")
                .ipAddress("192.168.1.1")
                .trusted(false)
                .lastSeen(LocalDateTime.now().minusDays(1))
                .build();

        DeviceFingerprint newFingerprint = DeviceFingerprint.builder()
                .userId(userId)
                .fingerprintHash("abc123")
                .ipAddress("192.168.1.2") // Different IP
                .build();

        when(deviceFingerprintRepository.findByFingerprintHash("abc123")).thenReturn(Optional.of(existingDevice));
        when(deviceFingerprintRepository.save(any(DeviceFingerprint.class))).thenReturn(existingDevice);

        // When
        DeviceFingerprint result = deviceFingerprintService.registerDevice(userId, newFingerprint);

        // Then
        assertThat(result.getIpAddress()).isEqualTo("192.168.1.2"); // IP should be updated
        verify(deviceFingerprintRepository).save(existingDevice);
    }

    @Test
    void testGetUserDevices() {
        // Given
        String userId = "user123";
        List<DeviceFingerprint> devices = Arrays.asList(
                DeviceFingerprint.builder().userId(userId).browserType("Chrome").build(),
                DeviceFingerprint.builder().userId(userId).browserType("Firefox").build()
        );
        when(deviceFingerprintRepository.findByUserIdOrderByLastSeenDesc(userId)).thenReturn(devices);

        // When
        List<DeviceFingerprint> result = deviceFingerprintService.getUserDevices(userId);

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).isEqualTo(devices);
    }

    @Test
    void testGetTrustedDevices() {
        // Given
        String userId = "user123";
        List<DeviceFingerprint> trustedDevices = Arrays.asList(
                DeviceFingerprint.builder().userId(userId).browserType("Chrome").trusted(true).build()
        );
        when(deviceFingerprintRepository.findByUserIdAndTrustedTrue(userId)).thenReturn(trustedDevices);

        // When
        List<DeviceFingerprint> result = deviceFingerprintService.getTrustedDevices(userId);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTrusted()).isTrue();
    }

    @Test
    void testTrustDevice() {
        // Given
        String userId = "user123";
        String fingerprintHash = "abc123";
        DeviceFingerprint device = DeviceFingerprint.builder()
                .userId(userId)
                .fingerprintHash(fingerprintHash)
                .trusted(false)
                .build();

        when(deviceFingerprintRepository.findByFingerprintHash(fingerprintHash)).thenReturn(Optional.of(device));
        when(deviceFingerprintRepository.save(any(DeviceFingerprint.class))).thenReturn(device);

        // When
        deviceFingerprintService.trustDevice(userId, fingerprintHash);

        // Then
        assertThat(device.getTrusted()).isTrue();
        verify(deviceFingerprintRepository).save(device);
    }

    @Test
    void testUntrustDevice() {
        // Given
        String userId = "user123";
        String fingerprintHash = "abc123";
        DeviceFingerprint device = DeviceFingerprint.builder()
                .userId(userId)
                .fingerprintHash(fingerprintHash)
                .trusted(true)
                .build();

        when(deviceFingerprintRepository.findByFingerprintHash(fingerprintHash)).thenReturn(Optional.of(device));
        when(deviceFingerprintRepository.save(any(DeviceFingerprint.class))).thenReturn(device);

        // When
        deviceFingerprintService.untrustDevice(userId, fingerprintHash);

        // Then
        assertThat(device.getTrusted()).isFalse();
        verify(deviceFingerprintRepository).save(device);
    }

    @Test
    void testIsNewDeviceLogin_True() {
        // Given
        String userId = "user123";
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        when(deviceFingerprintRepository.existsByUserIdAndFingerprintHash(eq(userId), anyString())).thenReturn(false);

        // When
        boolean isNewDevice = deviceFingerprintService.isNewDeviceLogin(userId, request);

        // Then
        assertThat(isNewDevice).isTrue();
    }

    @Test
    void testIsNewDeviceLogin_False() {
        // Given
        String userId = "user123";
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        when(deviceFingerprintRepository.existsByUserIdAndFingerprintHash(eq(userId), anyString())).thenReturn(true);

        // When
        boolean isNewDevice = deviceFingerprintService.isNewDeviceLogin(userId, request);

        // Then
        assertThat(isNewDevice).isFalse();
    }
}