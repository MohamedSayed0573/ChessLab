import type { COOKIE_NAMES } from "@/constants.ts";

export interface JwtPayload {
	userId: number;
}

export type CookieName = (typeof COOKIE_NAMES)[keyof typeof COOKIE_NAMES];
