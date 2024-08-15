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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PostService {
    private final PostRepository postRepository;    
    private final UserRepository userRepository; 
    private final JwtService jwtService;
    private final HtmlSanitizer htmlSanitizer;
    private final FollowService followService;
    
    public PostService(PostRepository postRepository, UserRepository userRepository, JwtService jwtService, HtmlSanitizer htmlSanitizer, FollowService followService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.htmlSanitizer = htmlSanitizer;
        this.followService = followService;
    }

    public void CreatePost(User user,String content) {
        String sanitizedContent = htmlSanitizer.sanitize(content);

        Post newPost = new Post();
        newPost.setAuthor(user);
        newPost.setContent(sanitizedContent);

        postRepository.save(newPost);
        return;
    }

    public Page<PostProjection> getFollowedPostList(User user,Integer page, String search, String searchType, String sort) {
    
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;

        if (page < 1) {
            page = 1;
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
       
        List<User> userList = followService.getFollowedUserList(user);
        userList.add(user);

        // Create Pageable object with sort
        Pageable pageable = PageRequest.of(page-1, 3, Sort.by(direction, sortField));

        if (searchType.equals("user")) {
            return postRepository.searchFollowedPostUser(searchInput, userList,pageable);
        } else { 
            return postRepository.searchFollowedPostContent(searchInput, userList, pageable);
        }
        
        
    }
    public Page<PostProjection> getAllPost(Integer page, String search, String searchType, String sort) {
       
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;
        
        if (page < 1) {
            page = 1;
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
        Pageable pageable = PageRequest.of(page - 1, 1, Sort.by(direction, sortField));

        if (searchType.equals("user")) {
            return postRepository.searchAllPostUsers(searchInput, pageable);
        } else { 
            return postRepository.searchAllPostContent(searchInput, pageable);
        }
        
    }

    public Page<PostProjection> getPopular(Integer page) {

       if (page < 1) {
        page = 1;
       }
        
        Sort.Direction direction = Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, 25, Sort.by(direction, "likeCount"));

        Page<PostProjection> list = postRepository.findAllProjectedBy(pageable);
        return list;
 
    }

    public Page<PostProjection> getMyPost(User user,Integer page) {

        if (page < 1) {
            page = 1;
           }

        Sort.Direction direction = Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, 20, Sort.by(direction, "createdAt"));

        Page<PostProjection> list = postRepository.findByAuthor(user,pageable);
        return list;

    }


    public Post getPostById(Integer id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException(("Post not found")));
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
