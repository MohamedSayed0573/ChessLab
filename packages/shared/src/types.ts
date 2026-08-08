export type PlayerColor = "w" | "b";

export type CreateGameAck =
	| {
			ok: true;
			gameId: string;
	  }
	| {
			ok: false;
			error: string;
			gameId?: string;
	  };

export type JoinGameAck =
	| {
			ok: true;
			gameId: string;
	  }
	| {
			ok: false;
			error: string;
			gameId?: string;
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

export type TimeInfo = {
	whiteTimeMs: number;
	blackTimeMs: number;
	lastMoveTime: number | undefined;
};

export type MoveMadeEvent = {
	fen: string;
	turn: PlayerColor;
	timeInfo: TimeInfo;
};

export type GameStartedEvent = {
	timeInfo: TimeInfo;
};

export type GameMoveAck =
	| {
			ok: true;
			fen: string;
			turn: PlayerColor;
			timeInfo: TimeInfo;
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
			timeInfo: TimeInfo;
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

type ServerError = {
	success: false;
	message: string;
};

type Success<T> = {
	success: true;
} & T;

type ApiResponse<T> = Success<T> | ServerError;

export type LoginResponse = ApiResponse<{ accessToken: string }>;
export type RegisterResponse = ApiResponse<{ accessToken: string }>;
