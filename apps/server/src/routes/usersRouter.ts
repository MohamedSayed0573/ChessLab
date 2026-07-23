import { upload } from "@/config/multer.js";
import { updateAvatarController } from "@/controllers/usersController.js";
import { requireAuth } from "@/middleware/authMiddleware.js";
import { Router } from "express";

const router: Router = Router();

router.patch(
	"/me/avatar",
	requireAuth,
	upload.single("avatar"),
	updateAvatarController,
);

export default router;
