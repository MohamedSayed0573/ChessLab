import express, { type Express, type NextFunction } from "express";
import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { authenticate } from "@middleware/authMiddleware.js";
import { AppError } from "./errors.js";
import { env } from "@config/env.js";
import cors from "cors";
import helmet from "helmet";

const app: Express = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(authenticate);

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
	console.error(err);

	let message = "Internal Server Error";
	let statusCode = 500;

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	}

	res.status(statusCode).json({
		success: false,
		message,
	});
});

app.use((req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: "Page Not Found",
	});
});

export default app;
