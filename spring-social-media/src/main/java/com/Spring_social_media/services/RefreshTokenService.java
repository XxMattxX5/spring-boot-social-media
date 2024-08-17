package com.Spring_social_media.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Spring_social_media.repositories.RefreshTokenRepository;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.exceptions.RefreshTokenExpiredException;
import com.Spring_social_media.exceptions.RefreshTokenNotFoundException;
import com.Spring_social_media.models.RefreshToken;
import com.Spring_social_media.models.User;
import java.time.Instant;

@Service
public class RefreshTokenService {

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @Autowired
    UserRepository userRepository;

    // Creates a new refresh token or update an existing one
    public RefreshToken createRefreshToken(User user, String deviceId) {
        String expires = System.getenv("REFRESH_EXPIRES");
        int refreshExpires = Integer.parseInt(expires);
        try {
            RefreshToken refreshToken = findByUserAndDeviceId(user, deviceId);
            String newToken = UUID.randomUUID().toString();

            // Generates a unique refresh token
            while (true) {
                if (!refreshTokenRepository.findByTokenAndDeviceId(newToken, deviceId).isPresent()) {
                    break;
                } else {
                    newToken = UUID.randomUUID().toString();
                }
            }
            refreshToken.setToken(newToken);
            refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpires));
            
            return refreshTokenRepository.save(refreshToken);

        } catch(Exception e) {
            RefreshToken refreshToken = new RefreshToken();
            String newToken = UUID.randomUUID().toString();

            // Generates a unique refresh token
            while (true) {
                if (!refreshTokenRepository.findByTokenAndDeviceId(newToken, deviceId).isPresent()) {
                    break;
                } else {
                    newToken = UUID.randomUUID().toString();
                }
            }

            refreshToken.setUser(userRepository.findByUsername(user.getUsername()).orElseThrow(() -> new RuntimeException("User not found")));
            refreshToken.setToken(newToken);
            refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpires));
            refreshToken.setDeviceId(deviceId);
            
            return refreshTokenRepository.save(refreshToken);
        }
    }

    // Finds a refresh token given a token string
    public RefreshToken findByToken(String token){
        return refreshTokenRepository.findByToken(token).orElseThrow(() -> new RefreshTokenNotFoundException(token +"Token not found"));
    }

    // Gets a refresh token given a device Id
    public RefreshToken findByDeviceId(String deviceId) {
        return refreshTokenRepository.findByDeviceId(deviceId).orElseThrow(() -> new RefreshTokenNotFoundException("Token not found"));
    }

    // Gets a refresh token given a token string and device id
    public RefreshToken findByTokenAndDeviceId(String token, String deviceId) {
        return refreshTokenRepository.findByTokenAndDeviceId(token, deviceId).orElseThrow(() -> new RefreshTokenNotFoundException("Token: " + token + " or " + "Device: " + deviceId + " Not Found"));
    }

    // Gets a refresh token given a user and device id
    public RefreshToken findByUserAndDeviceId(User user, String deviceId) {
        return refreshTokenRepository.findByUserAndDeviceId(user, deviceId).orElseThrow(() -> new RefreshTokenNotFoundException("User: " + user.getUsername() + " or " + "Device: " + deviceId + " Not Found"));
    }

    // Checks if refresh token is expired
    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now())<0){
            refreshTokenRepository.delete(token);
            throw new RefreshTokenExpiredException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

}
