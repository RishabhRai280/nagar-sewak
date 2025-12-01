package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Getter/Setter required for DataSeeder and RatingService
    @Column(name = "contractor_id")
    private Long contractorId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contractor_id", insertable = false, updatable = false)
    private Contractor contractor;

    private String title;
    private String description;

    // Getter required for AdminDashboardService
    @Column(precision = 15, scale = 2)
    private BigDecimal budget;

    private String status;

    private Double lat;
    private Double lng;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(length = 2000)
    private String progressNotes;

    @Column(length = 2000)
    private String progressPhotos; // Comma-separated photo URLs

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}