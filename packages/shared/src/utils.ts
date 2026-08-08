import type { GameStateEvent } from "./types.js";
import type { Chess } from "chess.js";

export function getGameOverInfo(chess: Chess): GameStateEvent | undefined {
	if (!chess.isGameOver()) return undefined;

	let reason: GameStateEvent["reason"];
	let winnerColor: GameStateEvent["winnerColor"];
	if (chess.isCheckmate()) {
		reason = "Checkmate";
		winnerColor = chess.turn() === "w" ? "b" : "w";
	} else if (chess.isDraw()) {
		winnerColor = "d";
		if (chess.isDrawByFiftyMoves()) reason = "Fifty-Move Rule";
		else if (chess.isInsufficientMaterial()) reason = "Insufficient Material";
		else if (chess.isStalemate()) reason = "Stalemate";
		else if (chess.isThreefoldRepetition()) reason = "Threefold Repetition";
	}

	return {
		gameOver: true,
		reason,
		winnerColor,
	};
}
