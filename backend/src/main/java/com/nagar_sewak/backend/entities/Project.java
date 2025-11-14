package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

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

    private String title;
    private String description;

    // Getter required for AdminDashboardService
    @Column(precision = 15, scale = 2)
    private BigDecimal budget;

    private String status;

    private Double lat;
    private Double lng;
}