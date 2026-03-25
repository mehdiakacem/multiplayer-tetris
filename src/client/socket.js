import { io } from "socket.io-client";

const socketServerUrl =
  import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000";

export const socket = io(socketServerUrl, {
  autoConnect: false,
});
