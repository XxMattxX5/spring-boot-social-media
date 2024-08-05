import React from "react";
import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import styles from "../styles/register.module.css";
import { Metadata } from "next";

const RegisterForm = dynamic(() => import("./RegisterForm"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Spring Social - Register",
  description: "...",
};

const Register = () => {
  return (
    <Grid id={styles.register_form_container}>
      <RegisterForm />
    </Grid>
  );
};

export default Register;
