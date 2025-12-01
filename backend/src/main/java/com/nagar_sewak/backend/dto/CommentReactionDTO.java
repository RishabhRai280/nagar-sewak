package com.nagar_sewak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentReactionDTO {
    private Long id;
    private String type;
    private Long userId;
    private String userFullName;
    private String createdAt;
}
