import { type Request, type Response } from "express";
import { usersTable } from "@database/schema.js";
import { eq, or } from "drizzle-orm";
import {
	clearCookie,
	generateJWT,
	saveCookie,
	verifyPassword,
} from "@utils/authUtils.js";
import { COOKIE_NAMES } from "@/constants.js";
import { db } from "@database/db.js";
import * as argon2 from "argon2";
import { BadRequestError, UnauthorizedError } from "@/errors.js";

export async function loginController(req: Request, res: Response) {
	const { email, password } = req.body;

	const [user] = await db
		.select({
			passwordHashed: usersTable.passwordHashed,
			id: usersTable.id,
		})
		.from(usersTable)
		.where(eq(usersTable.email, email));
	if (!user) throw new UnauthorizedError("Invalid email or password");

	const validPassword = await verifyPassword(password, user.passwordHashed);
	if (!validPassword)
		throw new UnauthorizedError("Invalid email or password");

	const token = generateJWT({ userId: user.id });
	saveCookie(res, COOKIE_NAMES.JWT, token);

	res.status(200).json({
		success: true,
	});
}

export async function registerController(req: Request, res: Response) {
	const { name, username, email, password } = req.body;

	const [alreadyExists] = await db
		.select()
		.from(usersTable)
		.where(
			or(eq(usersTable.username, username), eq(usersTable.email, email)),
		);

	if (alreadyExists?.username === username) {
		throw new BadRequestError("Username already exists");
	}

	if (alreadyExists?.email === email) {
		throw new BadRequestError("Email already exists");
	}
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

	if (!user) throw new BadRequestError("user doesn't exist");

	res.status(200).json({
		success: true,
		user,
	});
}

export async function logoutController(req: Request, res: Response) {
	clearCookie(res, COOKIE_NAMES.JWT);
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
	if (!removedUser) throw new BadRequestError("The user does not exist");

	clearCookie(res, "jwt");

	res.status(200).json({
		success: true,
	});
}
