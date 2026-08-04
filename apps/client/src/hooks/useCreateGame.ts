import { useNavigate } from "react-router";
import { useState } from "react";
import type { CreateGameAck } from "@chesslab/shared/types";
import { routes } from "../routes";
import { useSocket } from "./useSocket";

export default function useCreateGame() {
	const { socket } = useSocket();
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState<string>();
	const createGame = () => {
		try {
			const timeout = setTimeout(
				() => setErrorMessage("Server took too long to respond"),
				5000,
			);

			const onError = (err: Error) => {
				clearTimeout(timeout);
				setErrorMessage(err.message);
			};

			socket.on("connect_error", onError);
			socket.emit("game:create", ({ gameId }: CreateGameAck) => {
				clearTimeout(timeout);
				socket.off("connect_error", onError);

				if (!gameId) {
					setErrorMessage("Failed to create game");
					return;
				}
				navigate(routes.game.path(gameId));
			});
		} catch (err) {
			setErrorMessage(err instanceof Error ? err.message : String(err));
		}
	};

	const clearMessage = () => setErrorMessage(undefined);
	return { errorMessage, createGame, clearMessage };
}
