import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	CLIENT_URL: z.url().default("http://localhost:3000"),
	PORT: z.coerce.number().int().positive().default(3000),

	DATABASE_URL: z.string().min(1),

	JWT_SECRET: z.string().min(10),
	JWT_EXPIRES_IN_S: z.coerce.number().int().positive().default(86400), // 1 day in seconds
	COOKIE_EXPIRES_IN_MS: z.coerce.number().int().positive().default(86400000), // 1 day in milliseconds

	S3_ENDPOINT: z.url().optional(),
	S3_ACCESS_KEY_ID: z.string().optional(),
	S3_SECRET_ACCESS_KEY: z.string().optional(),
	S3_BUCKET_NAME: z.string().optional(),
	S3_PUBLIC_URL: z.url().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables:", parsedEnv.error.issues);
	process.exit(1);
}

export const env = parsedEnv.data;
