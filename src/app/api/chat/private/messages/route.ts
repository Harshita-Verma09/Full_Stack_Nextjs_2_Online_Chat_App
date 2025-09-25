// // src/app/api/chat/messages/route.ts


import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import { z } from "zod";
import jwt from "jsonwebtoken";

const postSchema = z.object({
  chatId: z.string(),
  senderId: z.string(),
  text: z.string().min(1),
  createdAt: z.string().optional(),
});

// JWT verification
function verifyJWT(token?: string) {
  if (!token) throw new Error("No token provided");
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch {
    throw new Error("Invalid token");
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /chat/private/messages called");

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    let body = await request.json();
    const data = postSchema.parse(body);
    console.log("Parsed data:", data);

    //  Case 1: Socket server request
    if (token === process.env.SOCKET_SERVER_TOKEN) {
      console.log("🔑 Verified via SOCKET_SERVER_TOKEN");

      const createdMessage = await prisma.message.create({
        data: {
          chatId: data.chatId,
          senderId: data.senderId,
          text: data.text,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        },
      });

      return NextResponse.json(createdMessage);
    }

    //  Case 2: Normal user request → verify JWT
    const decoded = verifyJWT(token);
    console.log("Decoded JWT:", decoded);

    if (decoded.userId !== data.senderId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: data.chatId },
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat.participantIds.includes(data.senderId)) {
      return NextResponse.json(
        { error: "You are not a participant of this chat" },
        { status: 403 }
      );
    }

    const createdMessage = await prisma.message.create({
      data: {
        chatId: data.chatId,
        senderId: data.senderId,
        text: data.text,
        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      },
    });

    return NextResponse.json(createdMessage);
  } catch (err: any) {
    console.error("❌ Error in POST /chat/messages:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("GET /chat/messages called");

    const url = new URL(request.url);
    const chatId = url.searchParams.get("chatId");
    if (!chatId) {
      console.log("chatId missing in query");
      return NextResponse.json({ error: "chatId Required" }, { status: 400 });
    }

    // Optional: Verify chat exists before fetching messages
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    console.log("Fetched messages:", messages.length);
    return NextResponse.json({ messages });
  } catch (err: any) {
    console.log("Error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
