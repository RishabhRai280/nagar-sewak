package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
public class Project {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Getter/Setter required for DataSeeder and RatingService
    private Long contractorId;

    private String title;
    private String description;

    // Getter required for AdminDashboardService
    private BigDecimal budget;

    private String status;

    private Double lat;
    private Double lng;
}