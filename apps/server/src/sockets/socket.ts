import { GameManager } from "@/game/gameManager.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "@/config/env.js";
import type { DefaultEventsMap, Socket, SocketData } from "socket.io";
import type {
	CreateGameAck,
	JoinGameAck,
	GameMoveEvent,
	MoveMadeEvent,
	PlayerJoinedEvent,
} from "@chesslab/shared/types";
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

	socket.on("game:create", (cb: (reply: CreateGameAck) => void) => {
		const { gameId, game } = gameManager.createGame(userId);
		socket.join(gameId);
		socket.data.gameInfo = { gameId, game };

		game.on("game-over", ({ GameStateEvent }) => {
			io.to(gameId).emit("game:game-over", {
				GameStateEvent,
			});
		});

		cb({
			gameId,
			color: game.getColor(userId),
		});
	});

	socket.on("game:join", (gameId: string, cb: (reply: JoinGameAck) => void) => {
		const game = gameManager.joinGame(gameId, userId);
		socket.join(gameId);
		socket.data.gameInfo = { gameId, game };

		game.on("game-over", () => {
			io.to(gameId).emit("game:game-over", {
				GameStateEvent: game.getGameStateEvent(),
			});
		});

		socket.emit("game:fen", { fen: game.getFEN(), turn: game.getTurn() });

		const opponentId = game.getMyOpponent(userId);

		if (!opponentId) {
			cb({ ok: false, error: "Could not find an opponent" });
			return;
		}

		socket.to(gameId).emit("game:PlayerJoinedEvent", {
			gameId,
			color: game.getColor(userId),
			opponentId,
		} as PlayerJoinedEvent);

		cb({
			ok: true,
			gameId,
			color: game.getColor(userId),
			opponentId,
		});
	});

	socket.on("game:move", ({ from, to, promotion }: GameMoveEvent): void => {
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

			socket.to(gameId).emit("game:move-made", { fen, turn } as MoveMadeEvent);

			if (game.isGameOver()) {
				io.to(gameId).emit("game:game-over", game.getGameStateEvent());
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

	socket.emit("game:start", () => {
		if (!socket.data.gameInfo) {
			throw new Error("You are not in a game");
		}
		const { game } = socket.data.gameInfo;
		game.start();
	});
});
