package com.Spring_social_media.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import com.Spring_social_media.models.Settings;
import com.Spring_social_media.classes.UserInfo;
import com.Spring_social_media.classes.SettingsInfo;
import com.Spring_social_media.responses.UpdateInfoResponse;
import com.Spring_social_media.dtos.UpdateInfoDto;
import com.Spring_social_media.dtos.UpdateSettingsDto;
import com.Spring_social_media.responses.UserInfoResponse;
import com.Spring_social_media.models.RefreshToken;
import com.Spring_social_media.models.User;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.repositories.SettingsRepository;
import com.Spring_social_media.services.UserService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.AuthenticationService;
import com.Spring_social_media.services.RefreshTokenService;

import java.util.Map;


@Controller 
@RequestMapping(path="/user") 
public class UserController {
      
  private final UserRepository userRepository;
  private final SettingsRepository settingsRepository;
  private final UserService userService;
  private final JwtService jwtService;
  private final AuthenticationService authenticationService;
  private final RefreshTokenService refreshTokenService;
  

  public UserController(UserService userService, UserRepository userRepository, JwtService jwtService, AuthenticationService authenticationService, RefreshTokenService refreshTokenService, SettingsRepository settingsRepository) {
    this.userService = userService;
    this.userRepository = userRepository;
    this.settingsRepository = settingsRepository;
    this.jwtService = jwtService;
    this.authenticationService = authenticationService;
    this.refreshTokenService =refreshTokenService;
  }

  @PostMapping(path="/add") // Map ONLY POST Requests
  public @ResponseBody String addNewUser (@RequestParam String name
      , @RequestParam String email, @RequestParam String username, @RequestParam String password) {
    

    User n = new User();

    n.setName(name);
    n.setEmail(email);
    n.setUsername(username);
    n.setPassword(password);
    userRepository.save(n);

    return "User Created Successfully";
  }

  @GetMapping(path="/all")
  public @ResponseBody Iterable<User> getAllUsers() {
    return userRepository.findAll();
  }

  @PatchMapping(path="/profile_picture")
  public void UpdateProfilePicture(HttpServletResponse response, @RequestBody Map<String, String> body, @CookieValue String access_token) {
    String profile_picture = body.get("profile_picture");

    if (profile_picture == null) {
      response.setStatus(400);
      return;
    }

    try {
      userService.updateProfilePicture(profile_picture, access_token);
     
      response.setStatus(200);
      return;

    } catch(Exception e) {
      response.setStatus(400);
      return;
    }
  }

  @GetMapping(path="/info")
  public @ResponseBody UserInfoResponse getUserInfo(HttpServletResponse response,@CookieValue String access_token, @CookieValue String username) {
    UserInfoResponse userInfoResponse = new UserInfoResponse();
    try {
      User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
      if (!jwtService.isTokenValid(access_token, user)) {
        throw new RuntimeException("Token not valid");
      }

      UserInfo userInfo = new UserInfo();
      userInfo.setName(user.getName());
      userInfo.setUsername(user.getUsername());
      userInfo.setEmail(user.getEmail());
      userInfo.setProfilePicture(user.getProfilePicture());
      SettingsInfo settingInfo = new SettingsInfo();
      settingInfo.setPostVisibility(user.getSettings().getPostVisibility());
      settingInfo.setNameVisibility(user.getSettings().getNameVisibility());
      settingInfo.setProfileVisibility(user.getSettings().getProfileVisibility());
      settingInfo.setColorTheme(user.getSettings().getColorTheme());
      
      userInfoResponse.setUserInfo(userInfo);
      userInfoResponse.setSettingsInfo(settingInfo);

      response.setStatus(200);
      return userInfoResponse;

    } catch(Exception e) {
      response.setStatus(401);

      return userInfoResponse;
    }

  }
  
  @PatchMapping(path="/update_info")
  public @ResponseBody UpdateInfoResponse updateInfo(HttpServletResponse response, @RequestBody UpdateInfoDto updateInfoDto, @CookieValue String username, @CookieValue String deviceId) {
    User user;
    
    try {
      user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
      if (updateInfoDto.getName() == null || updateInfoDto.getUsername() == null) {
        throw new RuntimeException("Input Empty");
      }
    } catch(Exception e) {
      response.setStatus(404);
      UpdateInfoResponse updateInfoResponse = new UpdateInfoResponse();
      return updateInfoResponse;
    }
    
    UpdateInfoResponse updateInfoResponse = userService.updateUserInfo(user, updateInfoDto.getName(), updateInfoDto.getUsername());
    if(!updateInfoResponse.isValid()) {
      response.setStatus(400);
    } else {
      String expires = System.getenv("REFRESH_EXPIRES");
      int refreshExpires = Integer.parseInt(expires);
      
      Cookie access_token = new Cookie("access_token", "");
      access_token.setPath("/");
      access_token.setMaxAge(0);

      Cookie newUsername = new Cookie("username", updateInfoDto.getUsername());
      newUsername.setPath("/");
      newUsername.setMaxAge(refreshExpires / 1000);

      response.addCookie(access_token);
      response.addCookie(newUsername);
      response.setStatus(200);
    }

    return updateInfoResponse;
  }
  

  @DeleteMapping(path="/delete")
  public void deleteAccount(HttpServletResponse response, @CookieValue String access_token, @CookieValue String username) {
    
    try {
      User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
      if (!jwtService.isTokenValid(access_token, user)) {
        throw new RuntimeException("Token not valid");
      }
      userRepository.delete(user);
      authenticationService.clearCredentials(response);
      response.setStatus(200);
      return;
    } catch(Exception e) {
      response.setStatus(400);
      return;
    }
    
  }
  @PatchMapping(path="/update_settings")
  public void updateSettings(HttpServletResponse response, @RequestBody UpdateSettingsDto updateSettingsDto, @CookieValue String username) {
    
    
    try {
      User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
      Settings settings = user.getSettings();
      if (updateSettingsDto.getPostVisibility().equals("everyone") || updateSettingsDto.getPostVisibility().equals("followers")) {
        
        settings.setPostVisibility(updateSettingsDto.getPostVisibility());
      }
      if (updateSettingsDto.getNameVisibility().equals("everyone") || updateSettingsDto.getNameVisibility().equals("followers")) {
        
        settings.setNameVisibility(updateSettingsDto.getNameVisibility());
      }
      
      if (updateSettingsDto.getColorTheme().equals("light") || updateSettingsDto.getColorTheme().equals("dark")) {
        
        settings.setColorTheme(updateSettingsDto.getColorTheme());
      }

      String expires = System.getenv("REFRESH_EXPIRES");
      int refreshExpires = Integer.parseInt(expires);

      Cookie theme = new Cookie("theme", settings.getColorTheme());
      theme.setPath("/");
      theme.setMaxAge(refreshExpires / 1000);

      response.addCookie(theme);

      settingsRepository.save(settings);
      response.setStatus(200);
      return;
    } catch(Exception e) {
      response.setStatus(400);
      return;
    }
  }
}