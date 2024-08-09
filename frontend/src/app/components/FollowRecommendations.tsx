"use client";
import React from "react";
import { Grid, Typography } from "@mui/material";
import styles from "../styles/FollowRecommendations.module.css";
import { useAuth } from "../hooks/useAuth";

const FollowRecommendations = () => {
  const { settings } = useAuth();
  const theme = settings?.colorTheme || "light";
  return (
    <Grid
      container
      id={styles.followrec_container}
      sx={{ backgroundColor: theme == "dark" ? "#333333" : "white" }}
    >
      <Grid item id={styles.followrec_box}>
        <Grid item id={styles.followrec_header}>
          <Typography variant="h5">Follow Recommendations</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FollowRecommendations;
