import styles from "./styles/home.module.css";
import { Grid, Typography, CircularProgress } from "@mui/material";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const PopularPosts = dynamic(() => import("./components/PopularPosts"), {
  ssr: false,
  loading: () => (
    <Grid
      container
      sx={{
        flexGrow: 1,
        alignContent: "center",
      }}
    >
      <CircularProgress size={"80px"} sx={{ margin: "0 auto" }} />
    </Grid>
  ),
});

export const metadata: Metadata = {
  title: "Spring Social",
  description: "Spring social home page",
};

export default async function Home() {
  return (
    <Grid container id={styles.home_container}>
      <Grid item id={styles.home_popular_posts_container}>
        <PopularPosts />
      </Grid>
      <Grid item id={styles.home_box}>
        <Grid item id={styles.home_box_header}>
          <Typography variant="h1">Welcome to Spring Social</Typography>
        </Grid>
        <Grid item id={styles.home_box_welcome_message}>
          <Typography>
            Join the community at Spring Social, where technology meets
            connection. Built with the power of Spring Boot and the versatility
            of Next.js, our platform brings you a seamless social media
            experience. Connect, share, and discover with ease. Whether
            you&apos;re here to catch up with friends, share your latest
            adventures, or discover new interests, Spring Social is your go-to
            place for meaningful interactions. Dive in, explore your network,
            and start building your social world today!
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
