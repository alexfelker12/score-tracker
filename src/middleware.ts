//* react/next
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

//* lib
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    //* create search params from the url of the protecteded route to redirect back after authentication

    const fromProtectedURL = "?" + new URLSearchParams({ from: request.nextUrl.pathname })
    return NextResponse.redirect(new URL(`/sign-in${request.nextUrl.pathname !== "/" ? fromProtectedURL: ""}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  runtime: "nodejs",
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
