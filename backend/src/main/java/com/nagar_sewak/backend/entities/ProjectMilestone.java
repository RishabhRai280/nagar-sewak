package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_milestones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private Integer percentage; // 0, 25, 50, 75, 100

    @Column(length = 1000)
    private String notes;

    @Column(length = 2000)
    private String photoUrls; // Comma-separated

    @Column(nullable = false)
    private String status; // PENDING, IN_PROGRESS, COMPLETED

    @CreationTimestamp
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "updated_by")
    private String updatedBy; // Username of contractor who updated
}
