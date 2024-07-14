"use client";
import React from "react";
import { Grid, Button } from "@mui/material";
import Link from "next/link";
const Footer = () => {
  return (
    <Grid container id="footer">
      <Grid item xs={12} id="backtotop_btn">
        <Button fullWidth onClick={() => window.scrollTo(0, 0)}>
          Back To Top
        </Button>
      </Grid>
      <Grid item xs={12} id="footer_content_container" textAlign={"center"}>
        <Link href="https://github.com">GitHub</Link>
      </Grid>
    </Grid>
  );
};

export default Footer;
