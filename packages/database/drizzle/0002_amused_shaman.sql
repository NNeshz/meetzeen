-- Crear tabla Appointment si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'Appointment'
    ) THEN
        CREATE TABLE "Appointment" (
            "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
            "customerId" text,
            "memberId" text,
            "serviceId" text,
            "organizationId" text NOT NULL,
            "customerName" text NOT NULL,
            "customerEmail" text NOT NULL,
            "customerPhone" text,
            "customerNotes" text,
            "memberName" text NOT NULL,
            "memberEmail" text NOT NULL,
            "memberRole" text,
            "appointmentDate" text NOT NULL,
            "startTime" text NOT NULL,
            "endTime" time NOT NULL,
            "status" text NOT NULL,
            "notes" text,
            "cancellationReason" text,
            "cancelledAt" timestamp(3) with time zone,
            "cancelledBy" text,
            "paymentStatus" text NOT NULL,
            "paymentMethod" text,
            "amountPaid" numeric NOT NULL,
            "source" text DEFAULT 'manual',
            "reminderSent" boolean DEFAULT false,
            "reminderSentAt" timestamp(3) with time zone,
            "createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
            "updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
        );
    END IF;
END $$;
--> statement-breakpoint
-- Crear tabla Customer si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'Customer'
    ) THEN
        CREATE TABLE "Customer" (
            "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
            "name" text NOT NULL,
            "lastName" text NOT NULL,
            "email" text NOT NULL,
            "phoneNumber" text,
            "organizationId" text NOT NULL,
            "totalAppointments" integer DEFAULT 0 NOT NULL,
            "lastAppointmentDate" timestamp(3) with time zone,
            "notes" text,
            "isActive" boolean DEFAULT true NOT NULL,
            "createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
            "updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
        );
    END IF;
END $$;
--> statement-breakpoint
-- Agregar foreign keys solo si no existen
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND constraint_name = 'Appointment_customerId_fkey'
    ) THEN
        ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE set null ON UPDATE cascade;
    END IF;
END $$;
--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND constraint_name = 'Appointment_memberId_fkey'
    ) THEN
        ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE set null ON UPDATE cascade;
    END IF;
END $$;
--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND constraint_name = 'Appointment_serviceId_fkey'
    ) THEN
        ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE set null ON UPDATE cascade;
    END IF;
END $$;
--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND constraint_name = 'Appointment_organizationId_fkey'
    ) THEN
        ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE cascade;
    END IF;
END $$;
--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND constraint_name = 'Customer_organizationId_fkey'
    ) THEN
        ALTER TABLE "Customer" ADD CONSTRAINT "Customer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE cascade;
    END IF;
END $$;
--> statement-breakpoint
-- Crear índices solo si no existen
CREATE INDEX IF NOT EXISTS "Appointment_customer_idx" ON "Appointment" USING btree ("customerId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Appointment_member_idx" ON "Appointment" USING btree ("memberId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Appointment_date_idx" ON "Appointment" USING btree ("appointmentDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Appointment_status_idx" ON "Appointment" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Appointment_org_date_idx" ON "Appointment" USING btree ("organizationId","appointmentDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Appointment_member_date_time_idx" ON "Appointment" USING btree ("memberId","appointmentDate","startTime");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Appointment_customer_email_idx" ON "Appointment" USING btree ("customerEmail");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Customer_email_org_key" ON "Customer" USING btree ("email","organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Customer_email_idx" ON "Customer" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Customer_phone_idx" ON "Customer" USING btree ("phoneNumber");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Customer_org_idx" ON "Customer" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Customer_active_idx" ON "Customer" USING btree ("isActive");
