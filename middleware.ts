import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const token = request.cookies.get("access_token"); // fix typo from "acess_token" to "access_token"

  const isAccessingDashboard = url.startsWith("/dashboard");

  if (isAccessingDashboard && !token) {
    // Not authenticated, redirect to homepage or login
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (url === "/" && token) {
    // Already logged in, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
