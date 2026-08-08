import type { ChessboardOptions, PieceDropHandlerArgs } from "react-chessboard";
import useStockfish from "./useStockfish";
import { Chess } from "chess.js";
import { useState } from "react";
import { getGameOverInfo } from "@chesslab/shared/utils";
import { useCompTimer } from "./useCompTimer";
import { playMoveSound } from "@services/sfx/index";

export function useComputerGame() {
	const [chessGame] = useState(() => new Chess());
	const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
	const [turn, setTurn] = useState<"w" | "b">("w");
	const [gameHistory, setGameHistory] = useState<string[]>([]);
	// const [side] = useState<"w" | "b">(() => (Math.random() < 0.5 ? "w" : "b"));
	const [side] = useState<"w" | "b">(() => "w");

	let gameOverInfo = getGameOverInfo(chessGame);

	const { timeMs, isTimeUp } = useCompTimer({
		turn,
		side,
		isGameOver: !!gameOverInfo,
	});

	if (isTimeUp && !gameOverInfo) {
		gameOverInfo = {
			gameOver: true,
			winnerColor: turn === "w" ? "b" : "w",
			reason: "Timeout",
		};
	}

	useStockfish({
		chessGame,
		turn,
		stockfishSide: side === "w" ? "b" : "w",
		isGameOver: !!gameOverInfo,
		onMove: () => {
			setChessPosition(chessGame.fen());
			setTurn(chessGame.turn());
			setGameHistory(chessGame.history());
			playMoveSound(chessGame);
		},
	});

	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		if (turn !== side || !targetSquare || gameOverInfo) return false;

		try {
			const move = chessGame.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});

			if (!move) return false;

			setChessPosition(chessGame.fen());

			playMoveSound(chessGame);
			setTurn(chessGame.turn());
			setGameHistory(chessGame.history());

			return true;
		} catch {
			return false;
		}
	}

	const chessboardOptions: ChessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		boardOrientation: side === "w" ? "white" : "black",
	};

	return {
		turn,
		side,
		timeMs,
		gameHistory,
		gameOverInfo,
		chessboardOptions,
	};
}
