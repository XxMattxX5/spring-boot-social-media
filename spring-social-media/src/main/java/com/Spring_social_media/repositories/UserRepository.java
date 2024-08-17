package com.Spring_social_media.repositories;

import org.springframework.data.repository.CrudRepository;
import com.Spring_social_media.models.User;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> findById(Integer id);
    Optional<User> findByName(String name);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
