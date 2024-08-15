package com.Spring_social_media.projections;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import java.util.List;

public interface CommentWithRepliesProjection {

    Integer getId();
    
    @Value("#{target.author.username}")
    String getUsername();

    @Value("#{target.author.profilePicture}")
    String getProfilePicture();

    String getContent();

    List<ReplyProjection> getReplies(); 

    Date getCreatedAt();


}
