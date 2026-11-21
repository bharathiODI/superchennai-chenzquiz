-- Quiz Site Settings global (src/globals/QuizSiteSettings).
-- Generated from the Payload schema diff; safe to run more than once.
-- Applied automatically on deploy by scripts/db-migrate.mjs.

DO $$ BEGIN
  CREATE TYPE "public"."enum_quiz_site_settings_leaderboard_default_tab" AS ENUM('daily', 'weekly', 'monthly', 'all');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "quiz_site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"login_login_heading" varchar DEFAULT 'Welcome Back',
	"login_signup_heading" varchar DEFAULT 'Create Account',
	"login_login_subheading" varchar DEFAULT 'Enter your mobile number to get OTP and access your dashboard',
	"login_signup_subheading" varchar DEFAULT 'Join thousands of quiz fans across Chennai',
	"login_require_email" boolean DEFAULT true,
	"login_show_message_field" boolean DEFAULT true,
	"login_terms_url" varchar DEFAULT '/terms',
	"login_privacy_url" varchar DEFAULT '/privacy',
	"login_side_panel_badge" varchar DEFAULT 'CHENNAI QUIZ MASTER',
	"login_side_panel_text" varchar DEFAULT 'Test your Chennai knowledge, climb the leaderboards & win daily rewards!',
	"login_side_panel_footer" varchar DEFAULT 'Chennai Landmark Edition',
	"quizzes_page_badge" varchar DEFAULT '⚡ Daily Brain Challenge',
	"quizzes_page_heading" varchar DEFAULT 'Super Chennai Quizzes',
	"quizzes_page_description" varchar DEFAULT 'Play today assigned interactive games, climb the local leaderboard, and claim your Chennai master badge!',
	"quizzes_page_empty_eyebrow" varchar DEFAULT 'Daily Quiz Schedule',
	"quizzes_page_empty_heading" varchar DEFAULT 'No Active Quiz Scheduled',
	"quizzes_page_empty_text" varchar DEFAULT 'We are preparing fresh challenges! Check back in a bit or explore previous quizzes.',
	"leaderboard_heading" varchar DEFAULT 'Leaderboard',
	"leaderboard_description" varchar DEFAULT 'Top scorers and champions across all Chennai quiz challenges.',
	"leaderboard_empty_text" varchar DEFAULT 'No champions ranked for this period yet. Play a game to claim your spot!',
	"leaderboard_rows_per_page" numeric DEFAULT 10,
	"leaderboard_default_tab" "enum_quiz_site_settings_leaderboard_default_tab" DEFAULT 'all',
	"test_players_allow_test_logins" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);
