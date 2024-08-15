package com.Spring_social_media.repositories;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;


import org.springframework.data.repository.query.Param;

import com.Spring_social_media.models.Post;
import com.Spring_social_media.models.User;
import com.Spring_social_media.projections.PostProjection;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
   
    @Query("SELECT p FROM Post p Where " 
    + "(:search IS NULL OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%'))) ")
    Page<PostProjection> searchAllPostContent(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Post p Where " 
    + "(:search IS NULL OR LOWER(p.author.username) LIKE LOWER(CONCAT('%', :search, '%'))) ")
    Page<PostProjection> searchAllPostUsers(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE "
    + "(:search IS NULL OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%'))) "
    + "AND p.author IN :users")
    Page<PostProjection> searchFollowedPostContent(@Param("search") String search,
                                           @Param("users") List<User> users,
                                           Pageable pageable);

    @Query("SELECT p FROM Post p WHERE "
    + "(:search IS NULL OR LOWER(p.author.username) LIKE LOWER(CONCAT('%', :search, '%'))) "
    + "AND p.author IN :users")
    Page<PostProjection> searchFollowedPostUser(@Param("search") String search,
                                           @Param("users") List<User> users,
                                           Pageable pageable);


    Page<PostProjection> findAllProjectedBy(Pageable pageable);

    Optional<Post> findById(Integer id);
    Page<PostProjection> findByAuthor(User user, Pageable pageable);

    @Query("SELECT p.author FROM Post p")
    Page<User> findPopularPostUsersAll(Pageable pageable);


}