package com.nagar_sewak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintVoteDTO {
    private Long complaintId;
    private Long voteCount;
    private Boolean hasVoted;
}
