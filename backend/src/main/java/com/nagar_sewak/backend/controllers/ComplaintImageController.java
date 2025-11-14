package com.nagar_sewak.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/uploads/complaints")
@CrossOrigin("*")
public class ComplaintImageController {

    private final Path uploadBase = Paths.get("uploads/complaints");

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = uploadBase.resolve(filename).normalize();
            if (!Files.exists(file))
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");

            byte[] bytes = Files.readAllBytes(file);
            String contentType = Files.probeContentType(file);
            if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(new ByteArrayResource(bytes));

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read file");
        }
    }
}
