import { useEffect, type PropsWithChildren } from "react";
import useAuth from "../hooks/useAuth";
import { socket } from "../socket";

export function SocketProvider({ children }: PropsWithChildren) {
	const { accessToken } = useAuth();

	useEffect(() => {
		if (!accessToken) return;

		socket.auth = { token: accessToken };
		socket.connect();

		return () => {
			socket.disconnect();
		};
	}, [accessToken]);

	return children;
}
