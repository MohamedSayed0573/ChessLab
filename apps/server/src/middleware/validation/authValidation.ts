import { BadRequestError } from "@/errors.js";
import type { NextFunction, Request, Response } from "express";
import * as z from "zod";

export const loginSchema = z.object({
	email: z.email().trim(),
	password: z.string().min(6).max(16).trim(),
});

export const registerSchema = z.object({
	email: z.email().trim(),
	password: z.string().min(6).max(16).trim(),
	name: z.string().min(1).max(32).trim(),
	username: z.string().min(1).max(32).trim(),
});

export function validate(schema: z.ZodTypeAny) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			throw new BadRequestError(
				result.error.issues[0]?.message || "Invalid request body",
			);
		}

		req.body = result.data;
		return next();
	};
}
