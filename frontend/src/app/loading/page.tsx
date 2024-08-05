"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useCookies } from "react-cookie";

const Loading = () => {
  const { refresh } = useAuth();
  const [cookies, setCookies] = useCookies(["access_token", "refresh_token"]);
  // const searchParams = useSearchParams();
  const pathname = usePathname();

  const router = useRouter();
  // const redirect = searchParams.get("redirect") || "/";
  const [refreshed, setRefreshed] = useState<boolean | null>(null);

  useEffect(() => {
    if (refreshed != null) {
      if (refreshed == true) {
        router.refresh();
      } else {
        router.replace(`/login?redirect=${pathname}`);
      }
    }
  }, [refreshed, router, pathname]);

  useEffect(() => {
    const controller = new AbortController();
    const refreshToken = async () => {
      await refresh(controller).then((res) => {
        if (res != null) {
          setRefreshed(res);
        }
      });
    };
    refreshToken();
    return () => {
      controller.abort();
    };
  }, [refresh]);

  return (
    <Grid container id="loading_container">
      <CircularProgress size={"100px"} />
    </Grid>
  );
};

export default Loading;
