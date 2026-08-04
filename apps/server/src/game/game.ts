import type { GameStateEvent, PromotionPiece } from "@chesslab/shared/types";
import { Chess } from "chess.js";
import EventEmitter from "node:events";

const PLAYER_TIME = 600_000;

export class Game extends EventEmitter {
	private chess: Chess;
	private whitePlayerId: string | undefined;
	private blackPlayerId: string | undefined;
	private GameStateEvent: GameStateEvent;
	private isStarted: boolean;
	private pendingDrawOffer: { offeredBy: "w" | "b" } | undefined;

	private whiteDisconnectTimeout: NodeJS.Timeout | undefined;
	private blackDisconnectTimeout: NodeJS.Timeout | undefined;

	private whiteTimeMs: number;
	private blackTimeMs: number;
	private lastMoveTime: number | undefined;

	private whiteTimeout: NodeJS.Timeout | undefined;
	private blackTimeout: NodeJS.Timeout | undefined;

	constructor(firstPlayerId: string, fen?: string) {
		super();

		this.chess = new Chess(fen);
		this.GameStateEvent = {
			gameOver: false,
			reason: undefined,
			winnerColor: undefined,
		};
		this.isStarted = false;
		this.whiteDisconnectTimeout = undefined;
		this.blackDisconnectTimeout = undefined;
		this.whiteTimeMs = PLAYER_TIME;
		this.blackTimeMs = PLAYER_TIME;
		this.lastMoveTime = undefined;
		this.whiteTimeout = undefined;
		this.blackTimeout = undefined;

		if (Math.random() < 0.5) {
			this.whitePlayerId = firstPlayerId;
		} else {
			this.blackPlayerId = firstPlayerId;
		}
	}

	disconnected(playerId: string) {
		if (!this.isValidPlayerId(playerId)) throw new Error("Player doesn't exist in the game");
		const playerColor = this.getColor(playerId);

		const timeout = setTimeout(() => {
			this.GameStateEvent = {
				gameOver: true,
				reason: "Abandonment",
				winnerColor: oppositeColor(playerColor),
			};

			this.emit("game-over", { GameStateEvent: this.GameStateEvent });
		}, 30_000);

		if (playerColor === "w") {
			clearTimeout(this.whiteDisconnectTimeout);
			this.whiteDisconnectTimeout = timeout;
		} else {
			clearTimeout(this.blackDisconnectTimeout);
			this.blackDisconnectTimeout = timeout;
		}
	}

	reconnect(playerId: string) {
		if (!this.isValidPlayerId(playerId)) throw new Error("Player doesn't exist in the game");
		const playerColor = this.getColor(playerId);

		if (playerColor === "w") {
			clearTimeout(this.whiteDisconnectTimeout);
		} else {
			clearTimeout(this.blackDisconnectTimeout);
		}
	}

	start() {
		if (!this.whitePlayerId || !this.blackPlayerId) {
			throw new Error("The game isn't full yet. Can't start");
		}

		if (this.isStarted) {
			throw new Error("The game has already started");
		}

		this.isStarted = true;
		this.lastMoveTime = Date.now();

		this.whiteTimeout = setTimeout(() => {
			this.GameStateEvent = {
				gameOver: true,
				reason: "Timeout",
				winnerColor: "b",
			};
			this.emit("game-over", {
				GameStateEvent: this.GameStateEvent,
			});
		}, PLAYER_TIME);
	}

	join(playerId: string) {
		// If the player is already in the game, do nothing
		if (playerId === this.whitePlayerId || playerId === this.blackPlayerId) {
			return;
		}

		if (this.whitePlayerId && this.blackPlayerId) {
			throw new Error("The game is full");
		}

		if (!this.whitePlayerId) {
			this.whitePlayerId = playerId;
		} else {
			this.blackPlayerId = playerId;
		}
	}

	move(playerId: string, from: string, to: string, promotion: PromotionPiece = "q") {
		this.assertPlayerCanMove(playerId);

		const now = Date.now();
		if (this.updateClock(now)) return;

		this.chess.move({ from, to, promotion }, { strict: true });
		this.lastMoveTime = now;

		// Clear the draw offer on
		this.pendingDrawOffer = undefined;

		this.clearTurnTimers();

		if (this.chess.isGameOver()) {
			this.evaluateGameOverState(playerId);
		} else {
			this.scheduleTurnTimer();
		}
	}

	getColor(playerId: string) {
		if (!this.isValidPlayerId(playerId)) throw new Error("Invalid Player Id");

		return playerId === this.whitePlayerId ? "w" : "b";
	}

	getMyOpponent(myPlayerId: string) {
		if (!this.isValidPlayerId(myPlayerId)) throw new Error("Invalid Player Id");
		return myPlayerId === this.whitePlayerId ? this.blackPlayerId : this.whitePlayerId;
	}

	getChess() {
		return this.chess;
	}

	getFEN() {
		return this.chess.fen();
	}

	getTurn() {
		return this.chess.turn();
	}

	isGameOver() {
		return this.GameStateEvent.gameOver;
	}

	getGameStateEvent() {
		return this.GameStateEvent;
	}

	getGameHistory() {
		return this.chess.history();
	}

