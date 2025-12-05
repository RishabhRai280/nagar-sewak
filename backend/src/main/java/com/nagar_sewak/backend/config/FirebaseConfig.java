package com.nagar_sewak.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${firebase.credentials:}")
    private String firebaseCredentials;

    @Value("${firebase.credentials.path:}")
    private String firebaseCredentialsPath;

    @PostConstruct
    public void initializeFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return; // Already initialized
        }

        try {
            FirebaseOptions options = buildOptions();
            if (options == null) {
                log.warn("Skipping Firebase initialization: provide firebase.credentials (base64) or firebase.credentials.path");
                return;
            }

            FirebaseApp.initializeApp(options);
            log.info("Firebase initialized for Google Sign-In verification");
        } catch (Exception e) {
            log.error("Failed to initialize Firebase for Google Sign-In verification", e);
        }
    }

    private FirebaseOptions buildOptions() throws IOException {
        if (firebaseCredentials != null && !firebaseCredentials.isBlank()) {
            byte[] decoded = Base64.getDecoder().decode(firebaseCredentials);
            try (InputStream is = new ByteArrayInputStream(decoded)) {
                return FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(is))
                        .build();
            }
        }

        if (firebaseCredentialsPath != null && !firebaseCredentialsPath.isBlank()) {
            Path credentialsPath = Path.of(firebaseCredentialsPath);
            if (Files.exists(credentialsPath)) {
                try (InputStream is = Files.newInputStream(credentialsPath)) {
                    return FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(is))
                            .build();
                }
            } else {
                log.warn("Firebase credentials path does not exist: {}", firebaseCredentialsPath);
            }
        }

        return null;
    }
}

