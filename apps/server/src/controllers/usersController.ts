import { type Request, type Response } from "express";
import { s3 } from "@/config/s3.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { usersTable } from "@/database/schema.js";
import { db } from "@/config/db.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { env } from "@/config/env.js";

export async function updateAvatarController(req: Request, res: Response) {
	const userId = req.userId;
	const file = req.file;

	if (!file) {
		return res.status(400).json({
			success: false,
			message: "No file uploaded",
		});
	}

	const fileExt = file.originalname.split(".").pop();
	const fileKey = `avatars/${userId}/${randomUUID()}.${fileExt}`;

	await s3.send(
		new PutObjectCommand({
			Bucket: env.S3_BUCKET_NAME!,
			Key: fileKey,
			Body: file.buffer,
		}),
	);

	// Check if the user already has an avatar and store the old avatar key for deletion
	let oldAvatarUrl: string | undefined = undefined;
	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, userId));

	if (user?.avatarUrl) {
		oldAvatarUrl = user.avatarUrl;
	}

	await db
		.update(usersTable)
		.set({
			avatarUrl: `${env.S3_PUBLIC_URL}/${fileKey}`,
		})
		.where(eq(usersTable.id, userId));

	// Delete the old avatar from Storage if it exists
	if (oldAvatarUrl) {
		s3.send(
			new DeleteObjectCommand({
				Bucket: env.S3_BUCKET_NAME!,
				Key: oldAvatarUrl,
			}),
		).catch((err) => console.error("Failed to delete old avatar", err));
	}

	res.status(200).json({
		success: true,
		avatarUrl: `${env.S3_PUBLIC_URL}/${fileKey}`,
	});
}
