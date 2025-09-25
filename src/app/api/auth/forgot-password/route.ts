// src/app/api/auth/forgot-password/route.ts

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import { forgotPasswordSchema } from "@/app/lib/zod-schemas";
import { generateOTP, otpExpiry } from "@/app/lib/otp";
import { sendOTPEmail } from "@/app/lib/mailer";

/**
 * POST /api/auth/forgot-password
 * 
 *  - Validates input via Zod
 *  - Checks if user exists (generic error to prevent email enumeration)
 *  - Generates OTP and expiry timestamp
 *  - Updates user record securely
 *  - Sends OTP via email
 *  - Handles edge cases like multiple requests safely
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse & validate request body
    const body = await request.json();
    const data = forgotPasswordSchema.parse(body);

    // Step 2: Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Step 3: Handle non-existent users securely
    if (!user) {
      // Generic message to avoid revealing if user exists
      return NextResponse.json(
        { message: "If the email exists, an OTP has been sent." },
        { status: 200 }
      );
    }

    // Step 4: Generate OTP and expiry
    const otp = generateOTP();
    const expiry = otpExpiry();

    // Step 5: Update user OTP and expiry in DB
    await prisma.user.update({
      where: { email: data.email },
      data: {
        otp,
        otpExpiresAt: expiry,
        otpRequestCount: (user.otpRequestCount || 0) + 1,
        otpLastSentAt: new Date(),
      },
    });

    // Step 6: Send OTP email (async)
    await sendOTPEmail(data.email, otp);

    // Step 7: Return success message
    return NextResponse.json(
      { message: "If the email exists, an OTP has been sent." },
      { status: 200 }
    );

  } catch (error: any) {
    // Step 8: Catch and handle errors safely
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
