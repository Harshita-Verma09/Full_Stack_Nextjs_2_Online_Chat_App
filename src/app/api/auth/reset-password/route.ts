// src/app/api/auth/reset-password/route.ts

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import { resetPasswordSchema } from "@/app/lib/zod-schemas";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/reset-password
 * 
 * Resets user password securely:
 *  - Validates input via Zod
 *  - Checks if user exists
 *  - Verifies OTP and expiry
 *  - Hashes new password
 *  - Clears OTP and expiry fields after success
 *  - Prevents fake users or expired OTP attacks
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse & validate request body
    const body = await request.json();
    const data = resetPasswordSchema.parse(body);

    // Step 2: Find user by email
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      // Do not reveal if email exists or not, generic message
      return NextResponse.json(
        { error: "Invalid OTP or user" },
        { status: 400 }
      );
    }

    // Step 3: Verify OTP and expiry safely
    const otpExpiryDate =
      user.otpExpiresAt instanceof Date
        ? user.otpExpiresAt
        : user.otpExpiresAt
        ? new Date(user.otpExpiresAt)
        : null;

    if (!user.otp || user.otp !== data.otp || !otpExpiryDate || otpExpiryDate < new Date()) {
      return NextResponse.json(
        { error: "Invalid OTP or expired OTP" },
        { status: 400 }
      );
    }

    // Step 4: Hash new password securely
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Step 5: Update user password and clear OTP fields
    await prisma.user.update({
      where: { email: data.email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
        otpRequestCount: 0,
        otpLastSentAt: null,
      },
    });

    // Step 6: Return success message
    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
    
  } catch (error: unknown) {
    // Step 7: Handle unexpected errors safely
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
  }
}
