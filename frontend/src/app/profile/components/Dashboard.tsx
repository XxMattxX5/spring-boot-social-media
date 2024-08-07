import React, { useState, Suspense } from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import styles from "../../styles/profile.module.css";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import { useAuth } from "../../hooks/useAuth";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { SafeHtmlClient } from "../../components/SafeHtml";
import ReactLoading from "react-loading";
import SelectPostButton from "../../components/SelectPostButton";

type follow = {
  userId: number;
  imageId: string;
  username: string;
  dateFollowed: string;
};
type Post = {
  profilePicture: string;
  username: string;
  likeCount: number;
  id: number;
  content: string;
  createdAt: string;
};

const Dashboard = () => {
  const { settings } = useAuth();
  const theme = settings?.colorTheme || "light";
  const [followers, setFollowers] = useState<follow[]>([
    // {
    //   userId: 1,
    //   imageId: "wz3epueadv1fn4lncwec",
    //   username: "Follower1",
    //   dateFollowed: "Jan-05",
    // },
    // {
    //   userId: 2,
    //   imageId: "wz3epueadv1fn4lncwec",
    //   username: "Follower2",
    //   dateFollowed: "Apr-05",
    // },
    // {
    //   userId: 3,
    //   imageId: "wz3epueadv1fn4lncwec",
    //   username: "Follower3",
    //   dateFollowed: "Aug-05",
    // },
    // {
    //   userId: 4,
    //   imageId: "wz3epueadv1fn4lncwec",
    //   username: "Follower4",
    //   dateFollowed: "Jan-05",
    // },
    // {
    //   userId: 5,
    //   imageId: "wz3epueadv1fn4lncwec",
    //   username: "Follower5",
    //   dateFollowed: "July-05",
    // },
  ]);
  const [followerCount, setFollowerCount] = useState(0);
  const [searchFollower, setSearchFollower] = useState("");

  const [following, setFollowing] = useState<follow[]>([
    // {
    //   userId: 1,
    //   imageId: "z0kjpsj5vnmlekxurcid",
    //   username: "Follower1",
    //   dateFollowed: "Jan-05",
    // },
    // {
    //   userId: 2,
    //   imageId: "z0kjpsj5vnmlekxurcid",
    //   username: "Follower2",
    //   dateFollowed: "Apr-05",
    // },
    // {
    //   userId: 3,
    //   imageId: "z0kjpsj5vnmlekxurcid",
    //   username: "Follower3",
    //   dateFollowed: "Aug-05",
    // },
    // {
    //   userId: 4,
    //   imageId: "z0kjpsj5vnmlekxurcid",
    //   username: "Follower4",
    //   dateFollowed: "Jan-05",
    // },
    // {
    //   userId: 5,
    //   imageId: "z0kjpsj5vnmlekxurcid",
    //   username: "Follower5",
    //   dateFollowed: "July-05",
    // },
    // {
  ]);
  const [followingCount, setFollowingCount] = useState(0);
  const [searchFollowing, setSearchFollowing] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      username: "Matthew15",
      createdAt: "Jan 05",
      likeCount: 0,
      profilePicture:
        "https://res.cloudinary.com/drk8ctpvl/image/upload/c_limit,w_256/f_auto/q_auto/v1722712293/zzplweeh6wnidyqfzhgt?_a=BAVFB+DW0",
      content:
        "<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.<img src='https://www.thepowerdoc.com/media/Images/Savings_With_LED_Lighting.png' />Illum necessitatibus, pariatur deserunt perspiciatis ipsam, earumminima aut iure beatae, quibusdam quod ipsum repellendus nesciuntsequi aspernatur in dignissimos adipisci aliquid </p>",
    },
    {
      id: 2,
      username: "Matthew15",
      createdAt: "Jan 05",
      likeCount: 0,
      profilePicture:
        "https://res.cloudinary.com/drk8ctpvl/image/upload/c_limit,w_256/f_auto/q_auto/v1722712293/zzplweeh6wnidyqfzhgt?_a=BAVFB+DW0",
      content:
        "<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.<img src='https://www.thepowerdoc.com/media/Images/Savings_With_LED_Lighting.png' />Illum necessitatibus, pariatur deserunt perspiciatis ipsam, earumminima aut iure beatae, quibusdam quod ipsum repellendus nesciuntsequi aspernatur in dignissimos adipisci aliquid.</p>",
    },
  ]);
  const [postCount, setPostCount] = useState(0);

  const handleSearchFollowerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchFollower(e.target.value);
  };

  const handleSearchFollowingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchFollowing(e.target.value);
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
                <IconButton className={styles.dashboard_follow_search_btn}>
                  <SearchIcon
                    sx={{ color: theme == "dark" ? "white" : "black" }}
                  />
                </IconButton>
              </Grid>
              <Grid item className={styles.dashboard_box_content}>
                {followers.length > 0 ? (
                  followers.map((follower) => (
                    <Grid
                      item
                      className={styles.dashboard_follow_box}
                      key={follower?.userId}
                    >
                      <Typography
                        className={styles.dashboard_follow_box_username}
                        sx={{ color: theme == "dark" ? "white" : "black" }}
                      >
                        <img
                          src={follower.imageId}
                          alt="Profile Image"
                          height={40}
                          width={40}
                          className={styles.dashboard_follow_profile_pic}
                        />
                        <Link href={`/profile/view/${follower.userId}`}>
                          {follower.username}
                        </Link>
                      </Typography>
                      <Typography
                        className={styles.dashboard_follow_box_date}
                        sx={{ color: theme == "dark" ? "white" : "black" }}
                      >
                        {follower.dateFollowed}
                      </Typography>
                      <Button className={styles.dashboard_follower_block}>
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
                <IconButton className={styles.dashboard_follow_search_btn}>
                  <SearchIcon
                    sx={{ color: theme == "dark" ? "white" : "black" }}
                  />
                </IconButton>
              </Grid>
              <Grid item className={styles.dashboard_box_content}>
                {following.length > 0 ? (
                  following.map((follow) => (
                    <Grid
                      item
                      className={styles.dashboard_follow_box}
                      key={follow.userId}
                    >
                      <Typography
                        className={styles.dashboard_follow_box_username}
                        sx={{ color: theme == "dark" ? "white" : "black" }}
                      >
                        <img
                          src={follow.imageId}
                          alt="Profile Image"
                          height={40}
                          width={40}
                          className={styles.dashboard_follow_profile_pic}
                        />
                        <Link href={`/profile/view/${follow.userId}`}>
                          {follow.username}
                        </Link>
                      </Typography>
                      <Typography
                        className={styles.dashboard_follow_box_date}
                        sx={{ color: theme == "dark" ? "white" : "black" }}
                      >
                        {follow.dateFollowed}
                      </Typography>
                      <Button className={styles.dashboard_follower_block}>
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
              <MessageIcon /> Posts: {postCount}
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
                              className={styles.dashboard_post_header_username}
                            >
                              {post.username}
                            </Typography>
                            <Typography
                              className={styles.dashboard_post_header_date}
                            >
                              {post.createdAt}
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
                    sx={{ color: theme == "dark" ? "white" : "black" }}
                  >
                    No Posts
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
