import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@meetzeen/auth";

const PUBLIC_ROUTES = ["/", "/auth"];
const AUTH_REQUIRED_NO_ORG_ROUTES = ["/create"];
const ORG_REQUIRED_ROUTES = ["/dashboard"];

function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.some(route => pathname === route);
}

function isAuthRequiredNoOrgRoute(pathname: string): boolean {
	return AUTH_REQUIRED_NO_ORG_ROUTES.some(route => 
		pathname === route || pathname.startsWith(route + "/")
	);
}

function isOrgRequiredRoute(pathname: string): boolean {
	return ORG_REQUIRED_ROUTES.some(route => 
		pathname === route || pathname.startsWith(route + "/")
	);
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// 1. Rutas públicas - permitir sin verificación
	if (isPublicRoute(pathname)) {
		return NextResponse.next();
	}

	const sessionCookie = getSessionCookie(request);

	// 2. Rutas que requieren auth pero NO requieren organización (/create)
	// Estas rutas son el destino del callback de OAuth
	if (isAuthRequiredNoOrgRoute(pathname)) {
		// Si no hay sesión, redirigir a inicio
		if (!sessionCookie) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		// Tiene sesión, permitir acceso a /create
		return NextResponse.next();
	}

	// 3. Rutas que requieren organización (/dashboard)
	if (isOrgRequiredRoute(pathname)) {
		if (!sessionCookie) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		try {
			const session = await auth.api.getSession({
				headers: request.headers,
			});

			if (!session) {
				return NextResponse.redirect(new URL("/", request.url));
			}

			const organizations = await auth.api.listOrganizations({
				headers: request.headers,
			});

			if (!organizations || organizations.length === 0) {
				return NextResponse.redirect(new URL("/create", request.url));
			}

			return NextResponse.next();
		} catch (error) {
			console.error("Error verifying user organizations:", error);
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	// 4. Cualquier otra ruta - requiere al menos sesión
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|assets|api).*)",
	],
};