export const routes = {
	home: "/",

	computer: "/computer",

	game: {
		pattern: "/game/:roomId",
		path: (roomId: string) => `/game/${roomId}`,
	},

	signup: "/signup",
	login: "/login",
	profile: "/profile",
} as const;
