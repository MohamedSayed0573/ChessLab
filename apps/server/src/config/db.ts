import { drizzle } from "drizzle-orm/neon-http";

function initDB() {
	const dbURL = process.env.DATABASE_URL;
	if (!dbURL) {
		console.error("Error: Set DATABASE_URL in .env and try again...");
		process.exit(1);
	}
	return drizzle(dbURL);
}

export const db = initDB();
