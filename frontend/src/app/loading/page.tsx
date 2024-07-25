"use client";
import React, { useEffect, useState } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { refreshToken } from "../lib/Auth";
import { useCookies } from "react-cookie";

const page = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";
  const [refreshed, setRefreshed] = useState<boolean | null>(null);

  if (refreshed != null) {
    if (refreshed == true) {
      window.location.reload();
    } else {
      router.replace(`/login?redirect=${redirect}`);
    }
  }

  useEffect(() => {
    const refresh = async () => {
      await refreshToken().then((res) => setRefreshed(res));
    };
    refresh();
  }, []);

  return (
    <Grid container id="loading_container">
      <CircularProgress size={"100px"} />
    </Grid>
  );
};

export default page;
