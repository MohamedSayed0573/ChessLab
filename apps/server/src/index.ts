import { createServer } from "node:http";

import "dotenv/config";
import app from "@/app.js";
import { Server, type DefaultEventsMap, type SocketData } from "socket.io";
import { env } from "./config/env.js";

const server = createServer(app);

export const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(
	server,
	{ cors: { origin: "*" } },
);

server.listen(env.PORT, "0.0.0.0", () => {
	console.log(`Server is running at http://localhost:${env.PORT}`);
});
