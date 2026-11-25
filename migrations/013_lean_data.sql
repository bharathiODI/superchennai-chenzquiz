-- Lean setup (25 Nov 2026), part 2: move today's setup into the new fields, so nothing a player
-- gets changes at the switch.

-- 1. Questions in a sponsored schedule are Sponsored questions.
UPDATE "questions" SET "use_in" = 'sponsored'
 WHERE "id" IN (SELECT "question_id" FROM "quizzes_sponsored_questions" WHERE "question_id" IS NOT NULL);

-- 2. A question in a quiz's (old) Question Pool belongs to that quiz. If it sits in several pools,
--    it keeps its Quiz when that is one of them, otherwise it goes to the first.
UPDATE "questions" q SET "quiz_id" = p."quiz_id"
  FROM (SELECT "questions_id" AS qid, min("parent_id") AS quiz_id FROM "quizzes_rels"
         WHERE "path" = 'questions' AND "questions_id" IS NOT NULL GROUP BY "questions_id") p
 WHERE q."id" = p.qid
   AND (q."quiz_id" IS NULL OR NOT EXISTS (
         SELECT 1 FROM "quizzes_rels" r WHERE r."path" = 'questions' AND r."questions_id" = q."id" AND r."parent_id" = q."quiz_id"));

-- 3. Published questions that were in no pool and no schedule were not in play: keep them out.
--    Editors switch them to General when they want them back. (Drafts stay General, so they join
--    when published.)
UPDATE "questions" SET "use_in" = 'none'
 WHERE "_status" = 'published' AND "use_in" = 'general'
   AND "id" NOT IN (SELECT "questions_id" FROM "quizzes_rels" WHERE "path" = 'questions' AND "questions_id" IS NOT NULL)
   AND "id" NOT IN (SELECT "question_id" FROM "quizzes_sponsored_questions" WHERE "question_id" IS NOT NULL);

-- 4. Versions follow the question, so opening and saving a question keeps these values.
UPDATE "_questions_v" v SET "version_use_in" = q."use_in"::text::"enum__questions_v_version_use_in", "version_quiz_id" = q."quiz_id"
  FROM "questions" q WHERE v."parent_id" = q."id";

-- 5. Round layout from the old settings: "Questions per round" slots, the sponsored one at
--    "Sponsored question slot". Only for quizzes that don't have a layout yet.
INSERT INTO "quizzes_round_layout" ("_order", "_parent_id", "id", "source", "extra_seconds", "points")
SELECT n, z."id", substr(md5(random()::text || clock_timestamp()::text || z."id" || n), 1, 24),
       (CASE WHEN n = COALESCE(z."sponsored_position", 0) THEN 'sponsored' ELSE 'general' END)::"enum_quizzes_round_layout_source",
       0, 'normal'
  FROM "quizzes" z
  CROSS JOIN LATERAL generate_series(1, GREATEST(1, LEAST(10, COALESCE(z."questions_per_round", 3)::int))) AS n
 WHERE NOT EXISTS (SELECT 1 FROM "quizzes_round_layout" l WHERE l."_parent_id" = z."id");
