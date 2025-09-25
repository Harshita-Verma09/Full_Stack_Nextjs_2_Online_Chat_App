// // // src/app/api/chat/group/messages/route.ts

// // import { NextRequest, NextResponse } from "next/server";
// // import { prisma } from "@/app/lib/db";

// // export async function GET(request: NextRequest) {
// //   try {
// //     const { searchParams } = new URL(request.url);
// //     const chatId = searchParams.get("chatId");
// //     const userId = searchParams.get("userId");
// //     if (!chatId || !userId) {
// //       return NextResponse.json(
// //         { error: "Missing chatId or userId" },
// //         { status: 400 }
// //       );
// //     }

// //     if (!chatId || !userId) {
// //       return NextResponse.json(
// //         { error: "Missing chatId or userId" },
// //         { status: 400 }
// //       );
// //     }

// //     // Get user by email
// //     const user = await prisma.user.findUnique({
// //       where: { id: userId },
// //       select: { id: true, email: true },
// //     });

// //     if (!user) {
// //       return NextResponse.json({ error: "User not found" }, { status: 404 });
// //     }

// //     const chat = await prisma.chat.findUnique({
// //       where: { id: chatId },
// //     });

// //     if (!chat) {
// //       return NextResponse.json({ error: "Chat not found" }, { status: 404 });
// //     }

// //     // Check if user is participant
// //     if (!chat.participantIds.includes(user.id)) {
// //       return NextResponse.json(
// //         { error: "You are not a participant of this chat" },
// //         { status: 403 }
// //       );
// //     }

// //     // Fetch messages with sender info
// //     const messages = await prisma.message.findMany({
// //       where: { chatId },
// //       orderBy: { createdAt: "asc" },
// //       include: {
// //         sender: { select: { id: true, username: true, email: true } },
// //       },
// //     });

// //     const mappedMessages = messages.map((msg) => ({
// //       id: msg.id,
// //       chatId: msg.chatId,
// //       text: msg.text,
// //       createdAt: msg.createdAt,
// //       sender: msg.sender
// //         ? {
// //             id: msg.sender.id,
// //             username: msg.sender.username,
// //             email: msg.sender.email,
// //           }
// //         : null,
// //     }));

// //     return NextResponse.json({ messages: mappedMessages });
// //   } catch (error) {
// //     let message = "Unknown error";
// //     if (error instanceof Error) message = error.message;
// //     return NextResponse.json({ error: message }, { status: 500 });
// //   }
// // }

// // src\app\api\chat\group\messages\route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/app/lib/db";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const chatId = searchParams.get("chatId");
//     const userId = searchParams.get("userId");

//     if (!chatId || !userId) {
//       return NextResponse.json(
//         { error: "Missing chatId or userId" },
//         { status: 400 }
//       );
//     }

