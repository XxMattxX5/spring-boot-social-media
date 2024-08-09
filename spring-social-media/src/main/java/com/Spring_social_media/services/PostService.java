package com.Spring_social_media.services;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import com.Spring_social_media.repositories.PostRepository;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.util.HtmlSanitizer;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
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

    public Page<PostProjection> getFollowedPostList(User user,String page, String search, String searchType, String sort) {
    
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;

        Integer pageNum;
        try {
            Integer num = Integer.parseInt(page);
            pageNum = num;
        } catch(Exception e) {
            pageNum = 1;
        }

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
        Pageable pageable = PageRequest.of(pageNum-1, 3, Sort.by(direction, sortField));

        if (searchType.equals("user")) {
            return postRepository.searchFollowedPostUser(searchInput, pageable);
        } else { 
            return postRepository.searchFollowedPostContent(searchInput, pageable);
        }
        
        
    }
    public Page<PostProjection> getAllPost(String page, String search, String searchType, String sort) {
       
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;
        Integer pageNum;
        try {
            Integer num = Integer.parseInt(page);
            pageNum = num;
        } catch(Exception e) {
            pageNum = 1;
        }

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
        Pageable pageable = PageRequest.of(pageNum - 1, 1, Sort.by(direction, sortField));

        if (searchType.equals("user")) {
            return postRepository.searchAllPostUsers(searchInput, pageable);
        } else { 
            return postRepository.searchAllPostContent(searchInput, pageable);
        }
        
    }

    public Page<PostProjection> getPopular(String page) {

        Integer pageNum;
        try {
            Integer num = Integer.parseInt(page);
            pageNum = num;
        } catch(Exception e) {
            pageNum = 1;
        }
        
        Sort.Direction direction = Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(pageNum - 1, 20, Sort.by(direction, "likeCount"));

        Page<PostProjection> list = postRepository.findAllProjectedBy(pageable);
        return list;
 
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
