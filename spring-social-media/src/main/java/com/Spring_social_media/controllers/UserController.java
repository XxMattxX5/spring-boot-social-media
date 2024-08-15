package com.Spring_social_media.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import com.Spring_social_media.models.Settings;
import com.Spring_social_media.classes.UserInfo;
import com.Spring_social_media.classes.SettingsInfo;
import com.Spring_social_media.responses.FollowersResponse;
import com.Spring_social_media.responses.FollowingResponse;
import com.Spring_social_media.responses.PostListResponse;
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
import com.Spring_social_media.services.PostService;
import com.Spring_social_media.services.AuthenticationService;
import com.Spring_social_media.services.FollowService;
import com.Spring_social_media.services.RefreshTokenService;
import com.Spring_social_media.projections.FollowersProjection;
import com.Spring_social_media.projections.FollowingProjection;
import com.Spring_social_media.projections.PostProjection;

import org.springframework.data.domain.Page;

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
  private final FollowService followService;
  private final PostService postService;
  

  public UserController(
    UserService userService, 
    UserRepository userRepository, 
    JwtService jwtService, 
    AuthenticationService authenticationService, 
    RefreshTokenService refreshTokenService, 
    SettingsRepository settingsRepository,
    FollowService followService,
    PostService postService
    ) {
    this.userService = userService;
    this.userRepository = userRepository;
    this.settingsRepository = settingsRepository;
    this.jwtService = jwtService;
    this.authenticationService = authenticationService;
    this.refreshTokenService = refreshTokenService;
    this.followService = followService;
    this.postService = postService;
  }

  @PostMapping(path="/add")
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
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No Profile Picture found");
    }

    try {
      userService.updateProfilePicture(profile_picture, access_token);
      response.setStatus(200);
      return;

    } catch(Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
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
      settingInfo.setAllowFollows(user.getSettings().getAllowFollows());
      settingInfo.setProfileVisibility(user.getSettings().getProfileVisibility());
      settingInfo.setColorTheme(user.getSettings().getColorTheme());
      
      userInfoResponse.setUserInfo(userInfo);
      userInfoResponse.setSettingsInfo(settingInfo);

      response.setStatus(200);
      return userInfoResponse;

    } catch(Exception e) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
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
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }
    
    UpdateInfoResponse updateInfoResponse = userService.updateUserInfo(user, updateInfoDto.getName(), updateInfoDto.getUsername());
    if(!updateInfoResponse.isValid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Input not valid");
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
      throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, e.getMessage());
    }
    
  }
  @PatchMapping(path="/update_settings")
  public void updateSettings(HttpServletResponse response, @RequestBody UpdateSettingsDto updateSettingsDto, @CookieValue String username) {
    
    
    try {
      User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
      Settings settings = user.getSettings();
      if (updateSettingsDto.getAllowFollows().equals("yes") || updateSettingsDto.getAllowFollows().equals("no")) {
        
        settings.setAllowFollows(updateSettingsDto.getAllowFollows());
      }
      if (
          updateSettingsDto.getProfileVisibility().equals("everyone")
          || updateSettingsDto.getProfileVisibility().equals("followers")
          || updateSettingsDto.getProfileVisibility().equals("no one")
       ) {
        
        settings.setProfileVisibility(updateSettingsDto.getProfileVisibility());
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
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
      
    }
  }

  @GetMapping("/get_followers/{id}")
  public ResponseEntity<FollowersResponse> getFollowers(
    @CookieValue(required = false) String access_token, 
    @CookieValue(required = false) String isLogged, 
    @PathVariable Integer id, 
    @RequestParam(defaultValue = "1") Integer page,
    @RequestParam(defaultValue = "") String search
    ) {
    User user;
    User viewer;
    try {
      user = userService.findUserById(id);
      
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }
    
    if (user.getSettings().getProfileVisibility().equals("no one")) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
    } else if (user.getSettings().getProfileVisibility().equals("followers")) {
        if (access_token == null && isLogged != null) {
          throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Expired");
        } else if (access_token == null && isLogged == null) {
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
        } else {
          try {
            String username = jwtService.extractUsername(access_token);
            viewer = userService.findUserByUsername(username);
          } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
          }
          if (!followService.isFollowed(viewer, user) && !user.equals(viewer)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
          }
      }
    } 
    
    Page<FollowersProjection> followers = followService.getFollowers(user, page,search);
    FollowersResponse followerResponse = new FollowersResponse();
    followerResponse.setFollowList(followers.getContent());    
    followerResponse.setFollowCount(followers.getTotalElements());
    followerResponse.setFollowPageCount(followers.getTotalPages());

    return ResponseEntity.ok(followerResponse);
  }

  @GetMapping("/get_following/{id}")
  public ResponseEntity<FollowingResponse> getFollowing(
    @CookieValue(required = false) String access_token, 
    @CookieValue(required = false) String isLogged, 
    @PathVariable Integer id, 
    @RequestParam(defaultValue = "1") Integer page,
    @RequestParam(defaultValue = "") String search
    ) {
      User user;
      User viewer;
      try {
        user = userService.findUserById(id);
        
      } catch (Exception e) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
      }
      
      if (user.getSettings().getProfileVisibility().equals("no one")) {
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
      } else if (user.getSettings().getProfileVisibility().equals("followers")) {
          if (access_token == null && isLogged != null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Expired");
          } else if (access_token == null && isLogged == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
          } else {
            try {
              String username = jwtService.extractUsername(access_token);
              viewer = userService.findUserByUsername(username);
            } catch (Exception e) {
              throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
            }
            if (!followService.isFollowed(viewer, user) && !user.equals(viewer)) {
              throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
            }
        }
      } 
      Page<FollowingProjection> following = followService.getFollowing(user, page,search);
      FollowingResponse followingResponse = new FollowingResponse();
      followingResponse.setFollowList(following.getContent());    
      followingResponse.setFollowCount(following.getTotalElements());
      followingResponse.setFollowPageCount(following.getTotalPages());
  
      return ResponseEntity.ok(followingResponse);
  }
  @GetMapping("/get_posts/{id}")
  public ResponseEntity<PostListResponse> getPosts(
  @CookieValue(required = false) String access_token, 
  @CookieValue(required = false) String isLogged, 
  @PathVariable Integer id, 
  @RequestParam(defaultValue = "1") Integer page
  ) {
    User user;
    User viewer;
    try {
      user = userService.findUserById(id);
      
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }
    
    if (user.getSettings().getProfileVisibility().equals("no one")) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
    } else if (user.getSettings().getProfileVisibility().equals("followers")) {
        if (access_token == null && isLogged != null) {
          throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Expired");
        } else if (access_token == null && isLogged == null) {
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
        } else {
          try {
            String username = jwtService.extractUsername(access_token);
            viewer = userService.findUserByUsername(username);
          } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
          }
          if (!followService.isFollowed(viewer, user) && !user.equals(viewer)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
          }
      }
    }

    Page<PostProjection> posts = postService.getMyPost(user, page);
    PostListResponse postList = new PostListResponse();
    postList.setPostList(posts.getContent());
    postList.setPageCount(posts.getTotalPages());
    return ResponseEntity.ok(postList);

  }
  


}