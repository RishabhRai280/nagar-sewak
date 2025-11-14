package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Project {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private Double budget;

    private String status; // Planned, In Progress, Completed

    private Double lat;
    private Double lng;
}

