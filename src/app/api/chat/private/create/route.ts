// src/app/api/chat/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { z } from "zod";

const schema = z.object({
  userA: z.string(),
  userB: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse and validate request body
    const body = await request.json();
    const { userA, userB } = schema.parse(body);

    // Step 2: Check if both users exist and are verified
    const userAExists = await prisma.user.findUnique({
      where: { id: userA },
      select: { id: true, isVerified: true },
    });
    const userBExists = await prisma.user.findUnique({
      where: { id: userB },
      select: { id: true, isVerified: true },
    });

    if (!userAExists || !userBExists) {
      return NextResponse.json(
        { error: "One or both users do not exist" },
        { status: 400 }
      );
    }

    if (!userAExists.isVerified || !userBExists.isVerified) {
      return NextResponse.json(
        { error: "Both users must be verified to create chat" },
        { status: 403 }
      );
    }

    // Step 3: Sort participants for uniqueness
    const participants = [userA, userB].sort();

    // Step 4: Check if chat already exists
    const existing = await prisma.chat.findFirst({
      where: {
        AND: [
          { participantIds: { hasEvery: participants } },
          { isGroup: false },
        ],
      },
    });

    if (existing) return NextResponse.json(existing);

    // Step 5: Create new chat
    const chat = await prisma.chat.create({
      data: {
        participantIds: participants,
        isGroup: false,
      },
    });

    return NextResponse.json({ chat });
  } catch (error: any) {
    // Step 6: Catch-all error handling
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//src\app\api\chat\create\route.ts
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { isVerified: true },
      select: { id: true, email: true },
    });

    return NextResponse.json({ users });
  } catch (error: unknown) {
    //  Proper error handling without 'any'
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
