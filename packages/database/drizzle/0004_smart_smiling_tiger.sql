ALTER TABLE "Invitation" ADD COLUMN "token" text;--> statement-breakpoint
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM "Invitation" WHERE "token" IS NULL) THEN
    UPDATE "Invitation" SET "token" = substr(md5(random()::text || clock_timestamp()::text), 1, 32) WHERE "token" IS NULL;
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "Invitation" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint