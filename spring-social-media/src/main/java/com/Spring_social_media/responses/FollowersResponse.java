package com.Spring_social_media.responses;

import com.Spring_social_media.projections.FollowersProjection;

import java.util.List;

public class FollowersResponse {
    
    private List<FollowersProjection> followList;

    private Integer followPageCount;

    private long followCount;

    public void setFollowList(List<FollowersProjection> followList) {
        this.followList = followList;
    }
    public List<FollowersProjection> getFollowList() {
        return followList;
    }

    public void setFollowPageCount(Integer followPageCount) {
        this.followPageCount = followPageCount;
    }
    public Integer getFollowPageCount() {
        return followPageCount;
    }

    public void setFollowCount(long followCount) {
        this.followCount = followCount;
    }
    public long getFollowCount() {
        return followCount;
    }
}
