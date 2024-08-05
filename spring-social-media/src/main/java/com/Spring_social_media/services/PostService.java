package com.Spring_social_media.services;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import com.Spring_social_media.repositories.PostRepository;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.util.HtmlSanitizer;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

import com.Spring_social_media.models.Post;
import com.Spring_social_media.models.User;
import com.Spring_social_media.projections.PostProjection;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;    
    private final UserRepository userRepository; 
    private final JwtService jwtService;
    private final HtmlSanitizer htmlSanitizer;
    
    public PostService(PostRepository postRepository, UserRepository userRepository, JwtService jwtService, HtmlSanitizer htmlSanitizer) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.htmlSanitizer = htmlSanitizer;
    }

    public void CreatePost(User user,String content) {
        String sanitizedContent = htmlSanitizer.sanitize(content);

        Post newPost = new Post();
        newPost.setAuthor(user);
        newPost.setContent(sanitizedContent);

        postRepository.save(newPost);
        return;
    }

    public List<PostProjection> getFollowedPostList(User user, String search, String type, String sort) {
        
        
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;

        Sort.Direction direction = Sort.Direction.DESC;

        // Validate and set sort field
        String sortField = "createdAt";
        
        if ("createdAtAsc".equalsIgnoreCase(sort)) {
            direction = Sort.Direction.ASC;
            sortField = "createdAt";
        } else if ("createdAtDesc".equalsIgnoreCase(sort)) {
            sortField = "createdAt";
        } else if ("username".equalsIgnoreCase(sort)) {
            sortField = "author.username";
        }
       
        // Create Pageable object with sort
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by(direction, sortField));

        if (type.equals("user")) {
            return postRepository.searchFollowedPostUser(searchInput, pageable);
        } else { 
            return postRepository.searchFollowedPostContent(searchInput, pageable);
        }
        
        
    }

    public void addLike(Post post) {
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }
    public void removeLike(Post post) {
        post.setLikeCount((post.getLikeCount() + -1) > 0 ? post.getLikeCount() + -1 : 0);
        postRepository.save(post);
    }

    

}
