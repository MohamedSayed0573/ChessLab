import { Router } from "express";
import { requireAuth, requireGuest } from "@middleware/authMiddleware.js";
import {
	validate,
	loginSchema,
	registerSchema,
} from "@middleware/validation/authValidation.js";
import {
	loginController,
	logoutController,
	meController,
	registerController,
} from "@controllers/authController.js";

const router: Router = Router();

router.post("/login", requireGuest, validate(loginSchema), loginController);

router.post(
	"/register",
	requireGuest,
	validate(registerSchema),
	registerController,
);

router.get("/me", requireAuth, meController);

router.post("/logout", requireAuth, logoutController);

export default router;
