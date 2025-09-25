// src/app/api/auth/login/route.ts

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import { loginSchema } from "@/app/lib/zod-schemas";
import bcrypt from "bcryptjs";
import { signToken } from "@/app/lib/auth";

/**
 * POST /api/auth/login
 *
 * Logs in a user:
 *  - Validates input via Zod
 *  - Checks if user exists
 *  - Checks if user is verified
 *  - Verifies password securely
 *  - Returns JWT token for authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse & validate request body
    const body = await request.json();
    const data = loginSchema.parse(body);

    // Step 2: Find user by email
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Step 3: Ensure user has verified their email
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 400 }
      );
    }

    // Step 4: Verify password securely
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Step 5: Generate JWT token (only user ID in payload)
    const token = signToken(user.id);

    // Step 6: Return token safely
    return NextResponse.json({ token });
  } catch (error: unknown) {
    // Step 7: Handle errors safely
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
