package com.nagar_sewak.backend.config;

import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepo;
    private final ContractorRepository contractorRepo;
    private final ProjectRepository projectRepo;
    private final WardRepository wardRepo;
    private final PasswordEncoder passwordEncoder;

    @EventListener
    @Transactional
    public void seed(ApplicationReadyEvent event) {
        // Skip seeding if any users already exist
        if (userRepo.count() > 0) return;

        System.out.println("--- Starting Data Seeding ---");

        // --- 1. Create Users ---
        String hashedPassword = passwordEncoder.encode("password");

        // Admin User (Access to /dashboard/admin)
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@nagar.gov");
        adminUser.setFullName("Govt Admin");
        adminUser.setPassword(hashedPassword); 
        adminUser.setRoles(Set.of(Role.ADMIN, Role.SUPER_ADMIN));
        userRepo.save(adminUser);

        // Citizen User (Can submit complaints/ratings)
        User citizenUser = new User();
        citizenUser.setUsername("citizen");
        citizenUser.setEmail("citizen@public.org");
        citizenUser.setFullName("Active Citizen");
        citizenUser.setPassword(hashedPassword); // FIX: setPassword
        citizenUser.setRoles(Set.of(Role.CITIZEN));
        userRepo.save(citizenUser);

        // Contractor User (Can update project status)
        User contractorUser = new User();
        contractorUser.setUsername("contractor");
        contractorUser.setEmail("contractor@builds.com");
        contractorUser.setFullName("City Builders Inc.");
        contractorUser.setPassword(hashedPassword); // FIX: setPassword
        contractorUser.setRoles(Set.of(Role.CONTRACTOR));
        userRepo.save(contractorUser);
        
        // --- 2. Create Contractor Entity ---
        Contractor contractor = new Contractor();
        contractor.setUser(contractorUser);
        contractor.setCompanyName("City Solutions Pvt. Ltd.");
        contractor.setLicenseNo("LIC-12345");
        contractorRepo.save(contractor);

        // --- 3. Create Ward (for testing detection logic) ---
        Ward ward = new Ward();
        ward.setName("Central Ward A");
        ward.setZone("East");
        ward.setLatitude(19.0760); 
        ward.setLongitude(72.8777);
        wardRepo.save(ward);

        // --- 4. Create Project (for map/dashboard KPI) ---
        Project project = new Project();
        project.setTitle("Main Road Flyover Construction");
        project.setDescription("Construction of a new 4-lane flyover to ease congestion.");
        project.setContractorId(contractor.getId()); // FIX: setContractorId
        project.setBudget(new BigDecimal("150000000.00")); // FIX: setBudget with BigDecimal
        project.setStatus("In Progress");
        project.setLat(19.1000);
        project.setLng(72.8800);
        projectRepo.save(project);
        
        System.out.println("--- Data Seeding Complete. Users created. ---");
        System.out.println("Test Credentials: All users use 'password'");
    }
}