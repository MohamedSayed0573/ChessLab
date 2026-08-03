import { io, type Socket } from "socket.io-client";
import { SERVER_URL } from "./config";

export const socket: Socket = io(SERVER_URL, {
	autoConnect: false,
	withCredentials: true,
});
