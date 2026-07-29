import type { Game } from "@/game/game.js";

export type GameInfo =
	| {
			gameId: string;
			game: Game;
	  }
	| undefined;

export interface GameState {
	gameOver: boolean;
	reason:
		| "Resignation"
		| "Draw by Agreement"
		| "Checkmate"
		| "Stalemate"
		| "Threefold Repetition"
		| "Insufficient Material"
		| "Fifty-Move Rule"
		| "Timeout"
		| "Abandonment"
		| undefined;
	winnerColor: "w" | "b" | "d" | undefined;
}

export type PromotionPiece = "q" | "r" | "b" | "n";
