package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.PushSubscription;
import com.nagar_sewak.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {

    List<PushSubscription> findByUserAndIsActive(User user, Boolean isActive);

    Optional<PushSubscription> findByEndpoint(String endpoint);

    @Modifying
    @Query("UPDATE PushSubscription p SET p.isActive = false WHERE p.expiresAt < :now AND p.isActive = true")
    int deactivateExpiredSubscriptions(@Param("now") LocalDateTime now);

    void deleteByUserAndEndpoint(User user, String endpoint);
}
