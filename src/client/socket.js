import { io } from "socket.io-client";

const socketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL;

export const socket = socketServerUrl
  ? io(socketServerUrl, {
      autoConnect: false,
    })
  : io({
      autoConnect: false,
    });
