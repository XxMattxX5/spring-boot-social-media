package com.Spring_social_media.classes;

public class SettingsInfo {
    private String post_visibility;;
    private String name_visibility;
    private String profile_visibility;
    private String color_theme;

    public void setPostVisibility(String postVisibility) {
        this.post_visibility = postVisibility;
    }
    public String getPostVisibility() {
        return post_visibility;
    }

    public void setNameVisibility(String nameVisibility) {
        this.name_visibility = nameVisibility;
    }
    public String getNameVisibility() {
        return name_visibility;
    }

    public void setProfileVisibility(String profileVisibility) {
        this.profile_visibility = profileVisibility;
    }
    public String getProfileVisibility() {
        return profile_visibility;
    }


    public void setColorTheme(String colorTheme) {
        this.color_theme = colorTheme;
    }
    public String getColorTheme() {
        return color_theme;
    }

    
}
