package com.Spring_social_media.responses;

import com.Spring_social_media.projections.CommentWithRepliesProjection;

import java.util.List;

public class CommentResponse {
    private List<CommentWithRepliesProjection> commentList;
    private Integer commentPages;

    public void setCommentList(List<CommentWithRepliesProjection> commentList) {
        this.commentList = commentList;
    }
    public List<CommentWithRepliesProjection> getCommentList() {
        return commentList;
    }

    public void setCommentPages(Integer commentPages) {
        this.commentPages = commentPages;
    }
    public Integer getCommentPages() {
        return commentPages;
    }

}
