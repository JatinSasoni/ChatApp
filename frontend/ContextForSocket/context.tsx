import { createContext, useState, type ReactNode } from "react";
import { Socket } from "socket.io-client";

//Context Value Type
interface SocketContextType {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

export const socketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  return (
    <socketContext.Provider value={{ socket, setSocket }}>
      {children}
    </socketContext.Provider>
  );
};
