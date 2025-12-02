package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.NotificationPreference;
import com.nagar_sewak.backend.entities.NotificationType;
import com.nagar_sewak.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {

    List<NotificationPreference> findByUser(User user);

    Optional<NotificationPreference> findByUserAndNotificationType(User user, NotificationType notificationType);

    void deleteByUser(User user);
}
