import { io } from "socket.io-client";
import type { user } from "../types/models";

export const connectToSocket = (userData: user) => {
  if (!userData) return;
  const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
    query: {
      userId: userData?._id,
    },
  });
  newSocket.connect();
  return newSocket;
};
