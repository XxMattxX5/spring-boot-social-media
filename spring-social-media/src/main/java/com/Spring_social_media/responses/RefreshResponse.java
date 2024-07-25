package com.Spring_social_media.responses;

import java.time.Instant;

public class RefreshResponse {

    private String token;

    private long expiresIn;

    private String refreshToken;

    private Instant refreshExpiryDate;
    
    private String username;

    private String profile_picture;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Instant getRefreshExpiryDate() {
        return refreshExpiryDate;
    }

    public void setRefreshExpiryDate(Instant refreshExpiryDate) {
        this.refreshExpiryDate = refreshExpiryDate;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getUsername() {
        return username;
    }
    public void setProfilePicture(String pic) {
        this.profile_picture = pic;
    }
    public String getProfilePicture() {
        return profile_picture;
    }
}
