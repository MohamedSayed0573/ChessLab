export type PlayerColor = "w" | "b";

export type CreateGameRes = {
	success: true;
	roomId: string;
	color: "w";
};

export type JoinGameRes =
	| {
			success: false;
			message: string;
	  }
	| {
			success: true;
			color: PlayerColor;
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
