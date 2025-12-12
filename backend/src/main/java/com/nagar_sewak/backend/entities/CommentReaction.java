package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment_reactions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"comment_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentReaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private ComplaintComment comment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReactionType type;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    public enum ReactionType {
        LIKE, DISLIKE, HEART, THUMBS_UP, THUMBS_DOWN
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
