package com.Spring_social_media.services;

import org.springframework.stereotype.Service;

import com.Spring_social_media.repositories.CommentRepository;
import com.Spring_social_media.util.HtmlSanitizer;
import com.Spring_social_media.projections.CommentWithRepliesProjection;
import com.Spring_social_media.models.Post;
import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Comment;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final HtmlSanitizer htmlSanitizer;

    public CommentService(CommentRepository commentRepository, HtmlSanitizer htmlSanitizer) {
        this.commentRepository = commentRepository;
        this.htmlSanitizer = htmlSanitizer;
    }

    // Creates a new comment
    public void createComment(User user, Post post, String content) {
        String sanitizedContent = htmlSanitizer.sanitize(content);

        Comment newComment = new Comment();
        newComment.setAuthor(user);
        newComment.setPost(post);
        newComment.setContent(sanitizedContent);

        commentRepository.save(newComment);
    }

    // Gets a list of comments and their replies
    public Page<CommentWithRepliesProjection> getCommentsWithReplies(Post post, Integer page) {

        // Makes sure page number isn't below zero
        if (page < 1) {
            page = 1;
        }

        Sort.Direction direction = Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(direction, "createdAt"));

        return commentRepository.findCommentsWithRepliesByPost(post, pageable);
    }

    // Gets a comment given id
    public Comment getCommentById(Integer id) {
        return commentRepository.findById(id).orElseThrow(() -> new RuntimeException("Comment not found"));
    }
    
}
