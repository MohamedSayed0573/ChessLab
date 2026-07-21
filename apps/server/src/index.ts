import { createServer } from "node:http";

import "dotenv/config";
import app from "@/app.js";
import { Server } from "socket.io";

const server = createServer(app);

export const io = new Server(server, { cors: { origin: "*" } });

server.listen(3000, () => {
	console.log("Server is running at http://localhost:3000");
});
