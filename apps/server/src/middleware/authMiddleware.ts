import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "@/errors.js";
import type { JwtPayload } from "@app-types/types.js";
import { env } from "@/config/env.js";
import { toErrorMessage } from "@chesslab/shared/errors";

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const accessToken = req.headers.authorization?.split(" ")[1];
	if (!accessToken) return next();

	try {
		const payload = jwt.verify(accessToken, env.JWT_SECRET) as JwtPayload;

		req.userId = payload.userId;
		return next();
	} catch (err) {
		console.log(toErrorMessage(err));
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
