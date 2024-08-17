package com.Spring_social_media.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Spring_social_media.services.BlockService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import jakarta.servlet.http.HttpServletResponse;

import com.Spring_social_media.models.User;


@RequestMapping("block")
@RestController
public class BlockController {
    private final BlockService blockService;
    private final UserService userService;
    private final JwtService jwtService;

    public BlockController(BlockService blockService, UserService userService, JwtService jwtService) {
        this.blockService = blockService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Blocks user given an id
    @PostMapping("/{id}")
    public void blockUser(HttpServletResponse response, @PathVariable Integer id, @CookieValue String access_token) {
        User blocking;
        User blocked;    

        try {
            String username = jwtService.extractUsername(access_token);
            blocking = userService.findUserByUsername(username);
            blocked = userService.findUserById(id);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        // Blocks user
        blockService.blockUser(blocking, blocked);
        
        response.setStatus(200);
        return;

        
    }
    
    
}
