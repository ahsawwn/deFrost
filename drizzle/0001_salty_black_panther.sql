ALTER TABLE "verification_token" ALTER COLUMN "identifier" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_token" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_account" ALTER COLUMN "provider" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_account" ALTER COLUMN "provider_account_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_verification_token" ALTER COLUMN "identifier" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_verification_token" ALTER COLUMN "token" SET NOT NULL;