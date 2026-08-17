import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes, but not /admin/login itself
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = req.cookies.get("al_ekhlas_session");

    if (!session?.value) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate session token
    try {
      const sessionData = JSON.parse(Buffer.from(session.value, "base64").toString());
      const expires = new Date(sessionData.expires);
      if (expires < new Date()) {
        // Session expired
        const loginUrl = new URL("/admin/login", req.url);
        loginUrl.searchParams.set("expired", "1");
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("al_ekhlas_session");
        return res;
      }
      if (sessionData.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    } catch {
      // Invalid token
      const loginUrl = new URL("/admin/login", req.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("al_ekhlas_session");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
