package com.Spring_social_media.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Date;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;



@Table(name = "posts")
@Entity 
public class Post {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(nullable = false, name = "user_id", referencedColumnName = "id")
    private User author;

    @Column(length = 5000)
    private String content;

    @Column
    private Integer likeCount = 0;

    @OneToMany(mappedBy = "post")
    private Set<Like> likes;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    public Integer getId() {
        return id;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
    public User getAuthor() {
        return author;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public String getContent() {
        return content;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }
    public Integer getLikeCount() {
        return likeCount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }
    
    public Date getUpdatedAd() {
        return updatedAt;
    }

    public boolean isLikedByUser(User user) {
        return likes.stream()
                .anyMatch(like -> like.getUser().equals(user));
    }



}
