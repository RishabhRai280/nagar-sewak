package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.ContractorDashboardDTO;
import com.nagar_sewak.backend.services.ContractorDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard/contractor")
@CrossOrigin("*")
public class ContractorDashboardController {

    private final ContractorDashboardService contractorDashboardService;

    @GetMapping
    public ContractorDashboardDTO getContractorDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        return contractorDashboardService.getDashboard(userDetails.getUsername());
    }
}


