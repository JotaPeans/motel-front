import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const redirectToRoomsUrls = ["/login"];

function verifyJwt(token: string) {
  try {
    const decoded = jwt.decode(token);
    const isTokenValid =
      ((decoded as any)?.exp || 0) - new Date().getTime() / 1000 > 0;

    return isTokenValid;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access-token");

  const isTokenValid = verifyJwt(accessToken?.value || "");

  if (isTokenValid) {
    if (redirectToRoomsUrls.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/rooms", request.url));
    }
    return;
  }

  if (redirectToRoomsUrls.includes(request.nextUrl.pathname) === false) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
