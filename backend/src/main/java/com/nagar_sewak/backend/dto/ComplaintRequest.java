package com.nagar_sewak.backend.dto;

import lombok.Data;


@Data
public class ComplaintRequest {
    private String title;
    private String description;
    private Integer severity;
    private Double lat;
    private Double lng;
    private Long projectId;
    private String status;
}
