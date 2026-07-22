import { useNavigate } from "react-router";
import { socket } from "../socket";
import { useState } from "react";
import type { CreateGameRes } from "@chesslab/shared/types";
import { routes } from "../routes";

export default function useCreateGame() {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState<string>();
	const createGame = () => {
		try {
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
			socket.emit("createGame", ({ roomId }: CreateGameRes) => {
				clearTimeout(timeout);
				socket.off("connect_error", onError);

				if (!roomId) {
					setErrorMessage("Failed to create game");
					return;
				}
				navigate(routes.game.path(roomId));
			});
		} catch (err) {
			setErrorMessage(err instanceof Error ? err.message : String(err));
		}
	};

	const clearMessage = () => setErrorMessage(undefined);
	return { errorMessage, createGame, clearMessage };
}
