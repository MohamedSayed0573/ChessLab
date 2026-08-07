import type {
	GameMoveAck,
	GameStateEvent,
	GameSync,
	MoveMadeEvent,
	PlayerColor,
	PlayerJoinedEvent,
} from "@chesslab/shared/types";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import type { PieceDropHandlerArgs } from "react-chessboard";

export function useChessGame(gameId?: string) {
	const { socket } = useSocket();

	const [chessGame] = useState(new Chess());
	const [chessPosition, setChessPosition] = useState(() => chessGame.fen());
	const [gameOverInfo, setGameOverInfo] = useState<GameStateEvent | undefined>();
	const [opponentId, setOpponentId] = useState<string | undefined>();
	const [color, setColor] = useState<PlayerColor | undefined>();
	const [, setTurn] = useState<PlayerColor | undefined>();
	const [isGameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (!gameId) return;
		function handleMove({ fen, turn }: MoveMadeEvent) {
			chessGame.load(fen);
			setChessPosition(fen);
			setTurn(turn);
		}

		function handleGameOver(gameOverInfo: GameStateEvent) {
			setGameOverInfo(gameOverInfo);
		}

		function handleOpponentJoined({ opponentId }: PlayerJoinedEvent) {
			setOpponentId(opponentId);
		}

		function handleGameStarted() {
			setGameStarted(true);
		}

		socket.on("game:game-over", handleGameOver);
		socket.on("game:move-made", handleMove);
		socket.on("game:game-started", handleGameStarted);
		socket.on("game:player-joined", handleOpponentJoined);
		socket.emit("game:sync", (res: GameSync) => {
			if (!res.ok) {
				console.error("game:sync failed:", res.error);
				return;
			}
			setColor(res.color);
			setOpponentId(res.opponentId);
			chessGame.load(res.fen);
			setChessPosition(res.fen);
			setTurn(res.turn);
			if (res.opponentId) {
				setGameStarted(true);
			}
		});

		return () => {
			socket.off("game:move-made", handleMove);
			socket.off("game:game-over", handleGameOver);
			socket.off("game:game-started", handleGameStarted);
			socket.off("game:player-joined", handleOpponentJoined);
		};
	}, [socket, chessGame, gameId]);

	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		if (!targetSquare || gameOverInfo?.gameOver || !isGameStarted || !color) {
			return false;
		}

		const chess = chessGame;

		// Local turn check — avoid emitting when it's not our turn
		if (chess.turn() !== color) {
			return false;
		}

		const previousFen = chess.fen();

		try {
			const move = chess.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});
			if (!move) return false;
		} catch {
			// chess.js throws on illegal moves
			return false;
		}

		// Optimistic UI: show the move immediately
		setChessPosition(chess.fen());
		setTurn(chess.turn());

		socket.emit(
			"game:move",
			{
				promotion: "q",
				from: sourceSquare,
				to: targetSquare,
			},
			(data: GameMoveAck) => {
				if (data.ok) {
					chessGame.load(data.fen);
					setChessPosition(data.fen);
					setTurn(data.turn);
				} else {
					chess.load(previousFen);
					setChessPosition(previousFen);
					setTurn(chess.turn());
					console.error("game:move rejected:", data.error);
				}
			},
		);

		return true;
	}

	return { onPieceDrop, color, chessPosition, opponentId, gameOverInfo };
}
