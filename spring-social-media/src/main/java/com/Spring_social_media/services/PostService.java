package com.Spring_social_media.services;

import org.springframework.data.domain.PageRequest;
import com.Spring_social_media.repositories.PostRepository;
import com.Spring_social_media.util.HtmlSanitizer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

import com.Spring_social_media.models.Post;
import com.Spring_social_media.models.User;
import com.Spring_social_media.projections.PostProjection;

import java.util.List;


@Service
public class PostService {
    private final PostRepository postRepository;    
    private final HtmlSanitizer htmlSanitizer;
    private final FollowService followService;
    
    public PostService(PostRepository postRepository, HtmlSanitizer htmlSanitizer, FollowService followService) {
        this.postRepository = postRepository;
        this.htmlSanitizer = htmlSanitizer;
        this.followService = followService;
    }

    // Create a new post
    public void CreatePost(User user,String content) {
        String sanitizedContent = htmlSanitizer.sanitize(content);

        Post newPost = new Post();
        newPost.setAuthor(user);
        newPost.setContent(sanitizedContent);

        postRepository.save(newPost);
        return;
    }

    // get a list of post where user is following author
    public Page<PostProjection> getFollowedPostList(User user,Integer page, String search, String searchType, String sort) {
    
        
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;

        // Makes sure page number is not 0 or below
        if (page < 1) {
            page = 1;
        }

        Sort.Direction direction = Sort.Direction.DESC;

        // Validate and set sort field
        String sortField = "createdAt";
        
        // Sets sortfield and direction
        if ("createdAtAsc".equalsIgnoreCase(sort)) {
            direction = Sort.Direction.ASC;
            sortField = "createdAt";
        } else if ("createdAtDesc".equalsIgnoreCase(sort)) {
            sortField = "createdAt";
        } else if ("username".equalsIgnoreCase(sort)) {
            sortField = "author.username";
        }
       
        List<User> userList = followService.getFollowedUserList(user);
        userList.add(user);

        // Create Pageable object with sort
        Pageable pageable = PageRequest.of(page-1, 3, Sort.by(direction, sortField));

        // Gets field to be searched
        if (searchType.equals("user")) {
            return postRepository.searchFollowedPostUser(searchInput, userList,pageable);
        } else { 
            return postRepository.searchFollowedPostContent(searchInput, userList, pageable);
        }
        
        
    }

    // Gets all posts
    public Page<PostProjection> getAllPost(Integer page, String search, String searchType, String sort) {
       
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;
        
        // Makes sure page number is not 0 or below
        if (page < 1) {
            page = 1;
        }

        Sort.Direction direction = Sort.Direction.DESC;
        
        // Validate and set sort field
        String sortField = "createdAt";
        
        // Sets sortfield and direction
        if ("createdAtAsc".equalsIgnoreCase(sort)) {
            direction = Sort.Direction.ASC;
            sortField = "createdAt";
        } else if ("createdAtDesc".equalsIgnoreCase(sort)) {
            sortField = "createdAt";
        } else if ("username".equalsIgnoreCase(sort)) {
            sortField = "author.username";
        }
       
        // Create Pageable object with sort
        Pageable pageable = PageRequest.of(page - 1, 1, Sort.by(direction, sortField));

        // Gets field to be searched
        if (searchType.equals("user")) {
            return postRepository.searchAllPostUsers(searchInput, pageable);
        } else { 
            return postRepository.searchAllPostContent(searchInput, pageable);
        }
        
    }

    // Gets popular post list
    public Page<PostProjection> getPopular(Integer page) {

        // Makes sure page number isn't 0 or below
        if (page < 1) {
        page = 1;
        }
        
        Sort.Direction direction = Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, 25, Sort.by(direction, "likeCount"));

        Page<PostProjection> list = postRepository.findAllProjectedBy(pageable);
        return list;
 
    }

    // Gets user's posts
    public Page<PostProjection> getMyPost(User user,Integer page) {

        // Makes sure page number isn't 0 or below
        if (page < 1) {
            page = 1;
           }

        Sort.Direction direction = Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, 20, Sort.by(direction, "createdAt"));

        Page<PostProjection> list = postRepository.findByAuthor(user,pageable);
        return list;

    }

    // Gets a post given id
    public Post getPostById(Integer id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException(("Post not found")));
    }

    // Adds a like to a post
    public void addLike(Post post) {
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }

    // Removes a like from a post
    public void removeLike(Post post) {
        post.setLikeCount((post.getLikeCount() + -1) > 0 ? post.getLikeCount() + -1 : 0);
        postRepository.save(post);
    }


    

}
