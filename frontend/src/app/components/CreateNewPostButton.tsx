"use client";
import React, { useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import CreateNewPost from "./CreateNewPost";

const CreateNewPostButton = () => {
  const [displayCreatePost, setDisplayCreatePost] = useState(false); // Whether to display the create post menu

  // Toggles display post menu
  const handleDisplayCreatePostchange = () => {
    setDisplayCreatePost((prev) => !prev);
  };

  return (
    <>
      {displayCreatePost ? (
        <CreateNewPost displayMenuClose={handleDisplayCreatePostchange} />
      ) : null}
      <Grid item id="create_new_post">
        <Button fullWidth onClick={handleDisplayCreatePostchange}>
          <Typography variant="h4">Create New Post</Typography>
        </Button>
      </Grid>
    </>
  );
};

export default CreateNewPostButton;
