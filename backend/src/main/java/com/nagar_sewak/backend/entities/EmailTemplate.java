package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "email_templates", indexes = {
    @Index(name = "idx_template_type", columnList = "type"),
    @Index(name = "idx_template_language", columnList = "language"),
    @Index(name = "idx_template_active", columnList = "active"),
    @Index(name = "idx_template_type_lang", columnList = "type,language")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EmailTemplateType type;

    @Column(nullable = false, length = 255)
    private String subject;

    @Column(name = "html_content", columnDefinition = "TEXT", nullable = false)
    private String htmlContent;

    @Column(name = "text_content", columnDefinition = "TEXT")
    private String textContent;

    @Column(length = 10)
    @Builder.Default
    private String language = "en";

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}