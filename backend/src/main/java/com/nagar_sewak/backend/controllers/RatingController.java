package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.RatingRequest;
import com.nagar_sewak.backend.entities.Rating;
import com.nagar_sewak.backend.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ratings")
public class RatingController {

    private final RatingService ratingService;

    // POST /ratings (Citizen Only - Secured by SecurityConfig)
    @PostMapping
    public ResponseEntity<Rating> submitRating(
            @RequestBody RatingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        
        Rating savedRating = ratingService.submitAndProcessRating(request, userDetails.getUsername());
        
        return new ResponseEntity<>(savedRating, HttpStatus.CREATED);
    }
}