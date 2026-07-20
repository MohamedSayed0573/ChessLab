import { Router } from "express";
import { type Request, type Response } from "express";
import { usersTable } from "../database/schema.ts";
import { db } from "../database/db.ts";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { COOKIE_NAMES } from "../constants.ts";
import { clearCookie, generateJWT, saveCookie } from "../utils/authUtils.ts";
import { requireAuth, requireGuest } from "../middleware/authMiddleware.ts";

const router: Router = Router();

async function verifyPassword(userPassword: string, hashedPassword: string) {
	return await argon2.verify(hashedPassword, userPassword);
}
router.post("/login", requireGuest, async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const [user] = await db
		.select({
			passwordHashed: usersTable.passwordHashed,
			id: usersTable.id,
		})
		.from(usersTable)
		.where(eq(usersTable.email, email));
	if (!user) throw new Error("Invalid email or password");

	const validPassword = await verifyPassword(password, user.passwordHashed);
	if (!validPassword) throw new Error("Invalid email or password");

	const token = generateJWT({ userId: user.id });
	saveCookie(res, COOKIE_NAMES.JWT, token);

	res.json({
		success: true,
	});
});

router.post("/register", requireGuest, async (req: Request, res: Response) => {
	const { name, username, email, password } = req.body;
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

	const token = generateJWT({ userId: insertedUser!.id });
	saveCookie(res, COOKIE_NAMES.JWT, token);

	res.status(201).json({
		success: true,
	});
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
	const userId = req.userId;
	const [user] = await db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			username: usersTable.username,
			email: usersTable.email,
			elo: usersTable.elo,
			createdAt: usersTable.createdAt,
		})
		.from(usersTable)
		.where(eq(usersTable.id, userId));

	if (!user) throw new Error("user doesn't exist");

	res.json({
		success: true,
		user,
	});
});

router.post("/logout", requireAuth, (req: Request, res: Response) => {
	clearCookie(res, "jwt");
	res.status(200).json({
		success: true,
	});
});

router.post("/remove", requireAuth, async (req: Request, res: Response) => {
	const userId = req.userId;

	const [removedUser] = await db
		.delete(usersTable)
		.where(eq(usersTable.id, userId))
		.returning({ id: usersTable.id });
	if (!removedUser) throw new Error("The user does not exist");

	clearCookie(res, "jwt");

	res.status(200).json({
		success: true,
	});
});

export default router;
