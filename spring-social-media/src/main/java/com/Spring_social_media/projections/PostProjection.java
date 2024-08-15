package com.Spring_social_media.projections;
import org.springframework.beans.factory.annotation.Value;
import java.util.Date;

public interface PostProjection {

    Integer getId();
    String getContent();

    Integer getLikeCount();

    Date getCreatedAt();
    
    @Value("#{target.author.id}")
    Integer getUserId();

    @Value("#{target.author.username}")
    String getUsername();

    @Value("#{target.author.profilePicture}")
    String getProfilePicture();

}
