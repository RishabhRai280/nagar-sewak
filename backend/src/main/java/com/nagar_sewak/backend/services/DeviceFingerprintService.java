package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.DeviceFingerprint;
import com.nagar_sewak.backend.entities.SecurityEventType;
import com.nagar_sewak.backend.repositories.DeviceFingerprintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeviceFingerprintService {

    private final DeviceFingerprintRepository deviceFingerprintRepository;
    private final SecurityAuditService securityAuditService;
    private final EmailService emailService;

    /**
     * Create a device fingerprint from HTTP request
     */
    public DeviceFingerprint createFingerprint(HttpServletRequest request, String userId) {
        String userAgent = request.getHeader("User-Agent");
        String acceptLanguage = request.getHeader("Accept-Language");
        String acceptEncoding = request.getHeader("Accept-Encoding");
        String ipAddress = getClientIpAddress(request);
        
        // Extract browser and OS information from User-Agent
        BrowserInfo browserInfo = parseBrowserInfo(userAgent);
        
        // Create fingerprint hash
        String fingerprintData = String.format("%s|%s|%s|%s|%s", 
            userAgent != null ? userAgent : "",
            acceptLanguage != null ? acceptLanguage : "",
            acceptEncoding != null ? acceptEncoding : "",
            browserInfo.getBrowser(),
            browserInfo.getOperatingSystem()
        );
        
        String fingerprintHash = generateHash(fingerprintData);
        
        DeviceFingerprint fingerprint = DeviceFingerprint.builder()
                .userId(userId)
                .browserType(browserInfo.getBrowser())
                .operatingSystem(browserInfo.getOperatingSystem())
                .deviceType(browserInfo.getDeviceType())
                .ipAddress(ipAddress)
                .fingerprintHash(fingerprintHash)
                .trusted(false) // New devices are not trusted by default
                .build();
        
        log.info("Created device fingerprint for user: {} with hash: {}", userId, fingerprintHash);
        return fingerprint;
    }

    /**
     * Check if a device is known (previously registered) for a user
     */
    public boolean isKnownDevice(String userId, DeviceFingerprint fingerprint) {
        return deviceFingerprintRepository.existsByUserIdAndFingerprintHash(userId, fingerprint.getFingerprintHash());
    }

    /**
     * Register a new device for a user
     */
    public DeviceFingerprint registerDevice(String userId, DeviceFingerprint fingerprint) {
        // Check if device already exists
        Optional<DeviceFingerprint> existing = deviceFingerprintRepository
                .findByFingerprintHash(fingerprint.getFingerprintHash());
        
        if (existing.isPresent()) {
            // Update last seen timestamp
            DeviceFingerprint existingDevice = existing.get();
            existingDevice.setLastSeen(LocalDateTime.now());
            existingDevice.setIpAddress(fingerprint.getIpAddress()); // Update IP if changed
            
            log.info("Updated existing device fingerprint for user: {} with hash: {}", 
                    userId, fingerprint.getFingerprintHash());
            return deviceFingerprintRepository.save(existingDevice);
        } else {
            // Save new device
            DeviceFingerprint saved = deviceFingerprintRepository.save(fingerprint);
            log.info("Registered new device for user: {} with hash: {}", userId, fingerprint.getFingerprintHash());
            return saved;
        }
    }

    /**
     * Get all devices for a user
     */
    public List<DeviceFingerprint> getUserDevices(String userId) {
        return deviceFingerprintRepository.findByUserIdOrderByLastSeenDesc(userId);
    }

    /**
     * Get trusted devices for a user
     */
    public List<DeviceFingerprint> getTrustedDevices(String userId) {
        return deviceFingerprintRepository.findByUserIdAndTrustedTrue(userId);
    }

    /**
     * Mark a device as trusted
     */
    public void trustDevice(String userId, String fingerprintHash) {
        Optional<DeviceFingerprint> device = deviceFingerprintRepository.findByFingerprintHash(fingerprintHash);
        if (device.isPresent() && device.get().getUserId().equals(userId)) {
            DeviceFingerprint deviceFingerprint = device.get();
            deviceFingerprint.setTrusted(true);
            deviceFingerprintRepository.save(deviceFingerprint);
            log.info("Marked device as trusted for user: {} with hash: {}", userId, fingerprintHash);
        }
    }

    /**
     * Remove trust from a device
     */
    public void untrustDevice(String userId, String fingerprintHash) {
        Optional<DeviceFingerprint> device = deviceFingerprintRepository.findByFingerprintHash(fingerprintHash);
        if (device.isPresent() && device.get().getUserId().equals(userId)) {
            DeviceFingerprint deviceFingerprint = device.get();
            deviceFingerprint.setTrusted(false);
            deviceFingerprintRepository.save(deviceFingerprint);
            log.info("Removed trust from device for user: {} with hash: {}", userId, fingerprintHash);
        }
    }

    /**
     * Check if this is a new device login (device not seen before)
     */
    public boolean isNewDeviceLogin(String userId, HttpServletRequest request) {
        DeviceFingerprint fingerprint = createFingerprint(request, userId);
        return !isKnownDevice(userId, fingerprint);
    }

    /**
     * Process device for login - register if new, update if existing
     */
    public DeviceFingerprint processDeviceForLogin(String userId, HttpServletRequest request) {
        DeviceFingerprint fingerprint = createFingerprint(request, userId);
        boolean isNewDevice = !isKnownDevice(userId, fingerprint);
        
        DeviceFingerprint savedDevice = registerDevice(userId, fingerprint);
        
        if (isNewDevice) {
            // Log new device login event
            Map<String, Object> details = Map.of(
                "browserType", fingerprint.getBrowserType(),
                "operatingSystem", fingerprint.getOperatingSystem(),
                "deviceType", fingerprint.getDeviceType(),
                "fingerprintHash", fingerprint.getFingerprintHash()
            );
            securityAuditService.logSecurityEvent(SecurityEventType.NEW_DEVICE_LOGIN, userId, request, details);
            
            // Send new device alert email (assuming we have user email)
            sendNewDeviceAlert(userId, fingerprint, request);
        }
        
        return savedDevice;
    }

    /**
     * Send new device alert email
     */
    private void sendNewDeviceAlert(String userId, DeviceFingerprint fingerprint, HttpServletRequest request) {
        try {
            // Generate confirmation token
            String confirmationToken = UUID.randomUUID().toString();
            
            // Get location info
            String location = getLocationFromRequest(request);
            
            // For now, we'll use userId as email (in real implementation, you'd fetch user email from database)
            String userEmail = userId; // This should be replaced with actual email lookup
            
            emailService.sendNewDeviceAlert(
                userEmail,
                fingerprint.getDeviceType() + " device",
                fingerprint.getBrowserType(),
                fingerprint.getOperatingSystem(),
                fingerprint.getIpAddress(),
                location,
                LocalDateTime.now(),
                confirmationToken
            );
        } catch (Exception e) {
            log.error("Failed to send new device alert for user: {}", userId, e);
        }
    }

    /**
     * Get location information from request (simplified implementation)
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
     * Get client IP address from request
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
     * Parse browser information from User-Agent string
     */
    private BrowserInfo parseBrowserInfo(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return new BrowserInfo("Unknown", "Unknown", "Unknown");
        }

        String browser = "Unknown";
        String os = "Unknown";
        String deviceType = "Desktop";

        // Browser detection
        if (userAgent.contains("Chrome") && !userAgent.contains("Chromium")) {
            browser = "Chrome";
        } else if (userAgent.contains("Firefox")) {
            browser = "Firefox";
        } else if (userAgent.contains("Safari") && !userAgent.contains("Chrome")) {
            browser = "Safari";
        } else if (userAgent.contains("Edge")) {
            browser = "Edge";
        } else if (userAgent.contains("Opera")) {
            browser = "Opera";
        }

        // OS detection (check iOS first before macOS since iOS user agents contain "Mac OS X")
        if (userAgent.contains("iPhone") || userAgent.contains("iPad")) {
            os = "iOS";
            deviceType = userAgent.contains("iPad") ? "Tablet" : "Mobile";
        } else if (userAgent.contains("Android")) {
            os = "Android";
            deviceType = "Mobile";
        } else if (userAgent.contains("Windows")) {
            os = "Windows";
        } else if (userAgent.contains("Mac OS X") || userAgent.contains("macOS")) {
            os = "macOS";
        } else if (userAgent.contains("Linux")) {
            os = "Linux";
        }

        // Device type detection
        if (userAgent.contains("Mobile") && !userAgent.contains("iPad")) {
            deviceType = "Mobile";
        } else if (userAgent.contains("Tablet") || userAgent.contains("iPad")) {
            deviceType = "Tablet";
        }

        return new BrowserInfo(browser, os, deviceType);
    }

    /**
     * Generate SHA-256 hash for fingerprint data
     */
    private String generateHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not available", e);
            return String.valueOf(data.hashCode()); // Fallback to simple hash
        }
    }

    /**
     * Inner class to hold browser information
     */
    private static class BrowserInfo {
        private final String browser;
        private final String operatingSystem;
        private final String deviceType;

        public BrowserInfo(String browser, String operatingSystem, String deviceType) {
            this.browser = browser;
            this.operatingSystem = operatingSystem;
            this.deviceType = deviceType;
        }

        public String getBrowser() {
            return browser;
        }

        public String getOperatingSystem() {
            return operatingSystem;
        }

        public String getDeviceType() {
            return deviceType;
        }
    }
}