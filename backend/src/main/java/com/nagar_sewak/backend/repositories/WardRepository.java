package com.nagar_sewak.backend.repositories;


import com.nagar_sewak.backend.entities.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {
}
