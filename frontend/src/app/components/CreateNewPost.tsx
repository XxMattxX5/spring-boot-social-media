"use client";
import React, { useState } from "react";
import styles from "../styles/createpost.module.css";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Collapse,
  Alert,
} from "@mui/material";
import Tiptap from "./Tiptap";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../hooks/Auth";
import { useRouter } from "next/navigation";
import { stat } from "fs";

type Props = {
  displayMenuClose: () => void;
};

const CreateNewPost = ({ displayMenuClose }: Props) => {
  const router = useRouter();
  const { settings, refresh } = useAuth();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const theme = settings?.colorTheme || "light";
  const [content, setContent] = useState<string>("");
  const [postError, setPostError] = useState("");

  const createPost = async () => {
    if (!content) {
      setPostError("Post content cannot be empty");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
    };
    let status = null;
    await fetch(`${backendUrl}/post/create`, {
      headers: headers,
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        content: content,
      }),
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          router.refresh();
          displayMenuClose();
        } else if (res.status === 401 || res.status === 403) {
          status = false;
        } else {
        }
      })
      .catch((error) => console.log(error));

    if (status == false) {
      const refreshStatus = await refresh();
      if (refreshStatus) {
        createPost();
      }
    } else if (status != true) {
      setPostError("Failed to create post");
    }
  };

  const handleContentChange = (content: string) => {
    setContent(content);
  };

  return (
    <Grid container id={styles.create_new_post_container}>
      <Grid item id={styles.create_new_post_close_box}>
        <IconButton onClick={displayMenuClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Grid>
      <Grid
        item
        id={styles.create_new_post_box}
        sx={{
          backgroundColor: theme == "dark" ? "#333333" : "#eeeeee",
          color: theme == "dark" ? "white" : "black",
        }}
      >
        <Typography id={styles.create_new_post_header} variant="h3">
          Create New Post
        </Typography>
        <Tiptap contentCallBack={handleContentChange} />
        <Collapse in={postError != ""}>
          <Alert
            severity="error"
            onClose={() => setPostError("")}
            sx={{ boxShadow: "black 0px 0px 3px", marginTop: "10px" }}
          >
            {postError}
          </Alert>
        </Collapse>
        <Button fullWidth id={styles.create_post_button} onClick={createPost}>
          <Typography>Create Post</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateNewPost;
