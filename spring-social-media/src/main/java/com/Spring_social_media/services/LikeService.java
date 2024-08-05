package com.Spring_social_media.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.Spring_social_media.repositories.LikeRepository;
import com.Spring_social_media.services.PostService;

import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Post;
import com.Spring_social_media.models.Like;

@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostService postService;

    public LikeService(LikeRepository likeRepository, PostService postService) {
        this.likeRepository = likeRepository;
        this.postService = postService;
    }

    public void createLike(User user, Post post) {
        Optional<Like> oldLike = likeRepository.findByUser(user);

        if (oldLike.isPresent()) {
            likeRepository.delete(oldLike.get());
            postService.removeLike(post);
        } else {
            Like newLike = new Like();
            newLike.setPost(post);
            newLike.setUser(user);
            likeRepository.save(newLike);
            postService.addLike(post);
        }
        
    }

    public boolean isLiked(User user, Post post) {
        return post.isLikedByUser(user);
    }
}
