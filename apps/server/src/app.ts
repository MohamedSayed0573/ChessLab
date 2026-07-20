import express, { type Express } from "express";
import authRouter from "./routes/authRouter.ts";
import { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authMiddleware.ts";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.use(authenticate);

app.use("/auth", authRouter);

app.get("*", (req: Request, res: Response) => {
	res.status(404).send("Page Not Found");
});

app.use((err: Error, req: Request, res: Response) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

export default app;
