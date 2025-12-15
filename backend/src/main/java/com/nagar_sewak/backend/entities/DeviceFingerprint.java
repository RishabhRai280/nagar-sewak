package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "device_fingerprints", indexes = {
    @Index(name = "idx_device_user_id", columnList = "user_id"),
    @Index(name = "idx_fingerprint_hash", columnList = "fingerprint_hash"),
    @Index(name = "idx_trusted", columnList = "trusted"),
    @Index(name = "idx_user_trusted", columnList = "user_id,trusted")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceFingerprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 255)
    private String userId;

    @Column(name = "browser_type", length = 100)
    private String browserType;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "ip_address", length = 45) // IPv6 support
    private String ipAddress;

    @Column(name = "fingerprint_hash", nullable = false, length = 64, unique = true)
    private String fingerprintHash;

    @Column(name = "first_seen", nullable = false)
    private LocalDateTime firstSeen;

    @Column(name = "last_seen", nullable = false)
    private LocalDateTime lastSeen;

    @Builder.Default
    @Column(nullable = false)
    private Boolean trusted = false;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (firstSeen == null) {
            firstSeen = now;
        }
        if (lastSeen == null) {
            lastSeen = now;
        }
        if (trusted == null) {
            trusted = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastSeen = LocalDateTime.now();
    }
}