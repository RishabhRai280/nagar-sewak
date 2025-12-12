package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment_attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentAttachment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private ComplaintComment comment;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String fileUrl;
    
    @Column(nullable = false)
    private String fileType;
    
    private Long fileSize;
    
    @Column(nullable = false)
    private LocalDateTime uploadedAt;
    
    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
