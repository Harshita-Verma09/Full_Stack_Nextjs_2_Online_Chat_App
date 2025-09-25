// // src/app/api/chat/group/send/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/app/lib/db";
// import { z } from "zod";

// // ------------------------
// // Schema validation
// // ------------------------
// const schema = z.object({
//   groupName: z.string().min(1, "Group name is required"), // group name instead of chatId
//   senderEmail: z.string().email({ message: "Invalid email address" }),
//   text: z
//     .string()
//     .refine((value) => value !== "", { message: "Message text is required" })
//     .min(1, "Message cannot be empty")
//     .max(1000, "Message cannot exceed 1000 characters"),
// });

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { groupName, senderEmail, text } = schema.parse(body);

//     // ------------------------
//     // 1️⃣ Find group by name
//     // ------------------------
//     const chat = await prisma.chat.findFirst({
//       where: { groupName },
//     });

//     if (!chat)
//       return NextResponse.json({ error: "Group not found" }, { status: 404 });

//     // ------------------------
//     // 2️⃣ Check sender exists in DB
//     // ------------------------
//     const sender = await prisma.user.findUnique({
//       where: { email: senderEmail },
//       select: { id: true, username: true, email: true },
//     });
//     if (!sender)
//       return NextResponse.json(
//         { error: "Sender not found in DB" },
//         { status: 403 }
//       );

//     // ------------------------
//     // 3️⃣ Check sender is a participant
//     // ------------------------
//     if (!chat.participantIds.includes(sender.id)) {
//       return NextResponse.json(
//         { error: "You are not a participant of this group" },
//         { status: 403 }
//       );
//     }

//     // ------------------------
//     // 4️⃣ Create message
//     // ------------------------
//     const message = await prisma.message.create({
//       data: {
//         text,
//         sender: { connect: { id: sender.id } },
//         chat: { connect: { id: chat.id } },
//       },
//       include: {
//         sender: { select: { id: true, username: true, email: true } },
//       },
//     });

//     // ------------------------
//     // 5️⃣ Return message with sender info
//     // ------------------------
//     return NextResponse.json({
//       message: {
//         ...message,
//         sender: {
//           id: sender.id,
//           username: sender.username,
//           email: sender.email,
//         },
//       },
//     });
//   } catch (err) {
//     let message = "Unknown error";
//     if (err instanceof Error) message = err.message;
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// src/app/api/chat/group/send/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { z } from "zod";

// ------------------------
// Schema validation
// ------------------------
const schema = z.object({
  chatId: z.string().min(1, "chatId is required"),
  senderId: z.string().min(1, "senderId is required"),
  text: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, senderId, text } = schema.parse(body);

    // ------------------------
    // 1️⃣ Check chat exists
    // ------------------------
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { id: true, participantIds: true },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // ------------------------
    // 2️⃣ Check sender is participant
    // ------------------------
    if (!chat.participantIds.includes(senderId)) {
      return NextResponse.json(
        { error: "Access denied. You are not a participant of this chat." },
        { status: 403 }
      );
    }

    // ------------------------
    // 3️⃣ Create message
    // ------------------------
    const message = await prisma.message.create({
      data: {
        text,
        sender: { connect: { id: senderId } },
        chat: { connect: { id: chatId } },
      },
      include: {
        sender: { select: { id: true, username: true, email: true } },
      },
    });

    // ------------------------
    // 4️⃣ Return message
    // ------------------------
    return NextResponse.json({ message });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
