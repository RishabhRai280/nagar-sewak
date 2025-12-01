package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.RatingRequest;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepo;
    private final ContractorRepository contractorRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;

    @Transactional
    public Rating submitAndProcessRating(RatingRequest request, String username) {
        // 1. Fetch related entities
        User citizen = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        Project project = projectRepo.findById(request.getProjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        // Ensure the project has an assigned contractor
        Long contractorId = project.getContractorId();
        if (contractorId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project has no assigned contractor.");
        }
        
        Contractor contractor = contractorRepo.findById(contractorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contractor not found"));

        // 2. Create and Save the new Rating
        Rating newRating = new Rating();
        newRating.setUser(citizen);
        newRating.setProject(project);
        newRating.setContractor(contractor);
        newRating.setScore(request.getScore());
        newRating.setComment(request.getComment());

        Rating savedRating = ratingRepo.save(newRating);

        // 3. Recalculate Contractor Average Rating
        recalculateAndCheckFlagging(contractor);

        return savedRating;
    }

    private void recalculateAndCheckFlagging(Contractor contractor) {
        List<Rating> allRatings = ratingRepo.findByContractorId(contractor.getId());
        
        if (allRatings.isEmpty()) return;

        // Calculate Sum of Scores
        double totalScore = allRatings.stream()
                .mapToInt(Rating::getScore)
                .sum();
        
        // Calculate new Average
        BigDecimal newAvg = BigDecimal.valueOf(totalScore)
                .divide(BigDecimal.valueOf(allRatings.size()), 2, RoundingMode.HALF_UP);

        contractor.setAvgRating(newAvg);

        // 4. Check Flagging Criteria (Avg rating <= 2.5)
        if (newAvg.compareTo(new BigDecimal("2.5")) <= 0) {
            Boolean currentFlagged = contractor.getIsFlagged();
            if (currentFlagged == null || !currentFlagged) {
                contractor.setIsFlagged(true);
                contractor.setFlaggedAt(ZonedDateTime.now());
                // NOTE: An Admin notification service would be called here.
            }
        } else {
            // Unflag if score recovers
            contractor.setIsFlagged(false);
            contractor.setFlaggedAt(null);
        }

        contractorRepo.save(contractor);
    }
}