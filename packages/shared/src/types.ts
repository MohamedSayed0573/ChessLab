export type PlayerColor = "w" | "b";

export type CreateGameAck = {
	gameId: string;
	color: "w" | "b";
};

export type JoinGameAck =
	| {
			ok: true;
			gameId: string;
			color: "w" | "b";
			opponentId: string;
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

export type PlayerJoinedEvent = {
	gameId: string;
	color: PlayerColor;
	opponentId: string;
};

export type MoveMadeEvent = {
	fen: string;
	turn: PlayerColor;
};

export type GameMoveEvent = {
	from: string;
	to: string;
	promotion: string;
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
