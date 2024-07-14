package com.Spring_social_media.responses;

import java.time.Instant;

public class LoginResponse {
    private String token;

    private long expiresIn;

    private String refreshToken;

    private Instant refreshExpiryDate;

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
}
