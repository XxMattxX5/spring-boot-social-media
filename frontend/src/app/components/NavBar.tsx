"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { CldImage } from "next-cloudinary";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
  const { user, logout, settings } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theme
  const profile_picture = user?.profilePicture || ""; // User's profile picture
  const [showSideNav, setShowSideNav] = useState(false); // Whether to display side nav
  const [showProfileNav, setShowProfileNav] = useState(false); // Whether to display profile nav
  const [cookies, setCookie] = useCookies(["username"]); // User's cookies
  const username = cookies.username; // User's username

  // List of pages and their links
  const pages = [
    { name: "Home", link: "/" },
    { name: "Feed", link: "/feed" },
    { name: "Popular", link: "/popular" },
    { name: "Explore", link: "/explore" },
  ];

  // Hides navs when url changes
  const handleUrlChange = () => {
    setShowProfileNav(false);
    setShowSideNav(false);
  };

  // Logs out user
  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar id="nav">
      <Container style={{ maxWidth: "unset" }} disableGutters>
        <Toolbar disableGutters>
          <Box id="regular_nav">
            <Diversity3Icon fontSize="large" sx={{ alignSelf: "center" }} />
            <Typography className="website_title">Spring Social</Typography>
            {pages.map((page) => (
              <Link
                key={page.name}
                href={page.link}
                onClick={handleUrlChange}
                className="page_link"
              >
                <Typography>{page.name}</Typography>
              </Link>
            ))}
          </Box>
          <Box id="side_nav">
            <IconButton id="side_menu_btn" onClick={() => setShowSideNav(true)}>
              <MenuIcon fontSize="large" sx={{ color: "white" }} />
            </IconButton>

            <Box
              id={"side_menu"}
              sx={{
                left: showSideNav ? "0px" : "-310px",
                backgroundColor: theme == "dark" ? "#333333" : "white",
              }}
            >
              <Box id="side_menu_header">
                <Diversity3Icon fontSize="large" sx={{ margin: "auto 0" }} />
                <Typography className="website_title">Spring Social</Typography>
                <IconButton
                  sx={{
                    marginLeft: "auto",
                    "&:hover": {
                      backgroundColor: "unset",
                    },
                  }}
                  onClick={() => setShowSideNav(false)}
                >
                  <CloseIcon
                    fontSize="large"
                    sx={{
                      color: "white",
                    }}
                  />
                </IconButton>
              </Box>
              {pages.map((page) => (
                <Link
                  key={page.name}
                  href={page.link}
                  onClick={handleUrlChange}
                  className="side_page_link"
                  style={{ color: theme == "dark" ? "white" : "black" }}
                >
                  <Typography>{page.name}</Typography>
                </Link>
              ))}
            </Box>
          </Box>
          <Box id="nav_login_profile">
            {!username ? (
              <Link id="nav_login_btn" href="/login">
                Login
              </Link>
            ) : (
              <Box position={"relative"}>
                <Box display={"flex"} alignItems={"center"} columnGap={2}>
                  {user?.profilePicture ? (
                    <CldImage
                      src={profile_picture}
                      alt="Profile Picture"
                      width={50}
                      height={50}
                      id="nav_profile_image"
                      onClick={() =>
                        setShowProfileNav(showProfileNav ? false : true)
                      }
                    />
                  ) : null}
                </Box>
                <Box
                  id="nav_profile_drop"
                  display={showProfileNav ? "block" : "none"}
                  sx={{
                    backgroundColor: theme == "dark" ? "#333333" : "white",
                  }}
                >
                  <Box id="nav_profile_drop_header">
                    <Typography
                      sx={{
                        color: theme == "dark" ? "white" : "black",
                        textAlign: "center",
                      }}
                    >
                      {cookies.username}
                    </Typography>
                    {user?.profilePicture ? (
                      <CldImage
                        src={profile_picture}
                        alt="Profile Picture"
                        width={35}
                        height={35}
                        id="nav_profile_drop_image"
                      />
                    ) : null}
                  </Box>
                  <Button
                    className="nav_profile_drop_btns"
                    onClick={handleUrlChange}
                  >
                    <Link href="/profile">
                      <PersonIcon className="nav_profile_drop_btns_icon" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    className="nav_profile_drop_btns"
                    onClick={handleUrlChange}
                  >
                    <Link href="/profile?menu=settings">
                      <SettingsIcon className="nav_profile_drop_btns_icon" />
                      Settings
                    </Link>
                  </Button>
                  <Button
                    className="nav_profile_drop_btns"
                    onClick={handleLogout}
                  >
                    <LogoutIcon className="nav_profile_drop_btns_icon" />
                    Logout
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
