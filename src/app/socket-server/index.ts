// // src\app\socket-server\index.ts

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

// Track online users using Set
const onlineUsers = new Set<string>();

io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  // Decode userId from JWT
  let userId = "";
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      userId = decoded.userId;
    } catch (err) {
      console.error("JWT decode failed", err);
    }
  }

  if (userId) {
    onlineUsers.add(userId);
    io.emit("onlineUsers", Array.from(onlineUsers));
  }

  // Join chat room
  socket.on("joinChat", (chatId: string) => {
    socket.join(chatId);
    console.log(`👥 Socket ${socket.id} joined chat ${chatId}`);
  });

  // Leave chat room
  socket.on("leaveChat", (chatId: string) => {
    socket.leave(chatId);
    console.log(`🚪 Socket ${socket.id} left chat ${chatId}`);
  });

  // Send message
  socket.on(
    "sendMessage",
    async (payload: { chatId: string; senderId: string; text: string }) => {
      const msg = { ...payload, createdAt: new Date().toISOString() };

      // Broadcast to room
      io.to(msg.chatId).emit("newMessage", msg);

      // Save to DB via Next.js API
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/chat/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.SOCKET_SERVER_TOKEN}`,
            },
            body: JSON.stringify(msg),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Backend error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        console.log("💾 Message saved in DB:", data);
      } catch (error) {
        console.error("❌ Error saving message:", error);
      }
    }
  );

  // Disconnect
  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId);
      io.emit("onlineUsers", Array.from(onlineUsers));
    }
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket server listening on port ${PORT}`);
  console.log(" Allowed origins:", allowedOrigins);
});

// //node src/app/socket-server/index.js
// // npm run start:socket
