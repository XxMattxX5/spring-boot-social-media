package com.Spring_social_media.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletResponse;

import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Post;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.responses.PostListResponse;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.PostService;
import com.Spring_social_media.dtos.CreatePostDto;
import com.Spring_social_media.projections.PostProjection;

import org.springframework.data.domain.Page;
import java.util.List;

@RequestMapping("/post")
@RestController
public class PostController {
    private final PostService postService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public PostController(PostService postService, UserRepository userRepository, JwtService jwtService) {
        this.postService = postService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    
    
   
    @PostMapping(path="/create")
    public void createPost(@RequestBody(required = false) CreatePostDto postContent,HttpServletResponse response, @CookieValue String access_token) {
        System.out.println(postContent.getContent());
        if (postContent.getContent().equals("")) {
            response.setStatus(400);
            return;
        }
        
        User user;
        try {
            user = userRepository.findByUsername(jwtService.extractUsername(access_token)).orElseThrow(() -> new RuntimeException("User not found"));
        } catch(Exception e ) {
            response.setStatus(401);
            return;
        }

        try {
            postService.CreatePost(user, postContent.getContent());
            response.setStatus(200);
            return;
        } catch(Exception e) {
            response.setStatus(400);
            return;
        }

    }
   

    @GetMapping(path="/all")
    public @ResponseBody ResponseEntity<PostListResponse> getAllPost(HttpServletResponse response, @RequestParam(required = false) String page, @RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) String sort) {
    
        Page<PostProjection> posts = postService.getAllPost(page,search, type, sort);

        PostListResponse postList = new PostListResponse();
        postList.setPostList(posts.getContent());
        postList.setPageCount(posts.getTotalPages());
        return ResponseEntity.ok(postList);
    }

    @GetMapping(path="/popular")
    public ResponseEntity<PostListResponse> getTrending(HttpServletResponse response, @RequestParam(required = false, defaultValue = "1") String page  ) {
        
        Page<PostProjection> postList = postService.getPopular(page);
        PostListResponse postResponse = new PostListResponse();
        postResponse.setPostList(postList.getContent());
        postResponse.setPageCount(postList.getTotalPages());
        return ResponseEntity.ok(postResponse);
    }
    

    @GetMapping(path="/followed")
    public @ResponseBody ResponseEntity<PostListResponse> getFollowedPost(HttpServletResponse response, @CookieValue String access_token, @RequestParam(required = false) String page, @RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) String sort) {
        User user;
        
        try {
            String username = jwtService.extractUsername(access_token);
            user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, null, e);
        }

        Page<PostProjection> posts = postService.getFollowedPostList(user, page, search, type, sort);

        PostListResponse postList = new PostListResponse();
        postList.setPostList(posts.getContent());
        postList.setPageCount(posts.getTotalPages());
        return ResponseEntity.ok(postList);
    }
    
    
}

