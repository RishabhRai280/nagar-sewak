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
    private String contractorCompany;
    private String contractorLicense;
    private Double contractorAvgRating;
    private BigDecimal quoteAmount;
    private Integer estimatedDays;
    private String description;
    private java.util.List<String> documentUrls;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
