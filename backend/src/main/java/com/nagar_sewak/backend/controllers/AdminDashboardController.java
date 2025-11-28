package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.AdminDashboardDTO;
import com.nagar_sewak.backend.dto.ContractorCreationDTO;
import com.nagar_sewak.backend.services.AdminDashboardService;
import com.nagar_sewak.backend.services.ContractorCreationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;
    private final ContractorCreationService contractorCreationService;

    // GET /admin/dashboard (Admin Only - Secured by SecurityConfig)
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getAdminDashboard() {
        AdminDashboardDTO data = dashboardService.getDashboardData();
        return ResponseEntity.ok(data);
    }

    // POST /admin/contractors (Admin Only - Create contractor account)
    @PostMapping("/contractors")
    public ResponseEntity<Map<String, Object>> createContractor(@RequestBody ContractorCreationDTO dto) {
        try {
            Long contractorId = contractorCreationService.createContractor(dto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contractor created successfully");
            response.put("contractorId", contractorId);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}