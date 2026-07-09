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

const chessGame = new Chess();
type Game = {
  white?: string | undefined; // socket.id
  black?: string | undefined; // socket.id
};

let game: Game = {};

io.on("connection", (socket) => {
  socket.join("room1");
  socket.emit("moveRes", chessGame.fen());
  console.log("Connected with Socket ID: ", socket.id);
  socket.on("disconnect", () => {
    if (game.white === socket.id) {
      game.white = undefined;
    } else if (game.black === socket.id) {
      game.black = undefined;
    }
    console.log(socket.id, " Disconnected");
  });

  socket.on("move", ({ piece, from, to }) => {
    console.log(chessGame.turn());

    if (
      (chessGame.turn() === "w" && socket.id !== game.white) ||
      (chessGame.turn() === "b" && socket.id !== game.black)
    ) {
      return; // Ignore or reject the move
    }
    console.log(`Socket ${socket.id} moved ${piece} from ${from} to ${to}`);

    try {
      chessGame.move({ from, to });
      io.to("room1").emit("moveRes", chessGame.fen());
      console.log(game);
    } catch (err) {
      console.log(`Invalid move from ${from} to ${to}`);
    }
  });

  socket.on("start", () => {
    if (!game.white) {
      game.white = socket.id;
      socket.emit("color", "white");
    } else if (!game.black && game.white !== socket.id) {
      game.black = socket.id;
      socket.emit("color", "black");
    } else {
      socket.disconnect();
    }
    console.log(game);
  });
});
