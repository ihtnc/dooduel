import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@utilities/session";
import { getClient } from "@utilities/supabase/server";

const protectedRoutes = ["/create", "/join"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const client = await getClient();
  await client.auth.getUser();

  const session = await getSession();

  if (isProtectedRoute && !session?.playerName) {
    const url = new URL("/player", req.nextUrl);
    url.searchParams.set("prev", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};