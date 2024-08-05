package com.Spring_social_media.classes;

public class UserInfo {
    private String name;
    private String username;
    private String email;
    private String profile_picture;

    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public String getUsername() {
        return username;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getEmail() {
        return email;
    }

    public void setProfilePicture(String profilePicture) {
        this.profile_picture = profilePicture;
    }
    public String getProfilePicture() {
        return profile_picture;
    }
}
