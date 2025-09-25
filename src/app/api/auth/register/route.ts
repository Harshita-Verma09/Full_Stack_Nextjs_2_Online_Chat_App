// src/app/api/auth/register/route.ts

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import { registerSchema } from "@/app/lib/zod-schemas";
import { generateOTP, otpExpiry } from "@/app/lib/otp";
import { sendOTPEmail } from "@/app/lib/mailer";
import bcrypt from "bcryptjs";


/**
 * POST /api/auth/register
 * 
 * Registers a new user:
 *  - Validates input via Zod
 *  - Checks if user already exists
 *  - Hashes password securely
 *  - Generates OTP for email verification
 *  - Sends OTP email
 *  - Rate-limits repeated registrations (optional enhancement)
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse & validate request body
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Step 2: Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists. Please login or reset password." },
        { status: 400 }
      );
    }

    // Step 3: Hash the password securely
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Step 4: Generate OTP and expiry for email verification
    const otp = generateOTP();
    const expiry = otpExpiry();

    // Step 5: Create user in the database
    await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpiresAt: expiry,
        otpRequestCount: 0,
        otpLastSentAt: null,
      },
    });

    // Step 6: Send OTP email (async)
    try {
      await sendOTPEmail(data.email, otp);
    } catch (emailError) {
      // Log email sending failure but do not block registration
      console.error("Failed to send OTP email:", emailError);
    }

    // Step 7: Success response
    return NextResponse.json(
      { message: "User registered successfully. Please verify your email with OTP." },
      { status: 201 }
    );

  } catch (error: unknown) {
    // Step 8: Handle unexpected errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
  }
}
