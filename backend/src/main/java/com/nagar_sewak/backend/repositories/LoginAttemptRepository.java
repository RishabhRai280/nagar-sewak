package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.LoginAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {

    /**
     * Find all login attempts for a specific email within a time range
     */
    List<LoginAttempt> findByEmailAndAttemptTimeBetween(String email, LocalDateTime start, LocalDateTime end);

    /**
     * Find failed login attempts for a specific email within a time range
     */
    List<LoginAttempt> findByEmailAndSuccessfulFalseAndAttemptTimeBetween(String email, LocalDateTime start, LocalDateTime end);

    /**
     * Count failed login attempts for a specific email within a time range
     */
    long countByEmailAndSuccessfulFalseAndAttemptTimeBetween(String email, LocalDateTime start, LocalDateTime end);

    /**
     * Find recent login attempts for a specific email, ordered by attempt time descending
     */
    List<LoginAttempt> findByEmailOrderByAttemptTimeDesc(String email, Pageable pageable);

    /**
     * Find login attempts by IP address within a time range
     */
    List<LoginAttempt> findByIpAddressAndAttemptTimeBetween(String ipAddress, LocalDateTime start, LocalDateTime end);

    /**
     * Find all login attempts within a time range, ordered by attempt time
     */
    Page<LoginAttempt> findByAttemptTimeBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    /**
     * Delete old login attempts before a specific date
     */
    void deleteByAttemptTimeBefore(LocalDateTime cutoffDate);

    /**
     * Find suspicious activity - multiple failed attempts from different IPs for same email
     */
    @Query("SELECT la FROM LoginAttempt la WHERE la.email = :email AND la.successful = false " +
           "AND la.attemptTime >= :since GROUP BY la.ipAddress HAVING COUNT(la.id) >= :threshold")
    List<LoginAttempt> findSuspiciousActivityByEmail(@Param("email") String email, 
                                                    @Param("since") LocalDateTime since, 
                                                    @Param("threshold") long threshold);
}