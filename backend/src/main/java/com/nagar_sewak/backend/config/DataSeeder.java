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
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

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
        if (userRepo.count() > 0) return;

        System.out.println("--- Starting Data Seeding ---");
        String hashedPassword = passwordEncoder.encode("password");

        // --- Users ---
        User adminUser = createUser("admin", "admin@nagar.gov", "Govt Admin", hashedPassword, Set.of(Role.ADMIN, Role.SUPER_ADMIN));
        User citizenUser = createUser("citizen", "citizen@public.org", "Active Citizen", hashedPassword, Set.of(Role.CITIZEN));
        User citizenUser2 = createUser("citizen2", "citizen2@public.org", "Local Resident", hashedPassword, Set.of(Role.CITIZEN));
        User citizenUser3 = createUser("citizen3", "citizen3@public.org", "Ward Volunteer", hashedPassword, Set.of(Role.CITIZEN));
        User contractorUser = createUser("contractor", "contractor@builds.com", "City Builders Inc.", hashedPassword, Set.of(Role.CONTRACTOR));
        User contractorUser2 = createUser("contractor2", "contractor2@infra.com", "Urban Infra Works", hashedPassword, Set.of(Role.CONTRACTOR));

        // --- Contractors ---
        Contractor contractorA = createContractor(contractorUser, "City Solutions Pvt. Ltd.", "LIC-12345");
        Contractor contractorB = createContractor(contractorUser2, "Urban Infra Works LLP", "LIC-67890");

        // --- Wards ---
        Ward wardA = createWard("Central Ward A", "East", 19.0760, 72.8777);
        Ward wardB = createWard("North Ward B", "North", 19.2000, 72.8500);
        Ward wardC = createWard("Riverside Ward C", "West", 19.0500, 72.8200);
        Ward wardD = createWard("South Ward D", "South", 19.0000, 72.9100);

        // --- Projects ---
        Project project1 = createProject("Coastal Road Extension Phase 2",
                "Construction of a 4-lane tunnel extension under the main creek.",
                contractorA.getId(), new BigDecimal("550000000.00"), "In Progress", 19.0800, 72.8650);

        Project project2 = createProject("Sector 4 Community Park Renovation",
                "Full renovation and landscaping of Sector 4 community park, adding new jogging tracks.",
                contractorA.getId(), new BigDecimal("5000000.00"), "Completed", 19.0700, 72.9000);

        Project project3 = createProject("New Water Treatment Plant",
                "Construction of a small-scale water purification plant to serve Ward B.",
                contractorA.getId(), new BigDecimal("80000000.00"), "Pending", 19.1900, 72.8550);

        Project project4 = createProject("Old Town Drainage Upgrade",
                "Replacement of 3km sewage lines to eliminate annual flooding.",
                contractorB.getId(), new BigDecimal("120000000.00"), "In Progress", 19.0220, 72.8600);

        Project project5 = createProject("Smart LED Street Lighting",
                "Smart streetlights with fault detection and remote control.",
                contractorB.getId(), new BigDecimal("30000000.00"), "Completed", 19.0100, 72.9300);

        Project project6 = createProject("Primary Health Center Retrofit",
                "HVAC and solar upgrades for the district PHC.",
                contractorA.getId(), new BigDecimal("15000000.00"), "Pending", 19.1600, 72.8900);

        List<Project> projects = projectRepo.saveAll(List.of(project1, project2, project3, project4, project5, project6));

        // --- Complaints ---
        Complaint complaintA = createComplaint(
                "Massive Pothole on Sector 4 Main Road",
                "Pothole has caused two minor accidents this week. Requires urgent repair.",
                5, 19.0850, 72.8700, citizenUser, "Pending",
                "1763131283439_blueberry.jpg", null, null);

        Complaint complaintB = createComplaint(
                "Construction Debris Blocking Sidewalk",
                "Debris from the coastal road project is blocking pedestrian traffic.",
                3, 19.0810, 72.8655, citizenUser2, "In Progress",
                null, project1, null);

        Complaint complaintC = createComplaint(
                "Graffiti on Community Park Wall",
                "Graffiti was painted on the newly renovated park wall. Quickly cleaned up.",
                1, 19.0705, 72.9010, citizenUser, "Resolved",
                "1763141553475_blueberry.jpg", project2, Instant.now().minus(18, ChronoUnit.HOURS));

        Complaint complaintD = createComplaint(
                "Standing Water near Ward Office",
                "Drains blocked after light showers; foul smell reported.",
                4, 19.0230, 72.8610, citizenUser3, "Pending",
                null, project4, null);

        Complaint complaintE = createComplaint(
                "Streetlight Flickering in Lane 9",
                "Smart LED unit flickers every 5 seconds causing dark patch.",
                2, 19.0110, 72.9320, citizenUser2, "Resolved",
                "1763131283439_blueberry.jpg", project5, Instant.now().minus(3, ChronoUnit.DAYS));

        Complaint complaintF = createComplaint(
                "Garbage Overflowing Near Market",
                "Bins overflowing daily due to delayed pickups; stray dogs everywhere.",
                4, 19.0600, 72.8800, citizenUser3, "In Progress",
                null, null, null);

        complaintRepo.saveAll(List.of(complaintA, complaintB, complaintC, complaintD, complaintE, complaintF));

        // --- Ratings ---
        Rating rating1 = createRating(citizenUser, contractorA, project2, 2,
                "Work was okay, but the final cleanup was poor and left debris.", ZonedDateTime.now().minusDays(3));

        Rating rating2 = createRating(citizenUser2, contractorA, project2, 5,
                "Excellent completion! Very happy with the new tracks.", ZonedDateTime.now().minusDays(1));

        Rating rating3 = createRating(citizenUser3, contractorA, project5, 4,
                "Lighting upgrade looks great and feels safer already.", ZonedDateTime.now().minusDays(2));

        Rating rating4 = createRating(citizenUser, contractorB, project4, 2,
                "Site safety nets missing; debris spilling onto footpath.", ZonedDateTime.now().minusHours(30));

        Rating rating5 = createRating(citizenUser2, contractorB, project5, 1,
                "Controller keeps failing every week, maintenance is slow.", ZonedDateTime.now().minusHours(12));

        ratingRepo.saveAll(List.of(rating1, rating2, rating3, rating4, rating5));

        refreshContractorMetrics(contractorA);
        refreshContractorMetrics(contractorB);

        System.out.println("--- Data Seeding Complete. Sample credentials ---");
        System.out.println("Admin: admin@nagar.gov / password");
        System.out.println("Citizen: citizen@public.org / password");
        System.out.println("Contractor: contractor@builds.com / password");
    }

    private User createUser(String username, String email, String fullName, String password, Set<Role> roles) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(password);
        user.setRoles(roles);
        return userRepo.save(user);
    }

    private Contractor createContractor(User user, String companyName, String licenseNo) {
        Contractor contractor = new Contractor();
        contractor.setUser(user);
        contractor.setCompanyName(companyName);
        contractor.setLicenseNo(licenseNo);
        contractor.setAvgRating(BigDecimal.ZERO); 
        contractor.setTotalRatings(0); 
        return contractorRepo.save(contractor);
    }

    private Ward createWard(String name, String zone, double lat, double lng) {
        Ward ward = new Ward();
        ward.setName(name);
        ward.setZone(zone);
        ward.setLatitude(lat);
        ward.setLongitude(lng);
        return wardRepo.save(ward);
    }

    private Project createProject(String title, String description, Long contractorId, BigDecimal budget,
                                  String status, double lat, double lng) {
        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setContractorId(contractorId);
        project.setBudget(budget);
        project.setStatus(status);
        project.setLat(lat);
        project.setLng(lng);
        return project;
    }

    private Complaint createComplaint(String title, String description, int severity, double lat, double lng,
                                      User user, String status, String photoFilename, Project project, Instant resolvedAt) {
        Complaint complaint = new Complaint();
        complaint.setTitle(title);
        complaint.setDescription(description);
        complaint.setSeverity(severity);
        complaint.setLat(lat);
        complaint.setLng(lng);
        complaint.setUser(user);
        complaint.setStatus(status);
        complaint.setCreatedAt(Instant.now().minus(severity * 6L, ChronoUnit.HOURS));
        complaint.setPhotoUrl(photoFilename);
        complaint.setProject(project);
        complaint.setResolvedAt(resolvedAt);
        return complaint;
    }

    private Rating createRating(User citizen, Contractor contractor, Project project, int score, String comment, ZonedDateTime createdAt) {
        Rating rating = new Rating();
        rating.setUser(citizen);
        rating.setContractor(contractor);
        rating.setProject(project);
        rating.setScore(score);
        rating.setComment(comment);
        rating.setCreatedAt(createdAt);
        return rating;
    }

    private void refreshContractorMetrics(Contractor contractor) {
        List<Rating> allRatings = ratingRepo.findByContractorId(contractor.getId());
        if (allRatings.isEmpty()) {
            contractor.setAvgRating(BigDecimal.ZERO);
            contractor.setTotalRatings(0);
            contractor.setIsFlagged(false);
            contractor.setFlaggedAt(null);
            contractorRepo.save(contractor);
            return;
        }

        double totalScore = allRatings.stream().mapToInt(Rating::getScore).sum();
        BigDecimal avg = BigDecimal.valueOf(totalScore / allRatings.size()).setScale(2, RoundingMode.HALF_UP);

        contractor.setAvgRating(avg);
        contractor.setTotalRatings(allRatings.size());
        boolean flagged = avg.compareTo(new BigDecimal("2.5")) <= 0;
        contractor.setIsFlagged(flagged);
        contractor.setFlaggedAt(flagged ? ZonedDateTime.now() : null);
        contractorRepo.save(contractor);
    }
}