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
    private final TenderRepository tenderRepo;
    private final EmailTemplateRepository emailTemplateRepo;
    private final PasswordEncoder passwordEncoder;

    @EventListener
    @Transactional
    public void seed(ApplicationReadyEvent event) {
        if (userRepo.count() > 0) {
            System.out.println("Data already exists. Skipping main seeding.");
            return;
        }

        System.out.println("--- Starting Realistic Data Seeding ---");
        String hashedPassword = passwordEncoder.encode("password");

        // --- 1. Users ---
        // Admin
        User adminUser = createUser("admin", "admin@nagar.gov", "Nagar Sewak System Admin", hashedPassword, Set.of(Role.ADMIN, Role.SUPER_ADMIN));

        // Citizens
        User aditya = createUser("citizen_pune_1", "202301100046@mitaoe.ac.in", "Aditya Kulkarni", hashedPassword, Set.of(Role.CITIZEN));
        User rohan = createUser("citizen_mumbai_1", "202301100047@mitaoe.ac.in", "Rohan Mehta", hashedPassword, Set.of(Role.CITIZEN));
        User aman = createUser("citizen_delhi_1", "202301100007@mitaoe.ac.in", "Aman Verma", hashedPassword, Set.of(Role.CITIZEN));
        User suresh = createUser("citizen_pune_2", "samplebhai0012@gmail.com", "Suresh Patil", hashedPassword, Set.of(Role.CITIZEN));

        // Contractors
        User ranjeetUser = createUser("contractor_urbanbuild", "ranjeetjat00001@gmail.com", "Ranjeet Jat", hashedPassword, Set.of(Role.CONTRACTOR));
        User rishabhUser = createUser("contractor_metroworks", "rishabhrai281@gmail.com", "Rishabh Rai", hashedPassword, Set.of(Role.CONTRACTOR));

        // --- 2. Contractors Profiles ---
        Contractor urbanBuild = createContractor(ranjeetUser, "UrbanBuild Infra Pvt Ltd", "LIC-UB-90231");
        Contractor metroWorks = createContractor(rishabhUser, "MetroWorks Engineering", "LIC-MW-77441");

        // --- 3. Wards (Real Locations) ---
        // Pune
        createWard("Kothrud Ward", "Pune", 18.5074, 73.8077);
        createWard("Shivajinagar Ward", "Pune", 18.5308, 73.8475);
        // Mumbai
        createWard("Andheri East Ward", "Mumbai", 19.1136, 72.8697);
        createWard("Dadar West Ward", "Mumbai", 19.0196, 72.8420);
        // Delhi
        createWard("Lajpat Nagar Ward", "Delhi", 28.5677, 77.2433);
        createWard("Rohini Sector 9 Ward", "Delhi", 28.7364, 77.1167);

        // --- 4. Projects (Logical + Location-Based) ---

        // Pune Projects
        Project karveFlyover = createProject("Karve Road Flyover Expansion",
                "Expansion to reduce traffic congestion and repair structural cracks.",
                urbanBuild.getId(), new BigDecimal("120000000.00"), "In Progress", 18.5089, 73.8142,
                "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop"); // Construction

        Project shivajinagarDrain = createProject("Shivajinagar Storm Drain Upgrade",
                "Upgrading drainage capacity in flood-prone bus stand area.",
                metroWorks.getId(), new BigDecimal("60000000.00"), "Pending", 18.5311, 73.8459,
                "https://images.unsplash.com/photo-1585645620949-a2e6f40409a8?q=80&w=1000&auto=format&fit=crop"); // Drain/Water

        // Mumbai Projects
        Project andheriRoad = createProject("Andheri East Road Resurfacing",
                "Heavy duty resurfacing to address recurring pothole complaints.",
                urbanBuild.getId(), new BigDecimal("90000000.00"), "In Progress", 19.1148, 72.8719,
                "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop"); // Road work

        Project dadarLighting = createProject("Dadar West Streetlight Smart Upgrade",
                "Installation of smart LED streetlights with centralized control.",
                metroWorks.getId(), new BigDecimal("35000000.00"), "Completed", 19.0202, 72.8405,
                "https://images.unsplash.com/photo-1623945114138-164724248454?q=80&w=1000&auto=format&fit=crop"); // Streetlight

        // Delhi Projects
        Project lajpatDrain = createProject("Lajpat Nagar Drainage Repair",
                "Fixing monsoon water logging issues in low-lying residential blocks.",
                urbanBuild.getId(), new BigDecimal("40000000.00"), "In Progress", 28.5689, 77.2418,
                "https://images.unsplash.com/photo-1579611504958-39cb32e5256e?q=80&w=1000&auto=format&fit=crop"); // Drain pipe

        Project rohiniBridge = createProject("Rohini Footbridge Structural Repair",
                "Repairing cracks and rusted beams on the pedestrian footbridge.",
                metroWorks.getId(), new BigDecimal("70000000.00"), "Pending", 28.7372, 77.1184,
                "https://images.unsplash.com/photo-1584463673335-85309d94924b?q=80&w=1000&auto=format&fit=crop"); // Concrete/Bridge

        projectRepo.saveAll(List.of(karveFlyover, shivajinagarDrain, andheriRoad, dadarLighting, lajpatDrain, rohiniBridge));

        // --- 5. Complaints (Realistic & Matched) ---

        // 1. Pune - Karve Road
        Complaint c1 = createComplaint(
                "Deep potholes near Karve Road Flyover",
                "The potholes are getting bigger and causing traffic slowdowns. Dangerous for two-wheelers.",
                5, 18.5085, 73.8140, aditya, "In Progress",
                "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop", // Pothole
                karveFlyover, null);

        // 2. Pune - Shivajinagar
        Complaint c2 = createComplaint(
                "Storm water overflowing near Shivajinagar Bus Stand",
                "Every minor rain causes flooding near the entrance. Needs immediate drain cleaning.",
                4, 18.5315, 73.8460, suresh, "Pending",
                "https://images.unsplash.com/photo-1585645620949-a2e6f40409a8?q=80&w=1000&auto=format&fit=crop", // Drain
                shivajinagarDrain, null);

        // 3. Mumbai - Andheri
        Complaint c3 = createComplaint(
                "Road surface completely damaged near MIDC Andheri",
                "The entire stretch is damaged. Vehicles damaging their suspensions.",
                5, 19.1150, 72.8720, rohan, "In Progress",
                "https://images.unsplash.com/photo-1584463673335-85309d94924b?q=80&w=1000&auto=format&fit=crop", // Broken road
                andheriRoad, null);

        // 4. Mumbai - Dadar (Resolved)
        Complaint c4 = createComplaint(
                "Streetlights switching off every night in Dadar West",
                "Main junction lights go off around 10 PM. Safety hazard.",
                2, 19.0200, 72.8400, rohan, "Resolved",
                "https://images.unsplash.com/photo-1623945114138-164724248454?q=80&w=1000&auto=format&fit=crop", // Light
                dadarLighting, Instant.now().minus(5, ChronoUnit.DAYS));

        // 5. Delhi - Lajpat Nagar
        Complaint c5 = createComplaint(
                "Drain water entering houses during rain",
                "Drain blockage causes backflow into residential compounds.",
                4, 28.5690, 77.2420, aman, "In Progress",
                "https://images.unsplash.com/photo-1579611504958-39cb32e5256e?q=80&w=1000&auto=format&fit=crop", // Drain pipe
                lajpatDrain, null);

        // 6. Delhi - Rohini
        Complaint c6 = createComplaint(
                "Cracks visible on pedestrian bridge railing",
                "The concrete railing has visible cracks and exposed iron rods.",
                5, 28.7375, 77.1180, aman, "Pending",
                "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop", // Bridge structure
                rohiniBridge, null);

        List<Complaint> complaints = complaintRepo.saveAll(List.of(c1, c2, c3, c4, c5, c6));

        // --- 6. Tenders (Consistent Flow) ---

        // Open Tenders linked to specific complaints
        createOpenTender(c1, "Karve Road Pothole Repair & Resurfacing", new BigDecimal("500000"), 14);
        createOpenTender(c3, "Andheri East Road Surface Restoration", new BigDecimal("800000"), 21);
        Tender rohiniTender = createOpenTender(c6, "Rohini Footbridge Structural Strengthening", new BigDecimal("600000"), 30);

        // Contractor Bids (UrbanBuild & MetroWorks)
        // Bids for Karve Road (UrbanBuild vs MetroWorks - MetroWorks wins on price/time usually, but maybe not decided yet)
        createBid(c1, urbanBuild, "Standard Repair - 3 Year Warranty", new BigDecimal("550000"), 18, "PENDING");
        createBid(c1, metroWorks, "Express Repair Phase - 1 Year Warranty", new BigDecimal("480000"), 10, "PENDING");

        // Bids for Rohini (Both bid)
        createBid(c6, urbanBuild, "Advanced Structural Polymer Coating", new BigDecimal("700000"), 35, "PENDING");
        createBid(c6, metroWorks, "Standard Concrete Reinforcement", new BigDecimal("580000"), 25, "PENDING");

        // ACCEPTED Tender for Dadar Streetlight (Completed Project)
        // This project is already marked completed, so we simulate the accepted tender history
        createAcceptedTender(c4, metroWorks, "Smart LED Installation & Control System", new BigDecimal("3200000"), "COMPLETED");

        // --- 7. Ratings (Post-Resolution) ---

        // Dadar Smart Lighting - 4 Stars - Rohan - MetroWorks
        createRating(rohan, metroWorks, dadarLighting, 4,
                "Lighting is much better now. The app control integration took a few days to stabilize but works great.",
                ZonedDateTime.now().minusDays(2));

        // Karve Flyover - 2 Stars - Aditya - UrbanBuild
        createRating(aditya, urbanBuild, karveFlyover, 2,
                "Work is very slow. Traffic jams are increasing every day.",
                ZonedDateTime.now().minusDays(5));

        // Andheri Road - 2 Stars - Rohan - UrbanBuild
        createRating(rohan, urbanBuild, andheriRoad, 2,
                "They started work but left debris everywhere. Very dusty.",
                ZonedDateTime.now().minusDays(1));

        // Update Contractor Metrics
        refreshContractorMetrics(urbanBuild);
        refreshContractorMetrics(metroWorks);

        // Seed Email Templates
        seedEmailTemplates();

        System.out.println("--- Realistic Data Seeding Complete ---");
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
                                  String status, double lat, double lng, String imageUrl) {
        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setContractorId(contractorId);
        project.setBudget(budget);
        project.setStatus(status);
        project.setLat(lat);
        project.setLng(lng);
        project.setProgressPhotos(imageUrl); // Using progressPhotos for seed image
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
        complaint.setCreatedAt(Instant.now().minus(severity * 2L, ChronoUnit.DAYS)); // Varied creation times
        complaint.setPhotoUrl(photoFilename);
        complaint.setProject(project);
        complaint.setResolvedAt(resolvedAt);
        return complaint;
    }

    private Tender createOpenTender(Complaint complaint, String title, BigDecimal budget, int days) {
        Tender t = new Tender();
        t.setComplaint(complaint);
        t.setTitle(title);
        t.setDescription("Open tender for: " + complaint.getTitle());
        t.setBudget(budget);
        t.setEstimatedDays(days);
        t.setStatus("OPEN");
        t.setStartDate(java.time.LocalDateTime.now());
        t.setEndDate(java.time.LocalDateTime.now().plusDays(15));
        return tenderRepo.save(t);
    }

    private void createBid(Complaint complaint, Contractor contractor, String desc, BigDecimal quote, int days, String status) {
        Tender t = new Tender();
        t.setComplaint(complaint);
        t.setContractor(contractor);
        t.setQuoteAmount(quote);
        t.setEstimatedDays(days);
        t.setDescription(desc);
        t.setStatus(status);
        tenderRepo.save(t);
    }

    private void createAcceptedTender(Complaint complaint, Contractor contractor, String desc, BigDecimal quote, String status) {
        Tender t = new Tender();
        t.setComplaint(complaint);
        t.setContractor(contractor);
        t.setQuoteAmount(quote);
        t.setDescription(desc);
        t.setStatus("ACCEPTED");
        // For completed project, this tender is "closed" logically or "accepted"
        tenderRepo.save(t);
    }

    private void createRating(User citizen, Contractor contractor, Project project, int score, String comment, ZonedDateTime createdAt) {
        Rating rating = new Rating();
        rating.setUser(citizen);
        rating.setContractor(contractor);
        rating.setProject(project);
        rating.setScore(score);
        rating.setComment(comment);
        rating.setCreatedAt(createdAt);
        ratingRepo.save(rating);
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

    private void seedEmailTemplates() {
        if (emailTemplateRepo.count() > 0) return;

        EmailTemplate passwordResetTemplate = EmailTemplate.builder()
                .type(EmailTemplateType.PASSWORD_RESET)
                .subject("Password Reset Request - ${appName}")
                .htmlContent("password-reset")
                .language("en")
                .active(true)
                .build();

        EmailTemplate securityAlertTemplate = EmailTemplate.builder()
                .type(EmailTemplateType.SECURITY_ALERT)
                .subject("Security Alert - ${appName}")
                .htmlContent("security-alert")
                .language("en")
                .active(true)
                .build();

        EmailTemplate accountLockedTemplate = EmailTemplate.builder()
                .type(EmailTemplateType.ACCOUNT_LOCKED)
                .subject("Account Temporarily Locked - ${appName}")
                .htmlContent("account-locked")
                .language("en")
                .active(true)
                .build();

        EmailTemplate newDeviceTemplate = EmailTemplate.builder()
                .type(EmailTemplateType.NEW_DEVICE_LOGIN)
                .subject("New Device Login Detected - ${appName}")
                .htmlContent("new-device-login")
                .language("en")
                .active(true)
                .build();

        emailTemplateRepo.saveAll(List.of(
                passwordResetTemplate,
                securityAlertTemplate,
                accountLockedTemplate,
                newDeviceTemplate
        ));
    }
}