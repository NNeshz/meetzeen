import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { authClientVanilla } from "@meetzeen/auth/client/vanilla";

export async function middleware(request: NextRequest) {
  const session = await authClientVanilla.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
