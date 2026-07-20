import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "@/errors.js";
import type { JwtPayload } from "@app-types/types.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies.jwt;
	if (!token) return next();

	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET!,
		) as JwtPayload;

		req.userId = payload.userId;
		return next();
	} catch (err) {
		console.log(err);
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
