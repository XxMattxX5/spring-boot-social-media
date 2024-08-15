package com.Spring_social_media.projections;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

public interface FollowersProjection {
    
    @Value("#{target.following.id}")
    Integer getUserId();

    @Value("#{target.following.username}")
    String getFollowUsername();

    @Value("#{target.following.profilePicture}")
    String getFollowProfilePicture();
    
    Date getCreatedAt();
    
}
