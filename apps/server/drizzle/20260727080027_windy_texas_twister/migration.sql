CREATE TABLE "refreshTokens" (
	"refreshToken" varchar(255) PRIMARY KEY UNIQUE,
	"userId" integer NOT NULL,
	"expiredAt" bigint NOT NULL,
	"consumed" boolean DEFAULT false,
	"removedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;