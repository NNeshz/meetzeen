CREATE TABLE "Appointment" (
	"id" text PRIMARY KEY NOT NULL,
	"appointmentTypeId" text NOT NULL,
	"memberId" text NOT NULL,
	"organizationId" text NOT NULL,
	"customerName" text NOT NULL,
	"customerEmail" text NOT NULL,
	"customerPhone" text,
	"date" text NOT NULL,
	"startTime" text NOT NULL,
	"endTime" text NOT NULL,
	"status" text NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AppointmentType" (
	"id" text PRIMARY KEY NOT NULL,
	"memberId" text NOT NULL,
	"name" text NOT NULL,
	"duration" integer NOT NULL,
	"price" numeric,
	"description" text,
	"requiresApproval" boolean DEFAULT false NOT NULL,
	"bufferBefore" integer DEFAULT 0 NOT NULL,
	"bufferAfter" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "BaseSchedule" (
	"id" text PRIMARY KEY NOT NULL,
	"memberId" text NOT NULL,
	"dayOfWeek" integer NOT NULL,
	"startTime" text NOT NULL,
	"endTime" text NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "EmployeeAvailability" (
	"id" text PRIMARY KEY NOT NULL,
	"memberId" text NOT NULL,
	"date" text NOT NULL,
	"startTime" text NOT NULL,
	"endTime" text NOT NULL,
	"isAvailable" boolean NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "workdays" integer[] NOT NULL;--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "startTime" text;--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "endTime" text;--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "facebookLink" text;--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "instagramLink" text;--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "twitterLink" text;--> statement-breakpoint
ALTER TABLE "Organization" ADD COLUMN "tiktokLink" text;--> statement-breakpoint
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_appointmentTypeId_fkey" FOREIGN KEY ("appointmentTypeId") REFERENCES "public"."AppointmentType"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "AppointmentType" ADD CONSTRAINT "AppointmentType_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "BaseSchedule" ADD CONSTRAINT "BaseSchedule_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "EmployeeAvailability" ADD CONSTRAINT "EmployeeAvailability_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "Appointment_memberId_date_idx" ON "Appointment" USING btree ("memberId","date");--> statement-breakpoint
CREATE INDEX "Appointment_organizationId_date_idx" ON "Appointment" USING btree ("organizationId","date");--> statement-breakpoint
CREATE INDEX "Appointment_status_idx" ON "Appointment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "AppointmentType_memberId_idx" ON "AppointmentType" USING btree ("memberId");--> statement-breakpoint
CREATE INDEX "BaseSchedule_memberId_dayOfWeek_idx" ON "BaseSchedule" USING btree ("memberId","dayOfWeek");--> statement-breakpoint
CREATE INDEX "EmployeeAvailability_memberId_date_idx" ON "EmployeeAvailability" USING btree ("memberId","date");--> statement-breakpoint
CREATE INDEX "Organization_workdays_idx" ON "Organization" USING gin ("workdays");