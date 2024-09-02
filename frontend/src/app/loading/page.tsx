"use client";
import React, { useEffect, useState } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

const Loading = () => {
  const { refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Pathname for redirect
  const [refreshed, setRefreshed] = useState<boolean | null>(null); // When refresh when a success or not

  // Reroute logic after refresh attempt
  useEffect(() => {
    if (refreshed != null) {
      if (refreshed == true) {
        router.refresh();
      } else {
        router.replace(`/login?redirect=${pathname}`);
      }
    }
  }, [refreshed, router, pathname]);

  // Tries to refresh token on mount
  useEffect(() => {
    const refreshToken = async () => {
      await refresh().then((res) => {
        if (res != null) {
          setRefreshed(res);
        } else {
          setRefreshed(false);
        }
      });
    };
    refreshToken();
  }, [refresh]);

  return (
    <Grid container id="loading_container">
      <CircularProgress size={"100px"} />
    </Grid>
  );
};

export default Loading;
