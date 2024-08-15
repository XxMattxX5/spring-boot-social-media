package com.Spring_social_media.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;

@Table(name = "follows")
@Entity
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false, name = "following_user_id", referencedColumnName = "id")
    private User following;

    @ManyToOne
    @JoinColumn(nullable = false, name = "followed_user_id", referencedColumnName = "id")
    private User followed;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    public Integer getId() {
        return id;
    }

    public void setFollowing(User following) {
        this.following = following;
    }
    public User getFollowing() {
        return following;
    }

    public void setFollowed(User followed) {
        this.followed = followed;
    }
    public User getFollowed() {
        return followed;
    }

    public Date getCreated() {
        return createdAt;
    }

    
    
}
