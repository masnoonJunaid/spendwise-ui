import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const url = request.nextUrl.pathname;
  // const token = request.cookies.get("access_token");

  // console.log(`Request URL: ${url}`);
  // console.log(`Access Token: ${token}`);

  // const isAccessingDashboard = url.startsWith("/dashboard");

  // if (isAccessingDashboard && !token) {
  //   console.log("Redirecting to homepage due to missing token.");
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // if (url === "/" && token) {
  //   console.log("Redirecting to dashboard due to presence of token.");
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // console.log("Allowing request to proceed.");
  return NextResponse.next();
}
