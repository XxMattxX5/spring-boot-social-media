import styles from "./page.module.css";
import { Grid, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring Social",
  description: "Spring social home page",
};

export default async function Home() {
  return <Grid container>Home</Grid>;
}
