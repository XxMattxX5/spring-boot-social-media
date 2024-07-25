import React from "react";
import { Grid, Typography } from "@mui/material";
import styles from "../styles/profile.module.css";

const Settings = () => {
  return (
    <Grid container>
      <Typography variant="h2" className={styles.profile_menu_header}>
        Settings
      </Typography>
    </Grid>
  );
};

export default Settings;
