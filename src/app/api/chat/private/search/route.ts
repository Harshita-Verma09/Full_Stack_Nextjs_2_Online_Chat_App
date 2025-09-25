// src\app\api\chat\search\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, isVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      exists: true,
      user,
      message: user.isVerified
        ? "User exists and is verified"
        : "User exists but not verified",
    });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
