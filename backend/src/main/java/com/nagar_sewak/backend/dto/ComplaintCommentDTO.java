package com.nagar_sewak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintCommentDTO {
    private Long id;
    private Long complaintId;
    private Long userId;
    private String username;
    private String userRole;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean edited;
}
