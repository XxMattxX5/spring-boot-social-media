import React from "react";
import { Grid, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { SafeHtmlServer } from "../components/SafeHtml";
import styles from "../styles/PopularPosts.module.css";
import { cookies } from "next/headers";

const SelectedPostButton = dynamic(
  () => import("../components/SelectPostButton"),
  { ssr: false }
);

const TimeAgo = dynamic(() => import("../components/TimeAgo"), { ssr: false });

type Post = {
  profilePicture: string;
  username: string;
  likeCount: number;
  id: number;
  content: string;
  createdAt: string;
  userId: number;
};
type PostResponse = {
  postList: Post[];
  pageCount: number;
};

// Gets list of popular posts
const getPopularPosts = async () => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080"; // Url for the backend

  const response = await fetch(`${backendUrl}/post/popular`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Accept: "application/json",
    },
  }).catch((error) => console.log(error));

  if (response) {
    return response.json();
  } else {
    return [];
  }
};

const PopularPosts = async () => {
  const cookieStore = cookies(); // User's cookies
  const theme = cookieStore.get("theme")?.value || "light"; // User's selected theme
  const postResponse: PostResponse = await getPopularPosts(); // Gets list of popular posts
  const postList = postResponse.postList; // List of posts

  return (
    <Grid container id={styles.popular_container}>
      <Grid item id={styles.popular_box}>
        <Grid item id={styles.popular_box_header}>
          <Typography variant="h5">Popular Posts</Typography>
        </Grid>
        <Grid item id={styles.popular_post_list}>
          {postList.map((post) => (
            <SelectedPostButton post={post} key={post.id}>
              <Grid
                item
                className={styles.popular_post_box}
                sx={{
                  backgroundColor: theme == "dark" ? "#33333" : "white",
                }}
              >
                <Grid item className={styles.popular_post_box_header}>
                  <img
                    src={post.profilePicture}
                    className={styles.popular_post_box_image}
                    alt="profile_picture"
                    width={50}
                    height={50}
                  />
                  <Grid item className={styles.popular_post_box_info}>
                    <Typography>{post.username}</Typography>
                    <Typography>
                      <TimeAgo date={new Date(post.createdAt)} />
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item className={styles.popular_post_box_content}>
                  <SafeHtmlServer html={post.content} />
                </Grid>
              </Grid>
            </SelectedPostButton>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PopularPosts;
