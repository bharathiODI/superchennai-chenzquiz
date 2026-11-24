-- WordPress-style CMS roles, part 2.
-- Existing admins become Super Admins (they already had full access; someone must be able to give
-- the Super Admin role). Old "client" accounts become Viewers: like before, they see the player
-- reports and change nothing. "user" stays "No access". New accounts default to Viewer.
UPDATE "users" SET "role" = 'superadmin' WHERE "role" = 'admin'
   AND NOT EXISTS (SELECT 1 FROM "users" WHERE "role" = 'superadmin');
UPDATE "users" SET "role" = 'viewer' WHERE "role" = 'client';
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'viewer';

-- "Created by" on questions and posts: authors and contributors edit only their own.
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "created_by_id" integer;
ALTER TABLE "_questions_v" ADD COLUMN IF NOT EXISTS "version_created_by_id" integer;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "created_by_id" integer;
ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_created_by_id" integer;

DO $$ BEGIN
  ALTER TABLE "questions" ADD CONSTRAINT "questions_created_by_id_users_id_fk"
    FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_questions_v" ADD CONSTRAINT "_questions_v_version_created_by_id_users_id_fk"
    FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_id_users_id_fk"
    FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_created_by_id_users_id_fk"
    FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "questions_created_by_idx" ON "questions" USING btree ("created_by_id");
CREATE INDEX IF NOT EXISTS "_questions_v_version_version_created_by_idx" ON "_questions_v" USING btree ("version_created_by_id");
CREATE INDEX IF NOT EXISTS "posts_created_by_idx" ON "posts" USING btree ("created_by_id");
CREATE INDEX IF NOT EXISTS "_posts_v_version_version_created_by_idx" ON "_posts_v" USING btree ("version_created_by_id");
