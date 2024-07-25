"use server";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const clearCredentials = (response: NextResponse) => {
  response.cookies.set("access_token", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("refresh_token", "", {
    path: "/auth/refresh",
    maxAge: 0,
  });
  response.cookies.set("deviceId", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("username", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("profile_picture", "", {
    path: "/",
    maxAge: 0,
  });
};

export const setCredentials = (
  response: NextResponse,
  request: NextRequest,
  username: string,
  access_token: string,
  refresh_token: string,
  expiresIn: Date,
  refreshExpiryDate: Date,
  profile_picture: string
) => {
  response.cookies.set("access_token", access_token, {
    path: "/",
    expires: expiresIn,
    httpOnly: true,
    secure: true,
  });
  response.cookies.set("refresh_token", refresh_token, {
    path: "/auth/refresh",
    expires: refreshExpiryDate,
    httpOnly: true,
    secure: true,
  });

  response.cookies.set(
    "deviceId",
    String(request.cookies.get("deviceId")?.value),
    {
      path: "/",
      expires: refreshExpiryDate,
      httpOnly: true,
      secure: true,
    }
  );
  response.cookies.set("username", username, {
    path: "/",
    expires: refreshExpiryDate,
    httpOnly: false,
    secure: true,
  });
  response.cookies.set("profile_picture", profile_picture, {
    path: "/",
    expires: refreshExpiryDate,
    httpOnly: false,
    secure: true,
  });
};

export const checkAuth = (token: string) => {
  const decode = jwtDecode(token).exp;
  if (decode && new Date(decode * 1000) > new Date()) {
    return true;
  } else {
    return false;
  }
};

export const refreshToken = async (
  response: NextResponse,
  request: NextRequest
) => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  const deviceId = request.cookies.get("deviceId")?.value;
  const refresh_token = request.cookies.get("refresh_token")?.value;
  let refreshed = false;

  await fetch(`${backendUrl}/auth/refresh`, {
    headers: {
      Accept: "application/json",
      Cookie: `refresh_token=${refresh_token};deviceId=${deviceId}`,
    },
    method: "POST",
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Token not valid");
      }
    })
    .then((data) => {
      if (data) {
        setCredentials(
          response,
          request,
          data.username,
          data.token,
          data.refreshToken,
          new Date(Date.now() + data.expiresIn),
          new Date(data.refreshExpiryDate),
          data.profilePicture
        );
        refreshed = true;
      }
    })
    .catch((error) => {
      console.log("Error refreshing tokens: " + error);
      refreshed = false;
    });
  return refreshed;
};
