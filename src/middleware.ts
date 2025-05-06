import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const publicRoutes = ["/login"];
const privateRoutes = ["/dashboard","/products", "/rooms", "/new-reservations", "/customers", "/reservations"];

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
    if (publicRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next({
      request,
    });
  }

  if (privateRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
