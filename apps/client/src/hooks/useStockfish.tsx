import { useEffect } from "react";
import stockfish from "../stockfish/stockfish";
import type { Chess } from "chess.js";

export default function useStockfish({
	chessGame,
	turn,
	stockfishSide,
	onMove,
}: {
	chessGame: Chess;
	turn: "w" | "b";
	stockfishSide: "w" | "b";
	onMove: () => void;
}) {
	useEffect(() => {
		stockfish.postMessage("uci");
		stockfish.postMessage("isready");
		stockfish.postMessage("ucinewgame");

		stockfish.onmessage = (e) => {
			const message = e.data;
			if (message.startsWith("bestmove")) {
				const parts = message.split(" ");
				const bestMove = parts[1];
				if (bestMove && bestMove !== "(none)") {
					try {
						if (chessGame.isGameOver()) return;
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
	}, [chessGame, onMove]);

	useEffect(() => {
		if (turn === stockfishSide && !chessGame.isGameOver()) {
			stockfish.postMessage(`position fen ${chessGame.fen()}`);
			stockfish.postMessage("go depth 15");
		}
	}, [turn, chessGame, stockfishSide]);
}
