package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.EmailTemplate;
import com.nagar_sewak.backend.entities.EmailTemplateType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {

    /**
     * Find active template by type and language
     */
    Optional<EmailTemplate> findByTypeAndLanguageAndActiveTrue(EmailTemplateType type, String language);

    /**
     * Find active template by type (default language)
     */
    Optional<EmailTemplate> findByTypeAndActiveTrueOrderByLanguageAsc(EmailTemplateType type);

    /**
     * Find all templates by type
     */
    List<EmailTemplate> findByType(EmailTemplateType type);

    /**
     * Find all active templates
     */
    List<EmailTemplate> findByActiveTrue();

    /**
     * Find templates by language
     */
    List<EmailTemplate> findByLanguage(String language);

    /**
     * Find active templates by language
     */
    List<EmailTemplate> findByLanguageAndActiveTrue(String language);
}