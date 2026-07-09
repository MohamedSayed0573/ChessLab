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
io.on("connection", (socket) => {
  socket.join("room1");
  socket.emit("moveRes", chessGame.fen());
  console.log("Connected with Socket ID: ", socket.id);
  socket.on("disconnect", () => {
    console.log(socket.id, " Disconnected");
  });

  socket.on("move", ({ piece, from, to }) => {
    console.log(`Socket ${socket.id} moved ${piece} from ${from} to ${to}`);

    try {
      chessGame.move({ from, to });
      io.to("room1").emit("moveRes", chessGame.fen());
    } catch (err) {
      console.log(`Invalid move from ${from} to ${to}`);
    }
  });
});
