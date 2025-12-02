package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tenders")
public class Tender {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private Contractor contractor;

    @Column(length = 500)
    private String title;

    // Budget is set by admin when publishing tender opportunity
    private BigDecimal budget;

    // Quote amount is set by contractor when submitting bid
    private BigDecimal quoteAmount;

    private Integer estimatedDays;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 2000)
    private String documentUrls; // Comma-separated list of document URLs

    @Column(nullable = false)
    private String status; // OPEN, PENDING, ACCEPTED, REJECTED

    private LocalDateTime startDate;
    
    private LocalDateTime endDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
