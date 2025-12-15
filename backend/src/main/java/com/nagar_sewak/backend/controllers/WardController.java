package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.Ward;
import com.nagar_sewak.backend.services.WardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wards")
@CrossOrigin("*")
public class WardController {

    private final WardService wardService;

    @GetMapping("/detect")
    public ResponseEntity<Ward> detectWard(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        Ward ward = wardService.detectWard(lat, lng);
        return ResponseEntity.ok(ward);
    }
}
