import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkAuth } from "./app/lib/ServerAuth";

export async function middleware(request: NextRequest) {
  const protectedRoutes: Array<string> = ["/profile", "/", "/feed", "/explore"];
  const access_token = request.cookies.get("access_token")?.value;
  const refresh_token = request.cookies.get("refresh_token")?.value;
  const username = request.cookies.get("username")?.value;
  const response = NextResponse.next();
  let isLogged = false;

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
  // if (request.nextUrl.pathname == "/loading") {
  //   console.log("HERE");
  //   const redirect = request.nextUrl.searchParams.get("redirect") || "/";

  //   if (access_token) {
  //     return NextResponse.redirect(new URL(redirect, request.url));
  //   }

  //   return NextResponse.next();
  // }

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
