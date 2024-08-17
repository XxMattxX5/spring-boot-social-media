import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Collapse,
  Alert,
} from "@mui/material";
import styles from "../../styles/profile.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../hooks/useAuth";

const AccountDetails = () => {
  const { user, settings, refresh, fetchUser } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theme
  const [name, setName] = useState(user?.name); // Name input
  const [username, setUsername] = useState(user?.username); // Username input
  const [email, setEmail] = useState(user?.email); // Email input
  const [errors, setErrors] = useState({ error1: "", error2: "" }); // Error messages
  const [success, setSuccess] = useState(""); // Success message
  const [deleteError, setDeleteError] = useState(""); // Delete account error
  // Url for the backend
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Sets user info on mount
  useEffect(() => {
    setName(user?.name);
    setUsername(user?.username);
    setEmail(user?.email);
  }, [user]);

  // Updates user info
  const updateInfo = async () => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    let status = null;
    await fetch(`${backendUrl}/user/update_info`, {
      method: "PATCH",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({
        name: name,
        username: username,
      }),
    })
      .then((res) => {
        if (res.ok) {
          fetchUser();
          status = true;
          setSuccess("Account Details Updated!");
          setErrors({ error1: "", error2: "" });
        } else if (res.status === 400) {
          return res.json();
        } else if (res.status === 401) {
          status = false;
          return;
        }
      })
      .then((data) => {
        if (data) {
          setErrors({
            error1: data.error1 ? data.error1 : "",
            error2: data.error2 ? data.error2 : "",
          });
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was a 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed) {
        updateInfo();
      }
    }
  };

  // Handles changes to name input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Handles changes to username input
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Makes sure user want to delete account before proceceeding
  const handleDelete = async (first = true) => {
    if (
      first == false ||
      confirm(
        "Are you want to delete your account? You can't recover it afterwards."
      )
    ) {
      let status = null;
      fetch(`${backendUrl}/user/delete`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            status = true;
            window.location.reload();
          } else if (res.status === 401) {
            status = false;
          } else {
            setDeleteError("Failed to delete account");
          }
        })
        .catch((error) => console.log(error));

      // Refreshes token and tries again if error was a 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          handleDelete(false);
        }
      }
    } else {
      return;
    }
  };

  return (
    <Grid container height={"100%"}>
      <Grid container>
        <Typography variant="h2" className={styles.profile_menu_header}>
          Account Details
        </Typography>
        <Grid item id={styles.account_details_input_container}>
          <Grid className={styles.account_details_input_box}>
            <Typography
              className={styles.account_details_input_label}
              variant="h4"
              sx={{ color: theme == "dark" ? "white" : "black" }}
            >
              Name
            </Typography>
            <TextField
              value={name}
              inputProps={{ className: styles.account_details_input }}
              fullWidth
              onChange={handleNameChange}
              sx={{
                div: { color: theme == "dark" ? "white" : "black" },
                backgroundColor: theme == "dark" ? "#33333" : "white",
              }}
            />
            <Collapse
              in={errors.error1 != ""}
              className={styles.account_details_errors}
            >
              <Alert
                severity="error"
                onClose={() => setErrors((prev) => ({ ...prev, error1: "" }))}
              >
                {errors.error1}
              </Alert>
            </Collapse>
          </Grid>
          <Grid className={styles.account_details_input_box}>
            <Typography
              className={styles.account_details_input_label}
              variant="h4"
              sx={{ color: theme == "dark" ? "white" : "black" }}
            >
              Username
            </Typography>
            <TextField
              value={username}
              fullWidth
              onChange={handleUsernameChange}
              inputProps={{
                className: styles.account_details_input,
              }}
              sx={{
                div: { color: theme == "dark" ? "white" : "black" },
                backgroundColor: theme == "dark" ? "#33333" : "white",
              }}
            />
            <Collapse
              in={errors.error2 != ""}
              className={styles.account_details_errors}
            >
              <Alert
                severity="error"
                onClose={() => setErrors((prev) => ({ ...prev, error2: "" }))}
              >
                {errors.error2}
              </Alert>
            </Collapse>
          </Grid>
          <Grid className={styles.account_details_input_box}>
            <Typography
              className={styles.account_details_input_label}
              variant="h4"
              sx={{ color: theme == "dark" ? "white" : "black" }}
            >
              Email
            </Typography>
            <TextField
              value={email}
              fullWidth
              inputProps={{
                className: styles.account_details_input,
              }}
              sx={{
                div: {
                  WebkitTextFillColor:
                    theme == "dark"
                      ? "rgb(255,255,255, .38)"
                      : "rgb(0,0,0, .38)",
                },
                backgroundColor: theme == "dark" ? "#33333" : "white",
              }}
            />
          </Grid>
        </Grid>

        <Collapse
          in={success != ""}
          sx={{ width: "100%", marginBottom: "10px" }}
        >
          <Alert severity="success" onClose={() => setSuccess("")}>
            {success}
          </Alert>
        </Collapse>
        <Button fullWidth id={styles.account_details_save} onClick={updateInfo}>
          <Typography fontWeight={"bold"}>Save Changes</Typography>
        </Button>
      </Grid>
      <Grid item id={styles.delete_account_container}>
        <Button
          id={styles.delete_account_btn}
          sx={{
            backgroundColor: theme == "dark" ? "#33333" : "white",
            color: theme == "dark" ? "white" : "red",
          }}
          onClick={() => handleDelete()}
        >
          <DeleteIcon />
          <Typography fontWeight={"bold"}>Delete Account</Typography>
        </Button>
        <Typography
          id={styles.delete_account_warning}
          sx={{ color: theme == "dark" ? "white" : "black" }}
        >
          Warning!: If you delete your account all settings, account
          information, posts, and friends will be deleted and unrecoverable
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AccountDetails;
