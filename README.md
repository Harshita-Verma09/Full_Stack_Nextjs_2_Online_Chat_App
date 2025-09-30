##  Real Time Chat Application 

A modern, secure, real-time chat application built with Next.js, Socket.IO, and Prisma. This app supports private and group chats, OTP authentication, voice-to-text, online status, and more..

---


##  Tech Stack.

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM, Zod, MongoDB
- **Real-Time:** Socket.IO (Express server)
- **Auth & Security:** JWT, bcryptjs, OTP (email verification)
- **Styling:** CSS Modules
- **Email:** Nodemailer

---

##  Features

- **OTP Verification:** Secure registration & password reset via email OTP.
- **Forget/Reset Password:** Recover your account with OTP.
- **Private Chat:** One-to-one messaging.
- **Create Group:** Make group chats, invite friends.
- **Group Chat:** Real-time group messaging.
- **Admin Controls:** Only group admins can add/remove members.
- **Voice to Text:** Dictate messages using speech recognition.
- **Online Status:** See who's online in real time.
- **Dark/Light Mode:** Toggle between themes.
- **Logout:** Securely log out.
- **Delete for Me:** Hide messages locally.

---

## Folder Structure

```
.env
.gitignore
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
README.md
tsconfig.json
.next/
prisma/
  schema.prisma
  migrations/
public/
  file.svg
  globe.svg
  next.svg
  vercel.svg
  window.svg
src/
  app/
    api/
      auth/
        register/
        login/
        verify-otp/
        send-otp/
        forgot-password/
        reset-password/
      chat/
        private/
          create/
          messages/
        group/
          create/
          list/
          messages/
          send/
          add/
          remove/
    chat/
      UserList/
      ChatWindow/
      TypeSend/
      SelectUserAnimation/
    group/
      GroupList/
      ChatArea/
      ChatWindow/
      AddMember/
      RemoveMember/
      createGroup/
    auth/
      login/
      register/
      forgot-password/
      verify-otp/
  lib/
    db.ts
    otp.ts
    mailer.ts
    socket.ts
  socket-server/
    index.ts
```

---

##  Where Is It Used?

- **Personal Messaging:** Private chat between users.
- **Group Collaboration:** Create and manage group chats.
- **Secure Authentication:** OTP-based registration and password recovery.
- **Admin Management:** Group admins control membership.
- **Voice Messaging:** Dictate messages.

---

## How to Play

1. **Register:** Sign up with email, verify via OTP.
2. **Login:** Enter credentials.
3. **Private Chat:** Select a user and chat.
4. **Create Group:** Name your group, add members.
5. **Group Chat:** Send messages, manage members (admin only).
6. **Voice to Text:** Use mic button to dictate.
7. **Dark/Light Mode:** Toggle theme.
8. **Logout:** End your session.
9. **Delete for Me:** Hide messages from your view.

---

## How to Run

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Setup environment variables:**  
   Create `.env` file (see `.env.example`).
3. **Run Prisma migrations:**
   ```sh
   npx prisma migrate dev
   ```
4. **Start Next.js dev server:**
   ```sh
   npm run dev
   ```
5. **Start Socket.IO server:**
   ```sh
   npm run start:socket
   ```
6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

##  How Socket Connection Works

- **Client:** Connects using `src/app/lib/socket.ts`.
- **Server:** `src/app/socket-server/index.ts` handles:
  - Online user tracking
  - Room join/leave
  - Real-time message broadcast
  - Message persistence via Next.js API
- **Authentication:** JWT token sent with socket connection for user identification.

**Example server logic:**
```ts
// filepath: index.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_ORIGIN || "",
].filter(Boolean);

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true },
});

const onlineUsers = new Set<string>();

io.on("connection", (socket) => {
  // ... JWT decode, online user tracking, join/leave, sendMessage, disconnect ...
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(` Socket server listening on port ${PORT}`);
});
```

---

##  How Is It Secure?

- **JWT Authentication:** All requests require valid JWT tokens.
- **OTP Verification:** Email-based OTP for registration and password reset.
- **Password Hashing:** bcryptjs for passwords.
- **Rate Limiting:** OTP requests and verification attempts.
- **Safe Error Messages:** Prevents user enumeration.
- **Admin Controls:** Only group admins can add/remove members.

---

## UI Explained

- **Responsive Design:** Desktop & mobile friendly.
- **Sidebar Navigation:** Switch between chats.
- **User List:** Shows online status.
- **Chat Window:** Messages with timestamps, sender info.
- **Input Box:** Type or dictate messages.
- **Group Controls:** Admins can add/remove members.
- **Theme Toggle:** Dark/light mode.
- **Notifications:** Toasts for actions.

---

## Why Prisma, Zod, TypeScript in UI?
- Prisma: Used for type-safe, fast, and scalable database access. It simplifies data modeling, migrations, and querying MongoDB, ensuring consistency and reliability.

- Zod: Used for runtime validation and type inference of API inputs/outputs. It helps catch errors early, validates user data, and improves security by enforcing strict schemas.

- TypeScript: Used for type safety across the entire codebase. It reduces bugs, improves developer experience, and makes refactoring easier. In the UI, it ensures props, state, and API responses are always correct.

