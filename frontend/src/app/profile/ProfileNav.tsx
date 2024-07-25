import React from "react";
import { Button, Grid } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import styles from "../styles/profile.module.css";
import SettingsIcon from "@mui/icons-material/Settings";

type Props = {
  changeDisplayCallBack: (name: string) => void;
  currentNav: string;
};

const ProfileNav = ({ changeDisplayCallBack, currentNav }: Props) => {
  return (
    <Grid container id={styles.profile_nav}>
      <Grid
        item
        className={styles.profile_nav_buttons}
        sx={{
          backgroundColor: currentNav == "dashboard" ? "#dfdede" : "white",
        }}
      >
        <Button fullWidth onClick={() => changeDisplayCallBack("dashboard")}>
          <HomeIcon className={styles.profile_nav_icons} />
          Dashboard
        </Button>
      </Grid>
      <Grid
        item
        className={styles.profile_nav_buttons}
        sx={{
          backgroundColor: currentNav == "accountdetails" ? "#dfdede" : "white",
        }}
      >
        <Button
          fullWidth
          onClick={() => changeDisplayCallBack("accountdetails")}
        >
          <PersonIcon className={styles.profile_nav_icons} />
          Account Details
        </Button>
      </Grid>
      <Grid
        item
        className={styles.profile_nav_buttons}
        sx={{
          backgroundColor: currentNav == "settings" ? "#dfdede" : "white",
        }}
      >
        <Button fullWidth onClick={() => changeDisplayCallBack("settings")}>
          <SettingsIcon className={styles.profile_nav_icons} />
          Settings
        </Button>
      </Grid>
      <Grid item className={styles.profile_nav_buttons}>
        <Button fullWidth>
          <LogoutIcon className={styles.profile_nav_icons} />
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProfileNav;
