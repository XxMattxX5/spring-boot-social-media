import React, { Suspense, lazy } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import { useAuth } from "../hooks/Auth";
import CloseIcon from "@mui/icons-material/Close";
import ReactLoading from "react-loading";
import TimeAgo from "../components/TimeAgo";
import PostBottomBar from "./PostBottomBar";

const SafeHtml = lazy(() => import("../components/SafeHtml"));

type Post = {
  profilePicture: string;
  username: string;
  likeCount: number;
  id: number;
  content: string;
  createdAt: string;
};

type Props = {
  post: Post;
  clearPostCallBack: () => void;
};

const SelectedPost = ({ post, clearPostCallBack }: Props) => {
  const { settings } = useAuth();
  const theme = settings?.colorTheme || "light";
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
            <Typography id="selected_post_username">{post.username}</Typography>
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
            <SafeHtml html={post.content} />
          </Suspense>
        </Grid>
        <PostBottomBar
          postId={post.id}
          likes={post.likeCount}
          username={post.username}
        />
      </Grid>
    </Grid>
  );
};

export default SelectedPost;
