package com.nagar_sewak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnhancedCommentDTO {
    private Long id;
    private Long complaintId;
    private Long userId;
    private String userFullName;
    private String userRole;
    private String content;
    private String createdAt;
    private String updatedAt;
    private Boolean edited;
    
    // Reactions
    private Map<String, Long> reactionCounts;
    private String userReaction;
    
    // Mentions
    private List<String> mentionedUsernames;
    
    // Attachments
    private List<CommentAttachmentDTO> attachments;
}
