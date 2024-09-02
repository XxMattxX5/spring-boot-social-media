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
import { useRouter } from "next/navigation";

const Settings = () => {
  const router = useRouter();
  const { settings, fetchUser, refresh } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theme
  const [allowFollows, setAllowFollows] = useState(settings?.allowFollows); // Allows following setting
  const [colorTheme, setColorTheme] = useState(settings?.colorTheme); // Color theme setting
  // Profile visibility setting
  const [profileVisibility, setProfileVisibility] = useState(
    settings?.profileVisibility
  );

  // Handles changes to the allow follows setting
  const handleAllowFollowsChange = (e: SelectChangeEvent) => {
    setAllowFollows(e.target.value);
  };

  // Handles changes to the color theme setting
  const handleColorThemeChange = (e: SelectChangeEvent) => {
    setColorTheme(e.target.value);
  };

  // Handles changes to the profile visibilty setting
  const handleProfileVisiblityChange = (e: SelectChangeEvent) => {
    setProfileVisibility(e.target.value);
  };

  // Resets all settings to default
  const ResetSettings = () => {
    if (confirm("Are you sure you want to reset your settings?")) {
      setAllowFollows("yes");
      setProfileVisibility("everyone");
      setColorTheme("dark");
    }
  };

  // Updates user's settings
  const updateSettings = useCallback(async () => {
    let status = null;
    const headers = {
      "Content-Type": "application/json",
    };
    await fetch(`/api/user/update_settings`, {
      method: "PATCH",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({
        allowFollows: allowFollows,
        profileVisibility: profileVisibility,
        colorTheme: colorTheme,
      }),
    })
      .then((res) => {
        if (res.ok) {
          router.refresh();
          status = true;
          fetchUser();
          return;
        } else if (res.status === 401) {
          status = false;
          return;
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was a 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed) {
        updateSettings();
      }
    }
  }, [colorTheme, fetchUser, allowFollows, profileVisibility, refresh, router]);

  // Handles updating settings
  useEffect(() => {
    if (
      allowFollows != settings?.allowFollows ||
      profileVisibility != settings?.profileVisibility ||
      colorTheme != settings?.colorTheme
    ) {
      updateSettings();
    }
  }, [
    allowFollows,
    profileVisibility,
    colorTheme,
    settings?.allowFollows,
    settings?.profileVisibility,
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
            Allow Follows
          </Typography>
          <Select
            className={styles.settings_option_dropdown}
            sx={{
              color: theme == "dark" ? "white" : "black",
            }}
            value={allowFollows}
            onChange={handleAllowFollowsChange}
            inputProps={{ className: styles.settings_option_dropdown_input }}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </Grid>
        {/* <Grid item className={styles.settings_option_box}>
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
        </Grid> */}
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
