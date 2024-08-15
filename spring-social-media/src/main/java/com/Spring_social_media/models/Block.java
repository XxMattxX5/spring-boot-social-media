package com.Spring_social_media.models;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Table(name= "blocks")
@Entity
public class Block {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false, name = "blocking_user_id", referencedColumnName = "id")
    private User blocking;

    @ManyToOne
    @JoinColumn(nullable = false, name = "blocked_user_id", referencedColumnName = "id")
    private User blocked;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    public Integer getId() {
        return id;
    }

    public void setBlocking(User blocking) {
        this.blocking = blocking;
    }
    public User getBlocking() {
        return blocking;
    }

    public void setBlocked(User blocked) {
        this.blocked = blocked;
    }
    public User getBlocked() {
        return blocked;
    }

    public Date getCreated() {
        return createdAt;
    }
}
