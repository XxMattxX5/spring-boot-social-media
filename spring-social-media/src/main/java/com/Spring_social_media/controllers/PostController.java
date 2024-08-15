package com.Spring_social_media.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
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
import org.springframework.web.bind.annotation.PathVariable;


import jakarta.servlet.http.HttpServletResponse;

import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Post;
import com.Spring_social_media.repositories.PostRepository;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.responses.PostInfoResponse;
import com.Spring_social_media.responses.PostListResponse;
import com.Spring_social_media.services.CommentService;
import com.Spring_social_media.services.FollowService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.LikeService;
import com.Spring_social_media.services.PostService;
import com.Spring_social_media.dtos.CreatePostDto;
import com.Spring_social_media.projections.PostProjection;

import org.springframework.data.domain.Page;
import java.util.List;

@RequestMapping("/post")
@RestController
public class PostController {
    private final PostService postService;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final LikeService likeService;
    private final FollowService followService;
    private final CommentService commentService;

    public PostController(
    PostService postService,
    PostRepository postRepository, 
    UserRepository userRepository, 
    JwtService jwtService, 
    LikeService likeService, 
    FollowService followService,
    CommentService commentService
    ) {
        this.postService = postService;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.likeService = likeService;
        this.followService = followService;
        this.commentService = commentService;

    }

    
    
   
    @PostMapping(path="/create")
    public void createPost(@RequestBody CreatePostDto postContent,HttpServletResponse response, @CookieValue String access_token) {
        
        if (postContent.getContent().equals("")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content can't be empty");
            // response.setStatus(400);
            // return;
        }
        
        User user;
        try {
            user = userRepository.findByUsername(jwtService.extractUsername(access_token)).orElseThrow(() -> new RuntimeException("User not found"));
        } catch(Exception e ) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
            // response.setStatus(401);
            // return;
        }

        try {
            postService.CreatePost(user, postContent.getContent());
            response.setStatus(200);
            return;
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
            // response.setStatus(400);
            // return;
        }

    }
   

    @GetMapping(path="/all")
    public @ResponseBody ResponseEntity<PostListResponse> getAllPost(HttpServletResponse response, @RequestParam(defaultValue = "1" , required = false) Integer page, @RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) String sort) {
    
        Page<PostProjection> posts = postService.getAllPost(page,search, type, sort);

        PostListResponse postList = new PostListResponse();
        postList.setPostList(posts.getContent());
        postList.setPageCount(posts.getTotalPages());
        return ResponseEntity.ok(postList);
    }

    @GetMapping(path="/popular")
    public ResponseEntity<PostListResponse> getTrending(HttpServletResponse response, @RequestParam(defaultValue = "1" , required = false) Integer page  ) {
        
        Page<PostProjection> postList = postService.getPopular(page);
        PostListResponse postResponse = new PostListResponse();
        postResponse.setPostList(postList.getContent());
        postResponse.setPageCount(postList.getTotalPages());
        return ResponseEntity.ok(postResponse);
    }
    

    @GetMapping(path="/followed")
    public @ResponseBody ResponseEntity<PostListResponse> getFollowedPost(HttpServletResponse response, @CookieValue String access_token, @RequestParam(defaultValue = "1", required = false) Integer page, @RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) String sort) {
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

    @GetMapping(path="post_info/{id}")
    public ResponseEntity<PostInfoResponse> postInfo(HttpServletResponse response, @PathVariable(name="id") Integer id, @CookieValue(required = false) String access_token) {
        boolean liked;
        boolean followed;
        User user;
        
        try {
            if (access_token != null) {
                String username = jwtService.extractUsername(access_token);
                user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException(("User not found")));
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

            // Page<CommentWithRepliesProjection> comments = commentService.getCommentsWithReplies(post, id)


            PostInfoResponse postInfo = new PostInfoResponse();
            postInfo.setLike(liked);
            postInfo.setFollowed(followed);

            return ResponseEntity.ok(postInfo);

        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, null, e);
        }
    }
    
    @GetMapping(path="/me")
    public ResponseEntity<PostListResponse> getMyPost(HttpServletResponse response, @CookieValue String access_token, @RequestParam(defaultValue = "1", required = false) Integer page) {
        User user;
        try {
            String username = jwtService.extractUsername(access_token);
            user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }

        Page<PostProjection> posts = postService.getMyPost(user,page);
        PostListResponse postResponse = new PostListResponse();
        postResponse.setPostList(posts.getContent());
        postResponse.setPageCount(posts.getTotalPages());

        return ResponseEntity.ok(postResponse);



    }
    
}

