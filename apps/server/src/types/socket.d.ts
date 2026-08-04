import "socket.io";
import type { GameInfo } from "./chess.types.ts";

declare module "socket.io" {
	interface SocketData {
		userId: string;
		gameInfo: GameInfo;
	}
}
