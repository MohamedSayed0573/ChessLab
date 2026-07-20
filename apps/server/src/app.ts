import express, { type Express, type NextFunction } from "express";
import authRouter from "./routes/authRouter.js";
import { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { authenticate } from "@middleware/authMiddleware.js";
import { AppError } from "./errors.js";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.use(authenticate);

app.use("/auth", authRouter);

app.get("*", (req: Request, res: Response) => {
	res.status(404).send("Page Not Found");
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
	console.error(err);

	let message = "Internal Server Error";
	let statusCode = 500;

	if (err instanceof AppError) {
		message = err.message;
		statusCode = err.statusCode;
	}

	res.status(statusCode).json({
		success: false,
		message,
	});
});

export default app;
