// src\app\lib\middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./auth";


export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/chat/:path*"], // protect these routes
};
