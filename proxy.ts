import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add "/terms" and "/privacy" as public routes
const isPublicRoute = createRouteMatcher([
	"/login(.*)",
	"/sso-callback(.*)",
	"/terms(.*)",
	"/privacy(.*)",
]);

export const proxy = clerkMiddleware(async (auth, request) => {
	const { userId } = await auth();
	const url = request.nextUrl.clone();
	const pathname = request.nextUrl.pathname;

	// Redirect root to the correct page based on auth status
	if (pathname === "/") {
		url.pathname = userId ? "/home" : "/login";
		return NextResponse.redirect(url);
	}

	// Redirect authenticated users away from public routes (login, terms, privacy)
	if (userId && isPublicRoute(request)) {
		url.pathname = "/home";
		return NextResponse.redirect(url);
	}

	// Redirect unauthenticated users trying to access protected pages
	if (!userId && !isPublicRoute(request)) {
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}
});

export const config = {
	matcher: [
		// Match all routes except static files
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};