//     // Get user by id
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { id: true, email: true },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const chat = await prisma.chat.findUnique({
//       where: { id: chatId },
//     });

//     if (!chat) {
//       return NextResponse.json({ error: "Chat not found" }, { status: 404 });
//     }

//     // Check if user is participant
//     if (!chat.participantIds.includes(user.id)) {
//       return NextResponse.json(
//         { error: "You are not a participant of this chat" },
//         { status: 403 }
//       );
//     }

//     // Fetch messages with sender info
//     const messages = await prisma.message.findMany({
//       where: { chatId },
//       orderBy: { createdAt: "asc" },
//       include: {
//         sender: { select: { id: true, username: true, email: true } },
//       },
//     });

//     const mappedMessages = messages.map((msg) => ({
//       id: msg.id,
//       chatId: msg.chatId,
//       text: msg.text,
//       createdAt: msg.createdAt,
//       sender: msg.sender
//         ? {
//             id: msg.sender.id,
//             username: msg.sender.username,
//             email: msg.sender.email,
//           }
//         : null,
//     }));

//     return NextResponse.json({ messages: mappedMessages });
//   } catch (error) {
//     let message = "Unknown error";
//     if (error instanceof Error) message = error.message;
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// // }

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/app/lib/db";
// import { ObjectId } from "mongodb";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const chatId = searchParams.get("chatId");
//     const userId = searchParams.get("userId");

//     if (!chatId || !userId) {
//       return NextResponse.json(
//         { error: "Missing chatId or userId" },
//         { status: 400 }
//       );
//     }

//     //  Get user
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { id: true, email: true },
//     });

//     if (!user)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });

//     //  Get chat
//     const chat = await prisma.chat.findUnique({
//       where: { id: chatId },
//       select: { id: true, participantIds: true },
//     });

//     if (!chat)
//       return NextResponse.json({ error: "Chat not found" }, { status: 404 });

//     //  Security: Check user is participant
//     if (!chat.participantIds.includes(user.id)) {
//       return NextResponse.json(
//         { error: "Access denied. You are not a participant of this chat." },
//         { status: 403 }
//       );
//     }

//     //  Fetch messages
//     const messages = await prisma.message.findMany({
//       where: { chatId },
//       orderBy: { createdAt: "asc" },
//       include: {
//         sender: { select: { id: true, username: true, email: true } },
//       },
//     });

//     return NextResponse.json({ messages });
//   } catch (error) {
//     let message = "Unknown error";
//     if (error instanceof Error) message = error.message;
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// // src/app/api/chat/group/messages/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/app/lib/db";
// import jwt from "jsonwebtoken"; // install with: npm i jsonwebtoken

// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// export async function GET(request: NextRequest) {
//   try {
//     // -----------------------------
//     // 1️⃣ Authenticate user via JWT
//     // -----------------------------
//     const authHeader = request.headers.get("Authorization");
//     if (!authHeader)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const token = authHeader.replace("Bearer ", "");
//     let payload: any;

//     try {
//       payload = jwt.verify(token, JWT_SECRET);
//     } catch {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     const userId = payload.userId;

//     // -----------------------------
//     // 2️⃣ Validate chatId
//     // -----------------------------
//     const { searchParams } = new URL(request.url);
//     const chatId = searchParams.get("chatId");
//     if (!chatId)
//       return NextResponse.json({ error: "Missing chatId" }, { status: 400 });

//     // -----------------------------
//     // 3️⃣ Get chat
//     // -----------------------------
//     const chat = await prisma.chat.findUnique({
//       where: { id: chatId },
//       select: { id: true, participantIds: true },
//     });
//     if (!chat)
//       return NextResponse.json({ error: "Chat not found" }, { status: 404 });

//     // -----------------------------
//     // 4️⃣ Check user is participant
//     // -----------------------------
//     if (!chat.participantIds.includes(userId)) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     // -----------------------------
//     // 5️⃣ Fetch messages (with pagination)
//     // -----------------------------
//     const limit = parseInt(searchParams.get("limit") || "50");
//     const cursor = searchParams.get("cursor"); // optional for pagination

//     const messages = await prisma.message.findMany({
//       where: { chatId },
//       orderBy: { createdAt: "asc" },
//       take: limit,
//       cursor: cursor ? { id: cursor } : undefined,
//       skip: cursor ? 1 : 0,
//       include: { sender: { select: { id: true, username: true } } }, // don't expose email if not needed
//     });

//     return NextResponse.json({ messages });
//   } catch (err) {
//     let message = "Unknown error";
//     if (err instanceof Error) message = err.message;
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// src/app/api/chat/group/messages/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// -----------------------------
// GET - Fetch messages
// -----------------------------
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    let payload: any;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.userId;

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    if (!chatId)
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { id: true, participantIds: true },
    });
    if (!chat)
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    if (!chat.participantIds.includes(userId)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const limit = parseInt(searchParams.get("limit") || "50");
    const cursor = searchParams.get("cursor");

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: { sender: { select: { id: true, username: true } } },
    });

    return NextResponse.json({ messages });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// -----------------------------
// POST - Save new message
// -----------------------------
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    let payload: any;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.userId;

    const body = await request.json();
    const { chatId, text } = body;

    if (!chatId || !text)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { id: true, participantIds: true },
    });
    if (!chat)
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    if (!chat.participantIds.includes(userId)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const newMessage = await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        text,
      },
      include: { sender: { select: { id: true, username: true } } },
    });

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
