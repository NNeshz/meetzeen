CREATE TABLE "Account" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp(3),
	"refreshTokenExpiresAt" timestamp(3),
	"scope" text,
	"password" text,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Invitation" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizationId" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"inviterId" text NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Member" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizationId" text NOT NULL,
	"userId" text NOT NULL,
	"role" text NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Organization" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"timezone" text,
	"currency" text,
	"slug" text,
	"logo" text,
	"workdays" integer[],
	"startTime" text,
	"endTime" text,
	"location" text,
	"facebookLink" text,
	"instagramLink" text,
	"whatsappLink" text,
	"tiktokLink" text,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	"activeOrganizationId" text,
	"impersonatedBy" text
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"phoneNumber" text,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"phoneNumberVerified" boolean,
	"isAnonymous" boolean,
	"banned" boolean,
	"banReason" text,
	"banExpires" timestamp(3),
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "User_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
CREATE TABLE "Verification" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) with time zone,
	"updatedAt" timestamp(3) with time zone
);
--> statement-breakpoint
CREATE TABLE "DailyAvailability" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memberId" text NOT NULL,
	"date" date NOT NULL,
	"timeBlocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"isWorkingDay" boolean DEFAULT true NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"reason" text,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ScheduleGenerationLog" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memberId" text NOT NULL,
	"generatedUntil" date NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Service" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"serviceCategoryId" text,
	"description" text,
	"price" numeric NOT NULL,
	"duration" integer NOT NULL,
	"discount" integer,
	"organizationId" text NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ServiceCategory" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"organizationId" text NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WeeklyScheduleTemplate" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memberId" text NOT NULL,
	"dayOfWeek" integer NOT NULL,
	"timeBlocks" jsonb NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DailyAvailability" ADD CONSTRAINT "DailyAvailability_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ScheduleGenerationLog" ADD CONSTRAINT "ScheduleGenerationLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Service" ADD CONSTRAINT "Service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Service" ADD CONSTRAINT "Service_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "public"."ServiceCategory"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WeeklyScheduleTemplate" ADD CONSTRAINT "WeeklyScheduleTemplate_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "Organization_workdays_idx" ON "Organization" USING gin ("workdays");--> statement-breakpoint
CREATE UNIQUE INDEX "Session_token_key" ON "Session" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User" USING btree ("phoneNumber");--> statement-breakpoint
CREATE INDEX "DailyAvailability_memberId_date_idx" ON "DailyAvailability" USING btree ("memberId","date");--> statement-breakpoint
CREATE INDEX "DailyAvailability_date_idx" ON "DailyAvailability" USING btree ("date");--> statement-breakpoint
CREATE INDEX "DailyAvailability_unique_member_date" ON "DailyAvailability" USING btree ("memberId","date");--> statement-breakpoint
CREATE INDEX "ScheduleGenerationLog_memberId_idx" ON "ScheduleGenerationLog" USING btree ("memberId");--> statement-breakpoint
CREATE INDEX "WeeklyScheduleTemplate_memberId_idx" ON "WeeklyScheduleTemplate" USING btree ("memberId");