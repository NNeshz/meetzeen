ALTER TABLE "Account" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Account" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Member" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Organization" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Session" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Session" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Verification" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Verification" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Service" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Service" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "ServiceCategory" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "ServiceCategory" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "Invitation" ADD COLUMN "createdAt" timestamp(3) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "Invitation" ADD COLUMN "updatedAt" timestamp(3) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "Member" ADD COLUMN "updatedAt" timestamp(3) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "updatedAt" timestamp(3) with time zone NOT NULL;