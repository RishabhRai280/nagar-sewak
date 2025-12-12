package com.nagar_sewak.backend.dto;

import lombok.Data;

@Data
public class ContractorCreationDTO {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String companyName;
    private String licenseNo;
}
