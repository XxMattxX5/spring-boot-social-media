"use client";
import { Grid, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import ProfileNav from "./ProfileNav";
import AccountDetails from "./AccountDetails";
import Dashboard from "./Dashboard";
import ProfileImage from "./ProfileImage";
import Settings from "./Settings";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ReactLoading from "react-loading";

interface UserInfo {
  name: string;
  username: string;
  email: string;
}

const ProfileMenu = () => {
  const [displayedMenu, setDisplayedMenu] = useState(
    sessionStorage.getItem("profile_menu") || "dashboard"
  );
  const [showSideBar, setShowSideBar] = useState(false);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    getProfileInfo();
  }, []);

  const changeDisplayedMenu = (name: string) => {
    setShowSideBar(false);
    sessionStorage.setItem("profile_menu", name);
    setDisplayedMenu(name);
  };

  const getProfileInfo = () => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(`${backendUrl}/user/info`, {
      headers: headers,
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          console.log("REFRESH");
          getProfileInfo();
        } else {
          throw new Error("Failed to update user info");
        }
      })
      .then((data) => {
        if (data) {
          setUserInfo(data);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid container id={styles.profile_menu_container}>
      <Grid
        item
        id={styles.profile_nav_container}
        sx={{ left: showSideBar ? "0px" : "-250px" }}
      >
        <Grid item id={styles.profile_nav_content_box}>
          <Grid item id={styles.profile_image_container}>
            <ProfileImage />
          </Grid>
          <ProfileNav
            changeDisplayCallBack={changeDisplayedMenu}
            currentNav={displayedMenu}
          />
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
      <Grid item id={styles.profile_current_nav_menu}>
        {displayedMenu === "dashboard" ? <Dashboard /> : null}
        {displayedMenu === "accountdetails" ? (
          userInfo == null ? (
            <ReactLoading
              type="spinningBubbles"
              color="#00abf7"
              className={styles.profile_menu_loading}
            />
          ) : (
            <AccountDetails userInfo={userInfo} />
          )
        ) : null}
        {displayedMenu === "settings" ? <Settings /> : null}
      </Grid>
    </Grid>
  );
};

export default ProfileMenu;