	getWhite() {
		return this.whitePlayerId;
	}

	getBlack() {
		return this.blackPlayerId;
	}

	resign(playerId: string) {
		if (!this.isValidPlayerId(playerId)) throw new Error("Invalid Player Id");

		const color = this.getColor(playerId);
		this.clearTurnTimers();

		this.GameStateEvent = {
			gameOver: true,
			reason: "Resignation",
			winnerColor: oppositeColor(color),
		};
	}

	offerDraw(submittedByPlayerId: string) {
		if (!this.isValidPlayerId(submittedByPlayerId)) throw new Error("Invalid Player Id");

		if (this.GameStateEvent.gameOver) {
			throw new Error("The game is already over.");
		}

		if (this.pendingDrawOffer) {
			throw new Error("Draw is Already Offered");
		}

		this.pendingDrawOffer = { offeredBy: this.getColor(submittedByPlayerId) };
	}

	acceptDraw(playerId: string) {
		if (!this.isValidPlayerId(playerId)) throw new Error("Invalid Player Id");

		if (!this.pendingDrawOffer) {
			throw new Error("There is no draw offer");
		}

		const playerColor = this.getColor(playerId);
		if (this.pendingDrawOffer.offeredBy === playerColor) {
			throw new Error("You can't accept your own draw offer");
		}

		this.clearTurnTimers();
		this.GameStateEvent = {
			gameOver: true,
			reason: "Draw by Agreement",
			winnerColor: "d",
		};
		this.pendingDrawOffer = undefined;
	}

	declineDraw(playerId: string) {
		if (!this.isValidPlayerId(playerId)) throw new Error("Invalid Player Id");

		if (!this.pendingDrawOffer) {
			throw new Error("There is no draw offer");
		}

		const playerColor = this.getColor(playerId);
		if (this.pendingDrawOffer.offeredBy === playerColor) {
			throw new Error("You can't decline your own draw offer");
		}

		this.pendingDrawOffer = undefined;
	}

	// Private Helper Methods
	private isValidPlayerId(playerId: string) {
		return playerId === this.whitePlayerId || playerId === this.blackPlayerId;
	}

	private evaluateGameOverState(playerId: string) {
		let reason: GameStateEvent["reason"];
		let winnerColor: GameStateEvent["winnerColor"];
		if (this.chess.isCheckmate()) {
			reason = "Checkmate";
			winnerColor = this.getColor(playerId);
		} else if (this.chess.isDraw()) {
			winnerColor = "d";
			if (this.chess.isDrawByFiftyMoves()) reason = "Fifty-Move Rule";
			else if (this.chess.isInsufficientMaterial()) reason = "Insufficient Material";
			else if (this.chess.isStalemate()) reason = "Stalemate";
			else if (this.chess.isThreefoldRepetition()) reason = "Threefold Repetition";
		}

		this.clearDisconnectTimeouts();

		this.GameStateEvent = {
			gameOver: true,
			reason,
			winnerColor,
		};
	}

	private assertPlayerCanMove(playerId: string) {
		if (this.GameStateEvent.gameOver) {
			throw new Error("You can't make a move. The game is already over.");
		}

		if (!this.isStarted) {
			throw new Error("You can't make a move. the game hasn't started yet");
		}

		const expectedPlayerId =
			this.chess.turn() === "w" ? this.whitePlayerId : this.blackPlayerId;

		if (playerId !== expectedPlayerId) {
			throw new Error("It's not your turn.");
		}
	}

	private clearTurnTimers() {
		clearTimeout(this.whiteTimeout);
		clearTimeout(this.blackTimeout);
	}

	private clearDisconnectTimeouts() {
		clearTimeout(this.whiteDisconnectTimeout);
		clearTimeout(this.blackDisconnectTimeout);
	}

	private updateClock(now: number): boolean {
		const timeDifference = this.lastMoveTime ? now - this.lastMoveTime : 0;

		if (this.getTurn() === "w") {
			this.whiteTimeMs -= timeDifference;
		} else {
			this.blackTimeMs -= timeDifference;
		}

		if (this.whiteTimeMs <= 0 || this.blackTimeMs <= 0) {
			this.GameStateEvent = {
				gameOver: true,
				reason: "Timeout",
				winnerColor: this.whiteTimeMs <= 0 ? "b" : "w",
			};
			this.emit("game-over", { GameStateEvent: this.GameStateEvent });
			return true;
		}

		return false;
	}

	private scheduleTurnTimer() {
		if (this.getTurn() === "w") {
			this.whiteTimeout = setTimeout(() => {
				this.GameStateEvent = {
					gameOver: true,
					reason: "Timeout",
					winnerColor: "b",
				};
				this.emit("game-over", {
					GameStateEvent: this.GameStateEvent,
				});
			}, this.whiteTimeMs);
		} else {
			this.blackTimeout = setTimeout(() => {
				this.GameStateEvent = {
					gameOver: true,
					reason: "Timeout",
					winnerColor: "w",
				};
				this.emit("game-over", {
					GameStateEvent: this.GameStateEvent,
				});
			}, this.blackTimeMs);
		}
	}
}

function oppositeColor(color: "w" | "b") {
	return color === "w" ? "b" : "w";
}
