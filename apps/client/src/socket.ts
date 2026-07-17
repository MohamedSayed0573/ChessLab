import { io, type Socket } from "socket.io-client";

const socketUrl =
	typeof window !== "undefined"
		? `${window.location.protocol}//${window.location.hostname}:3000`
		: "http://localhost:3000";

export const socket: Socket = io(socketUrl, {
	autoConnect: false,
});
