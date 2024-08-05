"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography, TextField, IconButton } from "@mui/material";
import TimeAgo from "./TimeAgo";
import Link from "next/link";
import styles from "../styles/following.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../hooks/Auth";

type follow = {
  userId: number;
  profilePicture: string;
  username: string;
  dateFollowed: string;
};

type Props = {
  type: "followers" | "following";
};

const Follow = ({ type }: Props) => {
  const { settings } = useAuth();
  const theme = settings?.colorTheme || "light";
  const [followSearch, setFollowSearch] = useState("");
  const [followList, setFollowList] = useState<follow[]>([
    // {
    //   userId: 1,
    //   profilePicture:
    //     "https://res.cloudinary.com/drk8ctpvl/image/upload/v1722712293/zzplweeh6wnidyqfzhgt.jpg",
    //   username: "Follower1",
    //   dateFollowed: "2024-08-04 20:21:09.318",
    // },
    // {
    //   userId: 2,
    //   profilePicture:
    //     "https://res.cloudinary.com/drk8ctpvl/image/upload/v1722712293/zzplweeh6wnidyqfzhgt.jpg",
    //   username: "Follower2",
    //   dateFollowed: "2024-08-04 20:21:09.318",
    // },
    // {
    //   userId: 3,
    //   profilePicture:
    //     "https://res.cloudinary.com/drk8ctpvl/image/upload/v1722712293/zzplweeh6wnidyqfzhgt.jpg",
    //   username: "Follower3",
    //   dateFollowed: "2024-08-04 20:21:09.318",
    // },
    // {
    //   userId: 4,
    //   profilePicture:
    //     "https://res.cloudinary.com/drk8ctpvl/image/upload/v1722712293/zzplweeh6wnidyqfzhgt.jpg",
    //   username: "Follower4",
    //   dateFollowed: "2024-08-04 20:21:09.318",
    // },
    // {
    //   userId: 5,
    //   profilePicture:
    //     "https://res.cloudinary.com/drk8ctpvl/image/upload/v1722712293/zzplweeh6wnidyqfzhgt.jpg",
    //   username: "Follower5",
    //   dateFollowed: "2024-08-04 20:21:09.318",
    // },
  ]);

  const handleFollowSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFollowSearch(e.target.value);
  };

  return (
    <Grid container id={styles.following_container}>
      <Grid
        item
        id={styles.following_box}
        sx={{
          backgroundColor: theme == "dark" ? "#333333" : "white",
          color: theme == "dark" ? "white" : "black",
        }}
      >
        <Typography id={styles.following_box_header} variant="h4">
          {type == "following" ? "Following" : "Followers"}
        </Typography>
        <Grid item id={styles.following_box_search_box}>
          <TextField
            fullWidth
            value={followSearch}
            className={styles.following_box_search_input_box}
            sx={{ color: "inherit" }}
            inputProps={{ className: styles.following_box_search_input }}
            placeholder={`Search for ${type}`}
            onChange={handleFollowSearchChange}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item id={styles.following_box_content}>
          {followList.length > 0 ? (
            followList.map((follow) => (
              <Link
                href={`/feed/${follow.userId}`}
                key={follow.userId}
                className={styles.following_follow}
              >
                <Grid item className={styles.following_follow_info}>
                  <img
                    src={follow.profilePicture}
                    width={40}
                    height={40}
                    className={styles.following_follow_image}
                  />
                  <Grid item>
                    <Typography
                      className={styles.following_follow_info_username}
                    >
                      {follow.username}
                    </Typography>
                    <Typography className={styles.following_follow_date}>
                      <TimeAgo date={new Date(follow.dateFollowed)} />
                    </Typography>
                  </Grid>
                </Grid>
              </Link>
            ))
          ) : (
            <Typography id={styles.following_no_following}>
              {type == "following" ? "Not Following Anyone" : "No Followers"}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Follow;
