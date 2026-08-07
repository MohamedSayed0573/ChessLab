import { createContext } from "react";
import type { Socket } from "socket.io-client";

type SocketContextValue = {
	socket: Socket; // always defined
	isConnected: boolean;
};

export const SocketContext = createContext<SocketContextValue | null>(null);
