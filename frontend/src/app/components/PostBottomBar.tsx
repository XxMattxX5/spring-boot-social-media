"use client";
import React, { useEffect, useState } from "react";
import { Grid, Button, Tooltip } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import { useAuth } from "../hooks/useAuth";
import { useCookies } from "react-cookie";
import Comments from "./Comments";

type Props = {
  postId: number;
  likes: number;
  username: string;
  userId: number;
};

const PostBottomBar = ({ postId, likes, username, userId }: Props) => {
  const { refresh } = useAuth();
  const [cookies, setCookies] = useCookies(["isLogged"]); // User's cookies
  const isLogged = cookies.isLogged == true ? true : false; // User's login status
  const [isLiked, setIsLiked] = useState(false); // Whether user has liked post already or not
  const [likeCount, setLikeCount] = useState(likes); // Number of likes on post
  const [isFollowed, setIsFollowed] = useState(false); // Whether user is already following or not
  const [showNewCommentInput, setShowNewCommentInput] = useState(false); // Display input box for new comment

  // Toggles showNewCommentInput display
  const handleShowNewCommentInput = () => {
    setShowNewCommentInput((prev) => !prev);
  };

  // Gets information on post on mount
  useEffect(() => {
    const postInfo = async () => {
      let status = null;
      await fetch(`/api/post/post_info/${postId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            status = true;
            return res.json();
          } else if (res.status == 401) {
            status = false;
          }
        })
        .then((data) => {
          if (data) {
            setIsLiked(data.liked);
            setIsFollowed(data.followed);
          }
        })
        .catch((error) => console.log(error));

      // Refreshes token and tries again if error is a 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed == true) {
          postInfo();
        }
      }
    };
    postInfo();
  }, [postId, refresh]);

  // Likes the posts
  const likePost = async () => {
    let status = null;
    await fetch(`/api/like/${postId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
          setIsLiked((prev) => !prev);
        } else if (res.status == 401) {
          status = false;
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error is a 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed == true) {
        likePost();
      }
    }
  };

  // Follows the user who made the post
  const follow = async () => {
    let status = null;

    await fetch(`/api/follow/${userId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          setIsFollowed((prev) => !prev);
          return;
        } else if (res.status === 401) {
          status = false;
          return;
        } else if (res.status === 403) {
          return res.json();
        } else {
          return;
        }
      })
      .then((data) => {
        if (data) {
          alert(data.message);
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was a 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed == true) {
        follow();
      }
    }
  };

  return (
    <Grid container id="post_bottom_container">
      <Grid item id="post_bottom_buttons_box">
        <Grid item className="post_bottom_buttons">
          <Tooltip
            title={
              isLiked
                ? "Unlike Post"
                : isLogged
                ? "Like Post"
                : "Sign in to like"
            }
          >
            <Button
              onClick={isLogged ? likePost : undefined}
              id="post_bottom_button_like"
            >
              {isLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
              {likeCount}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item className="post_bottom_buttons">
          <Tooltip title="Comment on Post">
            <Button
              id="post_bottom_button_comment"
              onClick={handleShowNewCommentInput}
            >
              <CommentIcon /> Comment
            </Button>
          </Tooltip>
        </Grid>
        <Grid item className="post_bottom_buttons">
          <Tooltip
            title={
              isFollowed
                ? `Unfollow ${username}`
                : isLogged
                ? `Follow ${username}`
                : "Sign in to follow"
            }
          >
            <Button
              id="post_bottom_button_follow"
              onClick={isLogged ? follow : undefined}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid item id="post_comments" xs={12}>
        <Comments
          showNewCommentBox={showNewCommentInput}
          showNewCommentCallBack={handleShowNewCommentInput}
          postId={postId}
        />
      </Grid>
    </Grid>
  );
};

export default PostBottomBar;
