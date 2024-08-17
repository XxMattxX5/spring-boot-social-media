package com.Spring_social_media.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PathVariable;

import jakarta.servlet.http.HttpServletResponse;

import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Post;
import com.Spring_social_media.responses.PostInfoResponse;
import com.Spring_social_media.responses.PostListResponse;
import com.Spring_social_media.services.FollowService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.LikeService;
import com.Spring_social_media.services.PostService;
import com.Spring_social_media.services.UserService;
import com.Spring_social_media.dtos.CreatePostDto;
import com.Spring_social_media.projections.PostProjection;

import org.springframework.data.domain.Page;

@RequestMapping("/post")
@RestController
public class PostController {
    private final PostService postService;
    private final JwtService jwtService;
    private final LikeService likeService;
    private final FollowService followService;
    private final UserService userService;

    public PostController(
    PostService postService,
    JwtService jwtService, 
    LikeService likeService, 
    FollowService followService,
    UserService userService
    ) {
        this.postService = postService;
        this.jwtService = jwtService;
        this.likeService = likeService;
        this.followService = followService;
        this.userService = userService;
    }

    // Creates a new post
    @PostMapping(path="/create")
    public void createPost(@RequestBody CreatePostDto postContent,HttpServletResponse response, @CookieValue String access_token) {
        User user;

        // Makes sure post content isn't empty
        if (postContent.getContent().equals("")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content can't be empty");
        }
        
        // Gets user
        try {
            String username = jwtService.extractUsername(access_token);
            user = userService.findUserByUsername(username);
        } catch(Exception e ) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }

        // Creates new post
        try {
            postService.CreatePost(user, postContent.getContent());
            response.setStatus(200);
            return;
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

    }
   
    // Gets a list of all post
    @GetMapping(path="/all")
    public @ResponseBody ResponseEntity<PostListResponse> getAllPost(HttpServletResponse response, @RequestParam(defaultValue = "1" , required = false) Integer page, @RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) String sort) {
        
        // Gets list of posts
        Page<PostProjection> posts = postService.getAllPost(page,search, type, sort);

        // Puts list of posts into postListResponse
        PostListResponse postList = new PostListResponse();
        postList.setPostList(posts.getContent());
        postList.setPageCount(posts.getTotalPages());

        return ResponseEntity.ok(postList);
    }

    // Gets list of popular posts
    @GetMapping(path="/popular")
    public ResponseEntity<PostListResponse> getTrending(HttpServletResponse response, @RequestParam(defaultValue = "1" , required = false) Integer page  ) {
        
        // Gets list of popular posts
        Page<PostProjection> postList = postService.getPopular(page);

        // Puts list of popular posts into response
        PostListResponse postResponse = new PostListResponse();
        postResponse.setPostList(postList.getContent());
        postResponse.setPageCount(postList.getTotalPages());

        return ResponseEntity.ok(postResponse);
    }
    
    // Gets list of post of user's followed and themselves
    @GetMapping(path="/followed")
    public @ResponseBody ResponseEntity<PostListResponse> getFollowedPost(HttpServletResponse response, @CookieValue String access_token, @RequestParam(defaultValue = "1", required = false) Integer page, @RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) String sort) {
        User user;
        
        // Gets user
        try {
            String username = jwtService.extractUsername(access_token);
            user = userService.findUserByUsername(username);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, null, e);
        }

        // Gets list of followed posts
        Page<PostProjection> posts = postService.getFollowedPostList(user, page, search, type, sort);

        // Puts followed posts into response
        PostListResponse postList = new PostListResponse();
        postList.setPostList(posts.getContent());
        postList.setPageCount(posts.getTotalPages());

        return ResponseEntity.ok(postList);
    }

    // Gets extra info for a post
    @GetMapping(path="post_info/{id}")
    public ResponseEntity<PostInfoResponse> postInfo(HttpServletResponse response, @PathVariable(name="id") Integer id, @CookieValue(required = false) String access_token) {
        boolean liked;
        boolean followed;
        User user;
        
        // Checks if user is signed in so like and follow status can be retrieved
        try {
            if (access_token != null) {
                String username = jwtService.extractUsername(access_token);
                user = userService.findUserByUsername(username);
            } else {
                user = null;
            }
            Post post = postService.getPostById(id);

            if (access_token != null && user != null && !user.equals(post.getAuthor())) {
                liked = likeService.isLiked(user, post);
                followed = followService.isFollowed(user, post.getAuthor());
            } else {
                liked = false;
                followed = false;
            }

            // Puts post info into response
            PostInfoResponse postInfo = new PostInfoResponse();
            postInfo.setLike(liked);
            postInfo.setFollowed(followed);

            return ResponseEntity.ok(postInfo);

        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, null, e);
        }
    }
    
    // Gets list of user's posts
    @GetMapping(path="/me")
    public ResponseEntity<PostListResponse> getMyPost(HttpServletResponse response, @CookieValue String access_token, @RequestParam(defaultValue = "1", required = false) Integer page) {
        User user;

        // Gets user
        try {
            String username = jwtService.extractUsername(access_token);
            user = userService.findUserByUsername(username);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }

        // Gets list of posts
        Page<PostProjection> posts = postService.getMyPost(user,page);

        // Puts list of posts into response
        PostListResponse postResponse = new PostListResponse();
        postResponse.setPostList(posts.getContent());
        postResponse.setPageCount(posts.getTotalPages());

        return ResponseEntity.ok(postResponse);
    }
    
}

