package com.Spring_social_media.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Spring_social_media.repositories.RefreshTokenRepository;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.exceptions.RefreshTokenExpiredException;
import com.Spring_social_media.exceptions.RefreshTokenNotFoundException;
import com.Spring_social_media.exceptions.RefreshTokenWrongDeviceException;
import com.Spring_social_media.models.RefreshToken;
import com.Spring_social_media.models.User;
import java.time.Instant;

@Service
public class RefreshTokenService {

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @Autowired
    UserRepository userRepository;

    public RefreshToken createRefreshToken(User user, String deviceId) {
        try {
            RefreshToken refreshToken = findByDeviceId(deviceId);
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(Instant.now().plusMillis(600000));
            return refreshTokenRepository.save(refreshToken);

        } catch(Exception e) {

            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setUser(userRepository.findByUsername(user.getUsername()).orElseThrow(() -> new RuntimeException("User not found")));
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(Instant.now().plusMillis(600000));
            refreshToken.setDeviceId(deviceId);
            return refreshTokenRepository.save(refreshToken);
        }
    }

    public RefreshToken findByToken(String token){
        return refreshTokenRepository.findByToken(token).orElseThrow(() -> new RefreshTokenNotFoundException(token +"Token not found"));
    }

    public RefreshToken findByUser(User user) {
        return refreshTokenRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Token not found for user"));
    }

    public RefreshToken findByDeviceId(String deviceId) {
        return refreshTokenRepository.findByDeviceId(deviceId).orElseThrow(() -> new RuntimeException("Token not found for deviceId"));
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now())<0){
            refreshTokenRepository.delete(token);
            throw new RefreshTokenExpiredException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

    public void verifyDevice(RefreshToken token, String deviceId) {
        if (!token.getDeviceId().equals(deviceId)) {
            throw new RefreshTokenWrongDeviceException(token.getDeviceId() + " "+ deviceId + " Device Id does not match device id on token");
        }
    }

}
