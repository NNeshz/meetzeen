DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ScheduleGenerationLog' 
        AND column_name = 'generatedFrom'
    ) THEN
        ALTER TABLE "ScheduleGenerationLog" ADD COLUMN "generatedFrom" date NOT NULL;
    END IF;
END $$;