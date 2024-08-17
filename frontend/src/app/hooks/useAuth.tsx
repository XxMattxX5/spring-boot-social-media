"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { usePathname } from "next/navigation";

interface UserInfo {
  name: string;
  username: string;
  email: string;
  profilePicture: string;
}
interface SettingsInfo {
  allowFollows: string;
  profileVisibility: string;
  colorTheme: string;
}

type AuthContextType = {
  user: UserInfo | null;
  settings: SettingsInfo | null;
  fetchUser: () => void;
  refresh: (sig?: AbortController) => Promise<boolean | null>;
  login: (
    username: string,
    password: string,
    deviceId: string
  ) => Promise<string>;
  logout: () => void;
};

type Props = { children: React.ReactNode };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: Props) => {
  // Url for the backend
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const [cookies, setCookies] = useCookies(["isLogged", "username"]); // User's cookies
  // Gets User's info from localstorage
  const userInfo =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  // Gets User's setting info from localstorage
  const settingsInfo =
    typeof window !== "undefined" ? localStorage.getItem("settings") : null;
  const [user, setUser] = useState(userInfo ? JSON.parse(userInfo) : null); // User's info
  // User's setting info
  const [settings, setSettings] = useState(
    settingsInfo ? JSON.parse(settingsInfo) : null
  );

  let refreshPromise: Promise<boolean | null> | null = null; // Holds refresh token promise

  // Fetchs user's info and settings
  const fetchUser = async () => {
    let status = null;
    const headers = {
      Accept: "application/json",
    };
    await fetch(`${backendUrl}/user/info`, {
      method: "GET",
      headers: headers,
      credentials: "include",
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
          setUser(data.userInfo);
          setSettings(data.settingsInfo);
          localStorage.setItem("user", JSON.stringify(data.userInfo));
          localStorage.setItem("settings", JSON.stringify(data.settingsInfo));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // Refreshes token and tries again if error was a 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed) {
        fetchUser();
      }
    }
  };

  // Attempts to login in user giving username,password, and device id
  const login = async (
    username: string,
    password: string,
    deviceId: String
  ) => {
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    let message = "";
    await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
        deviceId: deviceId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          message = data.message;
        }
      })
      .catch((error) => console.error("error:", error));
    return message;
  };

  // Logs out user
  const logout = async () => {
    setUser(null);
    setSettings(null);
    localStorage.removeItem("settings");
    localStorage.removeItem("user");
    fetch(`${backendUrl}/auth/logout`, {
      credentials: "include",
      method: "DELETE",
    })
      .then(() => window.location.reload())
      .catch((error) => console.log(error));
  };

  // Attempts to refresh user's access token and refresh token
  const refresh = async () => {
    if (refreshPromise) {
      return await refreshPromise;
    }

    refreshPromise = fetch(`${backendUrl}/auth/refresh`, {
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return true;
        } else {
          sessionStorage.setItem("status", String(res.status));
          throw new Error("Token not valid");
        }
      })
      .catch((error) => {
        console.log("Error refreshing tokens: " + JSON.stringify(error));
        logout();
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });

    return await refreshPromise;
  };

  // Changes body color based on theme and logouts out user or fetches necessary date based on login status
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      settings &&
      settings.colorTheme == "dark" &&
      !document.body.classList.contains("dark-body")
    ) {
      document.body.classList.add("dark-body");
    } else if (
      typeof window !== "undefined" &&
      settings &&
      settings.colorTheme == "light" &&
      document.body.classList.contains("dark-body")
    ) {
      document.body.classList.remove("dark-body");
    }

    if (cookies.isLogged == true && user == null) {
      fetchUser();
    } else if (cookies.isLogged != true && user != null) {
      logout();
    }
  });

  return (
    <AuthContext.Provider
      value={{ user, settings, fetchUser, refresh, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
