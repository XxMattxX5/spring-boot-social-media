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
import styles from "../../styles/login.module.css";
import Image from "next/image";
import login_picture from "../../../../public/images/login_picture.jpg";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState(""); // Username input
  const [password, setPassword] = useState(""); // Password input
  const [loginError, setLoginError] = useState(""); // Error for user's login attempt
  const [showPassword, setShowPassword] = useState(false); // Whether to display password
  const [created, setCreated] = useState(
    useSearchParams().get("created") == "true" ? "true" : "false"
  );

  // Gets a user id from user's localstorage or creates them a new one
  const getDeviceId = () => {
    let deviceId = localStorage.getItem("device_id");

    if (!deviceId) {
      deviceId = uuidv4();
      if (deviceId) {
        localStorage.setItem("device_id", deviceId);
      }
    }

    return deviceId;
  };

  // Logins in user and sets error if there are any
  const loginUser = async () => {
    setLoginError(await login(username, password, getDeviceId()));
  };

  // Handles changes to the username input
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Handles changes to the password input
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Grid container>
      <Grid item xs={12} id={styles.login_container}>
        <Grid item xs={6} id={styles.login_box}>
          <Collapse in={created != "false"}>
            <Alert
              onClose={() => setCreated("false")}
              sx={{ marginBottom: "20px" }}
              severity="success"
            >
              Account created successfully
            </Alert>
          </Collapse>
          <Grid item xs={12} sx={{ marginBottom: "20px" }}>
            <Typography variant="h3">Sign in</Typography>
          </Grid>
          <Grid item xs={12} className={styles.login_field_boxes}>
            <p className={styles.login_field_labels}>Username</p>
            <TextField
              fullWidth
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter username"
              inputProps={{ className: styles.field_inputs }}
            />
          </Grid>

          <Grid item xs={12} className={styles.login_field_boxes}>
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
          <Grid item xs={12} className={styles.login_error}>
            <Collapse in={loginError != ""}>
              <Alert onClose={() => setLoginError("")} severity="error">
                {loginError}
              </Alert>
            </Collapse>
          </Grid>
          <Grid item xs={12} className={styles.login_buttons}>
            <Grid item xs={4} sx={{ marginRight: "10px" }}>
              <Button
                fullWidth
                className={styles.login_btn}
                sx={{
                  "&:hover": {
                    backgroundColor: "#0177ac",
                  },
                }}
                onClick={loginUser}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Link href="/register" className={styles.sign_up_btn}>
                Sign Up
              </Link>
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
