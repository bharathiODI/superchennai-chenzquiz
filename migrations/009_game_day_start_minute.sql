-- Game day can start on the half hour: Quiz Settings > Game day > minute.
-- The quiz now publishes questions at 12:30 AM (India time), so a schedule still on the old
-- 8:00 AM default moves to 12:30 AM (break 60 min = no play 11:30 PM-12:30 AM). A schedule
-- someone already changed in the CMS is left alone.
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_day_start_minute" numeric DEFAULT 0;
UPDATE "quiz_settings"
   SET "game_day_start_hour" = 0, "game_day_start_minute" = 30
 WHERE COALESCE("game_day_start_hour", 8) = 8 AND COALESCE("game_day_start_minute", 0) = 0;

-- Terms & Conditions: the publish time players read (only if it still says 8:00 AM)
UPDATE "quiz_site_settings"
   SET "terms_content" = replace("terms_content"::text, 'published every day at 8:00 AM', 'published every day at 12:30 AM')::jsonb
 WHERE "terms_content"::text LIKE '%published every day at 8:00 AM%';
