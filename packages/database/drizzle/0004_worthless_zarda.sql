DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'Appointment' 
        AND column_name = 'googleCalendarEventId'
    ) THEN
        ALTER TABLE "Appointment" ADD COLUMN "googleCalendarEventId" text;
    END IF;
END $$;