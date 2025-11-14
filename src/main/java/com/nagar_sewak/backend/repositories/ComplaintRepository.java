package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

}
