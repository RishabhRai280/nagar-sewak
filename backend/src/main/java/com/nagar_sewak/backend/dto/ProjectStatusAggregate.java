package com.nagar_sewak.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProjectStatusAggregate {
    private String status;
    private Long projectCount;
    private BigDecimal totalBudget;
}


