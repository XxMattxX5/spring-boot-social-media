import React from "react";
import { Grid, Typography } from "@mui/material";
import styles from "../styles/profile.module.css";

const Dashboard = () => {
  return (
    <Grid container>
      <Typography variant="h2" className={styles.profile_menu_header}>
        Dashboard
      </Typography>
    </Grid>
  );
};

export default Dashboard;
