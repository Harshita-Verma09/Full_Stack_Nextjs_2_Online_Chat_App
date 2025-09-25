// //src\app\lib\auth.ts

// import jwt from "jsonwebtoken";
// export function signToken( payload: object) {
//     return jwt.sign( payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
// }
// export function verifyToken( token: string){
//     return jwt.verify( token, process.env.JWT_SECRET!)
// }




// src/app/lib/auth.ts

import jwt from "jsonwebtoken";
// Payload ka type define karte hai
interface JWTPayload {
  userId: string;
}

// 🔑 Token generate karne ke liye
export function signToken(userId: string) {
  const payload: JWTPayload = { userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });

  console.log("JWT Generated:");
  console.log("Payload:", payload);
  console.log("Token:", token);


  return token; 
}

//  Token verify karne ke liye
export function verifyToken(token: string): JWTPayload {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

  console.log("JWT Verified:");
  console.log("Token:", token);
  console.log("Decoded Payload:", decoded);

  return decoded;
}
