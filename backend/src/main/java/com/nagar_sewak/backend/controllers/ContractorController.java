package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.ContractorProfileDTO;
import com.nagar_sewak.backend.services.ContractorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/contractors")
@CrossOrigin("*")
public class ContractorController {

    private final ContractorService contractorService;

    @GetMapping("/{id}")
    public ResponseEntity<ContractorProfileDTO> getContractorProfile(@PathVariable Long id) {
        try {
            ContractorProfileDTO profile = contractorService.getContractorProfile(id);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
