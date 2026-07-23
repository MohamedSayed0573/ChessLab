import { createServer } from "node:http";

import "dotenv/config";
import app from "@/app.js";
import { Server } from "socket.io";
import { env } from "./config/env.js";

const server = createServer(app);

export const io = new Server(server, { cors: { origin: "*" } });

server.listen(env.PORT, () => {
	console.log(`Server is running at http://localhost:${env.PORT}`);
});
