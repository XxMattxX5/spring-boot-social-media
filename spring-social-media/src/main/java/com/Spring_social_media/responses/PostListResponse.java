package com.Spring_social_media.responses;

import com.Spring_social_media.projections.PostProjection;
import java.util.List;

public class PostListResponse {
    public List<PostProjection> postList;
    public Integer pageCount;
    
    public void setPostList(List<PostProjection> postList) {
        this.postList = postList;
    }
    public List<PostProjection> getPostList() {
        return postList;
    }

    public void setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
    }
    public Integer getPageCount() {
        return pageCount;
    }

}
