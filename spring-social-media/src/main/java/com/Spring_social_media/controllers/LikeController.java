package com.Spring_social_media.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.LikeService;

import jakarta.servlet.http.HttpServletResponse;
import com.Spring_social_media.responses.CheckLikeResponse;


import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Post;
import com.Spring_social_media.repositories.PostRepository;
import com.Spring_social_media.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RequestMapping("/like")
@RestController
public class LikeController {

    private final LikeService likeService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final JwtService jwtService;

    public LikeController(LikeService likeService, UserRepository userRepository, JwtService jwtService, PostRepository postRepository) {
        this.likeService = likeService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.postRepository = postRepository;
    }

    @PostMapping(path="/{id}")
    public void likePost(HttpServletResponse response,@PathVariable(value="id") Integer id, @CookieValue String access_token) {
        try {
            String username = jwtService.extractUsername(access_token);
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException(("User not found")));
            Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException(("Post not found")));
            
            if (user.equals(post.getAuthor())) {
                response.setStatus(406);
                return;
            }
            
            likeService.createLike(user, post);
            response.setStatus(200);
            return;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, null, e);

        }
    }
    
    @GetMapping(path="/isLiked/{id}")
    public ResponseEntity<CheckLikeResponse> checkForLike(HttpServletResponse response, @CookieValue String access_token, @PathVariable(name = "id") Integer id) throws IOException {
        try {
        String username = jwtService.extractUsername(access_token);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException(("User not found")));
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException(("Post not found")));
        CheckLikeResponse checkResponse = new CheckLikeResponse();
        if (likeService.isLiked(user, post)) {
            checkResponse.setLike(true);
        } else {
            checkResponse.setLike(false);
        }
        return ResponseEntity.ok(checkResponse);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, null, e);
        }
        
    }
    
    
    
}
