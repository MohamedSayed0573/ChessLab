import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Chess } from "chess.js";
import type { GameOverInfo } from "@chesslab/shared/types";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

server.listen(3000, () => {
	console.log("Server is running at http://localhost:3000");
});

type Game = {
	id: string;
	chess: Chess;
	white: string | undefined; // socket.id
	black: string | undefined; // socket.id
	whiteTimeMs: number;
	blackTimeMs: number;
	lastMoveTime: number;
};

const games = new Map<string, Game>();

function sendGameState(roomId: string, game: Game) {
	io.to(roomId).emit("gameState", {
		whiteTimeMs: game.whiteTimeMs,
		blackTimeMs: game.blackTimeMs,
		currentTurn: game.chess.turn(),
		lastMoveTime: game.lastMoveTime,
	});
}

io.on("connection", (socket) => {
	function leaveCurrentGame() {
		const roomId = socket.data.roomId;

		if (!roomId) return;

		socket.leave(roomId);

		const game = games.get(roomId);

		if (game) {
			if (game.white === socket.id) game.white = undefined;

			if (game.black === socket.id) game.black = undefined;

			if (!game.white && !game.black) {
				games.delete(roomId);
			}
		}

		delete socket.data.roomId;
	}

	socket.on("disconnect", () => {
		leaveCurrentGame();
	});

	socket.on("move", ({ promotion, from, to }) => {
		const roomId = socket.data.roomId;
		if (!roomId) return;

		const game = games.get(roomId);
		if (!game) return;

		// Check if the turns are correct
		if (
			(game.chess.turn() === "w" && socket.id !== game.white) ||
			(game.chess.turn() === "b" && socket.id !== game.black)
		) {
			return;
		}

		try {
			game.chess.move({ from, to, promotion });

			io.to(roomId).emit("moveRes", game.chess.fen());

			const gameOverInfo = getGameOverInfo(game.chess);
			if (gameOverInfo) {
				io.to(roomId).emit("gameOver", gameOverInfo);
			}

			const timeDifference = new Date().getTime() - game.lastMoveTime;
			game.lastMoveTime = new Date().getTime();
			if (game.chess.turn() === "w") {
				game.blackTimeMs -= timeDifference;
			} else {
				game.whiteTimeMs -= timeDifference;
			}

			sendGameState(roomId, game);
		} catch (err) {
			console.log(`Invalid move from ${from} to ${to}`, err);
		}
	});

	socket.on("createGame", (callback) => {
		leaveCurrentGame();

		const roomId = `room-${crypto.randomUUID()}`;

		games.set(roomId, {
			chess: new Chess(),
			id: roomId,
			white: socket.id,
			black: undefined,
			whiteTimeMs: 600_000,
			blackTimeMs: 600_000,
			lastMoveTime: new Date().getTime(),
		});

		socket.join(roomId);
		socket.data.roomId = roomId;

		sendGameState(roomId, games.get(roomId)!);

		callback({
			success: true,
			roomId,
			color: "w",
		});
	});

	socket.on("joinGame", (roomId, callback) => {
		const game = games.get(roomId);

		if (!game) {
			callback({
				success: false,
				message: "Game doesn't exist",
			});
			return;
		}

		// White (or black) is already connected.
		if (game.white === socket.id || game.black === socket.id) {
			const color = game.white === socket.id ? "w" : "b";
			socket.emit("moveRes", game.chess.fen());

			sendGameState(roomId, game);
			callback({
				success: true,
				color,
			});
			return;
		}

		// Game is full
		if (game.white && game.black) {
			callback({
				success: false,
				message: "Game is full",
			});
			return;
		}

		leaveCurrentGame();

		// New Socket
		let color: "w" | "b";
		if (!game.white) {
			game.white = socket.id;
			color = "w";
		} else {
			game.black = socket.id;
			color = "b";
		}

		socket.data.roomId = roomId;
		socket.join(roomId);

		io.to(roomId).emit("moveRes", game.chess.fen());
		sendGameState(roomId, game);
		callback({
			success: true,
			color,
		});
	});

	socket.on("getHistory", (callback) => {
		const roomId = socket.data.roomId;
		if (!roomId) return;

		const game = games.get(roomId);
		if (!game) return;

		callback(game.chess.history());
	});
});

function getGameOverInfo(chess: Chess): GameOverInfo | undefined {
	if (!chess.isGameOver()) return;

	if (chess.isCheckmate()) {
		return {
			reason: "Checkmate",
			winner: chess.turn() === "w" ? "b" : "w",
		};
	} else {
		if (chess.isStalemate()) {
			return { reason: "Stalemate", winner: "d" };
		} else if (chess.isInsufficientMaterial()) {
			return { reason: "Insufficient Material", winner: "d" };
		} else if (chess.isThreefoldRepetition()) {
			return { reason: "Threefold Repetition", winner: "d" };
		} else if (chess.isDrawByFiftyMoves()) {
			return { reason: "Fifty-Move Rule", winner: "d" };
		} else {
			return { reason: "Draw", winner: "d" };
		}
	}
}
