package com.nagar_sewak.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TenderDTO {
    private Long id;
    private Long complaintId;
    private String complaintTitle;
    private Long contractorId;
    private String contractorName;
    private BigDecimal quoteAmount;
    private Integer estimatedDays;
    private String description;
    private String status;
    private LocalDateTime createdAt;
}
