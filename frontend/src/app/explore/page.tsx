import { Grid, Typography } from "@mui/material";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { SafeHtmlServer } from "../components/SafeHtml";
import React from "react";

const TimeAgo = dynamic(() => import("../components/TimeAgo"), { ssr: false });

const SearchPost = dynamic(() => import("../components/SearchPost"), {
  ssr: false,
});

const SelectPostButton = dynamic(
  () => import("../components/SelectPostButton"),
  {
    ssr: false,
  }
);
const FollowRecommendations = dynamic(
  () => import("../components/FollowRecommendations"),
  {
    ssr: false,
  }
);
const PopularPosts = dynamic(() => import("../components/PopularPosts"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Spring Social - Explore",
  description: "...",
};

type Post = {
  profilePicture: string;
  username: string;
  likeCount: number;
  id: number;
  content: string;
  createdAt: string;
};
type PostResponse = {
  postList: Post[];
  pageCount: number;
};

async function getPosts(
  page?: string,
  search?: string,
  type?: string,
  sort?: string
) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  const response = await fetch(
    `${backendUrl}/post/all?page=${page}&search=${search}&type=${type}&sort=${sort}`,
    {
      method: "GET",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
      },
    }
  ).catch((error) => console.log(error));

  if (response) {
    return response.json();
  } else {
    return [];
  }
}

export default async function Explore({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const page = searchParams?.page;
  const search = searchParams?.search;
  const type = searchParams?.type;
  const sort = searchParams?.sort;
  const postResponse: PostResponse = await getPosts(page, search, type, sort);
  const pageCount = postResponse.pageCount;
  const posts = postResponse.postList;
  const cookieStore = cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <Grid container id="explore_container">
      <Grid item xs={3} id="menu_popular_container">
        <PopularPosts />
      </Grid>
      <Grid xs={6} item id="menu_post_container">
        <SearchPost pageCount={pageCount}>
          <Grid item id="menu_post_list">
            {posts.length > 0 ? (
              posts.map((post) => (
                <SelectPostButton post={post} key={post.id}>
                  <Grid
                    item
                    className="menu_post_box"
                    sx={{
                      backgroundColor: theme == "dark" ? "#333333" : "white",
                    }}
                  >
                    <Grid item className="menu_post_box_header">
                      <img
                        height={50}
                        width={50}
                        src={post.profilePicture}
                        alt={`${post.username}'s profile picture`}
                      />
                      <Grid item className="menu_post_box_header_info">
                        <Typography className="menu_post_box_header_username">
                          {post.username}
                        </Typography>
                        <Typography className="menu_post_box_header_date">
                          <TimeAgo date={new Date(post.createdAt)}></TimeAgo>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item className="menu_post_box_content">
                      <SafeHtmlServer html={post.content} />
                    </Grid>
                  </Grid>
                </SelectPostButton>
              ))
            ) : (
              <Grid
                item
                minHeight={"70vh"}
                alignContent={"center"}
                textAlign={"center"}
              >
                <Typography variant="h4">No Posts</Typography>
              </Grid>
            )}
          </Grid>
        </SearchPost>
      </Grid>
      <Grid item xs={3} id="menu_follow_container">
        <FollowRecommendations />
      </Grid>
    </Grid>
  );
}
