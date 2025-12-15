package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.EmailHistory;
import com.nagar_sewak.backend.entities.EmailStatus;
import com.nagar_sewak.backend.entities.EmailTemplateType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmailHistoryRepository extends JpaRepository<EmailHistory, Long> {

    /**
     * Find email history by recipient
     */
    Page<EmailHistory> findByRecipientEmailOrderBySentAtDesc(String recipientEmail, Pageable pageable);

    /**
     * Find email history by status
     */
    List<EmailHistory> findByStatus(EmailStatus status);

    /**
     * Find email history by template type
     */
    Page<EmailHistory> findByTemplateType(EmailTemplateType templateType, Pageable pageable);

    /**
     * Find failed emails that can be retried
     */
    @Query("SELECT eh FROM EmailHistory eh WHERE eh.status = 'FAILED' AND eh.retryCount < :maxRetries")
    List<EmailHistory> findFailedEmailsForRetry(@Param("maxRetries") int maxRetries);

    /**
     * Find emails sent within a time range
     */
    Page<EmailHistory> findBySentAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    /**
     * Count emails by status
     */
    long countByStatus(EmailStatus status);

    /**
     * Count emails by recipient and status
     */
    long countByRecipientEmailAndStatus(String recipientEmail, EmailStatus status);

    /**
     * Find recent email history
     */
    List<EmailHistory> findTop100ByOrderBySentAtDesc();

    /**
     * Delete old email history before a specific date
     */
    void deleteBySentAtBefore(LocalDateTime cutoffDate);

    /**
     * Find emails by recipient and template type
     */
    List<EmailHistory> findByRecipientEmailAndTemplateTypeOrderBySentAtDesc(String recipientEmail, EmailTemplateType templateType);
}