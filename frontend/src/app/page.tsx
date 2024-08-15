import Image from "next/image";
import styles from "./page.module.css";
import { Grid, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring Social",
  description: "...",
};

export default async function Home() {
  return <Grid container>Home</Grid>;
}
