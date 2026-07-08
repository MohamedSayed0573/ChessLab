import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});

io.on("connection", (socket) => {
  const start = new Date();
  console.log(
    "Connected with Socket ID: ",
    socket.id,
    " at: ",
    start.toISOString(),
  );
  socket.on("disconnect", () => {
    const end = new Date();
    console.log(socket.id, " Disconnected at ", end.toISOString());
    console.log((end.getTime() - start.getTime()) / 1000);
  });
});
