package com.Spring_social_media.responses;

import com.Spring_social_media.projections.FollowingProjection;
import java.util.List;

public class FollowingResponse {
    
    private List<FollowingProjection> followList;

    private Integer followPageCount;

    private long followCount;

    public void setFollowList(List<FollowingProjection> followList) {
        this.followList = followList;
    }
    public List<FollowingProjection> getFollowList() {
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
