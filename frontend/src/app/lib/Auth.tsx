export const logout = () => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  fetch(`${backendUrl}/auth/logout`, {
    credentials: "include",

    method: "DELETE",
  })
    .then((res) => window.location.reload())
    .catch((error) => console.log(error));
};

export const refreshToken = async () => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  return fetch(`${backendUrl}/auth/refresh`, {
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
        throw new Error("Token not valid");
      }
    })
    .catch((error) => {
      console.log("Error refreshing tokens: " + JSON.stringify(error));
      logout();
      return false;
    });
};
