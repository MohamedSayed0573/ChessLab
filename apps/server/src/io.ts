import { createServer } from "node:http";
import app from "@/app.js";
import { Server, type DefaultEventsMap, type SocketData } from "socket.io";
import { env } from "@config/env.js";

const server = createServer(app);

export const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(
	server,
	{ cors: { origin: env.CLIENT_URL, credentials: true } },
);

export { server };
