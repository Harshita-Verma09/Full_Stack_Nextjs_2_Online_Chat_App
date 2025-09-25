// src/app/api/auth/verify-otp/route.ts

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import { otpSchema } from "@/app/lib/zod-schemas";

/**
 * POST /api/auth/verify-otp
 *
 * Validates an OTP for a given email and marks the user as verified.
 * Covers edge cases:
 *  - Non-existent users
 *  - Expired or invalid OTPs
 *  - Multiple attempts / brute-force prevention
 *  - Safe error messages (prevent email enumeration)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body and validate using zod
    const body = await request.json();
    const data = otpSchema.parse(body);

    // Step 1: Check if user exists
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    // Generic error to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or OTP" },
        { status: 400 }
      );
    }

    // Step 2: Handle OTP attempt limits (rate limiting / brute force protection)
    const MAX_ATTEMPTS = 5;
    const BLOCK_DURATION_MINUTES = 15;
    const now = new Date();

    if (
      user.otpRequestCount >= MAX_ATTEMPTS &&
      user.otpLastSentAt &&
      now.getTime() - new Date(user.otpLastSentAt).getTime() <
        BLOCK_DURATION_MINUTES * 60 * 1000
    ) {
      return NextResponse.json(
        {
          error: `Too many OTP attempts. Try again after ${BLOCK_DURATION_MINUTES} minutes.`,
        },
        { status: 429 }
      );
    }

    // Step 3: Ensure otpExpiresAt is a valid Date object
    const expiresAt =
      user.otpExpiresAt instanceof Date
        ? user.otpExpiresAt
        : user.otpExpiresAt
        ? new Date(user.otpExpiresAt)
        : null;

    // Step 4: Validate OTP
    if (!data.otp || !expiresAt || user.otp !== data.otp || expiresAt < now) {
      // Increment attempt count for monitoring
      await prisma.user.update({
        where: { email: data.email },
        data: {
          otpRequestCount: { increment: 1 },
          otpLastSentAt: now,
        },
      });

      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Step 5: OTP is valid, mark user as verified and reset OTP-related fields
    await prisma.user.update({
      where: { email: data.email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiresAt: null,
        otpRequestCount: 0, // reset attempt count
        otpLastSentAt: null, // reset last sent timestamp
      },
    });

    // Success response
    return NextResponse.json(
      { message: "OTP verified successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Catch unexpected errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
