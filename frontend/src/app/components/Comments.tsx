"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Button, Grid, Typography, IconButton } from "@mui/material";
import styles from "../styles/comments.module.css";
import TimeAgo from "./TimeAgo";
import { SafeHtmlClient } from "./SafeHtml";
import Tiptap from "./Tiptap";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ReactLoading from "react-loading";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useAuth } from "../hooks/useAuth";

type Props = {
  showNewCommentBox: true | false;
  showNewCommentCallBack: () => void;
  postId: number;
};

type Reply = {
  username: string;
  profilePicture: string;
  createdAt: string;
  id: number;
  content: string;
};

type Comment = {
  profilePicture: string;
  username: string;
  createdAt: string;
  replies: Reply[];
  id: number;
  content: string;
};

const Comments = ({
  showNewCommentBox,
  showNewCommentCallBack,
  postId,
}: Props) => {
  const { refresh } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]); // List of comments for post
  const [currentPage, setCurrentPage] = useState(1); // Current page in comments
  const [pageCount, setPageCount] = useState(0); // Number of pages of comments

  // A list of valid page numbers for navigation comments
  const pages = () => {
    const pagesArray: number[] = [];
    currentPage - 2 > 1 ? pagesArray.push(currentPage - 2) : null;
    currentPage - 1 > 1 ? pagesArray.push(currentPage - 1) : null;
    pagesArray.push(currentPage);
    currentPage + 1 < pageCount ? pagesArray.push(currentPage + 1) : null;
    currentPage + 2 < pageCount ? pagesArray.push(currentPage + 2) : null;

    return pagesArray;
  };

  const [newComment, setNewComment] = useState(""); // New comment content
  const [newReply, setNewReply] = useState(""); // New reply content
  const [visibleReply, setVisibleReply] = useState<number | null>(null); // What reply box is visible

  // Sets the updated content to the newComment state variable
  const handleCommentContentChange = (content: string) => {
    setNewComment(content);
  };

  // Sets the updated reply content to the newReply variable
  const handleReplyContentChange = (content: string) => {
    setNewReply(content);
  };

  // Sets id of the comment that the reply box should be visible on to the visibleReply variable
  // Sets visibleReply variable to null if comment id matches the visibleReply id
  const handleReplyClick = (commentId: number) => {
    if (visibleReply == commentId) {
      setVisibleReply(null);
      setNewReply("");
    } else {
      setVisibleReply(commentId);
    }
  };

  // Attempts to make a new comment if the newComment variable is not empty
  const createComment = async () => {
    if (!newComment) {
      return;
    }
    let status = null;
    await fetch(`/api/comment/create/${postId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        content: newComment,
      }),
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          showNewCommentCallBack();
          fetchComments();
          setNewComment("");
        } else if (res.status == 401) {
          status = false;
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed == true) {
        createComment();
      }
    }
  };

  // Attempts to create a new reply if the newReply variable isn't empty
  const createReply = async (commentId: number) => {
    if (!newReply) {
      return;
    }
    let status = null;
    await fetch(`/api/reply/create/${commentId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        content: newReply,
      }),
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          fetchComments();
          setNewReply("");
          setVisibleReply(null);
        } else if (res.status == 401) {
          status = false;
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed == true) {
        createReply(commentId);
      }
    }
  };

  // Attempts the fetch the comments for the post giving a postId and page
  const fetchComments = useCallback(async () => {
    fetch(`/api/comment/comments/${postId}?page=${currentPage}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to fetch comments");
        }
      })
      .then((data) => {
        if (data) {
          setComments(data.commentList);
          setPageCount(data.commentPages);
        }
      })
      .catch((error) => console.log(error));
  }, [currentPage, postId]);

  // Fetches comments on mount
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Changes the current page number if the page input is valid
  const handlePageChange = (page: number) => {
    if (currentPage === page || page < 1 || page > pageCount) {
      return;
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <Grid container>
      {showNewCommentBox ? (
        <Grid item id={styles.comment_create_box} xs={12}>
          <Grid item id={styles.comment_create_header}>
            <Typography>Comment on Post</Typography>
          </Grid>
          <Grid
            item
            id={styles.comment_create}
            xs={12}
            sx={{ minHeight: "400px", display: "flex", alignItems: "stretch" }}
          >
            <Tiptap contentCallBack={handleCommentContentChange} />
          </Grid>
          <Grid item id={styles.comment_create_button}>
            <Button fullWidth onClick={createComment}>
              Create Comment
            </Button>
          </Grid>
        </Grid>
      ) : null}
      <Grid item id={styles.comment_content_box} xs={12}>
        {comments.map((comment) => (
          <Grid container className={styles.comment_box} key={comment.id}>
            <Grid item className={styles.comment_box_info}>
              <img
                className={styles.comment_info_profile_picture}
                src={comment.profilePicture}
                height={40}
                width={40}
                alt={`${comment.username}'s profile picture`}
              />

              <Grid item className={styles.comment_info}>
                <Grid item className={styles.comment_username_reply_box}>
                  <Grid item className={styles.comment_info_username}>
                    <Typography>{comment.username}</Typography>
                  </Grid>
                  {"\xa0|\xa0"}
                  <Grid item className={styles.comment_info_reply_button}>
                    <Button onClick={() => handleReplyClick(comment.id)}>
                      Reply
                    </Button>
                  </Grid>
                </Grid>
                <Grid item className={styles.comment_info_createdAt}>
                  <Typography>
                    <TimeAgo date={new Date(comment.createdAt)} />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={styles.comment_content}>
              <Suspense
                fallback={
                  <Grid
                    sx={{
                      width: "fit-content",
                      margin: "0 auto",
                    }}
                  >
                    <ReactLoading type="spin" />
                  </Grid>
                }
              >
                <SafeHtmlClient html={comment.content} />
              </Suspense>
            </Grid>
            {visibleReply == comment.id ? (
              <Grid item id={styles.comment_create_box} xs={12}>
                <Grid item id={styles.comment_create_header}>
                  <Typography>Reply to Comment</Typography>
                </Grid>
                <Grid
                  item
                  id={styles.comment_create}
                  xs={12}
                  sx={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <Tiptap contentCallBack={handleReplyContentChange} />
                </Grid>
                <Grid item id={styles.comment_create_button}>
                  <Button fullWidth onClick={() => createReply(comment.id)}>
                    Reply
                  </Button>
                </Grid>
              </Grid>
            ) : null}
            <Grid item className={styles.comment_box_replies}>
              {comment.replies.map((reply) => (
                <Grid container className={styles.reply_box} key={reply.id}>
                  <Grid item className={styles.comment_box_info}>
                    <img
                      className={styles.comment_info_profile_picture}
                      src={reply.profilePicture}
                      height={40}
                      width={40}
                      alt={`${reply.username}'s profile picture`}
                    />

                    <Grid item className={styles.comment_info}>
                      <Grid item className={styles.comment_info_username}>
                        <Typography>
                          {reply.username} replied to {comment.username}
                        </Typography>
                      </Grid>
                      <Grid item className={styles.comment_info_createdAt}>
                        <Typography>
                          <TimeAgo date={new Date(reply.createdAt)} />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item className={styles.comment_content}>
                    <Suspense
                      fallback={
                        <Grid
                          sx={{
                            width: "fit-content",
                            margin: "0 auto",
                          }}
                        >
                          <ReactLoading type="spin" />
                        </Grid>
                      }
                    >
                      <SafeHtmlClient html={reply.content} />
                    </Suspense>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
      {pageCount > 1 ? (
        <Grid item id={styles.comment_page_buttons_box} xs={12}>
          <IconButton onClick={() => handlePageChange(currentPage - 1)}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          {currentPage != 1 ? (
            <Button
              onClick={() => handlePageChange(1)}
              sx={{
                backgroundColor: currentPage == 1 ? "#484747" : "unset",
              }}
            >
              1
            </Button>
          ) : null}
          {pageCount > 4 && currentPage > 1 + 3 ? <Button>...</Button> : null}
          {pages().map((num) => (
            <Button
              onClick={() => handlePageChange(num)}
              sx={{ backgroundColor: currentPage == num ? "#484747" : "unset" }}
              key={num}
            >
              {num}
            </Button>
          ))}
          {pageCount > 4 && currentPage < pageCount - 3 ? (
            <Button>...</Button>
          ) : null}
          {currentPage != pageCount && pageCount != 0 ? (
            <Button
              onClick={() => handlePageChange(pageCount)}
              sx={{
                backgroundColor: currentPage == pageCount ? "#484747" : "unset",
              }}
            >
              {pageCount}
            </Button>
          ) : null}
          <IconButton onClick={() => handlePageChange(currentPage + 1)}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default Comments;
