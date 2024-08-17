import React from "react";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import styles from "../../styles/profile.module.css";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  currentNav: string;
};

const ProfileNav = ({ currentNav }: Props) => {
  const router = useRouter();
  const { logout, settings } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theme

  // Logs out user
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };
  return (
    <Grid
      container
      id={styles.profile_nav}
      sx={{
        backgroundColor: theme == "dark" ? "#333333" : "white",
      }}
    >
      <Grid
        item
        className={styles.profile_nav_buttons}
        sx={{
          backgroundColor:
            currentNav == "dashboard"
              ? theme == "dark"
                ? "#484848"
                : "#dfdede"
              : "unset",
        }}
      >
        <Button
          fullWidth
          sx={{ color: theme == "dark" ? "white" : "black" }}
          onClick={() => router.push("profile?menu=dashboard")}
        >
          <HomeIcon className={styles.profile_nav_icons} />
          Dashboard
        </Button>
      </Grid>
      <Grid
        item
        className={styles.profile_nav_buttons}
        sx={{
          backgroundColor:
            currentNav == "accountdetails"
              ? theme == "dark"
                ? "#484848"
                : "#dfdede"
              : "unset",
        }}
      >
        <Button
          fullWidth
          sx={{ color: theme == "dark" ? "white" : "black" }}
          onClick={() => router.push("profile?menu=accountdetails")}
        >
          <PersonIcon className={styles.profile_nav_icons} />
          Account Details
        </Button>
      </Grid>
      <Grid
        item
        className={styles.profile_nav_buttons}
        sx={{
          backgroundColor:
            currentNav == "settings"
              ? theme == "dark"
                ? "#484848"
                : "#dfdede"
              : "unset",
        }}
      >
        <Button
          fullWidth
          sx={{ color: theme == "dark" ? "white" : "black" }}
          onClick={() => router.push("profile?menu=settings")}
        >
          <SettingsIcon className={styles.profile_nav_icons} />
          Settings
        </Button>
      </Grid>
      <Grid item className={styles.profile_nav_buttons}>
        <Button
          fullWidth
          onClick={handleLogout}
          sx={{ color: theme == "dark" ? "white" : "black" }}
        >
          <LogoutIcon className={styles.profile_nav_icons} />
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProfileNav;
