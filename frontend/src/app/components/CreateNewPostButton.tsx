"use client";
import React, { useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateNewPost from "./CreateNewPost";

const CreateNewPostButton = () => {
  const [displayCreatePost, setDisplayCreatePost] = useState(false);

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
          {/* <AddIcon /> */}
        </Button>
      </Grid>
    </>
  );
};

export default CreateNewPostButton;
