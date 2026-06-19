import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
  const isApi = pathname.startsWith("/api/");
  const isStatic = pathname.startsWith("/_next/") || pathname === "/favicon.ico";

  if (isPublic || isApi || isStatic) {
    if (isPublic && token && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
