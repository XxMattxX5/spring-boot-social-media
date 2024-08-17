package com.Spring_social_media.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.Spring_social_media.models.User;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.repositories.SettingsRepository;
import com.Spring_social_media.services.UserService;
import com.Spring_social_media.services.JwtService;
import com.Spring_social_media.services.PostService;
import com.Spring_social_media.services.AuthenticationService;
import com.Spring_social_media.services.FollowService;
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
  private final FollowService followService;
  private final PostService postService;
  

  public UserController(
    UserService userService, 
    UserRepository userRepository, 
    JwtService jwtService, 
    AuthenticationService authenticationService, 
    SettingsRepository settingsRepository,
    FollowService followService,
    PostService postService
    ) {
    this.userService = userService;
    this.userRepository = userRepository;
    this.settingsRepository = settingsRepository;
    this.jwtService = jwtService;
    this.authenticationService = authenticationService;
    this.followService = followService;
    this.postService = postService;
  }


  // Updates user profile picture
  @PatchMapping(path="/profile_picture")
  public void UpdateProfilePicture(HttpServletResponse response, @RequestBody Map<String, String> body, @CookieValue String access_token) {
    String profile_picture = body.get("profile_picture");

    // Makes sure a profile picture was submited
    if (profile_picture == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No Profile Picture found");
    }

    // Updates profile pictures
    try {
      userService.updateProfilePicture(profile_picture, access_token);
      response.setStatus(200);
      return;

    } catch(Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
  }

  // Gets user info and settings
  @GetMapping(path="/info")
  public @ResponseBody UserInfoResponse getUserInfo(HttpServletResponse response,@CookieValue String access_token) {
    UserInfoResponse userInfoResponse = new UserInfoResponse();
    
    // Gets user and info
    try {
      String username = jwtService.extractUsername(access_token);
      User user = userService.findUserByUsername(username);
     
      // Sets user to userinfo class
      UserInfo userInfo = new UserInfo();
      userInfo.setName(user.getName());
      userInfo.setUsername(user.getUsername());
      userInfo.setEmail(user.getEmail());
      userInfo.setProfilePicture(user.getProfilePicture());

      // Sets settings info to settingsInfo class
      SettingsInfo settingInfo = new SettingsInfo();
      settingInfo.setAllowFollows(user.getSettings().getAllowFollows());
      settingInfo.setProfileVisibility(user.getSettings().getProfileVisibility());
      settingInfo.setColorTheme(user.getSettings().getColorTheme());
      
      // Sets userinfo and settingsinfo to userinforesponse
      userInfoResponse.setUserInfo(userInfo);
      userInfoResponse.setSettingsInfo(settingInfo);

      response.setStatus(200);
      return userInfoResponse;

    } catch(Exception e) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

  }
  
  // Updates user info
  @PatchMapping(path="/update_info")
  public @ResponseBody UpdateInfoResponse updateInfo(HttpServletResponse response, @RequestBody UpdateInfoDto updateInfoDto, @CookieValue String deviceId, @CookieValue String access_token) {
    User user;

    if (updateInfoDto.getName() == null || updateInfoDto.getUsername() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Input Empty");
    }
    
    // Gets User
    try {
      String username = jwtService.extractUsername(access_token);
      user = userService.findUserByUsername(username);
    } catch(Exception e) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
    }
    
    // Update user info
    UpdateInfoResponse updateInfoResponse = userService.updateUserInfo(user, updateInfoDto.getName(), updateInfoDto.getUsername());

    // Sets new cookies if input was valid
    if(!updateInfoResponse.isValid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Input not valid");
    } else {
      String expires = System.getenv("REFRESH_EXPIRES");
      int refreshExpires = Integer.parseInt(expires);
      
      Cookie access = new Cookie("access_token", "");
      access.setPath("/");
      access.setMaxAge(0);

      Cookie newUsername = new Cookie("username", updateInfoDto.getUsername());
      newUsername.setPath("/");
      newUsername.setMaxAge(refreshExpires / 1000);

      response.addCookie(access);
      response.addCookie(newUsername);
      response.setStatus(200);
    }

    return updateInfoResponse;
  }
  
  // Deletes user
  @DeleteMapping(path="/delete")
  public void deleteAccount(HttpServletResponse response, @CookieValue String access_token) {
    User user;
    
    // Gets user
    try {
      String username = jwtService.extractUsername(access_token);
      user = userService.findUserByUsername(username);
    } catch(Exception e) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    userRepository.delete(user);
    authenticationService.clearCredentials(response);
    response.setStatus(200);
    return;
    
  }

  // Updates user settings
  @PatchMapping(path="/update_settings")
  public void updateSettings(HttpServletResponse response, @RequestBody UpdateSettingsDto updateSettingsDto, @CookieValue String access_token) {
    User user;
    try {
      String username = jwtService.extractUsername(access_token);
      user = userService.findUserByUsername(username);
     
    } catch(Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    
    // Gets user settings
    Settings settings = user.getSettings();

    // Sets allow follow if input valid
    if (updateSettingsDto.getAllowFollows().equals("yes") || updateSettingsDto.getAllowFollows().equals("no")) {
      settings.setAllowFollows(updateSettingsDto.getAllowFollows());
    }

    // Sets profile visiblity if input is valid
    if (
        updateSettingsDto.getProfileVisibility().equals("everyone")
        || updateSettingsDto.getProfileVisibility().equals("followers")
        || updateSettingsDto.getProfileVisibility().equals("no one")
     ) {
      settings.setProfileVisibility(updateSettingsDto.getProfileVisibility());
    }
    
    // Sets color theme if input is valid
    if (updateSettingsDto.getColorTheme().equals("light") || updateSettingsDto.getColorTheme().equals("dark")) {
      settings.setColorTheme(updateSettingsDto.getColorTheme());
    }

    // Sets updated tokens
    String expires = System.getenv("REFRESH_EXPIRES");
    int refreshExpires = Integer.parseInt(expires);

    Cookie theme = new Cookie("theme", settings.getColorTheme());
    theme.setPath("/");
    theme.setMaxAge(refreshExpires / 1000);

    response.addCookie(theme);

    settingsRepository.save(settings);
    response.setStatus(200);
    return;
  }

  // Gets list of followers for url id if user is authorized
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
    // Gets user to be viewed
    try {
      user = userService.findUserById(id);
      
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }
    
    // Determes if user is authorized
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
    
    // Gets list of followers
    Page<FollowersProjection> followers = followService.getFollowers(user, page,search);

    // Puts list of followers into followers response
    FollowersResponse followerResponse = new FollowersResponse();
    followerResponse.setFollowList(followers.getContent());    
    followerResponse.setFollowCount(followers.getTotalElements());
    followerResponse.setFollowPageCount(followers.getTotalPages());

    return ResponseEntity.ok(followerResponse);
  }

  // Checks if user is authorized to view user with id in url
  @GetMapping("/viewProfile/{id}")
  public void getViewProfileAuth(
    HttpServletResponse response,
    @PathVariable Integer id, 
    @CookieValue(required = false) String access_token, 
    @CookieValue(required = false) String isLogged
  ) {
    User user;
    User viewer;
    
    // Gets user to be viewed
      try {
        user = userService.findUserById(id);
        
      } catch (Exception e) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
      }
      
      // Determines if user is authorized to view the profile
      if (user.getSettings().getProfileVisibility().equals("no one")) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to access this information");
      } else if (user.getSettings().getProfileVisibility().equals("followers")) {
        if (access_token == null && isLogged != null) {

          System.out.println(access_token);
          System.out.println(isLogged);
          System.out.println("HERE");
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
  
    response.setStatus(200);
    return;
  }

  // Gets following for user with id in url if authorized
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

      // Gets user
      try {
        user = userService.findUserById(id);
        
      } catch (Exception e) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
      }
      
      // Determines if the user is authorized to view the profile
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

      // Gets a list of following
      Page<FollowingProjection> following = followService.getFollowing(user, page,search);

      // Puts list of following into following response
      FollowingResponse followingResponse = new FollowingResponse();
      followingResponse.setFollowList(following.getContent());    
      followingResponse.setFollowCount(following.getTotalElements());
      followingResponse.setFollowPageCount(following.getTotalPages());
  
      return ResponseEntity.ok(followingResponse);
  }

  // Gets a list of posts for the user with the id in url
  @GetMapping("/get_posts/{id}")
  public ResponseEntity<PostListResponse> getPosts(
  @CookieValue(required = false) String access_token, 
  @CookieValue(required = false) String isLogged, 
  @PathVariable Integer id, 
  @RequestParam(defaultValue = "1") Integer page
  ) {
    User user;
    User viewer;

    // Gets user
    try {
      user = userService.findUserById(id);
      
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }
    
    // Determines if user is authorized to view profile
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

    // Gets a list of posts
    Page<PostProjection> posts = postService.getMyPost(user, page);

    // Puts list of posts into response
    PostListResponse postList = new PostListResponse();
    postList.setPostList(posts.getContent());
    postList.setPageCount(posts.getTotalPages());

    return ResponseEntity.ok(postList);
  }

}