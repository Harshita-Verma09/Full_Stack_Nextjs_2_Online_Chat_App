//src\app\api\chat\group\add\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { z } from "zod";

const schema = z.object({
  chatId: z.string(),
  newUserEmail: z.string().email(), // Email of user to add
  adminEmail: z.string().email(), // Email of admin performing action
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, newUserEmail, adminEmail } = schema.parse(body);

    // Find chat
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Find admin user by email
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Check if admin is indeed chat admin
    if (chat.adminId !== adminUser.id) {
      return NextResponse.json(
        { error: "Only admin can add users" },
        { status: 403 }
      );
    }

    // Find new user by email
    const newUser = await prisma.user.findUnique({
      where: { email: newUserEmail },
    });
    if (!newUser) {
      return NextResponse.json(
        { error: "User to add not found" },
        { status: 404 }
      );
    }

    // Check if user already in group
    if (chat.participantIds.includes(newUser.id)) {
      return NextResponse.json(
        { error: "User already in group" },
        { status: 400 }
      );
    }

    // Update participants
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { participantIds: [...chat.participantIds, newUser.id] },
    });

    return NextResponse.json({ chat: updatedChat });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
