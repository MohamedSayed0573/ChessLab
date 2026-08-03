import type { Game } from "@/game/game.js";

export type GameInfo =
	| {
			gameId: string;
			game: Game;
	  }
	| undefined;

export type PromotionPiece = "q" | "r" | "b" | "n";
