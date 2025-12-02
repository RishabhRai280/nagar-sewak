package com.nagar_sewak.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequiredArgsConstructor
@RequestMapping("/uploads")
@CrossOrigin("*")
public class FileController {

    // Unified method to serve files from different directories
    private ResponseEntity<Resource> serveFile(String directory, String filename) {
        try {
            // Use absolute path from project root
            String projectRoot = System.getProperty("user.dir");
            Path uploadBase = Paths.get(projectRoot, "uploads", directory);
            Path file = uploadBase.resolve(filename).normalize();
            
            if (!Files.exists(file)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
            }

            byte[] bytes = Files.readAllBytes(file);
            String contentType = Files.probeContentType(file);
            
            // Fallback content types
            if (contentType == null) {
                if (filename.endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else if (filename.endsWith(".doc") || filename.endsWith(".docx")) {
                    contentType = "application/msword";
                } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (filename.endsWith(".png")) {
                    contentType = "image/png";
                } else {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(new ByteArrayResource(bytes));

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read file");
        }
    }

    // Serve complaint images
    @GetMapping("/complaints/{filename:.+}")
    public ResponseEntity<Resource> serveComplaintFile(@PathVariable String filename) {
        return serveFile("complaints", filename);
    }

    // Serve tender documents
    @GetMapping("/tenders/{filename:.+}")
    public ResponseEntity<Resource> serveTenderFile(@PathVariable String filename) {
        return serveFile("tenders", filename);
    }

    // Serve project progress photos
    @GetMapping("/projects/{filename:.+}")
    public ResponseEntity<Resource> serveProjectFile(@PathVariable String filename) {
        return serveFile("projects", filename);
    }
}
