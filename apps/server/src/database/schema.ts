import {
	bigint,
	boolean,
	date,
	integer,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 32 }).notNull().unique(),
	email: varchar({ length: 255 }).notNull().unique(),
	passwordHashed: varchar({ length: 255 }).notNull(),
	elo: integer().default(400).notNull(),
	avatarUrl: varchar({ length: 255 }),
	createdAt: date().defaultNow().notNull(),
	updatedAt: date(),
});

export const refreshTokensTable = pgTable("refreshTokens", {
	refreshToken: varchar({ length: 255 }).notNull().unique().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	expiredAt: bigint({ mode: "number" }).notNull(),
	consumed: boolean().default(false),
	removedAt: timestamp(),
});
