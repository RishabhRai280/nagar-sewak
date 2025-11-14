package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;

@Entity
@Data
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private Contractor contractor;

    // Score is checked in the SQL schema to be between 1 and 5
    @Column(nullable = false)
    private Integer score;

    private String comment;

    @Column(name = "created_at")
    private ZonedDateTime createdAt = ZonedDateTime.now();
}