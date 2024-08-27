"use server";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Clears cookies for user
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

// Sets cookies for user
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

// Checks user's access token
export const checkAuth = async (token: string) => {
  const jwtKey = process.env.JWT_SECRET;
  try {
    if (jwtKey) {
      const decodedKey = Buffer.from(jwtKey, "base64");
      await jwtVerify(token, decodedKey);
      return true;
    } else {
      throw new Error("JWT secret not found");
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Checks if user is allowed to view user profile
export const checkViewProfileAuth = async (
  access_token: string | undefined,
  isLogged: string | undefined,
  id: string
) => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  let cookieString = access_token ? `access_token=${access_token};` : undefined;

  isLogged
    ? cookieString
      ? (cookieString += `isLogged=${isLogged}`)
      : (cookieString = `isLogged=${isLogged}`)
    : null;

  const headers = cookieString
    ? {
        Cookie: cookieString,
      }
    : undefined;

  return fetch(`${backendUrl}/user/viewProfile/${id}`, {
    method: "GET",
    headers: headers,
  })
    .then((res) => {
      return res.status;
    })

    .catch((error) => {
      console.log(error);
      return 403;
    });
};
