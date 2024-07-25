package com.Spring_social_media.controllers;

import com.Spring_social_media.models.User;
import com.Spring_social_media.models.RefreshToken;
import com.Spring_social_media.dtos.LoginUserDto;
import com.Spring_social_media.dtos.RegisterUserDto;


import com.Spring_social_media.exceptions.RefreshTokenExpiredException;
import com.Spring_social_media.exceptions.RefreshTokenNotFoundException;
import com.Spring_social_media.exceptions.RefreshTokenWrongDeviceException;
import com.Spring_social_media.services.AuthenticationService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.RefreshTokenService;
import com.Spring_social_media.responses.RefreshResponse;
import com.Spring_social_media.responses.LoginResponse;
import com.Spring_social_media.responses.RegisterResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;






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

    // Creates a new account
    @PostMapping("/signup")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterUserDto registerUserDto) {
        
        RegisterResponse regResponse = authenticationService.signupValidation(registerUserDto);

        if (regResponse.isValid()) {
            authenticationService.signup(registerUserDto);
            return ResponseEntity.ok(regResponse);
        } else {
            return ResponseEntity.badRequest().body(regResponse);
        }
        
    }

    // Logins in user if username and password are correct
    @PostMapping("/login")
    public @ResponseBody ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto, HttpServletResponse response) {

        User authenticatedUser;
        LoginResponse loginResponse = new LoginResponse();
        try {
            authenticatedUser = authenticationService.authenticate(loginUserDto);
        } catch (Exception e) {
            response.setStatus(400);
            loginResponse.setMessage("Username or password is incorrect");
            return ResponseEntity.badRequest().body(loginResponse);
        }

        // Generates access token and refresh token
        String jwtToken = jwtService.generateToken(authenticatedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(authenticatedUser, loginUserDto.getDeviceId());

        // Sets tokens to cookies
        authenticationService.setCredentials(response, jwtToken, refreshToken, loginUserDto.getDeviceId());

        loginResponse.setMessage("Login Successful!");

        return ResponseEntity.ok(loginResponse);
    }


    // Logs user out by delete credential cookies
    @DeleteMapping("/logout")
    public String logoutUser(HttpServletResponse response) {

        response = authenticationService.clearCredentials(response);
        return "Logout Successful";

    }
    
    // Checks if token is still valid
    @PostMapping("/checkAuth")
    public void checkAuth(HttpServletResponse response, @CookieValue String access_token) {
        
        if (authenticationService.checkToken(access_token)) {
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
        }
        
        return;
    }
    
    // Refreshes access and refresh token if the refresh token is valid
    @PostMapping("/refresh")
    public void refreshToken(HttpServletResponse response, @CookieValue String refresh_token, @CookieValue String deviceId){
        // Thread.sleep(5000);
        
        try {
            // Verifies that refresh_token is valid
            RefreshToken refreshToken = refreshTokenService.findByTokenAndDeviceId(refresh_token, deviceId);
            refreshTokenService.verifyExpiration(refreshToken);
           
            // Creates a new refresh and access token
            User user = refreshToken.getUser();
            refreshToken = refreshTokenService.createRefreshToken(user, deviceId);
            String jwtToken = jwtService.generateToken(user);

            // Returns new token values
            // RefreshResponse refreshResponse = new RefreshResponse();
            // refreshResponse.setRefreshToken(refreshToken.getToken());
            // refreshResponse.setExpiresIn(jwtService.getExpirationTime());
            // refreshResponse.setRefreshExpiryDate(refreshToken.getExpiryDate());
            // refreshResponse.setToken(jwtToken);
            // refreshResponse.setUsername(user.getUsername());
            // refreshResponse.setProfilePicture(user.getProfilePicture());

            authenticationService.setCredentials(response, jwtToken, refreshToken, deviceId);
            response.setStatus(200);
            return;
            // return ResponseEntity.ok(refreshResponse);
            
        } catch (RefreshTokenNotFoundException e) {
            authenticationService.clearCredentials(response);
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        } catch (RefreshTokenExpiredException e) {
            authenticationService.clearCredentials(response);
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        } catch (RefreshTokenWrongDeviceException e) {
            authenticationService.clearCredentials(response);
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        }
    }
}
