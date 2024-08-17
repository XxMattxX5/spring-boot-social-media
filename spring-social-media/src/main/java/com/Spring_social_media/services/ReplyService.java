package com.Spring_social_media.services;

import org.springframework.stereotype.Service;

import com.Spring_social_media.repositories.ReplyRepository;
import com.Spring_social_media.util.HtmlSanitizer;
import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Comment;
import com.Spring_social_media.models.Reply;

@Service
public class ReplyService {
    
    private final ReplyRepository replyRepository;
    private final HtmlSanitizer htmlSanitizer;

    public ReplyService(ReplyRepository replyRepository, HtmlSanitizer htmlSanitizer) {
        this.replyRepository = replyRepository;
        this.htmlSanitizer = htmlSanitizer;
    }

    // Create a new reply
    public void createReply(User user, Comment comment, String content) {
        String sanitizedContent = htmlSanitizer.sanitize(content);

        Reply newReply = new Reply();
        newReply.setAuthor(user);
        newReply.setComment(comment);
        newReply.setContent(sanitizedContent);

        replyRepository.save(newReply);
    }

}
