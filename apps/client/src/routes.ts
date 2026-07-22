export const routes = {
	home: "/",

	play: {
		computer: "/computer",

		game: {
			pattern: "/game/:roomId",
			path: (roomId: string) => `/game/${roomId}`,
		},
	},

	signup: "/signup",
	login: "/login",
	profile: "/profile",
} as const;
