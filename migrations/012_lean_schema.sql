-- Lean setup (25 Nov 2026), part 1: schema.
-- * Questions get "Use in" (General / Sponsored / Both / Not in play). The pool of a quiz is every
--   published question whose Quiz is that quiz and whose Use in is not "Not in play".
-- * Quizzes get a Round layout (one row per question a player gets each day).
-- * Rounds keep play details (server timing, flags); every answer is stored in quiz_answers.
-- * Players can be disqualified (left off the leaderboard); Quiz Settings get the fair-play rules.
-- Generated from the Payload schema diff, made repeatable (IF NOT EXISTS). Data moves are in 013.
DO $$ BEGIN
  CREATE TYPE "public"."enum_questions_use_in" AS ENUM('general', 'sponsored', 'both', 'none');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "public"."enum__questions_v_version_use_in" AS ENUM('general', 'sponsored', 'both', 'none');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "public"."enum_quizzes_round_layout_source" AS ENUM('general', 'sponsored');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "public"."enum_quizzes_round_layout_points" AS ENUM('normal', 'fixed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TABLE IF NOT EXISTS "quizzes_round_layout" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"source" "enum_quizzes_round_layout_source" DEFAULT 'general' NOT NULL,
	"extra_seconds" numeric DEFAULT 0,
	"points" "enum_quizzes_round_layout_points" DEFAULT 'normal' NOT NULL,
	"fixed_points" numeric,
	"sponsor_name" varchar,
	"sponsor_line" varchar,
	"sponsor_logo_id" integer
);
CREATE TABLE IF NOT EXISTS "quiz_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"quiz_id" integer NOT NULL,
	"round_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"position" numeric NOT NULL,
	"answer" varchar,
	"correct" boolean,
	"timed_out" boolean,
	"points" numeric,
	"speed_bonus" numeric,
	"seconds" numeric,
	"sponsored" boolean,
	"served_at" timestamp(3) with time zone,
	"answered_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "use_in" "enum_questions_use_in" DEFAULT 'general';
ALTER TABLE "_questions_v" ADD COLUMN IF NOT EXISTS "version_use_in" "enum__questions_v_version_use_in" DEFAULT 'general';
ALTER TABLE "quiz_users" ADD COLUMN IF NOT EXISTS "disqualified" boolean DEFAULT false;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "position" numeric DEFAULT 0;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "served_at" timestamp(3) with time zone;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "time_taken" numeric;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "correct_answers" numeric;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "too_fast" boolean;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "linked" boolean;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "device_id" varchar;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "ip" varchar;
ALTER TABLE "quiz_rounds" ADD COLUMN IF NOT EXISTS "slots" jsonb;
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "quiz_answers_id" integer;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "safety_speed_floor_seconds" numeric DEFAULT 1.5;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "safety_too_fast_round_seconds" numeric DEFAULT 6;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "safety_linked_window_minutes" numeric DEFAULT 60;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "safety_shuffle_options" boolean DEFAULT true;
DO $$ BEGIN
  ALTER TABLE "quizzes_round_layout" ADD CONSTRAINT "quizzes_round_layout_sponsor_logo_id_media_id_fk" FOREIGN KEY ("sponsor_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "quizzes_round_layout" ADD CONSTRAINT "quizzes_round_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_user_id_quiz_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."quiz_users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_round_id_quiz_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."quiz_rounds"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "quizzes_round_layout_order_idx" ON "quizzes_round_layout" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "quizzes_round_layout_parent_id_idx" ON "quizzes_round_layout" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "quizzes_round_layout_sponsor_logo_idx" ON "quizzes_round_layout" USING btree ("sponsor_logo_id");
CREATE INDEX IF NOT EXISTS "quiz_answers_user_idx" ON "quiz_answers" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "quiz_answers_quiz_idx" ON "quiz_answers" USING btree ("quiz_id");
CREATE INDEX IF NOT EXISTS "quiz_answers_round_idx" ON "quiz_answers" USING btree ("round_id");
CREATE INDEX IF NOT EXISTS "quiz_answers_question_idx" ON "quiz_answers" USING btree ("question_id");
CREATE INDEX IF NOT EXISTS "quiz_answers_answered_at_idx" ON "quiz_answers" USING btree ("answered_at");
CREATE INDEX IF NOT EXISTS "quiz_answers_updated_at_idx" ON "quiz_answers" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "quiz_answers_created_at_idx" ON "quiz_answers" USING btree ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "round_position_idx" ON "quiz_answers" USING btree ("round_id","position");
DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_answers_fk" FOREIGN KEY ("quiz_answers_id") REFERENCES "public"."quiz_answers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "questions_use_in_idx" ON "questions" USING btree ("use_in");
CREATE INDEX IF NOT EXISTS "_questions_v_version_version_use_in_idx" ON "_questions_v" USING btree ("version_use_in");
CREATE INDEX IF NOT EXISTS "quiz_users_disqualified_idx" ON "quiz_users" USING btree ("disqualified");
CREATE INDEX IF NOT EXISTS "quiz_rounds_too_fast_idx" ON "quiz_rounds" USING btree ("too_fast");
CREATE INDEX IF NOT EXISTS "quiz_rounds_linked_idx" ON "quiz_rounds" USING btree ("linked");
CREATE INDEX IF NOT EXISTS "quiz_rounds_device_id_idx" ON "quiz_rounds" USING btree ("device_id");
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quiz_answers_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_answers_id");
