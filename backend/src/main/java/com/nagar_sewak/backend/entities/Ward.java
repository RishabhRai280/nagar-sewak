package com.nagar_sewak.backend.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter // FIX: Generates setLatitude/setLongitude required by DataSeeder
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String zone;

    // Getters required by WardService
    private Double latitude;
    private Double longitude;
}