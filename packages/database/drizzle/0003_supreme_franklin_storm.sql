CREATE TABLE "ServicesBooked" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointmentId" text NOT NULL,
	"serviceId" text,
	"serviceName" text NOT NULL,
	"servicePrice" numeric NOT NULL,
	"serviceDuration" integer NOT NULL,
	"serviceDiscount" integer,
	"serviceTotal" numeric NOT NULL,
	"serviceDiscountTotal" numeric NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ServicesBooked" ADD CONSTRAINT "ServicesBooked_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ServicesBooked" ADD CONSTRAINT "ServicesBooked_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "ServicesBooked_appointmentId_idx" ON "ServicesBooked" USING btree ("appointmentId");--> statement-breakpoint
CREATE INDEX "ServicesBooked_serviceId_idx" ON "ServicesBooked" USING btree ("serviceId");