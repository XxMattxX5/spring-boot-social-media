package com.Spring_social_media.services;

import com.Spring_social_media.services.JwtService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import com.Spring_social_media.models.Settings;
import com.Spring_social_media.repositories.SettingsRepository;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.responses.RegisterResponse;
import com.Spring_social_media.dtos.RegisterUserDto;
import com.Spring_social_media.dtos.CheckAuthDto;
import com.Spring_social_media.dtos.LoginUserDto;
import com.Spring_social_media.models.RefreshToken;
import com.Spring_social_media.models.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;
import java.time.Instant;
import java.util.regex.Matcher;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    
    private final PasswordEncoder passwordEncoder;
    
    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final SettingsRepository settingsRepository;

    public AuthenticationService(
        UserRepository userRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        SettingsRepository settingsRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.settingsRepository = settingsRepository;
    }

    public User signup(RegisterUserDto input) {
        User user = new User();
    
        user.setUsername(input.getUsername().toLowerCase());
        user.setName(input.getName());
        user.setEmail(input.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        User savedUser = userRepository.save(user);
        Settings settings = new Settings();
        settings.setUser(savedUser);
        settingsRepository.save(settings);

        return savedUser;
    }

    public RegisterResponse signupValidation(RegisterUserDto input) {
        RegisterResponse regResponse = new RegisterResponse();
       
        // Makes sure the Name input is valid
        if (input.getName().length() < 3) {
            regResponse.setError1("Name must be 3 characters or greater");
        } else if (input.getName().length() > 60) {
            regResponse.setError1("Name cannot be greater then 60 characters");
        } 

        // Makes sure the username input is valid
        if (input.getUsername().length() < 3) {
            regResponse.setError2("Username must be 3 characters or greater");
        } else if (input.getUsername().length() > 40) {
            regResponse.setError2("Name cannot be greater then 40 characters");
        } else if (userRepository.findByUsername(input.getUsername().toLowerCase()).isPresent()) {
            regResponse.setError2("Username is already in use");
        }

        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        Matcher emailMatcher= emailPattern.matcher(input.getEmail());

        // Makes sure the email input is valid
        if (!emailMatcher.matches()) {
            regResponse.setError3("Email not valid");
        } else if (userRepository.findByEmail(input.getEmail().toLowerCase()).isPresent()) {
            regResponse.setError3("An account using this email already exists");
        }

        Pattern passwordPattern = Pattern.compile("^(?=.*[A-Z])(?=.*[\\d\\W]).+$");
        Matcher matcher = passwordPattern.matcher(input.getPassword());

        // Makes sure the password input is valid
        if (input.getPassword().length() < 8) {
            regResponse.setError4("Password must be 8 characters or greater");
        } else if (!matcher.matches()) {
            regResponse.setError4("Password must have at least 1 capital letter and at least 1 number or special character");
        }

        return regResponse;
    }

    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getUsername().toLowerCase(),
                        input.getPassword()
                )
        );

        return userRepository.findByUsername(input.getUsername().toLowerCase())
                .orElseThrow();
    }

    public boolean checkToken(String input) {
        try {
            String username = jwtService.extractUsername(input);
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            return jwtService.isTokenValid(input, user);
        }
        catch(Exception e) {
            return false;
        }
    }

    // Sets crediental cookies in response
    public HttpServletResponse setCredentials(HttpServletResponse response, String jwtToken, RefreshToken refreshToken, String deviceId) {

        // Sets access token cookie
        Cookie accessCookie = new Cookie("access_token",  jwtToken);
        accessCookie.setMaxAge((int) jwtService.getExpirationTime() / 1000);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");

        Long currentEpochSeconds = Instant.now().getEpochSecond();

        // Sets refresh token cookie
        Cookie refreshCookie = new Cookie("refresh_token", refreshToken.getToken());
        refreshCookie.setMaxAge((int) (refreshToken.getExpiryDate().getEpochSecond() - currentEpochSeconds));
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/auth/refresh");

        // Sets username cookie
        Cookie username = new Cookie("username", refreshToken.getUser().getUsername());
        username.setMaxAge((int) (refreshToken.getExpiryDate().getEpochSecond() - currentEpochSeconds));
        username.setHttpOnly(false);
        username.setSecure(true);
        username.setPath("/");

        // Sets deviceId cookie
        Cookie deviceID = new Cookie("deviceId", deviceId);
        deviceID.setMaxAge((int) (refreshToken.getExpiryDate().getEpochSecond() - currentEpochSeconds));
        deviceID.setHttpOnly(true);
        deviceID.setSecure(true);
        deviceID.setPath("/");

        Cookie isLogged = new Cookie("isLogged", "true");
        isLogged.setPath("/");
        isLogged.setMaxAge((int) (refreshToken.getExpiryDate().getEpochSecond() - currentEpochSeconds));

        Cookie theme = new Cookie("theme", refreshToken.getUser().getSettings().getColorTheme());
        theme.setPath("/");
        theme.setMaxAge((int) (refreshToken.getExpiryDate().getEpochSecond() - currentEpochSeconds));

        // Adds all the cookies to the response
        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
        response.addCookie(username);
        response.addCookie(deviceID);
        response.addCookie(isLogged);
        response.addCookie(theme);

        return response;
    }

    // Clears all credientials from cookies
    public HttpServletResponse clearCredentials(HttpServletResponse response) {

        // Clears the access_token cookie
        Cookie accessCookie = new Cookie("access_token", "");
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        
        // Clears the refresh_token cookie
        Cookie refreshCookie = new Cookie("refresh_token", "");
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/auth/refresh");

        // Clears the username cookie
        Cookie username = new Cookie("username", "");
        username.setMaxAge(0);
        username.setPath("/");

        // Clears the deviceId cookie
        Cookie deviceID = new Cookie("deviceId", "");
        deviceID.setMaxAge(0);
        deviceID.setPath("/");

        Cookie isLogged = new Cookie("isLogged", "");
        isLogged.setMaxAge(0);
        isLogged.setPath("/");
        Cookie theme = new Cookie("theme", "");
        theme.setMaxAge(0);
        theme.setPath("/");
        
        // Adds the cleared cookies to the response
        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
        response.addCookie(username);
        response.addCookie(deviceID);
        response.addCookie(isLogged);
        response.addCookie(theme);

        return response;
    }
}
