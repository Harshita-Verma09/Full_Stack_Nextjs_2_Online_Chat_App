// // //src\app\lib\socket.ts

// import { io, Socket } from "socket.io-client";
// import type { Message } from "@/app/chat/TypeSend/page";

// //  Make sure this file is treated as a module
// export {};

// declare global {
//   // eslint-disable-next-line no-var
//   var socket: Socket | undefined;
// }

// let socket: Socket;

// if (!globalThis.socket) {
//   globalThis.socket = io(
//     process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
//     {
//       transports: ["websocket"], // force websocket
//       autoConnect: true,
//     }
//   );
// }

// socket = globalThis.socket;

// export default socket;

import { io, Socket } from "socket.io-client";
import type { Message } from "@/app/chat/TypeSend/page";

export {};

declare global {
  var socket: Socket | undefined;
}


let socket: Socket;

if (!globalThis.socket) {
  // Only run on client
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || "";

    globalThis.socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
      {
        transports: ["websocket"],
        autoConnect: true,
        auth: { token },
      }
    );
  }
}

socket = globalThis.socket!;
export default socket;
