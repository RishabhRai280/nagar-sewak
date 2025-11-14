package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.Complaint;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import lombok.RequiredArgsConstructor;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/complaints")
public class ComplaintController {
	
    private final ComplaintRepository repo = null;

    @GetMapping
    public List<Complaint> all() {
        return repo.findAll();
    }

    @PostMapping
    public Complaint create(@RequestBody Complaint c) {
        return repo.save(c);
    }
}
