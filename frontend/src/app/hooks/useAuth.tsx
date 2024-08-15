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
  const pathname = usePathname();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const [cookies, setCookies] = useCookies(["isLogged", "username"]);
  const userInfo =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const settingsInfo =
    typeof window !== "undefined" ? localStorage.getItem("settings") : null;
  const [user, setUser] = useState(userInfo ? JSON.parse(userInfo) : null);
  const [settings, setSettings] = useState(
    settingsInfo ? JSON.parse(settingsInfo) : null
  );

  let refreshPromise: Promise<boolean | null> | null = null;

  const router = useRouter();

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

    if (status == false) {
      const refreshed = await refresh();
      if (refreshed) {
        fetchUser();
      }
    }
  };

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

  const refresh = async () => {
    if (refreshPromise) {
      // console.log("Already Refreshing!");
      return await refreshPromise;
    }

    // console.log("REFRESHING TOKEN!");
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
