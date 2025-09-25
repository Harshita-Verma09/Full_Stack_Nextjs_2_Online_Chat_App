// src/app/api/user/all/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Optional: pass participantIds as a query param, comma-separated
    const url = new URL(request.url);
    const participantIdsParam = url.searchParams.get("participantIds"); // e.g., "id1,id2,id3"
    const participantIds = participantIdsParam
      ? participantIdsParam.split(",")
      : [];

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });

    // Filter out users who are already in the group
    const filteredUsers = users.filter(
      (user) => !participantIds.includes(user.id)
    );

    return NextResponse.json({ users: filteredUsers });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
