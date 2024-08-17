package com.Spring_social_media.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Spring_social_media.models.Follow;
import com.Spring_social_media.models.User;
import com.Spring_social_media.projections.FollowersProjection;
import com.Spring_social_media.projections.FollowingProjection;

import java.util.List;
import java.util.Optional;


public interface FollowRepository extends JpaRepository<Follow, Integer> {
    
    @Query("SELECT f FROM Follow f WHERE "
        + "(:followedId IS NULL OR f.followed.id = :followedId) AND "
        + "(:search IS NULL OR LOWER(f.following.username) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<FollowersProjection> findByFollowedAndSearch(@Param("followedId") Integer followedId,
                                                       @Param("search") String search,
                                                       Pageable pageable);
                                                       
    @Query("SELECT f FROM Follow f WHERE "
    + "(:followingId IS NULL OR f.following.id = :followingId) AND "
    + "(:search IS NULL OR LOWER(f.followed.username) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<FollowingProjection> findByFollowingAndSearch(@Param("followingId") Integer followedId,
                                            @Param("search") String search, 
                                            Pageable pageable);

    Optional<Follow> findByFollowingAndFollowed(User following, User followed);

    @Query("SELECT f.followed FROM Follow f Where f.following.id = :userId") 
    List<User> findFollowedUsersByUserId(@Param("userId") Integer userId);

    @Query("SELECT f.followed FROM Follow f WHERE f.following = :user")
    List<User> findUsersBeingFollowedBy(@Param("user") User users);
}
