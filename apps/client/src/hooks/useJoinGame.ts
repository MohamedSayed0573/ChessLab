import { useState } from "react";
import { useNavigate } from "react-router";
import { socket } from "../socket";
import type { JoinGameRes } from "@chesslab/shared/types";
import { routes } from "../routes";

export default function useJoinGame() {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState<string>();
	const joinGame = (roomId: string) => {
		if (!roomId) {
			setErrorMessage("Enter a code to join");
			return;
		}

		const timeout = setTimeout(
			() => setErrorMessage("Server took too long to respond"),
			5000,
		);
		socket.connect();

		const onError = (err: Error) => {
			clearTimeout(timeout);
			setErrorMessage(err.message);
		};
		socket.on("connect_error", onError);
		const trimmedRoomId = roomId.trim();
		socket.emit("joinGame", trimmedRoomId, (res: JoinGameRes) => {
			socket.off("connect_error", onError);
			clearTimeout(timeout);
			if (!res.success) {
				setErrorMessage(res.message);
				return;
			}
			navigate(routes.game.path(trimmedRoomId));
		});
	};

	const clearMessage = () => setErrorMessage(undefined);
	return { joinGame, errorMessage, clearMessage };
}
