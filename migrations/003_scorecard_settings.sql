-- Shareable scorecard settings (Quiz Settings > Share Scorecard): logos, picture and text.
-- Generated from the Payload schema diff; additive and safe to run more than once.
-- Needs 002 (it creates quiz_settings).

-- Columns
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "scorecard_logo_id" integer;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "scorecard_badge_logo_id" integer;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "scorecard_headline" varchar DEFAULT 'I just played the';
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "scorecard_highlight" varchar DEFAULT 'Super Chennai Quiz!';
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "scorecard_image_id" integer;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "scorecard_footer_text" varchar DEFAULT 'Think you know Chennai? Play at chenzquiz.superchennai.com';

-- Foreign keys
DO $$ BEGIN
 ALTER TABLE "quiz_settings" ADD CONSTRAINT "quiz_settings_scorecard_logo_id_media_id_fk" FOREIGN KEY ("scorecard_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quiz_settings" ADD CONSTRAINT "quiz_settings_scorecard_badge_logo_id_media_id_fk" FOREIGN KEY ("scorecard_badge_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quiz_settings" ADD CONSTRAINT "quiz_settings_scorecard_image_id_media_id_fk" FOREIGN KEY ("scorecard_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS "quiz_settings_scorecard_scorecard_logo_idx" ON "quiz_settings" USING btree ("scorecard_logo_id");
CREATE INDEX IF NOT EXISTS "quiz_settings_scorecard_scorecard_badge_logo_idx" ON "quiz_settings" USING btree ("scorecard_badge_logo_id");
CREATE INDEX IF NOT EXISTS "quiz_settings_scorecard_scorecard_image_idx" ON "quiz_settings" USING btree ("scorecard_image_id");
