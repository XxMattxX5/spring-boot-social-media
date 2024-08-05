"use client";
import React, { useState, CSSProperties } from "react";
import SelectedPost from "./SelectedPost";
import { Grid } from "@mui/material";

type Post = {
  profilePicture: string;
  username: string;
  likeCount: number;
  id: number;
  content: string;
  createdAt: string;
};

interface SelectButtonProps {
  post: Post;
  children: React.ReactNode;
  style?: CSSProperties;
}

const SelectPostButton = ({ post, children, style }: SelectButtonProps) => {
  const [displayPost, setDisplayPost] = useState(false);

  const clearPost = () => {
    setDisplayPost(false);
  };

  return (
    <>
      <Grid
        onClick={() => setDisplayPost(true)}
        style={style}
        sx={{ cursor: "pointer" }}
      >
        {children}
      </Grid>

      {displayPost ? (
        <SelectedPost post={post} clearPostCallBack={clearPost} />
      ) : null}
    </>
  );
};
export default SelectPostButton;
