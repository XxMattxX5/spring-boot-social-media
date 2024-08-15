package com.Spring_social_media.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Spring_social_media.models.Comment;
import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Post;
import com.Spring_social_media.projections.CommentWithRepliesProjection;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findCommentsByAuthor(User author);
    List<Comment> findCommentsByPost(Post post);
    Optional<Comment> findCommentById(Integer id);

    Page<CommentWithRepliesProjection> findCommentsWithRepliesByAuthor(User author, Pageable pageable);
    Page<CommentWithRepliesProjection> findCommentsWithRepliesByPost(Post post, Pageable pageable);

}
