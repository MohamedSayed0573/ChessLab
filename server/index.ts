import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Chess } from "chess.js";

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
};

const games = new Map<string, Game>();

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

  socket.on("move", ({ piece, from, to }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const game = games.get(roomId);
    if (!game) return;

    if (
      (game.chess.turn() === "w" && socket.id !== game.white) ||
      (game.chess.turn() === "b" && socket.id !== game.black)
    ) {
      return;
    }

    try {
      game.chess.move({ from, to });
      io.to(roomId).emit("moveRes", game.chess.fen());
      console.log(game);
    } catch (err) {
      console.log(`Invalid move from ${from} to ${to}`);
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
    });

    socket.join(roomId);
    socket.data.roomId = roomId;

    callback({
      success: true,
      roomId,
      color: "white",
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
      const color = game.white === socket.id ? "white" : "black";
      socket.emit("moveRes", game.chess.fen());

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
    let color: "white" | "black";
    if (!game.white) {
      game.white = socket.id;
      color = "white";
    } else {
      game.black = socket.id;
      color = "black";
    }

    socket.data.roomId = roomId;
    socket.join(roomId);

    io.to(roomId).emit("moveRes", game.chess.fen());
    callback({
      success: true,
      color,
    });
  });
});
