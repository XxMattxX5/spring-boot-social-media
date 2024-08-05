package com.Spring_social_media.models;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Table(name = "settings")
@Entity 
public class Settings {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String post_visibility = "everyone";

    @Column(nullable = false)
    private String name_visibility = "everyone";

    @Column(nullable = false)
    private String profile_visibility = "followers";

    @Column(nullable = false)
    private String color_theme = "light";

    @OneToOne
    @JoinColumn(nullable =  false, name = "user_id", referencedColumnName = "id")
    private User user;
   
    

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
