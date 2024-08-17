package com.Spring_social_media.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.LikeService;
import com.Spring_social_media.services.PostService;
import com.Spring_social_media.services.UserService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Post;

@RequestMapping("/like")
@RestController
public class LikeController {

    private final LikeService likeService;
    private final UserService userService;
    private final PostService postService;
    private final JwtService jwtService;

    public LikeController(LikeService likeService, UserService userService, JwtService jwtService, PostService postService) {
        this.likeService = likeService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.postService = postService;
    }

    // Likes a post or unlikes it given an id
    @PostMapping(path="/{id}")
    public void likePost(HttpServletResponse response,@PathVariable(value="id") Integer id, @CookieValue String access_token) {
        try {
            String username = jwtService.extractUsername(access_token);
            User user = userService.findUserByUsername(username);
            Post post = postService.getPostById(id);
            
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
    
    
}
