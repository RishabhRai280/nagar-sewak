package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contractors")
public class Contractor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "license_no", unique = true)
    private String licenseNo;

    // Maps to NUMERIC(3,2) in the SQL schema
    @Column(name = "avg_rating")
    private BigDecimal avgRating = new BigDecimal("5.00");

    // FIX: ADDED MISSING FIELD to resolve compilation error in DataSeeder
    @Column(name = "total_ratings")
    private Integer totalRatings = 0; 

    @Column(name = "is_flagged")
    private Boolean isFlagged = false;

    @Column(name = "flagged_at")
    private ZonedDateTime flaggedAt;

    private String notes;
}