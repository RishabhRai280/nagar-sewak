package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.DeviceFingerprint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceFingerprintRepository extends JpaRepository<DeviceFingerprint, Long> {

    /**
     * Find device fingerprint by hash
     */
    Optional<DeviceFingerprint> findByFingerprintHash(String fingerprintHash);

    /**
     * Find all device fingerprints for a specific user
     */
    List<DeviceFingerprint> findByUserId(String userId);

    /**
     * Find trusted devices for a specific user
     */
    List<DeviceFingerprint> findByUserIdAndTrustedTrue(String userId);

    /**
     * Find device fingerprints for a user ordered by last seen
     */
    List<DeviceFingerprint> findByUserIdOrderByLastSeenDesc(String userId);

    /**
     * Check if a device fingerprint exists for a user
     */
    boolean existsByUserIdAndFingerprintHash(String userId, String fingerprintHash);

    /**
     * Find devices by user and trust status
     */
    List<DeviceFingerprint> findByUserIdAndTrusted(String userId, boolean trusted);

    /**
     * Find devices not seen since a specific date
     */
    List<DeviceFingerprint> findByLastSeenBefore(LocalDateTime cutoffDate);

    /**
     * Find devices by IP address
     */
    List<DeviceFingerprint> findByIpAddress(String ipAddress);

    /**
     * Find devices by browser type and OS for a user
     */
    List<DeviceFingerprint> findByUserIdAndBrowserTypeAndOperatingSystem(String userId, String browserType, String operatingSystem);

    /**
     * Count total devices for a user
     */
    long countByUserId(String userId);

    /**
     * Count trusted devices for a user
     */
    long countByUserIdAndTrustedTrue(String userId);

    /**
     * Find recent device registrations
     */
    @Query("SELECT df FROM DeviceFingerprint df WHERE df.firstSeen >= :since ORDER BY df.firstSeen DESC")
    Page<DeviceFingerprint> findRecentDevices(@Param("since") LocalDateTime since, Pageable pageable);

    /**
     * Delete old untrusted devices
     */
    void deleteByTrustedFalseAndLastSeenBefore(LocalDateTime cutoffDate);
}