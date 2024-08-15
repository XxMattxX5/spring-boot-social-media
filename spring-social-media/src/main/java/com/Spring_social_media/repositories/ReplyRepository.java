package com.Spring_social_media.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Spring_social_media.models.Comment;
import com.Spring_social_media.models.Reply;
import com.Spring_social_media.models.User;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {
    List<Reply> findRepliesByAuthor(User author);
    List<Reply> findRepliesByComment(Comment comment);
    
}
    

