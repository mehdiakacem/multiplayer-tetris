import { leaveCurrentRoom } from "./joinRoom.js";

export function handleDisconnect({ socket, io, gameManager }) {
  return () => {
    leaveCurrentRoom({ socket, io, gameManager });
  };
}
