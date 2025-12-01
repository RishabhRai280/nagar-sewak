package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_votes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"complaint_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintVote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDateTime votedAt;
    
    @PrePersist
    protected void onCreate() {
        votedAt = LocalDateTime.now();
    }
}
