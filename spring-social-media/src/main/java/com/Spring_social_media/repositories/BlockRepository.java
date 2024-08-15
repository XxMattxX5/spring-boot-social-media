package com.Spring_social_media.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Spring_social_media.models.Block;
import com.Spring_social_media.models.User;
import java.util.Optional;


public interface BlockRepository extends JpaRepository<Block, Integer> {
    Optional<Block> findByBlockingAndBlocked(User blocking, User blocked);
}
