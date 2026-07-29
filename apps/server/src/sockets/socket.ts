import { io } from "@/index.js";
import { GameManager } from "@/game/gameManager.js";
import { type JwtPayload } from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import type { DefaultEventsMap, Socket, SocketData } from "socket.io";
const gameManager = new GameManager();

// Authentication Middleware
io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	if (!token) throw new Error("unAuthorized");

	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
		socket.data.userId = payload.userId;
	} catch {
		throw new Error("Unauthorized");
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
	if (socket.data.gameInfo) {
		const { gameId, game } = socket.data.gameInfo;
		socket.join(gameId);
		game.reconnect(userId);
		socket.emit("game:fen", { fen: game.getFEN(), turn: game.getTurn() });
		socket.to(gameId).emit("game:player-reconnected");
	}
}

io.on("connection", (socket) => {
	const userId = socket.data.userId;

	handleOnConnection(userId, socket);

	socket.on("game:create", (cb) => {
		const { gameId, game } = gameManager.createGame(userId);
		socket.join(gameId);
		socket.data.gameInfo = { gameId, game };

		game.on("game-over", ({ gameState }) => {
			io.to(gameId).emit("game:game-over", {
				gameState,
			});
		});

		cb({
			gameId,
			color: game.getColor(userId),
		});
	});

	socket.on("game:join", (gameId: string, cb) => {
		const game = gameManager.joinGame(gameId, userId);
		socket.join(gameId);
		socket.data.gameInfo = { gameId, game };

		game.on("game-over", () => {
			io.to(gameId).emit("game:game-over", {
				gameState: game.getGameState(),
			});
		});

		socket.emit("game:fen", { fen: game.getFEN(), turn: game.getTurn() });
		socket.broadcast.emit("game:playerJoined", {
			gameId,
			color: game.getColor(userId),
			opponent: game.getMyOpponent(userId),
		});

		cb({
			gameId,
			color: game.getColor(userId),
			opponent: game.getMyOpponent(userId),
		});
	});

	socket.on("game:move", (from: string, to: string, promotion: string) => {
		if (!socket.data.gameInfo) {
			throw new Error("You are not in a game");
		}
		const { game, gameId } = socket.data.gameInfo;

		if (game.getColor(userId) !== game.getChess().turn()) {
			throw new Error("This isn't your turn");
		}

		try {
			game.move(from, to, promotion);
			const fen = game.getFEN();
			const turn = game.getTurn();

			socket.to(gameId).emit("game:move-made", { fen, turn });

			if (game.isGameOver()) {
				io.to(gameId).emit("game:game-over", { gameState: game.getGameState() });
			}
		} catch (err) {
			throw new Error(`Illegal Move ${err instanceof Error ? err.message : String(err)}`, {
				cause: err,
			});
		}
	});

	socket.on("game:offerDraw", () => {
		if (!socket.data.gameInfo) {
			throw new Error("You are not in a game");
		}
		const { game, gameId } = socket.data.gameInfo;

		game.offerDraw(userId);
		socket.to(gameId).emit("game:draw-offered");
	});

	socket.on("game:acceptDraw", () => {
		if (!socket.data.gameInfo) {
			throw new Error("You are not in a game");
		}
		const { game, gameId } = socket.data.gameInfo;

		game.acceptDraw(userId);
		socket.to(gameId).emit("game:draw-accepted");
	});

	socket.on("game:declineDraw", () => {
		if (!socket.data.gameInfo) {
			throw new Error("You are not in a game");
		}
		const { game, gameId } = socket.data.gameInfo;

		game.declineDraw(userId);
		socket.to(gameId).emit("game:draw-declined");
	});

	socket.on("game:history", (cb) => {
		if (!socket.data.gameInfo) {
			throw new Error("You are not in a game");
		}
		const { game, gameId } = socket.data.gameInfo;

		cb({
			gameId: gameId,
			history: game.getGameHistory(),
		});
	});

	socket.on("disconnect", () => {
		if (!socket.data.gameInfo) return;
		const { game, gameId } = socket.data.gameInfo;
		game.disconnected(userId);

		socket.to(gameId).emit("game:player-disconnected");
	});

	socket.on("game:start", () => {
		if (!socket.data.gameInfo) {
			throw new Error("You are not in a game");
		}
		const { game } = socket.data.gameInfo;
		game.start();
	});
});
