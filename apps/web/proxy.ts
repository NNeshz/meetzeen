import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_ROUTES = ["/", "/auth"];
const PROTECTED_ROUTES = ["/create", "/dashboard"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_ROUTES.some(route => pathname === route)) {
		return NextResponse.next();
	}

	const sessionCookie = getSessionCookie(request);

	const isProtectedRoute = PROTECTED_ROUTES.some(route => 
		pathname === route || pathname.startsWith(route + "/")
	);

	if (isProtectedRoute && !sessionCookie) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|assets|api).*)",
	],
};