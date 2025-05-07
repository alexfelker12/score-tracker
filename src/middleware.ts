//* react/next
import { NextRequest, NextResponse } from "next/server";

//* packages
// import { betterFetch } from '@better-fetch/fetch';
// import { Session } from "better-auth";
import { getSessionCookie } from "better-auth/cookies";

export default async function middleware(request: NextRequest) {
  //? node runtime not supported outside of canary
  // const session = await auth.api.getSession({ headers: await headers() })

  //* get session with fetch call
  const sessionCookie = getSessionCookie(request, {
    cookieName: "session_token",
    cookiePrefix: "better-auth",
    // useSecureCookies: process.env.NODE_ENV === "production",
    useSecureCookies: true,
  });

  if (!sessionCookie) {
    //* create search params from the url of the protecteded route to redirect back after authentication
    const fromProtectedURL = "?" + new URLSearchParams({ from: request.nextUrl.pathname })
    return NextResponse.redirect(new URL(`/sign-in${request.nextUrl.pathname !== "/" ? fromProtectedURL : ""}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // runtime: "nodejs", ? not supported outside of canary for builds
  //* path modifier
  //* * is zero or more
  //* ? is zero or one
  //* + one or more
  matcher: [
    "/trackers/:path+",
    "/leaderboards/:path*",
    "/profile/:path*",
  ],
}
