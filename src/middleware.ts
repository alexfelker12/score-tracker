//* react/next
import { NextRequest, NextResponse } from "next/server";

//* packages
import { betterFetch } from '@better-fetch/fetch';
import { Session } from "better-auth";

export default async function middleware(request: NextRequest) {
  //? node runtime not supported outside of canary
  // const session = await auth.api.getSession({ headers: await headers() })

  //* get session with fetch call
  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
    },
  });

  if (!session) {
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
    "/user/:path*",
  ],
}
