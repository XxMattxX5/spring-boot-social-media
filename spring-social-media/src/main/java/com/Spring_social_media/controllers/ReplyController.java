package com.Spring_social_media.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Spring_social_media.services.CommentService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.ReplyService;
import com.Spring_social_media.services.UserService;
import com.Spring_social_media.dtos.NewReplyDto;
import com.Spring_social_media.models.Comment;
import com.Spring_social_media.models.User;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.servlet.http.HttpServletResponse;


@RequestMapping("/reply")
@RestController
public class ReplyController {
    private final JwtService jwtService;
    private final UserService userService;
    private final CommentService commentService;
    private final ReplyService replyService;
    

    public ReplyController(
        JwtService jwtService, 
        UserService userService, 
        CommentService commentService,
        ReplyService replyService
        ) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.commentService = commentService;
        this.replyService = replyService;
    }

    @PostMapping("/create/{id}")
    public void createReply(
        HttpServletResponse response, 
        @CookieValue String access_token,
        @PathVariable Integer id, 
        @RequestBody NewReplyDto replyContent
     ) {
        User user;
        Comment comment;

        if (replyContent.getContent().equals("")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content can't be empty");
        }
        
        try {
            String username = jwtService.extractUsername(access_token);
            user = userService.findUserByUsername(username);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }

        try {
            comment = commentService.getCommentById(id);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }

        replyService.createReply(user, comment, replyContent.getContent());
        response.setStatus(200);
        return;

    }
}
