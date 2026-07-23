import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "@/errors.js";
import type { JwtPayload } from "@app-types/types.js";
import { clearCookie } from "@/utils/authUtils.js";
import { env } from "@/config/env.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies.jwt;
	if (!token) return next();

	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

		req.userId = payload.userId;
		return next();
	} catch (err) {
		console.log(
			err instanceof Error ? err.message : "Error: Invalid Token",
		);
		clearCookie(res, "jwt");
		return next();
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	if (!req.userId) {
		throw new UnauthorizedError();
	}

	return next();
}

export function requireGuest(req: Request, res: Response, next: NextFunction) {
	if (req.userId) {
		throw new ConflictError("Already authenticated");
	}

	next();
}
