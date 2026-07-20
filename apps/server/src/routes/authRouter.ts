import { Router } from "express";
import { requireAuth, requireGuest } from "@middleware/authMiddleware.js";
import {
	loginController,
	logoutController,
	meController,
	registerController,
	removeController,
} from "@controllers/authController.js";

const router: Router = Router();

router.post("/login", requireGuest, loginController);

router.post("/register", requireGuest, registerController);

router.get("/me", requireAuth, meController);

router.post("/logout", requireAuth, logoutController);

router.post("/remove", requireAuth, removeController);

export default router;
