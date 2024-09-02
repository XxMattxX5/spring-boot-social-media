import React, { useState, Suspense, useEffect, useCallback } from "react";
import { Grid, Typography, Button, TextField, IconButton } from "@mui/material";
import styles from "../../styles/profile.module.css";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import { useAuth } from "../../hooks/useAuth";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { SafeHtmlClient } from "../../components/SafeHtml";
import ReactLoading from "react-loading";
import SelectPostButton from "../../components/SelectPostButton";
import TimeAgo from "../../components/TimeAgo";
import InfiniteScroll from "react-infinite-scroll-component";

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

const Dashboard = () => {
  const { settings, refresh } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theme
  const [followers, setFollowers] = useState<Follow[]>([]); // List of followers
  const [followerCount, setFollowerCount] = useState(0); // Number of followers
  const [followerPageCount, setFollowerPageCount] = useState(0); // Number of follower pages
  const [searchFollower, setSearchFollower] = useState(""); // Follower search input
  const [currentSearchFollower, setCurrentSearchFollower] = useState(""); // Current follower search being viewed
  const [currentFollowerPage, setCurrentFollowerPage] = useState(1); // Current follower page

  const [following, setFollowing] = useState<Follow[]>([]); // List of following
  const [followingCount, setFollowingCount] = useState(0); // Number of following
  const [followingPageCount, setFollowingPageCount] = useState(0); // Following page count
  const [currentFollowingPage, setCurrentFollowingPage] = useState(1); // Current following page
  const [searchFollowing, setSearchFollowing] = useState(""); // Following input
  const [currentSearchFollowing, setCurrentSearchFollowing] = useState(""); // Current following search being viewed

  const [posts, setPosts] = useState<Post[]>([]); // List of posts
  const [postPages, setPostPages] = useState(0); // Number of post pages
  const [currentPostPage, setCurrentPostPage] = useState(1); // Current post page

  // Changes current follower search
  const handleSearchFollowerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchFollower(e.target.value);
    setCurrentFollowerPage(1);
    setFollowers([]);
  };

  // Changes current following search
  const handleSearchFollowingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchFollowing(e.target.value);
    setCurrentFollowingPage(1);
  };

  // Removes follower or following after block or unfollow
  const removeFollow = (type: "followers" | "following", userId: number) => {
    if (type == "followers") {
      setFollowers(followers.filter((item) => item.userId !== userId));
    }
    if (type == "following") {
      setFollowing(following.filter((item) => item.userId !== userId));
    }
  };

  // Gets  list of followers and following on mount
  useEffect(() => {
    setFollowers([]);
  }, [currentSearchFollower]);
  useEffect(() => {
    setFollowing([]);
  }, [currentSearchFollowing]);

  // Gets list of followers
  const getFollowers = useCallback(
    async (sig?: AbortSignal) => {
      let url = `/api/follow/${"followers"}?page=${currentFollowerPage}`;

      if (currentSearchFollower) {
        url += `&search=${currentSearchFollower}`;
      }
      let status = null;
      fetch(url, {
        method: "GET",
        credentials: "include",
        signal: sig ? sig : undefined,
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
            setFollowers((prev) => prev.concat(data.followList));
            setFollowerPageCount(data.followPageCount);
            setFollowerCount(data.followCount);
          }
        })
        .catch((error) => {
          if (String(error.name) !== "AbortError") {
            console.log(error);
          }
        });

      // Refreshes token and tries again if error was a 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          getFollowers();
        }
      }
    },
    [currentSearchFollower, currentFollowerPage, refresh]
  );

  // Gets list of following
  const getFollowing = useCallback(
    async (sig?: AbortSignal) => {
      let url = `/api/follow/${"following"}?page=${currentFollowingPage}`;

      if (currentSearchFollowing) {
        url += `&search=${currentSearchFollowing}`;
      }
      let status = null;
      fetch(url, {
        method: "GET",
        credentials: "include",
        signal: sig ? sig : undefined,
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

      // Refreshes token and tries again if error was a 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          getFollowing();
        }
      }
    },
    [currentSearchFollowing, currentFollowingPage, refresh]
  );

  // Unfollows user
  const unFollow = async (userId: number) => {
    let status = null;

    await fetch(`/api/follow/${userId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          status = true;
        } else if (res.status == 401) {
          status = false;
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was a 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed) {
        unFollow(userId);
      }
    }
  };

  // Gets a list of posts
  const getPosts = useCallback(
    async (sig?: AbortSignal) => {
      let url = `/api/post/me?page=${currentPostPage}`;
      let status = null;
      fetch(url, {
        method: "GET",
        credentials: "include",
        signal: sig ? sig : undefined,
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

      // Refreshes token and tries again if error was a 401
      if (status == false) {
        const refreshed = await refresh();
        if (refreshed) {
          getPosts();
        }
      }
    },
    [currentPostPage, refresh]
  );

  // Handles unfollowing a user
  const handleUnFollow = async (userId: number) => {
    await unFollow(userId);
    removeFollow("following", userId);
  };

  // Gets dashboard information on mount
  useEffect(() => {
    const abortController = new AbortController();

    getPosts(abortController.signal);
    getFollowers(abortController.signal);
    getFollowing(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [getPosts, getFollowers, getFollowing]);

  // Blocks a follower
  const blockFollower = async (userId: number) => {
    let status = null;
    await fetch(`/api/block/${userId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          removeFollow("followers", userId);
          return;
        } else if (res.status === 401) {
          status = false;
          return;
        } else {
          throw new Error("failed to block user");
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was a 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed) {
        blockFollower(userId);
      }
    }
  };

  return (
    <>
      <Grid container>
        <Typography variant="h2" className={styles.profile_menu_header}>
          Dashboard
        </Typography>
        <Grid xs={12} item id={styles.dashboard_content_container}>
          <Grid
            item
            className={styles.dashboard_box}
            sx={{ flexBasis: "450px" }}
          >
            <Typography
              className={styles.dashboard_box_header}
              sx={{ color: theme == "dark" ? "white" : "black" }}
            >
              <PersonIcon /> Followers: {followerCount}
            </Typography>
            <Grid
              item
              className={styles.dashboard_main_container}
              sx={{ backgroundColor: theme == "dark" ? "#333333" : "white" }}
            >
              <Grid item className={styles.dashboard_box_content_header}>
                <Typography flexGrow={1}>Username</Typography>
                <Typography flexGrow={1}>Followed Date</Typography>
              </Grid>
              <Grid item className={styles.dashboard_follow_search}>
                <TextField
                  className={styles.dashboard_follow_search_input_box}
                  inputProps={{
                    className: styles.dashboard_follow_search_input,
                    sx: {
                      color: theme == "dark" ? "white" : "black",
                      opacity: 1,
                    },
                  }}
                  value={searchFollower}
                  onChange={handleSearchFollowerChange}
                  placeholder="Search Followers..."
                />
                <IconButton
                  className={styles.dashboard_follow_search_btn}
                  onClick={() => setCurrentSearchFollower(searchFollower)}
                >
                  <SearchIcon
                    sx={{ color: theme == "dark" ? "white" : "black" }}
                  />
                </IconButton>
              </Grid>
              <Grid
                item
                className={styles.dashboard_box_content}
                id="dashboard_follower_content_box"
              >
                <InfiniteScroll
                  dataLength={posts.length}
                  next={() => setCurrentFollowerPage((prev) => prev + 1)}
                  hasMore={
                    followers.length > 0
                      ? currentFollowerPage < followerPageCount
                      : false
                  }
                  loader={
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ReactLoading type={"spin"} />
                    </div>
                  }
                  scrollableTarget={"dashboard_follower_content_box"}
                  className={styles.dashboard_box_content_scroll}
                >
                  {followers.length > 0 ? (
                    followers.map((follower) => (
                      <Grid
                        item
                        className={styles.dashboard_follow_box}
                        key={follower?.userId.toString() + " follower"}
                      >
                        <Typography
                          className={styles.dashboard_follow_box_username}
                          sx={{ color: theme == "dark" ? "white" : "black" }}
                        >
                          <img
                            src={follower.followProfilePicture}
                            alt="Profile Image"
                            height={40}
                            width={40}
                            className={styles.dashboard_follow_profile_pic}
                          />
                          <Link href={`/profile/view/${follower.userId}`}>
                            {follower.followUsername}
                          </Link>
                        </Typography>
                        <Typography
                          className={styles.dashboard_follow_box_date}
                          sx={{ color: theme == "dark" ? "white" : "black" }}
                        >
                          <TimeAgo date={new Date(follower.createdAt)} />
                        </Typography>
                        <Button
                          className={styles.dashboard_follower_block}
                          onClick={() => blockFollower(follower.userId)}
                        >
                          Block
                        </Button>
                      </Grid>
                    ))
                  ) : (
                    <Typography
                      className={styles.dashboard_no_content}
                      sx={{ color: theme == "dark" ? "white" : "black" }}
                    >
                      No Followers
                    </Typography>
                  )}
                </InfiniteScroll>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            className={styles.dashboard_box}
            sx={{ flexBasis: "450px" }}
          >
            <Typography
              className={styles.dashboard_box_header}
              sx={{ color: theme == "dark" ? "white" : "black" }}
            >
              <PersonIcon /> Following: {followingCount}
            </Typography>
            <Grid
              item
              className={styles.dashboard_main_container}
              sx={{ backgroundColor: theme == "dark" ? "#333333" : "white" }}
            >
              <Grid item className={styles.dashboard_box_content_header}>
                <Typography flexGrow={1}>Username</Typography>
                <Typography flexGrow={1}>Followed Date</Typography>
              </Grid>
              <Grid item className={styles.dashboard_follow_search}>
                <TextField
                  className={styles.dashboard_follow_search_input_box}
                  inputProps={{
                    className: styles.dashboard_follow_search_input,
                    style: { color: theme == "dark" ? "white" : "black" },
                  }}
                  value={searchFollowing}
                  onChange={handleSearchFollowingChange}
                  placeholder="Search Following..."
                />
                <IconButton
                  className={styles.dashboard_follow_search_btn}
                  onClick={() => setCurrentSearchFollowing(searchFollowing)}
                >
                  <SearchIcon
                    sx={{ color: theme == "dark" ? "white" : "black" }}
                  />
                </IconButton>
              </Grid>
              <Grid
                item
                className={styles.dashboard_box_content}
                id={"dashboard_following_content_box"}
              >
                <InfiniteScroll
                  dataLength={posts.length}
                  next={() => setCurrentFollowingPage((prev) => prev + 1)}
                  hasMore={
                    following.length > 0
                      ? currentFollowingPage < followingPageCount
                      : false
                  }
                  loader={
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ReactLoading type={"spin"} />
                    </div>
                  }
                  scrollableTarget={"dashboard_following_content_box"}
                  className={styles.dashboard_box_content_scroll}
                >
                  {following.length > 0 ? (
                    following.map((follow) => (
                      <Grid
                        item
                        className={styles.dashboard_follow_box}
                        key={follow.userId.toString() + " following"}
                      >
                        <Typography
                          className={styles.dashboard_follow_box_username}
                          sx={{ color: theme == "dark" ? "white" : "black" }}
                        >
                          <img
                            src={follow.followProfilePicture}
                            alt="Profile Image"
                            height={40}
                            width={40}
                            className={styles.dashboard_follow_profile_pic}
                          />
                          <Link href={`/profile/view/${follow.userId}`}>
                            {follow.followUsername}
                          </Link>
                        </Typography>
                        <Typography
                          className={styles.dashboard_follow_box_date}
                          sx={{ color: theme == "dark" ? "white" : "black" }}
                        >
                          <TimeAgo date={new Date(follow.createdAt)} />
                        </Typography>
                        <Button
                          className={styles.dashboard_follower_block}
                          onClick={() => handleUnFollow(follow.userId)}
                        >
                          Unfollow
                        </Button>
                      </Grid>
                    ))
                  ) : (
                    <Typography
                      className={styles.dashboard_no_content}
                      sx={{ color: theme == "dark" ? "white" : "black" }}
                    >
                      Not Following Anyone
                    </Typography>
                  )}
                </InfiniteScroll>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            className={styles.dashboard_box}
            sx={{ flexBasis: "100%" }}
          >
            <Typography
              className={styles.dashboard_box_header}
              sx={{
                color: theme == "dark" ? "white" : "black",
              }}
            >
              <MessageIcon /> Posts
            </Typography>
            <Grid
              item
              className={styles.dashboard_main_container}
              sx={{ backgroundColor: theme == "dark" ? "#333333" : "white" }}
            >
              <Grid
                item
                className={styles.dashboard_post_content_header}
                sx={{ minWidth: 0 }}
              >
                <Typography flexGrow={1}>Recent Post</Typography>
              </Grid>
              <Grid
                item
                className={styles.dashboard_post_content}
                sx={{ color: theme == "dark" ? "white" : "black" }}
                id="post_scroll_box"
              >
                <InfiniteScroll
                  dataLength={posts.length}
                  next={() => setCurrentPostPage((prev) => prev + 1)}
                  hasMore={
                    posts.length > 0 ? currentPostPage < postPages : false
                  }
                  loader={
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <ReactLoading type={"spin"} />
                    </div>
                  }
                  scrollableTarget={"post_scroll_box"}
                  className={styles.dashboard_post_content_scroll}
                >
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <SelectPostButton
                        key={post.id}
                        post={post}
                        style={{ flexGrow: 1, flexBasis: "500px" }}
                      >
                        <Grid item className={styles.dashboard_post_box}>
                          <Grid item className={styles.dashboard_post_header}>
                            <img
                              src={post.profilePicture}
                              height={50}
                              width={50}
                              alt="Profile picture"
                              className={styles.dashboard_post_header_image}
                            />
                            <Grid item className={styles.dashboard_post_info}>
                              <Typography
                                className={
                                  styles.dashboard_post_header_username
                                }
                              >
                                {post.username}
                              </Typography>
                              <Typography
                                className={styles.dashboard_post_header_date}
                              >
                                <TimeAgo date={new Date(post.createdAt)} />
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            className={styles.dashboard_post_main_content}
                          >
                            <Suspense
                              fallback={
                                <Grid
                                  sx={{
                                    width: "fit-content",
                                    margin: "0 auto",
                                  }}
                                >
                                  <ReactLoading type="spin" />
                                </Grid>
                              }
                            >
                              <SafeHtmlClient html={post.content} />
                            </Suspense>
                          </Grid>
                        </Grid>
                      </SelectPostButton>
                    ))
                  ) : (
                    <Typography
                      className={styles.dashboard_no_content}
                      sx={{
                        color: theme == "dark" ? "white" : "black",
                        minHeight: 300,
                        margin: "0 auto",
                      }}
                    >
                      No Posts
                    </Typography>
                  )}
                </InfiniteScroll>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
