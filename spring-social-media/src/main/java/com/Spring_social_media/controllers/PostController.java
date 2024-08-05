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
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.PostService;
import com.Spring_social_media.dtos.CreatePostDto;
import com.Spring_social_media.projections.PostProjection;


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

    @GetMapping(path="/followed")
    public @ResponseBody List<PostProjection> getFollowedPost(HttpServletResponse response, @CookieValue String access_token, @RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) String sort) {
        User user;
        
        try {
            String username = jwtService.extractUsername(access_token);
            user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, null, e);
        }

        return postService.getFollowedPostList(user, search, type, sort);
    }
    
    
}

