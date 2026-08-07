import type { CookieOptions, Response } from "express";
import type { CookieName, JwtPayload } from "@app-types/types.ts";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { env } from "@config/env.js";

export function generateJWT(payload: JwtPayload) {
	return jwt.sign(payload, env.JWT_SECRET, {
		expiresIn: env.JWT_EXPIRES_IN_S,
	});
}

const isDev = env.NODE_ENV === "development";
const COOKIES_OPTIONS: CookieOptions = {
	maxAge: env.COOKIE_EXPIRES_IN_MS,
	secure: !isDev,
	httpOnly: true,
	sameSite: isDev ? "lax" : "none",
};

export function saveCookie(res: Response, cookieName: CookieName, cookiePayload: string) {
	res.cookie(cookieName, cookiePayload, COOKIES_OPTIONS);
}

export function clearCookie(res: Response, cookieName: CookieName) {
	res.clearCookie(cookieName, COOKIES_OPTIONS);
}

export async function verifyPassword(userPassword: string, hashedPassword: string) {
	return await argon2.verify(hashedPassword, userPassword);
}
