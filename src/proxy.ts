import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect all nutritionist routes
  if (pathname.startsWith("/nutritionist")) {
    // No authenticated session
    if (!session) {
      return NextResponse.redirect(
        new URL("/auth/login", req.url)
      );
    }

    // Only nutritionists can access nutritionist pages
    if (session.user?.role !== "nutritionist") {
      return NextResponse.redirect(
        new URL("/auth/login", req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/nutritionist/:path*"],
};