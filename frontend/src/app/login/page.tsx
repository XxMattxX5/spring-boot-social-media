import React from "react";
import { Typography, Grid, Alert, TextField } from "@mui/material";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Spring Social - Login",
  description: "...",
};

const Login = () => {
  return (
    <Grid container>
      <Grid item xs={12} id="login_form_container">
        <LoginForm />
      </Grid>
    </Grid>
  );
};

export default Login;
