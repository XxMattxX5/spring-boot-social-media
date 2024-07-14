"use client";
import React, { useState } from "react";
import {
  Typography,
  Grid,
  Alert,
  TextField,
  Button,
  Collapse,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import styles from "../Login.module.css";
import Image from "next/image";
import login_picture from "../../../public/images/login_picture.jpg";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Grid container>
      <Grid item xs={12} id={styles.login_container}>
        <Grid item xs={6} id={styles.login_box}>
          <Grid item xs={11} sx={{ margin: "0 auto", paddingBottom: "20px" }}>
            <Typography variant="h3">Sign in</Typography>
          </Grid>
          <Grid item xs={11} className={styles.login_field_boxes}>
            <p className={styles.login_field_labels}>Username</p>
            <TextField
              fullWidth
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter username"
              inputProps={{ className: styles.field_inputs }}
            />
          </Grid>

          <Grid item xs={11} className={styles.login_field_boxes}>
            <p className={styles.login_field_labels}>Password</p>
            <Grid item sx={{ position: "relative" }}>
              <TextField
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                inputProps={{ className: styles.field_inputs }}
                type={showPassword ? "text" : "password"}
              />
              <IconButton
                disableRipple
                className={styles.visibilityIcon}
                onClick={() => setShowPassword(showPassword ? false : true)}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={11} className={styles.login_error}>
            <Collapse in={loginError != ""} unmountOnExit>
              <Alert onClose={() => setLoginError("")} severity="error">
                {loginError}
              </Alert>
            </Collapse>
          </Grid>
          <Grid item xs={11} className={styles.login_buttons}>
            <Grid item xs={4} sx={{ marginRight: "10px" }}>
              <Button
                fullWidth
                className={styles.login_btn}
                sx={{
                  "&:hover": {
                    backgroundColor: "#0177ac",
                  },
                }}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth className={styles.sign_up_btn}>
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} id={styles.login_image_box}>
          <Image
            src={login_picture}
            alt="Mountain"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <Grid xs={12} item className={styles.welcome_msg}>
            <Typography variant="h3" className={styles.welcome_header}>
              Welcome Back!
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
