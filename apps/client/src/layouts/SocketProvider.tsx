import { useEffect, useState, type PropsWithChildren } from "react";
import useAuth from "../hooks/useAuth";

import { io, type Socket } from "socket.io-client";
import { SERVER_URL } from "../config";
import { SocketContext } from "../contexts/socketContext";

const socket: Socket = io(SERVER_URL, {
	autoConnect: false,
	withCredentials: true,
});

export function SocketProvider({ children }: PropsWithChildren) {
	const { accessToken } = useAuth();

	const [isConnected, setIsConnected] = useState(socket.connected);

	useEffect(() => {
		const onConnect = () => setIsConnected(true);
		const onDisconnect = () => setIsConnected(false);

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	useEffect(() => {
		if (!accessToken) return;

		socket.auth = { token: accessToken };
		socket.connect();

		return () => {
			socket.disconnect();
		};
	}, [accessToken]);

	useEffect(() => {
		socket.onAny((event, ...args) => {
			console.log(event, ...args);
		});
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
	);
}
