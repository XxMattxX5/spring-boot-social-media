package com.Spring_social_media.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import com.Spring_social_media.models.Like;
import com.Spring_social_media.models.User;


public interface LikeRepository extends CrudRepository<Like, Integer> {
    Optional<Like> findByUser(User user);
    
}
