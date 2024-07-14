package com.Spring_social_media.controllers;

import com.Spring_social_media.models.User;
import com.Spring_social_media.models.RefreshToken;
import com.Spring_social_media.dtos.LoginUserDto;
import com.Spring_social_media.dtos.RegisterUserDto;
import com.Spring_social_media.dtos.RefreshDto;
import com.Spring_social_media.exceptions.RefreshTokenExpiredException;
import com.Spring_social_media.exceptions.RefreshTokenNotFoundException;
import com.Spring_social_media.exceptions.RefreshTokenWrongDeviceException;
import com.Spring_social_media.responses.LoginResponse;
import com.Spring_social_media.services.AuthenticationService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.RefreshTokenService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    
    private final AuthenticationService authenticationService;

    private final RefreshTokenService refreshTokenService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, RefreshTokenService refreshTokenService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);
        
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(authenticatedUser, loginUserDto.getDeviceId());
       
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setRefreshToken(refreshToken.getToken());
        loginResponse.setRefreshExpiryDate(refreshToken.getExpiryDate());
        return ResponseEntity.ok(loginResponse);
    }
    @PostMapping("/refreshToken")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshDto refreshDto) {
        
        try {
            RefreshToken refreshToken = refreshTokenService.findByToken(refreshDto.getToken());
            refreshTokenService.verifyDevice(refreshToken, refreshDto.getDeviceId());
            refreshTokenService.verifyExpiration(refreshToken);

            User user = refreshToken.getUser();
            refreshToken = refreshTokenService.createRefreshToken(user, refreshDto.getDeviceId());
            String jwtToken = jwtService.generateToken(user);

            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(jwtToken);
            loginResponse.setExpiresIn(jwtService.getExpirationTime());
            loginResponse.setRefreshToken(refreshToken.getToken());
            loginResponse.setRefreshExpiryDate(refreshToken.getExpiryDate());

            return ResponseEntity.ok(loginResponse);

        } catch (RefreshTokenNotFoundException e) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        } catch (RefreshTokenExpiredException e) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        } catch (RefreshTokenWrongDeviceException e) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        }

    
    
    }
    

}
