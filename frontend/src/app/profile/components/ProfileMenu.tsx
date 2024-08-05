"use client";
import { Grid, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../../styles/profile.module.css";
import ProfileNav from "./ProfileNav";
import AccountDetails from "./AccountDetails";
import Dashboard from "./Dashboard";
import ProfileImage from "./ProfileImage";
import Settings from "./Settings";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ReactLoading from "react-loading";
import { useAuth } from "../../hooks/Auth";

interface UserInfo {
  name: string;
  username: string;
  email: string;
}

const ProfileMenu = () => {
  const { settings, user } = useAuth();
  const theme = settings?.colorTheme || "light";
  const searchParams = useSearchParams();
  const displayedMenu = searchParams.get("menu") || "dashboard";
  const [showSideBar, setShowSideBar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const currentMenuBackgroundColor = useState("white");

  useEffect(() => {
    setShowSideBar(false);
  }, [displayedMenu]);

  // useEffect(() => {
  //   let timeout: NodeJS.Timeout;
  //   const handleBackground = () => {
  //     setWindowWidth(window.innerWidth);
  //   };
  //   window.addEventListener("resize", handleBackground
  //    );

  //   return () => {
  //     window.removeEventListener("resize", handleBackground);
  //   };
  // }, [window.innerWidth]);

  return (
    <Grid container id={styles.profile_menu_container}>
      <Grid
        item
        id={styles.profile_nav_container}
        sx={{
          left: showSideBar ? "0px" : "-250px",
          backgroundColor: theme == "dark" ? "#333333" : "#eeeeee",
        }}
      >
        <Grid item id={styles.profile_nav_content_box}>
          <Grid item id={styles.profile_image_container}>
            <ProfileImage />
          </Grid>
          <ProfileNav currentNav={displayedMenu} />
        </Grid>
        <Grid item id={styles.profile_nav_sidebar}>
          <IconButton
            id={styles.profile_nav_expand_btn}
            onClick={() => setShowSideBar((prev) => !prev)}
          >
            {showSideBar ? (
              <KeyboardDoubleArrowLeftIcon
                sx={{ color: "white" }}
                fontSize="large"
              />
            ) : (
              <KeyboardDoubleArrowRightIcon
                sx={{ color: "white" }}
                fontSize="large"
              />
            )}
          </IconButton>
        </Grid>
      </Grid>
      <Grid
        item
        id={styles.profile_current_nav_menu}
        sx={{
          backgroundColor: theme == "dark" ? "#333333 !important" : "unset",

          // ? "#eeeeee"
          // : "white",
        }}
      >
        {displayedMenu === "dashboard" ? <Dashboard /> : null}
        {displayedMenu === "accountdetails" ? (
          user == null ? (
            <ReactLoading
              type="spinningBubbles"
              color="#00abf7"
              className={styles.profile_menu_loading}
            />
          ) : (
            <AccountDetails />
          )
        ) : null}
        {displayedMenu === "settings" ? <Settings /> : null}
      </Grid>
    </Grid>
  );
};

export default ProfileMenu;
