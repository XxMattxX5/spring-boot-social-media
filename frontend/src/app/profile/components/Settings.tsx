"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import styles from "../../styles/profile.module.css";
import { useAuth } from "../../hooks/useAuth";

const Settings = () => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const { settings, fetchUser, refresh } = useAuth();
  const theme = settings?.colorTheme || "light";
  const [postVisibility, setPostVisibility] = useState(
    settings?.postVisibility
  );
  const [nameVisibility, setNameVisibility] = useState(
    settings?.nameVisibility
  );
  const [colorTheme, setColorTheme] = useState(settings?.colorTheme);
  const [profileVisibility, setProfileVisibility] = useState(
    settings?.profileVisibility
  );

  const handlePostVisibilityChange = (e: SelectChangeEvent) => {
    setPostVisibility(e.target.value);
  };

  const handleNameVisibilityChange = (e: SelectChangeEvent) => {
    setNameVisibility(e.target.value);
  };

  const handleColorThemeChange = (e: SelectChangeEvent) => {
    setColorTheme(e.target.value);
  };

  const handleProfileVisiblityChange = (e: SelectChangeEvent) => {
    setProfileVisibility(e.target.value);
  };

  const ResetSettings = () => {
    if (confirm("Are you sure you want to reset your settings?")) {
      setPostVisibility("everyone");
      setNameVisibility("everyone");
      setColorTheme("light");
    }
  };

  const updateSettings = useCallback(async () => {
    let status = false;
    const headers = {
      "Content-Type": "application/json",
    };
    await fetch(`${backendUrl}/user/update_settings`, {
      method: "PATCH",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({
        postVisibility: postVisibility,
        nameVisibility: nameVisibility,
        colorTheme: colorTheme,
      }),
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          fetchUser();
          return;
        } else {
          return;
        }
      })
      .catch((error) => console.log(error));

    if (status == false) {
      const refreshed = await refresh();

      if (refreshed) {
        updateSettings();
      }
    }
  }, [
    backendUrl,
    colorTheme,
    fetchUser,
    nameVisibility,
    postVisibility,
    refresh,
  ]);

  useEffect(() => {
    if (
      postVisibility != settings?.postVisibility ||
      nameVisibility != settings?.nameVisibility ||
      colorTheme != settings?.colorTheme
    ) {
      updateSettings();
    }
  }, [
    postVisibility,
    nameVisibility,
    colorTheme,
    settings?.postVisibility,
    settings?.nameVisibility,
    settings?.colorTheme,
    updateSettings,
  ]);

  return (
    <Grid container height={"100%"}>
      <Typography variant="h2" className={styles.profile_menu_header}>
        Settings
      </Typography>
      <Grid item xs={12} id={styles.settings_option_container}>
        <Grid item className={styles.settings_option_box}>
          <Typography
            className={styles.settings_option_label}
            sx={{ color: theme == "dark" ? "white" : "black" }}
          >
            Post Visibility
          </Typography>
          <Select
            className={styles.settings_option_dropdown}
            sx={{
              color: theme == "dark" ? "white" : "black",
            }}
            value={postVisibility}
            onChange={handlePostVisibilityChange}
            inputProps={{ className: styles.settings_option_dropdown_input }}
          >
            <MenuItem value="followers">Followers Only</MenuItem>
            <MenuItem value="everyone">Everyone</MenuItem>
          </Select>
        </Grid>
        <Grid item className={styles.settings_option_box}>
          <Typography
            className={styles.settings_option_label}
            sx={{ color: theme == "dark" ? "white" : "black" }}
          >
            Name Visibility
          </Typography>
          <Select
            className={styles.settings_option_dropdown}
            sx={{
              color: theme == "dark" ? "white" : "black",
            }}
            value={nameVisibility}
            onChange={handleNameVisibilityChange}
            inputProps={{ className: styles.settings_option_dropdown_input }}
          >
            <MenuItem value="followers">Followers Only</MenuItem>
            <MenuItem value="everyone">Everyone</MenuItem>
          </Select>
        </Grid>
        <Grid item className={styles.settings_option_box}>
          <Typography
            className={styles.settings_option_label}
            sx={{ color: theme == "dark" ? "white" : "black" }}
          >
            Profile Visibility
          </Typography>
          <Select
            className={styles.settings_option_dropdown}
            sx={{
              color: theme == "dark" ? "white" : "black",
            }}
            value={profileVisibility}
            onChange={handleProfileVisiblityChange}
            inputProps={{ className: styles.settings_option_dropdown_input }}
          >
            <MenuItem value="no one">No One</MenuItem>
            <MenuItem value="followers">Followers Only</MenuItem>
            <MenuItem value="everyone">Everyone</MenuItem>
          </Select>
        </Grid>
        <Grid item className={styles.settings_option_box}>
          <Typography
            className={styles.settings_option_label}
            sx={{ color: theme == "dark" ? "white" : "black" }}
          >
            Color Theme
          </Typography>
          <Select
            className={styles.settings_option_dropdown}
            sx={{
              color: theme == "dark" ? "white" : "black",
            }}
            value={colorTheme}
            onChange={handleColorThemeChange}
            inputProps={{
              className: styles.settings_option_dropdown_input,
            }}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Button
        id={styles.settings_to_default}
        sx={{
          backgroundColor: theme == "dark" ? "#33333" : "white",
          color: theme == "dark" ? "white" : "red",
        }}
        onClick={ResetSettings}
      >
        <Typography>Reset settings to default</Typography>
      </Button>
    </Grid>
  );
};

export default Settings;
