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
import Image from "next/image";
import login_picture from "../../../public/images/login_picture.jpg";
import { useCookies } from "react-cookie";
import { CldImage } from "next-cloudinary";

const NavBar = () => {
  const [showSideNav, setShowSideNav] = useState(false);
  const [showProfileNav, setShowProfileNav] = useState(false);
  const [cookies, setCookie] = useCookies(["username", "profile_picture"]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const username = cookies.username;

  const pages = [
    { name: "Home", link: "/" },
    { name: "Login", link: "/login" },
    { name: "Link2", link: "/Link2" },
  ];

  const handleUrlChange = () => {
    setShowProfileNav(false);
    setShowSideNav(false);
  };

  const handleLogout = () => {
    try {
      fetch(`${backendUrl}/auth/logout`, {
        credentials: "include",

        method: "DELETE",
      }).then((res) => window.location.reload());
    } catch (error) {
      console.error("Logout Failed");
    }
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

            <Box id={"side_menu"} left={showSideNav ? "0px" : "-310px"}>
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
                  <Typography>{username}</Typography>

                  <CldImage
                    src={cookies.profile_picture}
                    alt="Profile Picture"
                    width={50}
                    height={50}
                    id="nav_profile_image"
                    onClick={() =>
                      setShowProfileNav(showProfileNav ? false : true)
                    }
                  />
                  {/* <Image
                    src={login_picture}
                    alt="Profile Picture"
                    width={50}
                    height={50}
                    id="nav_profile_image"
                    onClick={() =>
                      setShowProfileNav(showProfileNav ? false : true)
                    }
                  /> */}
                </Box>
                <Box
                  id="nav_profile_drop"
                  display={showProfileNav ? "block" : "none"}
                >
                  <Button className="nav_profile_drop_btns">
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button
                    className="nav_profile_drop_btns"
                    onClick={handleLogout}
                  >
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
