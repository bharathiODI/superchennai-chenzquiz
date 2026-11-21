-- Player titles (Quiz Settings), game timers, and daily rounds with sponsored questions.
-- Generated from the Payload schema diff (dhinesh-latest and quiz-pdf-updates -> daily rounds).
-- Additive and safe to run more than once: works on a database that has none of this yet (live)
-- and on one that already has the Quiz Settings tables (local copies of quiz-pdf-updates).

-- Types
DO $$ BEGIN
  CREATE TYPE "public"."enum_quiz_rounds_status" AS ENUM('assigned', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS "quizzes_sponsored_questions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"date" timestamp(3) with time zone NOT NULL,
	"round" numeric,
	"question_id" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "quiz_rounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"quiz_id" integer NOT NULL,
	"day" varchar NOT NULL,
	"round" numeric NOT NULL,
	"status" "enum_quiz_rounds_status" DEFAULT 'assigned' NOT NULL,
	"sponsored_question_id" integer,
	"score" numeric,
	"completed_at" timestamp(3) with time zone,
	"recycled" numeric DEFAULT 0,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "quiz_rounds_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"questions_id" integer
);

CREATE TABLE IF NOT EXISTS "quiz_settings_titles" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"min_x_p" numeric NOT NULL
);

CREATE TABLE IF NOT EXISTS "quiz_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_timers_mcq" numeric DEFAULT 20,
	"game_timers_dropdown" numeric DEFAULT 60,
	"game_timers_wordle" numeric DEFAULT 60,
	"game_timers_word_finder" numeric DEFAULT 60,
	"game_timers_match_following" numeric DEFAULT 60,
	"game_timers_spot_lie" numeric DEFAULT 60,
	"game_timers_reorder" numeric DEFAULT 60,
	"game_timers_drag_drop" numeric DEFAULT 60,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

-- Columns
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "quiz_rounds_id" integer;
ALTER TABLE "quiz_attempts" ADD COLUMN IF NOT EXISTS "round" numeric;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_timers_drag_drop" numeric DEFAULT 60;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_timers_dropdown" numeric DEFAULT 60;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_timers_match_following" numeric DEFAULT 60;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_timers_mcq" numeric DEFAULT 20;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_timers_reorder" numeric DEFAULT 60;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_timers_spot_lie" numeric DEFAULT 60;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_timers_word_finder" numeric DEFAULT 60;
ALTER TABLE "quiz_settings" ADD COLUMN IF NOT EXISTS "game_timers_wordle" numeric DEFAULT 60;
ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "questions_per_round" numeric DEFAULT 3;
ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "rounds_per_day" numeric DEFAULT 3;
ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "sponsored_position" numeric DEFAULT 3;

-- Foreign keys
DO $$ BEGIN
 ALTER TABLE "quizzes_sponsored_questions" ADD CONSTRAINT "quizzes_sponsored_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quizzes_sponsored_questions" ADD CONSTRAINT "quizzes_sponsored_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quiz_rounds" ADD CONSTRAINT "quiz_rounds_user_id_quiz_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."quiz_users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quiz_rounds" ADD CONSTRAINT "quiz_rounds_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quiz_rounds" ADD CONSTRAINT "quiz_rounds_sponsored_question_id_questions_id_fk" FOREIGN KEY ("sponsored_question_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quiz_rounds_rels" ADD CONSTRAINT "quiz_rounds_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_rounds"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quiz_rounds_rels" ADD CONSTRAINT "quiz_rounds_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "quiz_settings_titles" ADD CONSTRAINT "quiz_settings_titles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quiz_settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_rounds_fk" FOREIGN KEY ("quiz_rounds_id") REFERENCES "public"."quiz_rounds"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS "quizzes_sponsored_questions_order_idx" ON "quizzes_sponsored_questions" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "quizzes_sponsored_questions_parent_id_idx" ON "quizzes_sponsored_questions" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "quizzes_sponsored_questions_question_idx" ON "quizzes_sponsored_questions" USING btree ("question_id");
CREATE INDEX IF NOT EXISTS "quiz_rounds_user_idx" ON "quiz_rounds" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "quiz_rounds_quiz_idx" ON "quiz_rounds" USING btree ("quiz_id");
CREATE INDEX IF NOT EXISTS "quiz_rounds_day_idx" ON "quiz_rounds" USING btree ("day");
CREATE INDEX IF NOT EXISTS "quiz_rounds_sponsored_question_idx" ON "quiz_rounds" USING btree ("sponsored_question_id");
CREATE INDEX IF NOT EXISTS "quiz_rounds_updated_at_idx" ON "quiz_rounds" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "quiz_rounds_created_at_idx" ON "quiz_rounds" USING btree ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "user_quiz_day_round_idx" ON "quiz_rounds" USING btree ("user_id","quiz_id","day","round");
CREATE INDEX IF NOT EXISTS "quiz_rounds_rels_order_idx" ON "quiz_rounds_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "quiz_rounds_rels_parent_idx" ON "quiz_rounds_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "quiz_rounds_rels_path_idx" ON "quiz_rounds_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "quiz_rounds_rels_questions_id_idx" ON "quiz_rounds_rels" USING btree ("questions_id");
CREATE INDEX IF NOT EXISTS "quiz_settings_titles_order_idx" ON "quiz_settings_titles" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "quiz_settings_titles_parent_id_idx" ON "quiz_settings_titles" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quiz_rounds_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_rounds_id");
