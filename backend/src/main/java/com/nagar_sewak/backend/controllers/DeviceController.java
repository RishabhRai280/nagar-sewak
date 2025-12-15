package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.DeviceFingerprint;
import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.services.DeviceFingerprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/devices")
@CrossOrigin("*")
public class DeviceController {

    private final DeviceFingerprintService deviceFingerprintService;
    private final UserRepository userRepository;

    /**
     * Get all devices for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<DeviceFingerprint>> getUserDevices(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<DeviceFingerprint> devices = deviceFingerprintService.getUserDevices(user.getId().toString());
        return ResponseEntity.ok(devices);
    }

    /**
     * Get trusted devices for the authenticated user
     */
    @GetMapping("/trusted")
    public ResponseEntity<List<DeviceFingerprint>> getTrustedDevices(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<DeviceFingerprint> trustedDevices = deviceFingerprintService.getTrustedDevices(user.getId().toString());
        return ResponseEntity.ok(trustedDevices);
    }

    /**
     * Trust a device
     */
    @PostMapping("/{fingerprintHash}/trust")
    public ResponseEntity<Map<String, String>> trustDevice(
            @PathVariable String fingerprintHash,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        deviceFingerprintService.trustDevice(user.getId().toString(), fingerprintHash);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Device has been marked as trusted");
        return ResponseEntity.ok(response);
    }

    /**
     * Remove trust from a device
     */
    @DeleteMapping("/{fingerprintHash}/trust")
    public ResponseEntity<Map<String, String>> untrustDevice(
            @PathVariable String fingerprintHash,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        deviceFingerprintService.untrustDevice(user.getId().toString(), fingerprintHash);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Trust has been removed from the device");
        return ResponseEntity.ok(response);
    }
}