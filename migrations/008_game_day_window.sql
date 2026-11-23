-- Quiz Settings > Game Timers & Scoring > Game day: when the quiz day starts (India time) and the
-- break before it. Defaults: 8 AM start, 60 min break (no play 7-8 AM).
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_day_start_hour" numeric DEFAULT 8;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_day_cool_off_minutes" numeric DEFAULT 60;
UPDATE "quiz_settings" SET "game_day_start_hour" = 8 WHERE "game_day_start_hour" IS NULL;
UPDATE "quiz_settings" SET "game_day_cool_off_minutes" = 60 WHERE "game_day_cool_off_minutes" IS NULL;
