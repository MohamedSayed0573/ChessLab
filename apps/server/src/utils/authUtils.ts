import type { Response } from "express";
import type { CookieName, JwtPayload } from "@app-types/types.ts";
import * as jwt from "jsonwebtoken";
import * as argon2 from "argon2";

export function generateJWT(payload: JwtPayload) {
	return jwt.sign(payload, process.env.JWT_SECRET!, {
		expiresIn: Number(process.env.JWT_EXPIRES_IN_S),
	});
}

export function saveCookie(
	res: Response,
	cookieName: CookieName,
	cookieValue: string | Record<string, unknown>,
) {
	res.cookie(cookieName, cookieValue, {
		maxAge: Number(process.env.COOKIE_EXPIRES_IN_MS),
	});
}

export function clearCookie(res: Response, cookieName: CookieName) {
	res.clearCookie(cookieName);
}

export async function verifyPassword(
	userPassword: string,
	hashedPassword: string,
) {
	return await argon2.verify(hashedPassword, userPassword);
}
