package com.Spring_social_media.models;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Table(name = "settings")
@Entity 
public class Settings {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;

    @Column()
    private String allow_follows = "yes";

    @Column(nullable = false)
    private String profile_visibility = "followers";

    @Column(nullable = false)
    private String color_theme = "light";

    @OneToOne
    @JoinColumn(nullable =  false, name = "user_id", referencedColumnName = "id")
    private User user;

    public void setAllowFollows(String allow_follows) {
        this.allow_follows = allow_follows;
    }
    public String getAllowFollows() {
        return allow_follows;
    }

    public void setProfileVisibility(String profile_visibility) {
        this.profile_visibility = profile_visibility;
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

    public void setUser(User user) {
        this.user = user;
    }
    public User getUser() {
        return user;
    }
}
