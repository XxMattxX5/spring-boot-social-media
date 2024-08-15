package com.Spring_social_media.projections;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

public interface FollowingProjection {
    
    @Value("#{target.followed.id}")
    Integer getUserId();

    @Value("#{target.followed.username}")
    String getFollowUsername();

    @Value("#{target.followed.profilePicture}")
    String getFollowProfilePicture();

    Date getCreatedAt();
}
