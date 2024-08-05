package com.Spring_social_media.repositories;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import org.springframework.data.repository.query.Param;

import com.Spring_social_media.models.Post;
import com.Spring_social_media.models.User;
import com.Spring_social_media.projections.PostProjection;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    @Query("SELECT p FROM Post p Where " 
    + "(:search IS NULL OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%'))) ")
    List<PostProjection> searchFollowedPostContent(@Param("search") String search, Pageable sort);

    @Query("SELECT p FROM Post p Where " 
    + "(:search IS NULL OR LOWER(p.author.username) LIKE LOWER(CONCAT('%', :search, '%'))) ")
    List<PostProjection> searchFollowedPostUser(@Param("search") String search, Pageable sort);
    
    List<PostProjection> findByAuthorOrderByCreatedAtAsc(User author);
    List<PostProjection> findByAuthorOrderByCreatedAtDesc(User author);
    Optional<Post> OrderByCreatedAtAsc();
    Optional<Post> findById(Integer id);


}