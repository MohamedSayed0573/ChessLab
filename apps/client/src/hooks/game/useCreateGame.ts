import { useNavigate } from "react-router";
import { useState } from "react";
import type { CreateGameAck } from "@chesslab/shared/types";
import { routes } from "@/routes";
import { useSocket } from "@hooks/useSocket";
import { toErrorMessage } from "@chesslab/shared/errors";

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
			socket.emit("game:create", (res: CreateGameAck) => {
				clearTimeout(timeout);
				socket.off("connect_error", onError);

				if (!res.ok) {
					setErrorMessage(
						res.gameId
							? `You are already in an active game ${res.gameId}. Join it to continue`
							: res.error,
					);
					return;
				}
				navigate(routes.game.path(res.gameId));
			});
		} catch (err) {
			setErrorMessage(toErrorMessage(err));
		}
	};

	const clearMessage = () => setErrorMessage(undefined);
	return { errorMessage, createGame, clearMessage };
}
