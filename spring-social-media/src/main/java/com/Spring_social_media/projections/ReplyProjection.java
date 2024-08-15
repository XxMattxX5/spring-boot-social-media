package com.Spring_social_media.projections;

import com.Spring_social_media.models.User;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

public interface ReplyProjection {

    Integer getId();

    @Value("#{target.author.username}")
    String getUsername();

    @Value("#{target.author.profilePicture}")
    String getProfilePicture();

    String getContent();

    Date getCreatedAt();


    
}
