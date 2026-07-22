export const routes = {
	home: "/",

	play: {
		root: "/play",

		computer: "/play/computer",

		game: {
			pattern: "/play/game/:roomId",
			path: (roomId: string) => `/play/game/${roomId}`,
		},
	},

	signup: "/signup",
	login: "/login",
	profile: "/profile",
} as const;
