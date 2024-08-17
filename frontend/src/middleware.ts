import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkAuth, checkViewProfileAuth } from "./app/lib/ServerAuth";

export async function middleware(request: NextRequest) {
  const protectedRoutes: Array<string> = ["/profile", "/feed"];
  const access_token = request.cookies.get("access_token")?.value;
  const isLog = request.cookies.get("isLogged")?.value;
  const username = request.cookies.get("username")?.value;
  const response = NextResponse.next();
  let isLogged = false;

  if (request.nextUrl.pathname.includes("/profile/view")) {
    const match = request.nextUrl.pathname.match(/^\/profile\/view\/([^\/]+)$/);

    if (match) {
      const id = match[1];
      const authStatus = await checkViewProfileAuth(access_token, isLog, id);

      if (authStatus === 200) {
        return NextResponse.next();
      } else if (authStatus === 403) {
        return NextResponse.redirect(new URL("/", request.url));
      } else if (authStatus === 401) {
        return NextResponse.rewrite(
          new URL(`/loading?redirect=${request.nextUrl.pathname}`, request.url)
        );
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  if (
    username &&
    (request.nextUrl.pathname == "/login" ||
      request.nextUrl.pathname == "/register")
  ) {
    const redirect = request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  if (request.nextUrl.pathname == "/loading") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (access_token && protectedRoutes.includes(request.nextUrl.pathname)) {
    isLogged = checkAuth(access_token);
  }

  if (!isLogged && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.rewrite(
      new URL(`/loading?redirect=${request.nextUrl.pathname}`, request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
