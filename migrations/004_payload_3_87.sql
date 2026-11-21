-- Payload 3.33 -> 3.87 upgrade.
-- Generated from a Drizzle snapshot diff (3.33 schema vs 3.87 schema, same config), then made
-- safe to run twice. Additive only.
--
-- Left out on purpose: 3.87 no longer uses payload_locked_documents_rels.payload_jobs_id.
-- The column is nullable, so it stays rather than dropping anything.
-- Auth sessions stay off (useSessions: false on users and quiz-users), so no users_sessions table.

-- Key/value store table that Payload 3.87 uses by default
CREATE TABLE IF NOT EXISTS "payload_kv" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar NOT NULL,
  "data" jsonb NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");

-- Indexes 3.87 now names within Postgres's 63-character limit (they were missing before)
CREATE INDEX IF NOT EXISTS "_questions_v_version_mcq_group_version_mcq_group_questio_idx" ON "_questions_v" USING btree ("version_mcq_group_question_image_id");
CREATE INDEX IF NOT EXISTS "_questions_v_version_wordle_group_version_wordle_group_h_idx" ON "_questions_v" USING btree ("version_wordle_group_hint_image_id");

-- Fixes the doubled apostrophe in the form-builder email subject default
ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';

-- The redirects plugin now marks "from" as unique. Switch the index only when no duplicates exist.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM "redirects" GROUP BY "from" HAVING count(*) > 1)
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'redirects_from_idx' AND indexdef LIKE 'CREATE UNIQUE%') THEN
    DROP INDEX IF EXISTS "redirects_from_idx";
    CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  END IF;
END $$;
