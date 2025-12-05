package com.nagar_sewak.backend.dto;

import lombok.Data;

@Data
public class FirebaseLoginRequest {
    private String idToken;
    private String displayName;
    private String email;
}

