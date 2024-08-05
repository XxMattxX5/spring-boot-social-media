package com.Spring_social_media.responses;

import com.Spring_social_media.classes.UserInfo;
import com.Spring_social_media.classes.SettingsInfo;

public class UserInfoResponse {
    
    private UserInfo user;
    private SettingsInfo settings;

    public UserInfo getUserInfo() {
        return user;
    }
    public void setUserInfo(UserInfo user) {
        this.user = user;
    }

    public SettingsInfo getSettingsInfo() {
        return settings;
    }
    public void setSettingsInfo(SettingsInfo settings) {
        this.settings = settings;
    }

}
