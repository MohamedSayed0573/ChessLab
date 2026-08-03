import { useState } from "react";
import { useNavigate } from "react-router";
import { socket } from "../socket";
import type { JoinGameAck } from "@chesslab/shared/types";
import { routes } from "../routes";

export default function useJoinGame() {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState<string>();

	const joinGame = (gameId: string) => {
		if (!gameId) {
			setErrorMessage("Enter the game Id to join");
			return;
		}

		const timeout = setTimeout(() => setErrorMessage("Server took too long to respond"), 5000);
		socket.connect();

		const onError = (err: Error) => {
			clearTimeout(timeout);
			setErrorMessage(err.message);
		};

		socket.on("connect_error", onError);
		const trimmedgameId = gameId.trim();
		socket.emit("game:join", trimmedgameId, (res: JoinGameAck) => {
			socket.off("connect_error", onError);
			clearTimeout(timeout);
			if (!res.ok) {
				setErrorMessage(res.error);
				return;
			}
			navigate(routes.game.path(trimmedgameId), {
				state: { color: res.color, opponentId: res.opponentId },
			});
		});
	};

	const clearMessage = () => setErrorMessage(undefined);
	return { joinGame, errorMessage, clearMessage };
}
