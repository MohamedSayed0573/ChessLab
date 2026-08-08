import { GameManager } from "@game/gameManager.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "@config/env.js";
import type { DefaultEventsMap, Socket, SocketData } from "socket.io";
import type {
	CreateGameAck,
	JoinGameAck,
	GameMoveAck,
	MoveMadeEvent,
	PlayerJoinedEvent,
	GameSync,
	GameHistoryAck,
	GameStartedEvent,
} from "@chesslab/shared/types";
import { toErrorMessage } from "@chesslab/shared/errors";
import { io } from "@/io.js";
const gameManager = new GameManager();

// Authentication Middleware
io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	if (!token) return next(new Error("Unauthorized"));

	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
		socket.data.userId = payload.userId;
	} catch {
		return next(new Error("Unauthorized"));
	}

	return next();
});

// Attach GameInfo if the player is already in a game
io.use((socket, next) => {
	const userId = socket.data.userId;
	const gameId = gameManager.findGameIdByUser(userId);
	if (gameId) {
		const game = gameManager.getGame(gameId);
		socket.data.gameInfo = { gameId, game };
	}

	return next();
});

function handleOnConnection(
	userId: string,
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
) {
	try {
		if (socket.data.gameInfo) {
			const { gameId, game } = socket.data.gameInfo;
			socket.join(gameId);
			game.reconnect(userId);
			socket.to(gameId).emit("game:player-reconnected");
		}
	} catch (err) {
		console.error("handleOnConnection error:", toErrorMessage(err));
	}
}

io.on("connection", (socket) => {
	const userId = socket.data.userId;

	handleOnConnection(userId, socket);

	socket.onAny((event, ...args) => {
		console.log(event, ...args);
	});

	socket.on("game:create", (cb: (reply: CreateGameAck) => void) => {
		try {
			const activeGameId = gameManager.isPlayerInActiveGame(userId);
			if (activeGameId) {
				return cb({
					ok: false,
					error: "Already in a game",
					gameId: activeGameId,
				});
			}

			const { gameId, game } = gameManager.createGame(userId);
			socket.join(gameId);
			socket.data.gameInfo = { gameId, game };

			game.on("game-over", ({ GameStateEvent }) => {
				io.to(gameId).emit("game:game-over", {
					GameStateEvent,
				});
			});

			cb({
				ok: true,
				gameId,
			});
		} catch (err) {
			cb({
				ok: false,
				error: toErrorMessage(err),
			});
		}
	});

	socket.on("game:join", (gameId: string, cb: (reply: JoinGameAck) => void) => {
		try {
			// The user is already in an active game, reject the join request.
			const activeGameId = gameManager.isPlayerInActiveGame(userId);
			if (activeGameId && activeGameId !== gameId) {
				return cb({
					ok: false,
					error: "Already in a game",
					gameId: activeGameId,
				});
			}

			// Already in this game — reattach to the room without re-emitting start events.
			if (socket.data.gameInfo?.gameId === gameId) {
				const game = gameManager.getGame(gameId);
				socket.join(gameId);
				socket.data.gameInfo = { gameId, game };
				cb({ ok: true, gameId });
				return;
			}

			const game = gameManager.joinGame(gameId, userId);
			socket.join(gameId);
			socket.data.gameInfo = { gameId, game };

			game.on("game-over", () => {
				io.to(gameId).emit("game:game-over", {
					GameStateEvent: game.getGameStateEvent(),
				});
			});

			socket.to(gameId).emit("game:player-joined", {
				gameId,
				opponentColor: game.getColor(userId),
				opponentId: userId,
			} as PlayerJoinedEvent);

			game.start();
			io.to(gameId).emit("game:game-started", {
				timeInfo: game.getTimeInfo(),
			} satisfies GameStartedEvent);

			cb({
				ok: true,
				gameId,
			});
		} catch (err) {
			cb({
				ok: false,
				error: toErrorMessage(err),
			});
		}
	});

	socket.on("game:move", ({ from, to, promotion }, cb: (data: GameMoveAck) => void): void => {
		try {
			if (!socket.data.gameInfo) {
				throw new Error("You are not in a game");
			}
			const { game, gameId } = socket.data.gameInfo;
			const userId = socket.data.userId;

			if (game.getColor(userId) !== game.getChess().turn()) {
				throw new Error("This isn't your turn");
			}

			game.move(userId, from, to, promotion);
			const fen = game.getFEN();
			const turn = game.getTurn();
			const timeInfo = game.getTimeInfo();

			socket.to(gameId).emit("game:move-made", { fen, turn, timeInfo } as MoveMadeEvent);

			if (game.isGameOver()) {
				io.to(gameId).emit("game:game-over", game.getGameStateEvent());
			}

			cb({
				ok: true,
				fen,
				turn,
			});
		} catch (err) {
			cb({
				ok: false,
				error: toErrorMessage(err),
			});
		}
	});

	socket.on("game:offerDraw", () => {
		try {
			if (!socket.data.gameInfo) {
				throw new Error("You are not in a game");
			}
			const { game, gameId } = socket.data.gameInfo;

			game.offerDraw(userId);
			socket.to(gameId).emit("game:draw-offered");
		} catch (err) {
			console.error("game:offerDraw error:", toErrorMessage(err));
		}
	});

	socket.on("game:acceptDraw", () => {
		try {
			if (!socket.data.gameInfo) {
				throw new Error("You are not in a game");
			}
			const { game, gameId } = socket.data.gameInfo;

			game.acceptDraw(userId);
			socket.to(gameId).emit("game:draw-accepted");
		} catch (err) {
			console.error("game:acceptDraw error:", toErrorMessage(err));
		}
	});

	socket.on("game:declineDraw", () => {
		try {
			if (!socket.data.gameInfo) {
				throw new Error("You are not in a game");
			}
			const { game, gameId } = socket.data.gameInfo;

			game.declineDraw(userId);
			socket.to(gameId).emit("game:draw-declined");
		} catch (err) {
			console.error("game:declineDraw error:", toErrorMessage(err));
		}
	});

	socket.on("game:history", (cb: (reply: GameHistoryAck) => void) => {
		try {
			if (!socket.data.gameInfo) {
				throw new Error("You are not in a game");
			}
			const { game, gameId } = socket.data.gameInfo;

			cb({
				ok: true,
				gameId,
				history: game.getGameHistory(),
			});
		} catch (err) {
			cb({
				ok: false,
				error: toErrorMessage(err),
			});
		}
	});

	socket.on("disconnect", () => {
		try {
			if (!socket.data.gameInfo) return;
			const { game, gameId } = socket.data.gameInfo;
			game.disconnected(userId);

			socket.to(gameId).emit("game:player-disconnected");
		} catch (err) {
			console.error("disconnect error:", toErrorMessage(err));
		}
	});

	socket.on("game:sync", (cb: (sync: GameSync) => void) => {
		try {
			if (!socket.data.gameInfo) {
				throw new Error("You are not in a game");
			}
			const userId = socket.data.userId;
			const { game, gameId } = socket.data.gameInfo;

			cb({
				ok: true,
				gameId,
				color: game.getColor(userId),
				opponentId: game.getMyOpponent(userId),
				fen: game.getFEN(),
				turn: game.getTurn(),
				timeInfo: game.getTimeInfo(),
			});
		} catch (err) {
			cb({
				ok: false,
				error: toErrorMessage(err),
			});
		}
	});
});
