package com.Spring_social_media.dtos;

public class UpdateSettingsDto {
    private String postVisibility;
    private String nameVisibility;
    private String colorTheme;

    public void setPostVisibility(String postVisibilty) {
        this.postVisibility = postVisibilty;
    }
    public String getPostVisibility() {
        return postVisibility;
    }

    public void setNameVisibility(String nameVisibilty) {
        this.nameVisibility = nameVisibilty;
    }
    public String getNameVisibility() {
        return nameVisibility;
    }

    public void setColorTheme(String colorTheme) {
        this.colorTheme = colorTheme;
    }
    public String getColorTheme() {
        return colorTheme;
    }
}
