// src\app\lib\otp.ts

export function generateOTP(length: number = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}


export function otpExpiry(minutes = 10) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}

