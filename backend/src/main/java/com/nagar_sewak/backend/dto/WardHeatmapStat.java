package com.nagar_sewak.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WardHeatmapStat {
    private String wardName;
    private String zone;
    private Long complaintCount;
    private Long projectCount;
}


