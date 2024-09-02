"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { Grid, IconButton, TextField, Typography } from "@mui/material";
import styles from "../styles/viewprofile.module.css";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactLoading from "react-loading";
import TimeAgo from "./TimeAgo";
import SelectPostButton from "./SelectPostButton";
import { SafeHtmlClient } from "./SafeHtml";
import SearchIcon from "@mui/icons-material/Search";

type Follow = {
  userId: number;
  followProfilePicture: string;
  followUsername: string;
  createdAt: string;
};

type Post = {
  profilePicture: string;
  username: string;
  likeCount: number;
  id: number;
  content: string;
  createdAt: string;
  userId: number;
};

const ViewProfile = () => {
  const { settings, refresh } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theme
  const params = useParams(); // Url search params
  const [followers, setFollowers] = useState<Follow[]>([]); // List of followers
  const [followersCount, setFollowersCount] = useState(0); // Number of followers
  const [followersSearch, setFollowersSearch] = useState(""); // Follower search input
  const [followersCurrentSearch, setFollowersCurrentSearch] = useState(""); // Current followers search being viewed
  const [followersPageCount, setFollowersPageCount] = useState(0); // Number of pages for followers
  const [followersPage, setFollowersPage] = useState(1); // Current followers page

  const [following, setFollowing] = useState<Follow[]>([]); // List of following
  const [followingCount, setFollowingCount] = useState(0); // Number of following
  const [followingSearch, setFollowingSearch] = useState(""); // Following search input
  const [followingCurrentSearch, setFollowingCurrentSearch] = useState(""); // Current following search being viewed
  const [followingPageCount, setFollowingPageCount] = useState(0); // Number of following pages
  const [followingPage, setFollowingPage] = useState(1); // Current following page

  const [posts, setPosts] = useState<Post[]>([]); // List of posts
  const [postPages, setPostPages] = useState(0); // Number of post pages
  const [currentPostPage, setCurrentPostPage] = useState(1); // Current post page

  // Gets followers on mount and when page or search changes
  useEffect(() => {
    const controller = new AbortController();
    const getFollowers = async () => {
      let url = `/api/user/get_followers/${params.id}?page=${followersPage}`;

      if (followersCurrentSearch) {
        url += `&search=${followersCurrentSearch}`;
      }
      let status = null;
      fetch(url, {
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
            return;
          }
          return;
        })
        .then((data) => {
          if (data) {
            setFollowers((prev) => prev.concat(data.followList));
            setFollowersPageCount(data.followPageCount);
            setFollowersCount(data.followCount);
          }
        })
        .catch((error) => {
          if (String(error.name) !== "AbortError") {
            console.log(error);
          }
        });

      // Refreshes token and tries again if error was 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          getFollowers();
        }
      }
    };
    getFollowers();

    return () => {
      controller.abort();
    };
  }, [followersCurrentSearch, followersPage, params.id, refresh]);

  // Gets following on mount and when page or search changes
  useEffect(() => {
    const controller = new AbortController();
    const getFollowing = async () => {
      let url = `/api/user/get_following/${params.id}?page=${followingPage}`;

      if (followingCurrentSearch) {
        url += `&search=${followingCurrentSearch}`;
      }
      let status = null;
      fetch(url, {
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
            return;
          }
          return;
        })
        .then((data) => {
          if (data) {
            setFollowing((prev) => prev.concat(data.followList));
            setFollowingPageCount(data.followPageCount);
            setFollowingCount(data.followCount);
          }
        })
        .catch((error) => {
          if (String(error.name) !== "AbortError") {
            console.log(error);
          }
        });

      // Refreshes token and tries again if error was 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          getFollowing();
        }
      }
    };
    getFollowing();

    return () => {
      controller.abort();
    };
  }, [followingCurrentSearch, followingPage, params.id, refresh]);

  // Gets posts on mount and when page changes
  useEffect(() => {
    const controller = new AbortController();
    const getPosts = async () => {
      let url = `/api/user/get_posts/${params.id}?page=${currentPostPage}`;
      let status = null;
      fetch(url, {
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
            return;
          }
        })
        .then((data) => {
          if (data) {
            setPosts((prev) => prev.concat(data.postList));
            setPostPages(data.pageCount);
          }
        })
        .catch((error) => {
          if (String(error.name) !== "AbortError") {
            console.log(error);
          }
        });

      // Refreshes token and tries again if error was 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          getPosts();
        }
      }
    };
    getPosts();

    return () => {
      controller.abort();
    };
  }, [currentPostPage, params.id, refresh]);

  // Handles changes to the current followers and current following search
  const handleSearchChange = (type: "followers" | "following") => {
    if (type == "followers") {
      setFollowersPage(1);
      setFollowers([]);
      setFollowersCurrentSearch(followersSearch);
    } else if (type == "following") {
      setFollowingPage(1);
      setFollowing([]);
      setFollowingCurrentSearch(followingSearch);
    }
  };

  // Handles changes to followers search
  const handleFollowersSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFollowersSearch(e.target.value);
  };

  // Handles changes to the following search
  const handleFollowingSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFollowingSearch(e.target.value);
  };

  return (
    <Grid container id={styles.viewprofile_main_container}>
      <Grid item id={styles.viewprofile_main_box} xs={12}>
        <Grid item xs={11.5} id={styles.viewprofile_follow_container}>
          <Grid item id={styles.viewprofile_followers_container}>
            <Typography className={styles.viewprofile_follow_header}>
              <PersonIcon />
              Followers: {followersCount}
            </Typography>
            <Grid
              item
              className={styles.viewprofile_follow_box}
              sx={{ backgroundColor: theme == "dark" ? "#33333" : "white" }}
            >
              <Grid item className={styles.viewprofile_follow_box_header}>
                <Grid item xs={6}>
                  <Typography>Username</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Followed Date</Typography>
                </Grid>
              </Grid>
              <Grid item className={styles.viewprofile_follow_box_search}>
                <TextField
                  className={styles.viewprofile_follow_search_input_box}
                  inputProps={{
                    className: styles.viewprofile_follow_search_input,
                    sx: {
                      color: theme == "dark" ? "white" : "black",
                      opacity: 1,
                    },
                  }}
                  value={followersSearch}
                  onChange={handleFollowersSearchChange}
                  placeholder="Search Followers..."
                />
                <IconButton
                  className={styles.viewprofile_follow_box_search_button}
                  onClick={() => handleSearchChange("followers")}
                >
                  <SearchIcon
                    sx={{ color: theme == "dark" ? "white" : "black" }}
                  />
                </IconButton>
              </Grid>
              <Grid
                item
                className={styles.viewprofile_follow_box_content}
                id="viewprofile_followers_content_box"
              >
                <InfiniteScroll
                  dataLength={followers.length}
                  next={() => setFollowersPage((prev) => prev + 1)}
                  hasMore={followersPage < followersPageCount}
                  loader={
                    <ReactLoading
                      type="spin"
                      className={styles.follow_loader}
                    />
                  }
                  scrollableTarget={"viewprofile_followers_content_box"}
                >
                  {followers.map((follow) => (
                    <Grid
                      item
                      className={styles.viewprofile_follow}
                      key={String(follow.userId) + " follower"}
                    >
                      <Grid item className={styles.viewprofile_follow_user}>
                        <img
                          src={follow.followProfilePicture}
                          height={50}
                          width={50}
                          className={styles.viewprofile_follow_user_img}
                          alt={`${follow.followUsername}'s profile picture`}
                        />
                        <Typography
                          className={styles.viewprofile_follow_user_username}
                        >
                          {follow.followUsername}
                        </Typography>
                      </Grid>
                      <Grid item className={styles.viewprofile_follow_date}>
                        <TimeAgo date={new Date(follow.createdAt)}></TimeAgo>
                      </Grid>
                    </Grid>
                  ))}
                </InfiniteScroll>
              </Grid>
            </Grid>
          </Grid>
          <Grid item id={styles.viewprofile_following_container}>
            <Typography className={styles.viewprofile_follow_header}>
              <PersonIcon />
              Following: {followingCount}
            </Typography>
            <Grid
              item
              className={styles.viewprofile_follow_box}
              sx={{ backgroundColor: theme == "dark" ? "#333333" : "white" }}
            >
              <Grid item className={styles.viewprofile_follow_box_header}>
                <Grid item xs={6}>
                  <Typography>Username</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Followed Date</Typography>
                </Grid>
              </Grid>
              <Grid item className={styles.viewprofile_follow_box_search}>
                <TextField
                  className={styles.viewprofile_follow_search_input_box}
                  inputProps={{
                    className: styles.viewprofile_follow_search_input,
                    sx: {
                      color: theme == "dark" ? "white" : "black",
                      opacity: 1,
                    },
                  }}
                  value={followingSearch}
                  onChange={handleFollowingSearchChange}
                  placeholder="Search Following..."
                />
                <IconButton
                  className={styles.viewprofile_follow_box_search_button}
                  onClick={() => handleSearchChange("following")}
                >
                  <SearchIcon
                    sx={{ color: theme == "dark" ? "white" : "black" }}
                  />
                </IconButton>
              </Grid>
              <Grid
                item
                className={styles.viewprofile_follow_box_content}
                id="viewprofile_following_content_box"
              >
                <InfiniteScroll
                  dataLength={following.length}
                  next={() => setFollowingPage((prev) => prev + 1)}
                  hasMore={followingPage < followingPageCount}
                  loader={
                    <ReactLoading
                      type="spin"
                      className={styles.follow_loader}
                    />
                  }
                  scrollableTarget={"viewprofile_following_content_box"}
                >
                  {following.map((follow) => (
                    <Grid
                      item
                      className={styles.viewprofile_follow}
                      key={String(follow.userId) + " following"}
                    >
                      <Grid item className={styles.viewprofile_follow_user}>
                        <img
                          src={follow.followProfilePicture}
                          height={50}
                          width={50}
                          className={styles.viewprofile_follow_user_img}
                          alt={`${follow.followUsername}'s profile picture`}
                        />
                        <Typography
                          className={styles.viewprofile_follow_user_username}
                        >
                          {follow.followUsername}
                        </Typography>
                      </Grid>
                      <Grid item className={styles.viewprofile_follow_date}>
                        <TimeAgo date={new Date(follow.createdAt)}></TimeAgo>
                      </Grid>
                    </Grid>
                  ))}
                </InfiniteScroll>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item id={styles.viewprofile_post_container} xs={11.5}>
          <Grid item id={styles.viewprofile_postlist_container}>
            <Typography className={styles.viewprofile_follow_header}>
              <MessageIcon /> Posts
            </Typography>

            <Grid
              item
              className={styles.viewprofile_postlist_box}
              sx={{ backgroundColor: theme == "dark" ? "#333333" : "white" }}
            >
              <Grid item className={styles.viewprofile_follow_box_header}>
                <Grid item>
                  <Typography>Recent Posts</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                className={styles.viewprofile_postlist_content}
                id="viewprofile_postlist"
              >
                <InfiniteScroll
                  dataLength={posts.length}
                  next={() => setCurrentPostPage((prev) => prev + 1)}
                  hasMore={currentPostPage < postPages}
                  loader={
                    <ReactLoading
                      type="spin"
                      className={styles.follow_loader}
                    />
                  }
                  scrollableTarget={"viewprofile_following_content_box"}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >
                  {posts.map((post) => (
                    <SelectPostButton
                      post={post}
                      key={String(post.id) + " post"}
                      style={{ flexGrow: 1, flexBasis: "600px" }}
                    >
                      <Grid item className={styles.viewprofile_post}>
                        <Grid item className={styles.viewprofile_post_header}>
                          <img
                            src={post.profilePicture}
                            height={50}
                            width={50}
                            className={styles.viewprofile_post_header_image}
                            alt={`${post.username}'s profile picture`}
                          />
                          <Grid
                            item
                            className={styles.viewprofile_post_header_info}
                          >
                            <Typography
                              className={
                                styles.viewprofile_post_header_info_username
                              }
                            >
                              {post.username}
                            </Typography>
                            <Grid
                              className={
                                styles.viewprofile_post_header_info_date
                              }
                            >
                              <TimeAgo date={new Date(post.createdAt)} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item className={styles.viewprofile_post_content}>
                          <Suspense
                            fallback={
                              <Grid className={styles.html_fallback_loader}>
                                <ReactLoading type="spin" />
                              </Grid>
                            }
                          >
                            <SafeHtmlClient html={post.content} />
                          </Suspense>
                        </Grid>
                      </Grid>
                    </SelectPostButton>
                  ))}
                </InfiniteScroll>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewProfile;
