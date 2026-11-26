-- DRA questions tagged General (26 Nov 2026).
-- Questions 22, 29 and 35 carry the DRA banner ("Presents Pride Of Chennai ...") as their image but
-- were in TRIVIA's daily pool, so 013 made them General and they could show up as Q1 or Q2. They are
-- DRA sponsored questions: Use in -> Sponsored (Q3 only, with the sponsor box and extra time).
-- Only those three, and only while they still carry the banner and are General/Both: a question an
-- editor has changed since is left alone. Versions follow, so opening and saving keeps the value.
UPDATE "questions" q SET "use_in" = 'sponsored'
  FROM "media" m
 WHERE m."id" = q."hero_image_id"
   AND m."filename" LIKE 'Presents Pride Of Chennai%'
   AND q."id" IN (22, 29, 35)
   AND q."use_in" IN ('general', 'both');

UPDATE "_questions_v" v SET "version_use_in" = 'sponsored'
  FROM "questions" q
 WHERE v."parent_id" = q."id"
   AND q."id" IN (22, 29, 35)
   AND q."use_in" = 'sponsored'
   AND v."version_use_in" IS DISTINCT FROM 'sponsored';
