import React from "react";
import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring Social - View",
  description: "View user's profile",
};

const ViewProfile = dynamic(() => import("../../../components/ViewProfile"), {
  ssr: false,
});

const UserProfile = () => {
  return (
    <Grid container>
      <ViewProfile />
    </Grid>
  );
};

export default UserProfile;
