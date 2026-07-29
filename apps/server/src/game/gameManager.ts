import { Game } from "@game/game.js";
export class GameManager {
	private games: Map<string, Game> = new Map();

	createGame(firstPlayerId: string) {
		const gameId = crypto.randomUUID() as string;
		const game = new Game(firstPlayerId);
		this.games.set(gameId, game);

		return { gameId, game };
	}

	joinGame(gameId: string, playerId: string) {
		const game = this.games.get(gameId);
		if (!game) throw new Error("The game was not found");

		game.join(playerId);

		return game;
	}

	getGame(gameId: string) {
		const game = this.games.get(gameId);
		if (!game) throw new Error("The game was not found");
		return game;
	}

	findGameIdByUser(userId: string) {
		for (const [gameId, game] of this.games) {
			if (userId === game.getWhite() || userId === game.getBlack()) {
				return gameId;
			}
		}

		return undefined;
	}
}
