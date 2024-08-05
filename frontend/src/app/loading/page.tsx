"use client";
import React, { useEffect, useState } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
// import { refreshToken } from "../lib/Auth";
import { useAuth } from "../hooks/Auth";
import { useCookies } from "react-cookie";
import { stat } from "fs";

const page = () => {
  const { refresh } = useAuth();
  const [cookies, setCookies] = useCookies(["access_token", "refresh_token"]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";
  const [refreshed, setRefreshed] = useState<boolean | null>(null);

  useEffect(() => {
    if (refreshed != null) {
      if (refreshed == true) {
        router.refresh();
      } else {
        router.replace(`/login?redirect=${redirect}`);
      }
    }
  }, [refreshed]);

  useEffect(() => {
    const controller = new AbortController();
    const refreshToken = async () => {
      await refresh(controller).then((res) => {
        if (res != null) {
          setRefreshed(res);
        }
      });
      //   const backendUrl =
      //     process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      //   let status: null | boolean = null;
      //   await fetch(`${backendUrl}/auth/refresh`, {
      //     headers: {
      //       Accept: "application/json",
      //     },
      //     method: "POST",
      //     credentials: "include",
      //     signal: controller.signal,
      //   })
      //     .then((res) => {
      //       if (res.ok) {
      //         status = true;
      //       } else {
      //         sessionStorage.setItem("status", String(res.status));
      //         throw new Error("Token not valid");
      //       }
      //     })
      //     .catch((error) => {
      //       if (String(error.name) !== "AbortError") {
      //         status = null;
      //         console.log("Error refreshing tokens: " + JSON.stringify(error));
      //         // logout();
      //         status = false;
      //       } else {
      //       }
      //     });
      //   sessionStorage.setItem(
      //     "fetch",
      //     sessionStorage.getItem("fetch") + String(status)
      //   );
      //   if (status != null) {
      //     setRefreshed(status);
      //   }
      // sessionStorage.setItem("first", cookies.refresh_token);
      // setRefreshed(await refresh());
    };
    refreshToken();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Grid container id="loading_container">
      <CircularProgress size={"100px"} />
    </Grid>
  );
};

export default page;
