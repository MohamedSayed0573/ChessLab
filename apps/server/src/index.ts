import "dotenv/config";
import { env } from "./config/env.js";
import { server } from "./io.js";
import "./sockets/socket.js";

server.listen(env.PORT, "0.0.0.0", () => {
	console.log(`Server is running at http://localhost:${env.PORT}`);
});
