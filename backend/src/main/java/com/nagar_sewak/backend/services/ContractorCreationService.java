package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.ContractorCreationDTO;
import com.nagar_sewak.backend.models.Contractor;
import com.nagar_sewak.backend.models.User;
import com.nagar_sewak.backend.models.UserRole;
import com.nagar_sewak.backend.repositories.ContractorRepository;
import com.nagar_sewak.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ContractorCreationService {

    private final UserRepository userRepository;
    private final ContractorRepository contractorRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Long createContractor(ContractorCreationDTO dto) {
        // Check if username or email already exists
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Create User entity
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setRoles(Set.of(UserRole.CONTRACTOR));
        
        User savedUser = userRepository.save(user);

        // Create Contractor entity
        Contractor contractor = new Contractor();
        contractor.setUser(savedUser);
        contractor.setCompanyName(dto.getCompanyName());
        contractor.setLicenseNo(dto.getLicenseNo());
        contractor.setAvgRating(0.0);
        contractor.setTotalRatings(0);
        contractor.setFlagged(false);
        
        Contractor savedContractor = contractorRepository.save(contractor);

        return savedContractor.getId();
    }
}
