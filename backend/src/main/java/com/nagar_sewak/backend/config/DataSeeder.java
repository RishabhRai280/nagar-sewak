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
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.time.temporal.ChronoUnit; 

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepo;
    private final ContractorRepository contractorRepo;
    private final ProjectRepository projectRepo;
    private final WardRepository wardRepo;
    private final RatingRepository ratingRepo;
    private final ComplaintRepository complaintRepo; 
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
        citizenUser.setPassword(hashedPassword);
        citizenUser.setRoles(Set.of(Role.CITIZEN));
        userRepo.save(citizenUser);
        
        // Secondary Citizen User for more reviews/complaints
        User citizenUser2 = new User();
        citizenUser2.setUsername("citizen2");
        citizenUser2.setEmail("citizen2@public.org");
        citizenUser2.setFullName("Local Resident");
        citizenUser2.setPassword(hashedPassword);
        citizenUser2.setRoles(Set.of(Role.CITIZEN));
        userRepo.save(citizenUser2);


        // Contractor User (Can update project status)
        User contractorUser = new User();
        contractorUser.setUsername("contractor");
        contractorUser.setEmail("contractor@builds.com");
        contractorUser.setFullName("City Builders Inc.");
        contractorUser.setPassword(hashedPassword);
        contractorUser.setRoles(Set.of(Role.CONTRACTOR));
        userRepo.save(contractorUser);
        
        // --- 2. Create Contractor Entity ---
        Contractor contractor = new Contractor();
        contractor.setUser(contractorUser);
        contractor.setCompanyName("City Solutions Pvt. Ltd.");
        contractor.setLicenseNo("LIC-12345");
        contractor.setAvgRating(BigDecimal.ZERO); 
        contractor.setTotalRatings(0); 
        contractorRepo.save(contractor); 
        
        // --- 3. Create Wards ---
        Ward wardA = new Ward();
        wardA.setName("Central Ward A");
        wardA.setZone("East");
        wardA.setLatitude(19.0760); 
        wardA.setLongitude(72.8777);
        wardRepo.save(wardA);

        Ward wardB = new Ward();
        wardB.setName("North Ward B");
        wardB.setZone("North");
        wardB.setLatitude(19.2000); 
        wardB.setLongitude(72.8500);
        wardRepo.save(wardB);

        // --- 4. Create Projects ---

        // Project 1: In Progress (Near Mumbai Center)
        Project project1 = new Project();
        project1.setTitle("Coastal Road Extension Phase 2");
        project1.setDescription("Construction of a 4-lane tunnel extension under the main creek.");
        project1.setContractorId(contractor.getId());
        project1.setBudget(new BigDecimal("550000000.00"));
        project1.setStatus("In Progress");
        project1.setLat(19.0800);
        project1.setLng(72.8650);
        projectRepo.save(project1);
        
        // Project 2: Completed/Resolved (Can be rated)
        Project project2 = new Project();
        project2.setTitle("Sector 4 Community Park Renovation");
        project2.setDescription("Full renovation and landscaping of Sector 4 community park, adding new jogging tracks.");
        project2.setContractorId(contractor.getId());
        project2.setBudget(new BigDecimal("5000000.00"));
        project2.setStatus("Completed");
        project2.setLat(19.0700);
        project2.setLng(72.9000);
        projectRepo.save(project2);

        // Project 3: Pending
        Project project3 = new Project();
        project3.setTitle("New Water Treatment Plant");
        project3.setDescription("Construction of a small-scale water purification plant to serve Ward B.");
        project3.setContractorId(contractor.getId());
        project3.setBudget(new BigDecimal("80000000.00"));
        project3.setStatus("Pending");
        project3.setLat(19.1900);
        project3.setLng(72.8550);
        projectRepo.save(project3);


        // --- 5. Create Complaints ---

        // Complaint A: Pending, High Severity (Dashboard KPI) - Needs photo
        Complaint complaintA = new Complaint();
        complaintA.setTitle("Massive Pothole on Sector 4 Main Road");
        complaintA.setDescription("Pothole has caused two minor accidents this week. Requires urgent repair.");
        complaintA.setSeverity(5);
        complaintA.setLat(19.0850);
        complaintA.setLng(72.8700);
        complaintA.setUser(citizenUser);
        complaintA.setStatus("Pending");
        complaintA.setCreatedAt(Instant.now().minus(50, ChronoUnit.HOURS)); 
        complaintA.setPhotoUrl("1763131283439_blueberry.jpg"); 
        complaintRepo.save(complaintA);

        // Complaint B: In Progress, Medium Severity (Linked to Project 1)
        Complaint complaintB = new Complaint();
        complaintB.setTitle("Construction Debris Blocking Sidewalk");
        complaintB.setDescription("Debris from the coastal road project is blocking pedestrian traffic.");
        complaintB.setSeverity(3);
        complaintB.setLat(19.0810);
        complaintB.setLng(72.8655);
        complaintB.setUser(citizenUser2);
        complaintB.setStatus("In Progress");
        complaintB.setCreatedAt(Instant.now().minus(2, ChronoUnit.DAYS)); 
        complaintB.setProject(project1);
        complaintRepo.save(complaintB);
        
        // Complaint C: Resolved, Low Severity (Can be rated) - Linked to Project 2
        Complaint complaintC = new Complaint();
        complaintC.setTitle("Graffiti on Community Park Wall");
        complaintC.setDescription("Graffiti was painted on the newly renovated park wall. Quickly cleaned up.");
        complaintC.setSeverity(1);
        complaintC.setLat(19.0705);
        complaintC.setLng(72.9010);
        complaintC.setUser(citizenUser);
        complaintC.setStatus("Resolved");
        complaintC.setCreatedAt(Instant.now().minus(1, ChronoUnit.DAYS)); 
        complaintC.setProject(project2); 
        complaintRepo.save(complaintC);

        // --- 6. Create Ratings (Test Contractor Flagging) ---
        
        // Rating 1: Low Score (citizenUser)
        Rating rating1 = new Rating();
        rating1.setUser(citizenUser);
        rating1.setProject(project2);
        rating1.setContractor(contractor);
        rating1.setScore(2); 
        rating1.setComment("Work was okay, but the final cleanup was poor and left debris.");
        rating1.setCreatedAt(ZonedDateTime.now().minusDays(3));
        ratingRepo.save(rating1);

        // Rating 2: High Score (citizenUser2) - Contractor recovers
        Rating rating2 = new Rating();
        rating2.setUser(citizenUser2);
        rating2.setProject(project2);
        rating2.setContractor(contractor);
        rating2.setScore(5); 
        rating2.setComment("Excellent completion! Very happy with the new tracks.");
        rating2.setCreatedAt(ZonedDateTime.now().minusDays(1));
        ratingRepo.save(rating2);
        
        // Final Average Calculation: (2 + 5) / 2 = 3.5. Contractor is NOT flagged.
        double totalScores = rating1.getScore() + rating2.getScore();
        int numberOfRatings = 2;
        BigDecimal newAvg = BigDecimal.valueOf(totalScores / numberOfRatings).setScale(2, RoundingMode.HALF_UP);
        
        contractor.setAvgRating(newAvg);
        contractor.setTotalRatings(numberOfRatings); 
        contractor.setIsFlagged(newAvg.compareTo(BigDecimal.valueOf(2.5)) <= 0); 
        if (!contractor.getIsFlagged()) {
            contractor.setFlaggedAt(null);
        }

        contractorRepo.save(contractor);
        
        // --- Final Output ---
        System.out.println("--- Data Seeding Complete. All test data created. ---");
        System.out.println("Test Credentials: All users use 'password'");
        System.out.println("Contractor Avg Rating: " + newAvg + " (Is Flagged: " + contractor.getIsFlagged() + ")");
    }
}