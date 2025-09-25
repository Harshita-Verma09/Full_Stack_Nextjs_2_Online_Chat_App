// // src/app/api/chat/group/list/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/app/lib/db";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userEmail = searchParams.get("email"); // user email required

//     if (!userEmail) {
//       return NextResponse.json(
//         { error: "Missing user email" },
//         { status: 400 }
//       );
//     }

//     // 1️⃣ Get user
//     const user = await prisma.user.findUnique({
//       where: { email: userEmail },
//       select: { id: true, email: true },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // 2️⃣ Get groups where user is participant or admin
//     const groups = await prisma.chat.findMany({
//       where: {
//         isGroup: true,
//         OR: [
//           { participantIds: { has: user.id } }, // participant
//           { adminId: user.id }, // admin
//         ],
//       },
//       select: {
//         id: true,
//         groupName: true,
//         adminId: true,
//         participantIds: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // 3️⃣ Return group list
//     return NextResponse.json({ groups });
//   } catch (err) {
//     let message = "Unknown error";
//     if (err instanceof Error) message = err.message;
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// // src/app/api/chat/group/list/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/app/lib/db";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get("userId");

//   if (!userId)
//     return NextResponse.json({ error: "Missing userId" }, { status: 400 });

//   const groups = await prisma.chat.findMany({
//     where: {
//       isGroup: true,
//       OR: [{ participantIds: { has: userId } }, { adminId: userId }],
//     },
//     select: { id: true, groupName: true, participantIds: true, adminId: true },
//   });

//   return NextResponse.json({ groups });
// }

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/app/lib/db";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// export async function GET(request: NextRequest) {
//   const authHeader = request.headers.get("Authorization");
//   if (!authHeader)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const token = authHeader.replace("Bearer ", "");
//   let payload: any;

//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }

//   const userId = payload.userId;

//   const groups = await prisma.chat.findMany({
//     where: {
//       isGroup: true,
//       OR: [{ participantIds: { has: userId } }, { adminId: userId }],
//     },
//     select: { id: true, groupName: true, participantIds: true, adminId: true },
//   });

//   return NextResponse.json({ groups });
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request: NextRequest) {
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

  const groups = await prisma.chat.findMany({
    where: {
      isGroup: true,
      OR: [{ participantIds: { has: userId } }, { adminId: userId }],
    },
    select: {
      id: true,
      groupName: true,
      participantIds: true,
      adminId: true,
    },
  });

  //  Inject isAdmin field here
  const groupsWithAdminFlag = groups.map((g) => ({
    id: g.id,
    groupName: g.groupName,
    participantIds: g.participantIds,
    adminId: g.adminId,
    isAdmin: g.adminId === userId, //  logged-in user is admin or not
  }));

  return NextResponse.json({ groups: groupsWithAdminFlag });
}
