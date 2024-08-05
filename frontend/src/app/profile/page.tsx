import React from "react";
import { Grid } from "@mui/material";
import dynamic from "next/dynamic";
import styles from "../styles/profile.module.css";
import { Metadata } from "next";

const ProfileMenu = dynamic(() => import("./components/ProfileMenu"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Spring Social - Profile",
  description: "...",
};

const Profile = () => {
  return (
    <Grid container>
      <ProfileMenu />
    </Grid>
  );
};

export default Profile;
