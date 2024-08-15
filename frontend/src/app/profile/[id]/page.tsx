"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

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

const UserProfile = () => {
  const { settings, refresh } = useAuth();
  const params = useParams();
  const [authorized, setAuthorized] = useState(true);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followersSearch, setFollowersSearch] = useState("");
  const [followersCurrentSearch, setFollowersCurrentSearch] = useState("");
  const [followersPageCount, setFollowersPageCount] = useState(0);
  const [followersPage, setFollowersPage] = useState(1);

  const [following, setFollowing] = useState<Follow[]>([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [followingSearch, setFollowingSearch] = useState("");
  const [followingCurrentSearch, setFollowingCurrentSearch] = useState("");
  const [followingPageCount, setFollowingPageCount] = useState(0);
  const [followingPage, setFollowingPage] = useState(1);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postPages, setPostPages] = useState(0);
  const [currentPostPage, setCurrentPostPage] = useState(1);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const controller = new AbortController();
    const getFollowers = async () => {
      let url = `${backendUrl}/user/get_followers/${params.id}?page=${followersPage}`;

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
          } else if (res.status === 403) {
            setAuthorized(false);
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
  }, [followersCurrentSearch, followersPage, params.id]);

  useEffect(() => {
    const controller = new AbortController();
    const getFollowing = async () => {
      let url = `${backendUrl}/user/get_following/${params.id}?page=${followingPage}`;

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
          } else if (res.status === 403) {
            setAuthorized(false);
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
  }, [followingCurrentSearch, followingPage, params.id]);

  useEffect(() => {
    const controller = new AbortController();
    const getPosts = async () => {
      let url = `${backendUrl}/user/get_posts/${params.id}?page=${currentPostPage}`;
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
  }, [followingCurrentSearch, followingPage, params.id]);
};

export default UserProfile;
