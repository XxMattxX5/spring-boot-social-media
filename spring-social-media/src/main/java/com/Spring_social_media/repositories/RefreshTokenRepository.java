package com.Spring_social_media.repositories;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import com.Spring_social_media.models.RefreshToken;
import com.Spring_social_media.models.User;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByUser(User user);
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByDeviceId(String deviceId);

}
