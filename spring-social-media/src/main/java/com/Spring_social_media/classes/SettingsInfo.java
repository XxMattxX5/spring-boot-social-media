package com.Spring_social_media.classes;

public class SettingsInfo {
    private String allow_follows;
    private String profile_visibility;
    private String color_theme;

    public void setAllowFollows(String allow_follows) {
        this.allow_follows = allow_follows;
    }
    public String getAllowFollows() {
        return allow_follows;
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
