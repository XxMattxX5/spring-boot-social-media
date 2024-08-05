"use client";
import React, { useEffect, useState } from "react";
import { Grid, Button, Tooltip } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import { useAuth } from "../hooks/Auth";

type Props = {
  postId: number;
  likes: number;
  username: string;
};

const PostBottomBar = ({ postId, likes, username }: Props) => {
  const { refresh } = useAuth();
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  useEffect(() => {
    const getIsLiked = async () => {
      let status = null;
      await fetch(`${backendUrl}/like/isLiked/${postId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            status = true;
            return res.json();
          } else if (res.status == 401 || res.status == 403) {
            status = false;
          }
        })
        .then((data) => {
          if (data) {
            setIsLiked(data.liked);
          }
        })
        .catch((error) => console.log(error));

      if (status == false) {
        const refreshed = await refresh();
        if (refreshed == true) {
          getIsLiked();
        }
      }
    };
    getIsLiked();
  }, []);

  const likePost = async () => {
    let status = null;
    await fetch(`${backendUrl}/like/${postId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
          setIsLiked((prev) => !prev);
        } else if (res.status == 401 || res.status == 403) {
          status = false;
        }
      })
      .catch((error) => console.log(error));

    if (status == false) {
      const refreshed = await refresh();
      if (refreshed == true) {
        likePost();
      }
    }
  };

  return (
    <Grid container id="post_bottom_container">
      <Grid item id="post_bottom_buttons_box">
        <Grid item className="post_bottom_buttons">
          <Tooltip title={isLiked ? "Unlike Post" : "Like Post"}>
            <Button onClick={likePost} id="post_bottom_button_like">
              {isLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
              {likeCount}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item className="post_bottom_buttons">
          <Tooltip title="Comment on Post">
            <Button id="post_bottom_button_comment">
              <CommentIcon /> Comment
            </Button>
          </Tooltip>
        </Grid>
        <Grid item className="post_bottom_buttons">
          <Tooltip title={`Follow ${username}`}>
            <Button id="post_bottom_button_follow">Follow</Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid item id="post_comments"></Grid>
    </Grid>
  );
};

export default PostBottomBar;
