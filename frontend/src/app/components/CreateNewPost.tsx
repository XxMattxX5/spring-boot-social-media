"use client";
import React, { useState, useEffect } from "react";
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
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useScrollBlock } from "../hooks/useScrollBlock";

type Props = {
  displayMenuClose: () => void;
};

const CreateNewPost = ({ displayMenuClose }: Props) => {
  const router = useRouter();
  const [blockScroll, allowScroll] = useScrollBlock(); // Used to allow or block scroll
  const { settings, refresh } = useAuth();
  // Url for the backend
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const theme = settings?.colorTheme || "light"; // User's selected theme
  const [content, setContent] = useState<string>(""); // Content for new post
  const [postError, setPostError] = useState(""); // Error for post creation

  // Blocks scroll when mounted and allows scroll when unmounted
  useEffect(() => {
    blockScroll();
    return () => {
      allowScroll();
    };
  }, [blockScroll, allowScroll]);

  // Creates a new post if content isn't empty
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
        } else if (res.status === 401) {
          status = false;
        } else {
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was 401
    if (status == false) {
      const refreshStatus = await refresh();
      if (refreshStatus) {
        createPost();
      }
    } else if (status != true) {
      setPostError("Failed to create post");
    }
  };

  // Handles changes to the new post comment
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
        <Grid
          item
          sx={{ minHeight: "400px", display: "flex", alignItems: "stretch" }}
        >
          <Tiptap contentCallBack={handleContentChange} />
        </Grid>
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
