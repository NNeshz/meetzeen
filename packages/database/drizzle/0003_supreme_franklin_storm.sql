-- Crear tabla ServicesBooked si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'ServicesBooked'
    ) THEN
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
    END IF;
END $$;
--> statement-breakpoint
-- Agregar foreign keys solo si no existen
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND constraint_name = 'ServicesBooked_appointmentId_fkey'
    ) THEN
        ALTER TABLE "ServicesBooked" ADD CONSTRAINT "ServicesBooked_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE cascade ON UPDATE cascade;
    END IF;
END $$;
--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND constraint_name = 'ServicesBooked_serviceId_fkey'
    ) THEN
        ALTER TABLE "ServicesBooked" ADD CONSTRAINT "ServicesBooked_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE set null ON UPDATE cascade;
    END IF;
END $$;
--> statement-breakpoint
-- Crear índices solo si no existen
CREATE INDEX IF NOT EXISTS "ServicesBooked_appointmentId_idx" ON "ServicesBooked" USING btree ("appointmentId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ServicesBooked_serviceId_idx" ON "ServicesBooked" USING btree ("serviceId");
