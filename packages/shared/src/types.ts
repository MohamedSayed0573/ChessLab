export type PlayerColor = "w" | "b";

export type CreateGameAck =
	| {
			ok: true;
			gameId: string;
	  }
	| {
			ok: false;
			error: string;
	  };

export type JoinGameAck =
	| {
			ok: true;
			gameId: string;
	  }
	| {
			ok: false;
			error: string;
	  };

export type GameOverInfo = {
	reason:
		| "Checkmate"
		| "Stalemate"
		| "Insufficient Material"
		| "Threefold Repetition"
		| "Fifty-Move Rule"
		| "Draw";
	winner: "w" | "b" | "d";
};

export interface GameStateEvent {
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

export type PlayerJoinedEvent = {
	gameId: string;
	opponentColor: PlayerColor;
	opponentId: string;
};

export type MoveMadeEvent = {
	fen: string;
	turn: PlayerColor;
};

export type GameMoveAck =
	| {
			ok: true;
			fen: string;
			turn: PlayerColor;
	  }
	| {
			ok: false;
			error: string;
	  };

export type GameSync =
	| {
			ok: true;
			gameId: string;
			color: PlayerColor;
			opponentId: string | undefined;
			fen: string;
			turn: PlayerColor;
	  }
	| {
			ok: false;
			error: string;
	  };

export type GameHistoryAck =
	| {
			ok: true;
			gameId: string;
			history: string[];
	  }
	| {
			ok: false;
			error: string;
	  };

export type User = {
	id: number;
	name: string;
	username: string;
	email: string;
	elo: number;
	avatarUrl?: string | undefined;
	createdAt: string;
	updatedAt?: string | undefined;
};
