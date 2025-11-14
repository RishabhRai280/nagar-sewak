package com.nagar_sewak.backend.entities;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Complaint {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private int severity;

    private Double lat;
    private Double lng;

    private String status = "Pending";

    // Setter required by ComplaintController
    @ManyToOne
    private User user; 

    @ManyToOne
    private Project project;
}