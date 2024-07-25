package com.Spring_social_media.services;

import org.springframework.stereotype.Service;

import com.Spring_social_media.models.User;
import com.Spring_social_media.repositories.UserRepository;
// import com.Spring_social_media.services.JwtService;
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

    public String updateProfilePicture(String picture, String token) {
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfilePicture(picture);
        userRepository.save(user); 
        
        return picture;
    }

    public UpdateInfoResponse updateUserInfo(User user,String newName, String newUsername ) {
        UpdateInfoResponse updateInfoResponse = new UpdateInfoResponse();
        
        if (newName.length() < 3) {
            updateInfoResponse.setError1("Name must be 3 characters or greater");
        } else if (newName.length() > 60) {
            updateInfoResponse.setError1("Name cannot be greater then 60 characters");
        }

        if (newUsername.length() < 3) {
            updateInfoResponse.setError2("Username must be 3 characters or greater");
        } else if(newUsername.length() > 40) {
            updateInfoResponse.setError2("Username cannot be greater then 40 characters");
        } else if(!newUsername.toLowerCase().equals(user.getUsername()) && userRepository.findByUsername(newUsername).isPresent()) {
            updateInfoResponse.setError2("Username already in use");
        } 
        
        if (updateInfoResponse.isValid()) {
            System.out.println("Success");
            user.setName(newName);
            user.setUsername(newUsername.toLowerCase());
            userRepository.save(user);

        }

        return updateInfoResponse;
    }

}
