-- Quizzes > Daily Rounds > "Shuffle questions for each player" (off = Question Number order).
-- Additive and safe to run twice.
ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "shuffle_questions" boolean DEFAULT false;
