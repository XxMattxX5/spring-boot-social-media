package com.Spring_social_media.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Spring_social_media.services.CommentService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.PostService;
import com.Spring_social_media.services.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletResponse;

import com.Spring_social_media.models.Post;
import com.Spring_social_media.models.User; 
import com.Spring_social_media.dtos.NewCommentDto; 
import org.springframework.data.domain.Page;
import com.Spring_social_media.projections.CommentWithRepliesProjection;
import com.Spring_social_media.responses.CommentResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/comment")
@RestController
public class CommentController {

    private final CommentService commentService;
    private final PostService postService;
    private final UserService userService;
    private final JwtService jwtService;

    public CommentController(
        PostService postService, 
        CommentService commentService, 
        UserService userService,
        JwtService jwtService
    ) {
        this.postService = postService;
        this.commentService = commentService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Gets comments for a post given an id
    @GetMapping("/comments/{id}")
    public ResponseEntity<CommentResponse> getPostComments(HttpServletResponse response, @PathVariable Integer id, @RequestParam(defaultValue = "1") Integer page) {
        Post post;

        try {
            post = postService.getPostById(id);
        } catch(Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        // Gets comments
        Page<CommentWithRepliesProjection> comments = commentService.getCommentsWithReplies(post, page);

        // Puts comments and comment info into response
        CommentResponse commentResponse = new CommentResponse();
        commentResponse.setCommentList(comments.getContent());
        commentResponse.setCommentPages(comments.getTotalPages());

        return ResponseEntity.ok(commentResponse);
    }

    // Creates a new comment giving a post id
    @PostMapping("/create/{id}")
    public void createComment(HttpServletResponse response, @CookieValue String access_token, @PathVariable Integer id, @RequestBody NewCommentDto commentContent) {
        User user;
        Post post;

        // Makes sure comment content isn't empty
        if (commentContent.getContent().equals("")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content can't be empty");
        }
        
        // Finds user
        try {
            String username = jwtService.extractUsername(access_token);
            user = userService.findUserByUsername(username);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }

        // Finds post
        try {
            post = postService.getPostById(id);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }

        // Creates comment
        commentService.createComment(user, post, commentContent.getContent());
        
        response.setStatus(200);
        return;
    
        
    }
    
    
    
}
