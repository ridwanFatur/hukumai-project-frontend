import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/login(.*)", "/sso-callback(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const url = request.nextUrl.clone();

  // Redirect root to appropriate page
  if (request.nextUrl.pathname === "/") {
    url.pathname = userId ? "/home" : "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login
  if (userId && isPublicRoute(request)) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to login
  if (!userId && !isPublicRoute(request)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
