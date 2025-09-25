// src/app/api/auth/send-otp/route.ts

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import { sendOTPSchema } from "@/app/lib/zod-schemas";
import { generateOTP, otpExpiry } from "@/app/lib/otp";
import { sendOTPEmail } from "@/app/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = sendOTPSchema.parse(body);

    // 🔹 User find karo DB se
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔹 Aaj ki date nikal lo (00:00:00 reset karke) — taaki din ka check ho sake
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔹 User ke previous OTP requests ka data
    let otpRequestCount = user.otpRequestCount || 0;
    let otpLastSentAt = user.otpLastSentAt
      ? new Date(user.otpLastSentAt)
      : null;

    // 🔹 Agar last OTP bhi aaj hi request hua hai
    if (otpLastSentAt && otpLastSentAt >= today) {
      // Agar already 2 OTP bhej diye hain → block karo
      if (otpRequestCount >= 2) {
        return NextResponse.json(
          { error: "You can only request OTP 2 times per day" },
          { status: 429 } // Too Many Requests
        );
      }
      // Varna count +1 karo
      otpRequestCount += 1;
    } else {
      // 🔹 Agar naya din hai → counter reset karke 1 kar do
      otpRequestCount = 1;
    }

    // 🔹 Naya OTP generate karo + expiry time set karo
    const otp = generateOTP();
    const expiry = otpExpiry();

    // 🔹 User table update karo (OTP, expiry, request count, last sent time)
    await prisma.user.update({
      where: { email: data.email },
      data: {
        otp,
        otpExpiresAt: expiry,
        otpRequestCount,
        otpLastSentAt: new Date(),
      },
    });

    // 🔹 Mail bhejo user ko
    await sendOTPEmail(data.email, otp);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
