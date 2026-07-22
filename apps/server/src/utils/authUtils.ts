import type { CookieOptions, Response } from "express";
import type { CookieName, JwtPayload } from "@app-types/types.ts";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";

export function generateJWT(payload: JwtPayload) {
	return jwt.sign(payload, process.env.JWT_SECRET!, {
		expiresIn: Number(process.env.JWT_EXPIRES_IN_S),
	});
}

const COOKIES_OPTIONS: CookieOptions = {
	maxAge: Number(process.env.COOKIE_EXPIRES_IN_MS),
	secure: process.env.NODE_ENV === "production",
	httpOnly: true,
	sameSite: "lax",
};

export function saveCookie(
	res: Response,
	cookieName: CookieName,
	cookiePayload: string,
) {
	res.cookie(cookieName, cookiePayload, COOKIES_OPTIONS);
}

export function clearCookie(res: Response, cookieName: CookieName) {
	res.clearCookie(cookieName, COOKIES_OPTIONS);
}

export async function verifyPassword(
	userPassword: string,
	hashedPassword: string,
) {
	return await argon2.verify(hashedPassword, userPassword);
}
