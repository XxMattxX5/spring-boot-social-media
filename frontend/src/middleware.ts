import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const protectedRoutes: Array<string> = [];
  const token = request.cookies.get("token")?.value;
  const checkToken = (token: string) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp) {
        return decodedToken.exp < currentTime;
      } else {
        console.error("Error retrieving token expiration date");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  // If token is in cookies the expiration date is checked
  if (token) {
    if (checkToken(token)) {
      if (protectedRoutes.includes(String(request.nextUrl.pathname))) {
        console.log("credential's cleared");
        return NextResponse.redirect(new URL("/login", request.url));
      } else {
        console.log("credential's cleared");
      }
    }
  }

  // Redirects user if they try to reach login page while logged in
  const currentUser = false;
  if (currentUser && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
