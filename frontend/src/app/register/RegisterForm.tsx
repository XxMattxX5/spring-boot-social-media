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
import styles from "../styles/register.module.css";
import Image from "next/image";
import login_picture from "../../../public/images/login_picture.jpg";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterForm = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState(""); // Name input
  const [username, setUsername] = useState(""); // Username input
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [passwordConfirm, setPasswordConfirm] = useState(""); // Password confirmation
  const [showPassword, setShowPassword] = useState(false); // Whether to show passsword
  const [showConfirm, setShowConfirm] = useState(false); // Whether to show confirm password
  // Register errors
  const [registerErrors, setRegisterErrors] = useState({
    error1: "",
    error2: "",
    error3: "",
    error4: "",
    error5: "",
  });

  // Attempts to register user account
  const register = () => {
    const err = registerErrors;
    if (!fullName || !username || !email || !password || !passwordConfirm) {
      setRegisterErrors({
        error1: fullName ? "" : "Name field cannot be blank",
        error2: username ? "" : "Username field cannot be blank",
        error3: email ? "" : "Email field cannot be blank",
        error4: password ? "" : "Password field cannot be blank",
        error5: passwordConfirm ? "" : "Confirm field cannot be blank",
      });
      return;
    } else if (
      err.error1 ||
      err.error2 ||
      err.error3 ||
      err.error4 ||
      err.error5
    ) {
      return;
    }
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(`/api/auth/signup`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        name: fullName,
      }),
    })
      .then((res) => {
        if (res.ok) {
          router.push("/login?created=true");
        } else if (res.status === 400) {
          return res.json();
        } else {
          throw new Error("Account creation failed");
        }
      })
      .then((data) => {
        if (data) {
          setRegisterErrors((prev) => ({
            ...prev,
            error1: data.error1 ? data.error1 : "",
            error2: data.error2 ? data.error2 : "",
            error3: data.error3 ? data.error3 : "",
            error4: data.error4 ? data.error4 : "",
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handles changes to full name field and validates it
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let error;
    if (e.target.value.length < 3) {
      error = "Name must be 3 characters or greater";
    } else {
      setRegisterErrors((prev) => ({ ...prev, error1: "" }));
    }

    if (error) {
      setRegisterErrors((prev) => ({ ...prev, error1: error }));
    }
    setFullName(e.target.value);
  };

  // Handles changes to the username field and validates it
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let error;
    if (e.target.value.length < 3) {
      error = "Username must be 3 characters or greater";
    } else {
      setRegisterErrors((prev) => ({ ...prev, error2: "" }));
    }

    if (error) {
      setRegisterErrors((prev) => ({ ...prev, error2: error }));
    }

    setUsername(e.target.value);
  };
  // Handles changes to the email field and validates it
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let error;

    if (!e.target.value.match(regex)) {
      error = "Must be a valid email address";
    } else {
      setRegisterErrors((prev) => ({ ...prev, error3: "" }));
    }
    if (error) {
      setRegisterErrors((prev) => ({ ...prev, error3: error }));
    }
    setEmail(e.target.value);
  };

  // Handles changes to the password field and validates it
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let error;

    if (e.target.value.length < 8) {
      error = "Password must be at least 8 charactes long";
    } else if (!e.target.value.match(/(?=.*[A-Z])/)) {
      error = "Password must contain at least 1 capital letter";
    } else if (!e.target.value.match(/(?=.*[\d\W])/)) {
      error = "Password must contain at least 1 number or special character";
    } else {
      setRegisterErrors((prev) => ({ ...prev, error4: "" }));
    }

    if (error) {
      setRegisterErrors((prev) => ({ ...prev, error4: error }));
    }
    setPassword(e.target.value);
  };

  // Handles changes to the confirm password field and validates it
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value !== password) {
      setRegisterErrors((prev) => ({
        ...prev,
        error5: "Passwords must match",
      }));
    } else {
      setRegisterErrors((prev) => ({
        ...prev,
        error5: "",
      }));
    }

    setPasswordConfirm(e.target.value);
  };

  return (
    <Grid container>
      <Grid item xs={12} id={styles.register_container}>
        <Grid item xs={6} id={styles.register_box}>
          <Grid item xs={12} sx={{ margin: "0", paddingBottom: "20px" }}>
            <Typography variant="h3">Sign Up</Typography>
          </Grid>
          <Grid item xs={12} className={styles.register_input_container}>
            <Grid item xs={12} className={styles.register_field_boxes}>
              <p className={styles.register_field_labels}>Full Name</p>
              <TextField
                fullWidth
                value={fullName}
                onChange={handleNameChange}
                placeholder="Enter full name"
                inputProps={{ className: styles.field_inputs, maxLength: 60 }}
              />
            </Grid>
            <Grid item xs={12} className={styles.register_errors}>
              <Collapse in={registerErrors.error1 != ""}>
                <Alert severity="error">{registerErrors.error1}</Alert>
              </Collapse>
            </Grid>
            <Grid item xs={12} className={styles.register_field_boxes}>
              <p className={styles.register_field_labels}>Username</p>
              <TextField
                fullWidth
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter username"
                inputProps={{ className: styles.field_inputs, maxLength: 40 }}
              />
            </Grid>
            <Grid item xs={12} className={styles.register_errors}>
              <Collapse in={registerErrors.error2 != ""}>
                <Alert severity="error">{registerErrors.error2}</Alert>
              </Collapse>
            </Grid>
            <Grid item xs={12} className={styles.register_field_boxes}>
              <p className={styles.register_field_labels}>Email</p>
              <TextField
                fullWidth
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter email"
                inputProps={{ className: styles.field_inputs, maxLength: 80 }}
              />
            </Grid>
            <Grid item xs={12} className={styles.register_errors}>
              <Collapse in={registerErrors.error3 != ""}>
                <Alert severity="error">{registerErrors.error3}</Alert>
              </Collapse>
            </Grid>
            <Grid item xs={12} className={styles.register_field_boxes}>
              <p className={styles.register_field_labels}>Password</p>
              <Grid item sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter password"
                  inputProps={{ className: styles.field_inputs, maxLength: 40 }}
                  type={showPassword ? "text" : "password"}
                />
                <IconButton
                  disableRipple
                  className={styles.visibilityIcon}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={12} className={styles.register_errors}>
              <Collapse in={registerErrors.error4 != ""}>
                <Alert severity="error">{registerErrors.error4}</Alert>
              </Collapse>
            </Grid>
            <Grid item xs={12} className={styles.register_field_boxes}>
              <p className={styles.register_field_labels}>Confirm Password</p>
              <Grid item sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  placeholder="Enter password"
                  inputProps={{ className: styles.field_inputs, maxLength: 40 }}
                  type={showConfirm ? "text" : "password"}
                />
                <IconButton
                  disableRipple
                  className={styles.visibilityIcon}
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={12} className={styles.register_errors}>
              <Collapse in={registerErrors.error5 != ""}>
                <Alert severity="error">{registerErrors.error5}</Alert>
              </Collapse>
            </Grid>
          </Grid>
          <Grid item xs={12} className={styles.register_buttons}>
            <Grid item xs={4} sx={{ marginRight: "10px" }}>
              <Button
                fullWidth
                className={styles.register_btn}
                sx={{
                  "&:hover": {
                    backgroundColor: "#0177ac",
                  },
                }}
                onClick={register}
              >
                Create Account
              </Button>
            </Grid>

            <Grid item xs={4}>
              <Link href="/login" className={styles.back_to_login}>
                Back to Login
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} id={styles.register_image_box}>
          <Image
            src={login_picture}
            alt="Mountain"
            style={{ width: "100%", height: "100%", display: "block" }}
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

export default RegisterForm;
