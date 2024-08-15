"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography, TextField, IconButton } from "@mui/material";
import TimeAgo from "./TimeAgo";
import Link from "next/link";
import styles from "../styles/following.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../hooks/useAuth";
import ReactLoading from "react-loading";
import InfiniteScroll from "react-infinite-scroll-component";

type Follow = {
  userId: number;
  followProfilePicture: string;
  followUsername: string;
  createdAt: string;
};

type Props = {
  type: "followers" | "following";
};

const Follow = ({ type }: Props) => {
  const { settings, refresh } = useAuth();
  const theme = settings?.colorTheme || "light";
  const [followSearch, setFollowSearch] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [followList, setFollowList] = useState<Follow[]>([]);
  const [followPageCount, setFollowPageCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const handleFollowSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFollowSearch(e.target.value);
  };
  const handleSetCurrentSearch = () => {
    setCurrentSearch(followSearch);
    setCurrentPage(1);
    setFollowList([]);
  };

  useEffect(() => {
    const controller = new AbortController();
    const getFollows = async () => {
      let url = `${backendUrl}/follow/${
        type == "followers" ? "followers" : "following"
      }`;
      if (currentSearch) {
        url += `?search=${currentSearch}`;
      }

      let status: boolean | null = null;

      await fetch(url, {
        method: "GET",
        credentials: "include",
        signal: controller.signal,
      })
        .then((res) => {
          if (res.ok) {
            status = true;
            return res.json();
          } else if (res.status === 401) {
            status = false;
          }
        })
        .then((data) => {
          if (data) {
            setFollowList((prev) => prev.concat(data.followList));
            setFollowPageCount(data.followPageCount);
          }
        })
        .catch((error) => {
          if (String(error.name) !== "AbortError") {
            console.log(error);
          }
        });

      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          getFollows();
        }
      }
    };
    getFollows();
    return () => {
      controller.abort();
    };
  }, [currentSearch, currentPage, backendUrl, type]);

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
          <IconButton onClick={handleSetCurrentSearch}>
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid
          item
          className={styles.following_box_content}
          id={`following_box_content_${type}`}
        >
          <InfiniteScroll
            dataLength={followList.length}
            next={() => setCurrentPage((prev) => prev + 1)}
            hasMore={
              followList.length > 0 ? currentPage < followPageCount : false
            }
            loader={
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ReactLoading type={"spin"} />
              </div>
            }
            scrollableTarget={`following_box_content_${type}`}
          >
            {followList.length > 0 ? (
              followList.map((follow) => (
                <Link
                  href={`/feed/${follow.userId}`}
                  key={follow.userId.toString() + " " + type}
                  className={styles.following_follow}
                >
                  <Grid item className={styles.following_follow_info}>
                    <img
                      src={follow.followProfilePicture}
                      width={40}
                      height={40}
                      className={styles.following_follow_image}
                      alt={"Profile Picture"}
                    />
                    <Grid item>
                      <Typography
                        className={styles.following_follow_info_username}
                      >
                        {follow.followUsername}
                      </Typography>
                      <Typography className={styles.following_follow_date}>
                        <TimeAgo date={new Date(follow.createdAt)} />
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
          </InfiniteScroll>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Follow;
