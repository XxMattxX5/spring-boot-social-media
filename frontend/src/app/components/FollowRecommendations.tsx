"use client";
import React, { useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import styles from "../styles/FollowRecommendations.module.css";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";

type Recommendation = {
  id: number;
  username: string;
  profilePicture: string;
};

const FollowRecommendations = () => {
  const { settings, refresh } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theem
  // Url for the backend
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]); // List of follow recommendations

  // Removes recommendation if user follows them
  const removeRecommendation = (userId: number) => {
    setRecommendations(recommendations.filter((item) => item.id !== userId));
  };

  // Gets list of recommendations
  useEffect(() => {
    const getRecommendations = async () => {
      let status = null;
      await fetch(`${backendUrl}/follow/recommendations`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            status = true;
            return res.json();
          } else if (res.status === 401) {
            status = false;
          } else {
            throw new Error("Unable to retrieve recommedations");
          }
        })
        .then((data) => {
          if (data) {
            setRecommendations(data);
          }
        });

      // Refreshes token and tries again if error was 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          getRecommendations();
        }
      }
    };
    getRecommendations();
  }, [backendUrl, refresh]);

  // Follows user
  const follow = async (userId: number) => {
    let status = null;

    await fetch(`${backendUrl}/follow/${userId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          removeRecommendation(userId);
          return;
        } else if (res.status === 401) {
          status = false;
          return;
        } else if (res.status === 403) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          alert(data.message);
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed == true) {
        follow(userId);
      }
    }
  };

  return (
    <Grid container id={styles.followrec_container}>
      <Grid
        item
        id={styles.followrec_box}
        sx={{ backgroundColor: theme == "dark" ? "#333333" : "white" }}
      >
        <Grid item id={styles.followrec_header}>
          <Typography variant="h5">Follow Recommendations</Typography>
        </Grid>
        <Grid item id={styles.followrec_content_box}>
          {recommendations.map((rec) => (
            <Grid item className={styles.followrec_box} key={rec.id}>
              <Grid item className={styles.followrec_box_info}>
                <img
                  src={rec.profilePicture}
                  height={50}
                  width={50}
                  className={styles.followrec_box_info_img}
                  alt={`${rec.username}'s profile picture`}
                />
                <Typography>
                  <Link href={`/profile/view/${rec.id}`}>{rec.username}</Link>
                </Typography>
              </Grid>
              <Grid item className={styles.followrec_box_follow_button}>
                <Button onClick={() => follow(rec.id)}>Follow</Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FollowRecommendations;
