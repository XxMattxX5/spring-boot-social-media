import React from "react";
import { Grid, Typography } from "@mui/material";
import { cookies } from "next/headers";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { SafeHtmlServer } from "../components/SafeHtml";

const SelectPostButton = dynamic(
  () => import("../components/SelectPostButton"),
  {
    ssr: false,
  }
);

const SearchPost = dynamic(() => import("../components/SearchPost"), {
  ssr: false,
});

const TimeAgo = dynamic(() => import("../components/TimeAgo"), { ssr: false });

export const metadata: Metadata = {
  title: "Spring Social - Popular",
  description: "...",
};

const getPopularPosts = async (page: string) => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  const response = await fetch(`${backendUrl}/post/popular?page=${page}`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Accept: "application/json",
    },
  }).catch((error) => console.log(error));

  if (response) {
    return response.json();
  } else {
    return [];
  }
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

const Popular = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
}) => {
  const cookieStore = cookies();
  const page = searchParams?.page || "1";
  const postResponse: PostResponse = await getPopularPosts(page);
  const postList = postResponse.postList;
  const pageCount = postResponse.pageCount;
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <Grid container>
      <Grid item id="popular_post_container">
        <Typography variant="h1" id="popular_post_header">
          Popular Posts
        </Typography>
        <SearchPost pageCount={pageCount} showSearchBar={false}>
          <Grid item id="menu_post_list">
            {postList.map((post) => (
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
            ))}
          </Grid>
        </SearchPost>
      </Grid>
    </Grid>
  );
};

export default Popular;
