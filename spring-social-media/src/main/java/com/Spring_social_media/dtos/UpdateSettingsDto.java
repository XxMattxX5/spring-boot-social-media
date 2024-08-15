package com.Spring_social_media.dtos;

public class UpdateSettingsDto {
    private String allowFollows;
    private String profileVisibility;
    private String colorTheme;

    public void setAllowFollows(String allowFollows) {
        this.allowFollows = allowFollows;
    }
    public String getAllowFollows() {
        return allowFollows;
    }

    public void setProfileVisibility(String profileVisibility) {
        this.profileVisibility = profileVisibility;
    }
    public String getProfileVisibility() {
        return profileVisibility;
    }

    public void setColorTheme(String colorTheme) {
        this.colorTheme = colorTheme;
    }
    public String getColorTheme() {
        return colorTheme;
    }
}
