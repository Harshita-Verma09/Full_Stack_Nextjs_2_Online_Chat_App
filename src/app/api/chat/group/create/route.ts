// src/app/api/chat/group/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { z } from "zod";

// ------------------------
// Schema Validation
// ------------------------
const schema = z.object({
  groupName: z.string(), // group name
  memberEmails: z
    .array(z.string().email({ message: "Invalid email address" }))
    .max(9, "Maximum 10 members allowed in a group (including admin)"), // max 9 members + 1 admin
  adminEmail: z.string().email({ message: "Invalid email address" }), // admin email
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ------------------------
    // 1️⃣ Basic schema validation
    // ------------------------
    const { groupName, memberEmails, adminEmail } = schema.parse(body);

    // ------------------------
    // 2️⃣ Check if group name already exists
    // ------------------------
    const existingGroup = await prisma.chat.findFirst({
      where: { isGroup: true, groupName },
    });
    if (existingGroup) {
      return NextResponse.json(
        { error: "Group name already exists" },
        { status: 400 }
      );
    }

    // ------------------------
    // 3️⃣ Get admin ID from email
    // ------------------------
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true },
    });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // ------------------------
    // 4️⃣ Get member IDs from emails
    // ------------------------
    const members = await prisma.user.findMany({
      where: { email: { in: memberEmails } },
      select: { id: true, email: true },
    });

    // ------------------------
    // 5️⃣ Check if all emails exist in DB
    // ------------------------
    const missingEmails = memberEmails.filter(
      (email) => !members.find((m) => m.email === email)
    );
    if (missingEmails.length > 0) {
      return NextResponse.json(
        { error: `These emails do not exist: ${missingEmails.join(", ")}` },
        { status: 400 }
      );
    }

    // ------------------------
    // 6️⃣ Create group chat
    // ------------------------
    const memberIds = members.map((m) => m.id);

    const chat = await prisma.chat.create({
      data: {
        isGroup: true,
        groupName,
        adminId: admin.id,
        participantIds: [admin.id, ...memberIds],
      },
    });

    return NextResponse.json({ chat });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
