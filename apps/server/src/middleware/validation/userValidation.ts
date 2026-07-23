import * as z from "zod";

export const patchUsernameSchema = z.object({
	username: z.string().min(1).max(32).trim(),
});
