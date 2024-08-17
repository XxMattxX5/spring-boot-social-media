import React from "react";
import { Typography } from "@mui/material";
import { relative } from "path";

const Unauthorized = () => {
  return (
    <Typography
      variant="h4"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      You are not authorized to access this page
    </Typography>
  );
};

export default Unauthorized;
