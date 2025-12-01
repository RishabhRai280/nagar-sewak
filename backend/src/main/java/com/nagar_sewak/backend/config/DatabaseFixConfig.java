package com.nagar_sewak.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseFixConfig {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixTenderTable() {
        try {
            log.info("Checking and fixing tender table constraints...");
            
            // Make budget column nullable
            jdbcTemplate.execute("ALTER TABLE tenders MODIFY COLUMN budget DECIMAL(38,2) NULL");
            
            log.info("Successfully fixed tender table - budget column is now nullable");
        } catch (Exception e) {
            // If column doesn't exist or already nullable, ignore the error
            log.debug("Tender table fix not needed or already applied: {}", e.getMessage());
        }
    }
}
