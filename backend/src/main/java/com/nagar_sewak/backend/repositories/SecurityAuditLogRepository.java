package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.SecurityAuditLog;
import com.nagar_sewak.backend.entities.SecurityEventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SecurityAuditLogRepository extends JpaRepository<SecurityAuditLog, Long> {

    /**
     * Find security logs for a specific user
     */
    Page<SecurityAuditLog> findByUserId(String userId, Pageable pageable);

    /**
     * Find security logs by event type
     */
    Page<SecurityAuditLog> findByEventType(SecurityEventType eventType, Pageable pageable);

    /**
     * Find security logs for a user and event type
     */
    Page<SecurityAuditLog> findByUserIdAndEventType(String userId, SecurityEventType eventType, Pageable pageable);

    /**
     * Find security logs within a time range
     */
    Page<SecurityAuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    /**
     * Find security logs for a user within a time range
     */
    Page<SecurityAuditLog> findByUserIdAndTimestampBetween(String userId, LocalDateTime start, LocalDateTime end, Pageable pageable);

    /**
     * Find security logs by IP address
     */
    Page<SecurityAuditLog> findByIpAddress(String ipAddress, Pageable pageable);

    /**
     * Find security logs by IP address within a time range
     */
    List<SecurityAuditLog> findByIpAddressAndTimestampBetween(String ipAddress, LocalDateTime start, LocalDateTime end);

    /**
     * Find recent security events ordered by timestamp
     */
    List<SecurityAuditLog> findTop100ByOrderByTimestampDesc();

    /**
     * Find recent suspicious activities
     */
    @Query("SELECT sal FROM SecurityAuditLog sal WHERE sal.eventType IN :suspiciousEvents " +
           "AND sal.timestamp >= :since ORDER BY sal.timestamp DESC")
    List<SecurityAuditLog> findRecentSuspiciousActivity(@Param("suspiciousEvents") List<SecurityEventType> suspiciousEvents, 
                                                       @Param("since") LocalDateTime since);

    /**
     * Count events by type within a time range
     */
    @Query("SELECT sal.eventType, COUNT(sal) FROM SecurityAuditLog sal " +
           "WHERE sal.timestamp BETWEEN :start AND :end GROUP BY sal.eventType")
    List<Object[]> countEventsByTypeInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    /**
     * Find failed login attempts by IP address
     */
    List<SecurityAuditLog> findByEventTypeAndIpAddressAndTimestampBetween(
        SecurityEventType eventType, String ipAddress, LocalDateTime start, LocalDateTime end);

    /**
     * Delete old audit logs before a specific date
     */
    void deleteByTimestampBefore(LocalDateTime cutoffDate);

    /**
     * Find security events for multiple users
     */
    Page<SecurityAuditLog> findByUserIdIn(List<String> userIds, Pageable pageable);

    /**
     * Count total events for a user
     */
    long countByUserId(String userId);

    /**
     * Count events by type for a user
     */
    long countByUserIdAndEventType(String userId, SecurityEventType eventType);
}