export const difficulties = {
	beginner: { elo: 800 },
	easy: { elo: 1100 },
	medium: { elo: 1500 },
	hard: { elo: 1900 },
	expert: { elo: 2400 },
} as const;

export type DifficultyKey = keyof typeof difficulties;
