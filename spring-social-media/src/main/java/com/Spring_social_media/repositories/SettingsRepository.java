package com.Spring_social_media.repositories;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import com.Spring_social_media.models.Settings;
import com.Spring_social_media.models.User;

public interface SettingsRepository extends CrudRepository<Settings, Integer> {
    Optional<Settings> findByUser(User user);
}
