// src/app/api/chat/group/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { z } from "zod";

const schema = z.object({
  chatId: z.string(),
  removeUserEmail: z.string().email(), // Email of user to remove
  adminEmail: z.string().email(), // Email of admin performing action
});


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, removeUserEmail, adminEmail } = schema.parse(body);

    // Find chat
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Find admin by email
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Check if admin is actually the chat admin
    if (chat.adminId !== adminUser.id) {
      return NextResponse.json(
        { error: "Only admin can remove users" },
        { status: 403 }
      );
    }

    // Find user to remove by email
    const removeUser = await prisma.user.findUnique({
      where: { email: removeUserEmail },
    });
    if (!removeUser) {
      return NextResponse.json(
        { error: "User to remove not found" },
        { status: 404 }
      );
    }

    // Check if user is in group
    if (!chat.participantIds.includes(removeUser.id)) {
      return NextResponse.json({ error: "User not in group" }, { status: 400 });
    }

    // Remove user
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        participantIds: chat.participantIds.filter(
          (id) => id !== removeUser.id
        ),
      },
    });

    return NextResponse.json({ chat: updatedChat });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


// src\app\api\chat\group\remove\route.ts

export async function GET(req: NextRequest) {
  const chatId = req.nextUrl.searchParams.get("chatId");
  if (!chatId)
    return NextResponse.json({ error: "chatId required" }, { status: 400 });

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { participantIds: true },
  });

  if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

  const members = await prisma.user.findMany({
    where: { id: { in: chat.participantIds } },
    select: { id: true, email: true },
  });

  return NextResponse.json({ members });
}
