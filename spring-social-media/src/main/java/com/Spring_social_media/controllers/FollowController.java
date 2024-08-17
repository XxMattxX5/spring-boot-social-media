package com.Spring_social_media.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletResponse;


import org.springframework.data.domain.Page;

import com.Spring_social_media.projections.FollowersProjection;
import com.Spring_social_media.projections.FollowingProjection;
import com.Spring_social_media.models.User;
import com.Spring_social_media.dtos.FollowRecommendationDto;
import com.Spring_social_media.responses.FollowingResponse;
import com.Spring_social_media.responses.FollowersResponse;
import com.Spring_social_media.services.FollowService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.UserService;

import java.util.List;

@RequestMapping("/follow")
@RestController
public class FollowController {

    private final FollowService followService;
    private final JwtService jwtService;
    private final UserService userService;

    public FollowController(FollowService followService, JwtService jwtService, UserService userService) {
        this.followService = followService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    // Return list of user's the user is following
    @GetMapping(path="/following")
    public ResponseEntity<FollowingResponse> getFollowing(HttpServletResponse response, @CookieValue String access_token, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "") String search) {
        User user;
        
        // Gets user
        try {
            String username = jwtService.extractUsername(access_token);
            user = userService.findUserByUsername(username);
        } catch(Exception e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
        // Gets list of following
        Page<FollowingProjection> following = followService.getFollowing(user, page, search);

        // Puts following list into following response object
        FollowingResponse followResponse = new FollowingResponse();
        followResponse.setFollowList(following.getContent());
        followResponse.setFollowPageCount(following.getTotalPages());
        followResponse.setFollowCount(following.getTotalElements());

        return ResponseEntity.ok(followResponse);
    }

    // Gets list of user's that are following user
    @GetMapping(path="/followers")
    public ResponseEntity<FollowersResponse> getFollowers(HttpServletResponse response, @CookieValue String access_token, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "") String search) {
        User user;

        // Gets user
        try {
            String username = jwtService.extractUsername(access_token);
            user = userService.findUserByUsername(username);
        } catch(Exception e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
        
        // Gets list of followers
        Page<FollowersProjection> followers = followService.getFollowers(user, page, search);

        // Puts list of followers into followers response object
        FollowersResponse followersResponse = new FollowersResponse();
        followersResponse.setFollowList(followers.getContent());
        followersResponse.setFollowPageCount(followers.getTotalPages());
        followersResponse.setFollowCount(followers.getTotalElements());
        
        return ResponseEntity.ok(followersResponse);


    }

    // Follows or unfollows user given id
    @PostMapping(path="/{id}")
    public void follow(HttpServletResponse response, @PathVariable(name="id") Integer id, @CookieValue String access_token) {
        User following;
        User followed;
        
        // Gets request user
        try {
            String username = jwtService.extractUsername(access_token);
            following = userService.findUserByUsername(username);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
        
        // Gets user to be followed
        try {  
            followed = userService.findUserById(id);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
        
        // Makes sure the user isn't trying to follow themselves
        if (following.equals(followed)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can't follow yourself");
        }
    
        try {
            followService.follow(following, followed);
            response.setStatus(200);
            return;
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    // Gets a list of follow recommendations from popular posts
    @GetMapping("/recommendations")
    public @ResponseBody ResponseEntity<List<FollowRecommendationDto>> getFollowRecommendations(@CookieValue(required = false) String access_token, @CookieValue(required = false) String isLogged) {
        boolean signedIn = false;
        User user = null;

        // Checks if user is logged before getting popular posts to exclude themselves and those they follow
        if (access_token != null) {
            try {
                String username = jwtService.extractUsername(access_token);
                user = userService.findUserByUsername(username);
                signedIn = true;
            } catch(Exception e) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
            }
        } else if (isLogged != null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Expired");
        }

        return ResponseEntity.ok(followService.getFollowRecommendations(signedIn, user));
        
    }
    
    
    
}
