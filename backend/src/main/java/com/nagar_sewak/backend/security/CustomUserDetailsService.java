package com.nagar_sewak.backend.security;

import com.nagar_sewak.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String identifier) {
        // Support both email and username for backward compatibility
        var user = repo.findByEmail(identifier)
                .or(() -> repo.findByUsername(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + identifier));

        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))  // role.getName() → "ROLE_ADMIN" etc.
                .collect(Collectors.toList());

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername()) // Always use username for Spring Security context
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }
}
