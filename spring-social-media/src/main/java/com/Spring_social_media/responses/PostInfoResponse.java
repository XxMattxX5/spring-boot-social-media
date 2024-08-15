package com.Spring_social_media.responses;

public class PostInfoResponse {
    private boolean liked;
    private boolean followed;
    
    public void setLike(boolean liked) {
        this.liked = liked;
    }
    public boolean getLiked() {
        return liked;
    }

    public void setFollowed(boolean followed) {
        this.followed = followed;
    }
    public boolean getFollowed() {
        return followed;
    }

}
