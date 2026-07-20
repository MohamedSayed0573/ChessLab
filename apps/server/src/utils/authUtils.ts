import type { Response } from "express";
import type { CookieName, JwtPayload } from "../types/types.ts";
import * as jwt from "jsonwebtoken";

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
