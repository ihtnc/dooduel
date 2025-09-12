import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@utilities/session";

const protectedRoutes = ["/create", "/game", "/lobby", "join"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const session = await getSession();

  if (isProtectedRoute && !session?.player_name) {
    return NextResponse.redirect(new URL("/player", req.nextUrl));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};