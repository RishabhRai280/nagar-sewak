package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.AdminDashboardDTO;
import com.nagar_sewak.backend.services.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    // GET /dashboard/admin (Admin Only - Secured by SecurityConfig)
    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardDTO> getAdminDashboard() {
        AdminDashboardDTO data = dashboardService.getDashboardData();
        return ResponseEntity.ok(data);
    }
}