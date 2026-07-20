import { Router } from "express";
import { type Request, type Response } from "express";

const router: Router = Router();

router.post("/login", (req: Request, res: Response) => {
	res.json({
		success: true,
	});
});

router.post("/register", (req: Request, res: Response) => {
	res.json({
		success: true,
	});
});

router.get("/me", (req: Request, res: Response) => {
	res.json({
		success: true,
	});
});

router.post("/logout", (req: Request, res: Response) => {
	res.json({
		success: true,
	});
});

export default router;
