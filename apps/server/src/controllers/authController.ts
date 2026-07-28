import { type Request, type Response } from "express";
import { refreshTokensTable, usersTable } from "@database/schema.js";
import { and, eq, gt, or } from "drizzle-orm";
import {
	clearCookie,
	generateJWT,
	saveCookie,
	verifyPassword,
} from "@utils/authUtils.js";
import { COOKIE_NAMES } from "@/constants.js";
import { db } from "@/config/db.js";
import * as argon2 from "argon2";
import { BadRequestError, UnauthorizedError } from "@/errors.js";
import { env } from "@/config/env.js";

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

	const refreshToken = crypto.randomUUID() as string;
	saveCookie(res, COOKIE_NAMES.JWT, refreshToken);

	const accessToken = generateJWT({ userId: user.id });
	await db.insert(refreshTokensTable).values({
		refreshToken,
		userId: user.id,
		expiredAt: Date.now() + env.REFRESH_TOKEN_EXPIRES_IN,
	});

	res.status(200).json({
		success: true,
		accessToken,
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

	const refreshToken = crypto.randomUUID() as string;
	saveCookie(res, COOKIE_NAMES.JWT, refreshToken);

	const accessToken = generateJWT({ userId: insertedUser!.id });
	await db.insert(refreshTokensTable).values({
		refreshToken,
		userId: insertedUser!.id,
		expiredAt: Date.now() + env.REFRESH_TOKEN_EXPIRES_IN,
	});

	res.status(201).json({
		success: true,
		accessToken,
	});
}

export async function meController(req: Request, res: Response) {
	const userId = req.userId;
	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, userId));

	if (!user) throw new BadRequestError("user doesn't exist");

	res.status(200).json({
		success: true,
		user,
	});
}

export async function logoutController(req: Request, res: Response) {
	const refreshToken = req.cookies[COOKIE_NAMES.JWT];

	if (refreshToken) {
		await db
			.update(refreshTokensTable)
			.set({ consumed: true, removedAt: new Date() })
			.where(eq(refreshTokensTable.refreshToken, refreshToken));
	}

	clearCookie(res, COOKIE_NAMES.JWT);

	res.status(200).json({
		success: true,
	});
}

export async function refreshController(req: Request, res: Response) {
	const refreshToken = req.cookies.jwt;
	if (!refreshToken) {
		return res
			.status(401)
			.json({ success: false, message: "No refresh token provided" });
	}

	// Find the user using the refresh token
	const [user] = await db
		.select({ id: refreshTokensTable.userId })
		.from(refreshTokensTable)
		.where(
			and(
				eq(refreshTokensTable.refreshToken, refreshToken),
				eq(refreshTokensTable.consumed, false),
				gt(refreshTokensTable.expiredAt, Date.now()),
			),
		);

	if (!user) {
		clearCookie(res, COOKIE_NAMES.JWT);
		return res.status(401).json({
			success: false,
			message: "Invalid Refresh Token",
		});
	}

	// Generate a new refresh token & Insert it to DB & Save it as a cookie
	const newRefreshToken = crypto.randomUUID() as string;

	await db.transaction(async (tx) => {
		// Invalidate the old refresh token
		await tx
			.update(refreshTokensTable)
			.set({ consumed: true, removedAt: new Date() })
			.where(eq(refreshTokensTable.refreshToken, refreshToken));

		await tx.insert(refreshTokensTable).values({
			refreshToken: newRefreshToken,
			userId: user.id,
			expiredAt: Date.now() + env.REFRESH_TOKEN_EXPIRES_IN,
		});
	});

	saveCookie(res, COOKIE_NAMES.JWT, newRefreshToken);

	// Generate a new access token, send it to client
	const newAccessToken = generateJWT({ userId: user.id });
	res.status(200).json({
		success: true,
		accessToken: newAccessToken,
	});
}
