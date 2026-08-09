import { useEffect } from "react";
import stockfish from "@stockfish/stockfish";
import type { Chess } from "chess.js";
import { difficulties, type DifficultyKey } from "@constants/stockfish";

export default function useStockfish({
	chessGame,
	turn,
	stockfishSide,
	isGameOver,
	onMove,
	difficulty,
}: {
	chessGame: Chess;
	turn: "w" | "b";
	stockfishSide: "w" | "b";
	isGameOver: boolean;
	onMove: () => void;
	difficulty: DifficultyKey;
}) {
	useEffect(() => {
		if (turn !== stockfishSide || isGameOver) return;

		stockfish.postMessage("uci");
		stockfish.postMessage("isready");
		stockfish.postMessage("ucinewgame");
		stockfish.postMessage("setoption name UCI_LimitStrength value true");
		stockfish.postMessage(`setoption name UCI_Elo value ${difficulties[difficulty].elo}`);

		stockfish.onmessage = (e) => {
			const message = e.data;
			if (message.startsWith("bestmove")) {
				const parts = message.split(" ");
				const bestMove = parts[1];
				if (bestMove && bestMove !== "(none)") {
					try {
						if (isGameOver) return;
						chessGame.move({
							from: bestMove.substring(0, 2),
							to: bestMove.substring(2, 4),
							promotion: bestMove.charAt(4) || "q",
						});
						onMove();
					} catch (err) {
						console.error("Error applying Stockfish move:", err);
					}
				}
			}
		};

		return () => {
			stockfish.postMessage("stop");
			stockfish.onmessage = null;
		};
	}, [chessGame, onMove, isGameOver, difficulty, stockfishSide, turn]);

	useEffect(() => {
		if (turn === stockfishSide && !isGameOver) {
			stockfish.postMessage(`position fen ${chessGame.fen()}`);
			stockfish.postMessage("go depth 15 movetime 1000");
		}
	}, [turn, chessGame, stockfishSide, isGameOver, difficulty]);
}
