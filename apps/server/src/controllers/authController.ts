import { type Request, type Response } from "express";
import { usersTable } from "../database/schema.ts";
import { eq } from "drizzle-orm";
import {
	clearCookie,
	generateJWT,
	saveCookie,
	verifyPassword,
} from "../utils/authUtils.ts";
import { COOKIE_NAMES } from "../constants.ts";
import { db } from "../database/db.ts";
import * as argon2 from "argon2";

export async function loginController(req: Request, res: Response) {
	const { email, password } = req.body;

	const [user] = await db
		.select({
			passwordHashed: usersTable.passwordHashed,
			id: usersTable.id,
		})
		.from(usersTable)
		.where(eq(usersTable.email, email));
	if (!user) throw new Error("Invalid email or password");

	const validPassword = await verifyPassword(password, user.passwordHashed);
	if (!validPassword) throw new Error("Invalid email or password");

	const token = generateJWT({ userId: user.id });
	saveCookie(res, COOKIE_NAMES.JWT, token);

	res.json({
		success: true,
	});
}

export async function registerController(req: Request, res: Response) {
	const { name, username, email, password } = req.body;
	const passwordHashed = await argon2.hash(password);

	const user: typeof usersTable.$inferInsert = {
		email,
		name,
		username,
		passwordHashed,
	};
	const [insertedUser] = await db
		.insert(usersTable)
		.values(user)
		.returning({ id: usersTable.id });

	const token = generateJWT({ userId: insertedUser!.id });
	saveCookie(res, COOKIE_NAMES.JWT, token);

	res.status(201).json({
		success: true,
	});
}

export async function meController(req: Request, res: Response) {
	const userId = req.userId;
	const [user] = await db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			username: usersTable.username,
			email: usersTable.email,
			elo: usersTable.elo,
			createdAt: usersTable.createdAt,
		})
		.from(usersTable)
		.where(eq(usersTable.id, userId));

	if (!user) throw new Error("user doesn't exist");

	res.json({
		success: true,
		user,
	});
}

export async function logoutController(req: Request, res: Response) {
	clearCookie(res, "jwt");
	res.status(200).json({
		success: true,
	});
}

export async function removeController(req: Request, res: Response) {
	const userId = req.userId;

	const [removedUser] = await db
		.delete(usersTable)
		.where(eq(usersTable.id, userId))
		.returning({ id: usersTable.id });
	if (!removedUser) throw new Error("The user does not exist");

	clearCookie(res, "jwt");

	res.status(200).json({
		success: true,
	});
}
