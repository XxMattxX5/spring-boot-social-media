package com.Spring_social_media.services;

import org.springframework.stereotype.Service;

import com.Spring_social_media.models.User;
import com.Spring_social_media.repositories.UserRepository;
import com.Spring_social_media.responses.UpdateInfoResponse;

@Service
public class UserService {
    private final UserRepository userRepository;

    private final JwtService jwtService;

    public UserService(
        UserRepository userRepository,
        JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // Updates user profile picture
    public String updateProfilePicture(String picture, String token) {
        String username = jwtService.extractUsername(token);
        User user = findUserByUsername(username);
        user.setProfilePicture(picture);
        userRepository.save(user); 
        
        return picture;
    }

    // Updates user info
    public UpdateInfoResponse updateUserInfo(User user,String newName, String newUsername ) {
        UpdateInfoResponse updateInfoResponse = new UpdateInfoResponse();
        
        // Makes sure user's name is valid
        if (newName.length() < 3) {
            updateInfoResponse.setError1("Name must be 3 characters or greater");
        } else if (newName.length() > 60) {
            updateInfoResponse.setError1("Name cannot be greater then 60 characters");
        }

        // Makes sure user's username is valid
        if (newUsername.length() < 3) {
            updateInfoResponse.setError2("Username must be 3 characters or greater");
        } else if(newUsername.length() > 40) {
            updateInfoResponse.setError2("Username cannot be greater then 40 characters");
        } else if(!newUsername.toLowerCase().equals(user.getUsername()) && userRepository.findByUsername(newUsername).isPresent()) {
            updateInfoResponse.setError2("Username already in use");
        } 
        
        // Makes sure input is valid
        if (updateInfoResponse.isValid()) {
            user.setName(newName);
            user.setUsername(newUsername.toLowerCase());
            userRepository.save(user);
        }

        return updateInfoResponse;
    }

    // Finds user by username
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not Found"));
    }

    // Finds user by id
    public User findUserById(Integer id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not Found"));
    }

}
