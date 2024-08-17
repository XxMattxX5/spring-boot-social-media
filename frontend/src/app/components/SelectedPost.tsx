import React, { Suspense, lazy, useEffect } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import CloseIcon from "@mui/icons-material/Close";
import ReactLoading from "react-loading";
import TimeAgo from "../components/TimeAgo";
import PostBottomBar from "./PostBottomBar";
import { useScrollBlock } from "../hooks/useScrollBlock";
import Link from "next/link";

const SafeHtmlClient = lazy(() =>
  import("../components/SafeHtml").then((module) => ({
    default: module.SafeHtmlClient,
  }))
);

type Post = {
  profilePicture: string;
  username: string;
  likeCount: number;
  id: number;
  content: string;
  createdAt: string;
  userId: number;
};

type Props = {
  post: Post;
  clearPostCallBack: () => void;
};

const SelectedPost = ({ post, clearPostCallBack }: Props) => {
  const { settings } = useAuth();
  const [blockScroll, allowScroll] = useScrollBlock(); // Used to allow and block scroll
  const theme = settings?.colorTheme || "light"; // User's selected theme

  // Blocks scroll on mount and allows scroll on unmount
  useEffect(() => {
    blockScroll();
    return () => {
      allowScroll();
    };
  }, [blockScroll, allowScroll]);

  return (
    <Grid container id="selected_post_container">
      <Grid sx={{ width: "100%", textAlign: "right" }}>
        <IconButton id="selected_post_close" onClick={clearPostCallBack}>
          <CloseIcon id="selected_post_close_icon" />
        </IconButton>
      </Grid>
      <Grid
        id="selected_post_box"
        sx={{ backgroundColor: theme == "dark" ? "#333333" : "white" }}
      >
        <Grid id="selected_post_header">
          <img
            src={post.profilePicture}
            height={50}
            width={50}
            alt="Profile picture"
            id="select_post_profile_picture"
          />
          <Grid id="selected_post_info">
            <Typography id="selected_post_username">
              <Link href={`/profile/view/${post.userId}`}>{post.username}</Link>
            </Typography>
            <Typography id="selected_post_date">
              <TimeAgo date={new Date(post.createdAt)} />
            </Typography>
          </Grid>
        </Grid>
        <Grid
          id="selected_post_content"
          sx={{ color: theme == "dark" ? "white" : "black" }}
        >
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
            <SafeHtmlClient html={post.content} />
          </Suspense>
        </Grid>
        <PostBottomBar
          postId={post.id}
          likes={post.likeCount}
          username={post.username}
          userId={post.userId}
        />
      </Grid>
    </Grid>
  );
};

export default SelectedPost;
