-- Page builder (Pages > Page Builder tab).
-- New tables only: the builder's Section > Row > Column > Element blocks for pages and their
-- versions, for the elements in src/builder/elements.ts. No existing table or column changes.
-- Generated from a Drizzle snapshot diff (Payload 3.87 schema before/after the builder), then
-- made safe to run twice (IF NOT EXISTS; types and foreign keys skip when already there).
-- A few foreign-key names are longer than 63 characters; Postgres shortens them itself (no clashes).

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_level" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_rich_text_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_size" AS ENUM('sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_ratio" AS ENUM('auto', '16/9', '4/3', '3/2', '1/1');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_source" AS ENUM('embed', 'file');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_ratio" AS ENUM('16/9', '4/3', '1/1');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_video_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_spacer_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_left_cards_icon_type" AS ENUM('bulb', 'gamepad', 'users', 'trophy', 'list', 'star', 'fire', 'chart');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_right_cards_icon_type" AS ENUM('bulb', 'gamepad', 'users', 'trophy', 'list', 'star', 'fire', 'chart');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_about_trivia_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_steps_icon_type" AS ENUM('userPlus', 'quiz', 'trophy', 'gift');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_how_it_works_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_cards_card_bg_color" AS ENUM('white', 'cream');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_ready_to_play_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_quiz_rewards_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_faq_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_insta_reels_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_image_scale" AS ENUM('0.8', '1', '1.2');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_image_rotation" AS ENUM('rotate-0', '-rotate-3', 'rotate-4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_animation_intensity" AS ENUM('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_chenz_creative_hero_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5', '1/6', '5/6', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_valign" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_columns_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_gap" AS ENUM('none', 'sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_valign" AS ENUM('start', 'center', 'end', 'stretch');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_justify" AS ENUM('start', 'center', 'end', 'between', 'around', 'evenly');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_row_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_tag" AS ENUM('section', 'div', 'header', 'footer', 'main', 'aside', 'nav');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_width_mode" AS ENUM('contained', 'full');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_height" AS ENUM('auto', 'full', 'min');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_builder_section_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_level" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_size" AS ENUM('sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_ratio" AS ENUM('auto', '16/9', '4/3', '3/2', '1/1');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_source" AS ENUM('embed', 'file');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_ratio" AS ENUM('16/9', '4/3', '1/1');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_video_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_left_cards_icon_type" AS ENUM('bulb', 'gamepad', 'users', 'trophy', 'list', 'star', 'fire', 'chart');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_right_cards_icon_type" AS ENUM('bulb', 'gamepad', 'users', 'trophy', 'list', 'star', 'fire', 'chart');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_about_trivia_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_steps_icon_type" AS ENUM('userPlus', 'quiz', 'trophy', 'gift');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_how_it_works_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_cards_card_bg_color" AS ENUM('white', 'cream');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_ready_to_play_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_quiz_rewards_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_faq_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_insta_reels_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_image_scale" AS ENUM('0.8', '1', '1.2');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_image_rotation" AS ENUM('rotate-0', '-rotate-3', 'rotate-4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_animation_intensity" AS ENUM('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_align" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_chenz_creative_hero_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5', '1/6', '5/6', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_valign" AS ENUM('inherit', 'start', 'center', 'end');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_columns_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_gap" AS ENUM('none', 'sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_valign" AS ENUM('start', 'center', 'end', 'stretch');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_justify" AS ENUM('start', 'center', 'end', 'between', 'around', 'evenly');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_row_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_tag" AS ENUM('section', 'div', 'header', 'footer', 'main', 'aside', 'nav');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_width_mode" AS ENUM('contained', 'full');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_height" AS ENUM('auto', 'full', 'min');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_bg_type" AS ENUM('none', 'color', 'gradient', 'image', 'video');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_bg_pos" AS ENUM('left-top', 'left-center', 'left-bottom', 'center-top', 'center-center', 'center-bottom', 'right-top', 'right-center', 'right-bottom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_bg_fit" AS ENUM('cover', 'contain', 'auto');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_bg_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_bg_attach" AS ENUM('scroll', 'fixed', 'parallax');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_bg_blend" AS ENUM('normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'luminosity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_builder_section_anim_preset" AS ENUM('none', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "pages_blocks_heading_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_heading" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar,
	"eyebrow" varchar,
	"level" "enum_pages_blocks_heading_level" DEFAULT 'h2',
	"align" "enum_pages_blocks_heading_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_heading_font_weight",
	"transform" "enum_pages_blocks_heading_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_heading_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_heading_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_heading_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_heading_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_heading_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_heading_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_heading_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_rich_text_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_rich_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"content" jsonb,
	"align" "enum_pages_blocks_rich_text_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_rich_text_font_weight",
	"transform" "enum_pages_blocks_rich_text_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_rich_text_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_rich_text_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_rich_text_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_rich_text_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_rich_text_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_rich_text_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_rich_text_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_button_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_button" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar,
	"url" varchar,
	"variant" "enum_pages_blocks_button_variant" DEFAULT 'primary',
	"size" "enum_pages_blocks_button_size" DEFAULT 'md',
	"new_tab" boolean DEFAULT false,
	"align" "enum_pages_blocks_button_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_button_font_weight",
	"transform" "enum_pages_blocks_button_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_button_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_button_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_button_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_button_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_button_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_button_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_button_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_image_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_image" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image_id" integer,
	"caption" varchar,
	"ratio" "enum_pages_blocks_image_ratio" DEFAULT 'auto',
	"rounded" boolean DEFAULT false,
	"url" varchar,
	"align" "enum_pages_blocks_image_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_image_font_weight",
	"transform" "enum_pages_blocks_image_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_image_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_image_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_image_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_image_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_image_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_image_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_image_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_video_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_video" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"source" "enum_pages_blocks_video_source" DEFAULT 'embed',
	"embed_url" varchar,
	"file_id" integer,
	"poster_id" integer,
	"ratio" "enum_pages_blocks_video_ratio" DEFAULT '16/9',
	"controls" boolean DEFAULT true,
	"align" "enum_pages_blocks_video_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_video_font_weight",
	"transform" "enum_pages_blocks_video_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_video_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_video_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_video_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_video_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_video_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_video_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_video_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_divider_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_divider" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"height" numeric DEFAULT 32,
	"line" boolean DEFAULT false,
	"align" "enum_pages_blocks_divider_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_divider_font_weight",
	"transform" "enum_pages_blocks_divider_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_divider_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_divider_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_divider_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_divider_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_divider_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_divider_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_divider_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_spacer_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_spacer" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"h" numeric DEFAULT 48,
	"h_md" numeric,
	"h_sm" numeric,
	"align" "enum_pages_blocks_spacer_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_spacer_font_weight",
	"transform" "enum_pages_blocks_spacer_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_spacer_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_spacer_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_spacer_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_spacer_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_spacer_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_spacer_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_spacer_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_about_trivia_left_cards" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar,
	"icon_type" "enum_pages_blocks_chenz_about_trivia_left_cards_icon_type" DEFAULT 'bulb',
	"custom_icon_id" integer
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_about_trivia_right_cards" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar,
	"icon_type" "enum_pages_blocks_chenz_about_trivia_right_cards_icon_type" DEFAULT 'users',
	"custom_icon_id" integer
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_about_trivia_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_about_trivia" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"main_title" varchar DEFAULT 'Ready to Play',
	"highlight_text" varchar DEFAULT 'Trivia?',
	"sub_description" varchar DEFAULT 'Join the Chennai Trivia community.',
	"center_image_id" integer,
	"sign_up_text" varchar DEFAULT 'Sign Up',
	"sign_up_url" varchar DEFAULT '/signup',
	"login_text" varchar DEFAULT 'Login',
	"login_url" varchar DEFAULT '/login',
	"align" "enum_pages_blocks_chenz_about_trivia_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_chenz_about_trivia_font_weight",
	"transform" "enum_pages_blocks_chenz_about_trivia_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_chenz_about_trivia_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_chenz_about_trivia_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_chenz_about_trivia_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_chenz_about_trivia_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_chenz_about_trivia_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_chenz_about_trivia_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_chenz_about_trivia_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_how_it_works_steps" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"step_number" varchar,
	"title" varchar,
	"description" varchar,
	"icon_type" "enum_pages_blocks_chenz_how_it_works_steps_icon_type" DEFAULT 'userPlus'
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_how_it_works_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_how_it_works" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"top_subtitle" varchar DEFAULT 'CHENZ QUIZ',
	"main_title" varchar DEFAULT 'How It',
	"highlight_text" varchar DEFAULT 'Works',
	"sub_description" varchar DEFAULT 'Four simple steps to play, learn and celebrate Chennai.',
	"align" "enum_pages_blocks_chenz_how_it_works_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_chenz_how_it_works_font_weight",
	"transform" "enum_pages_blocks_chenz_how_it_works_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_chenz_how_it_works_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_chenz_how_it_works_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_chenz_how_it_works_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_chenz_how_it_works_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_chenz_how_it_works_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_chenz_how_it_works_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_chenz_how_it_works_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_ready_to_play_cards" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar,
	"button_text" varchar,
	"button_url" varchar,
	"card_bg_color" "enum_pages_blocks_chenz_ready_to_play_cards_card_bg_color" DEFAULT 'white'
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_ready_to_play_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_ready_to_play" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"top_subtitle" varchar DEFAULT 'CHENZ QUIZ',
	"main_title" varchar DEFAULT 'Ready to Play',
	"highlight_text" varchar DEFAULT 'Trivia?',
	"sub_description" varchar DEFAULT 'Join the Chennai Trivia community.',
	"align" "enum_pages_blocks_chenz_ready_to_play_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_chenz_ready_to_play_font_weight",
	"transform" "enum_pages_blocks_chenz_ready_to_play_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_chenz_ready_to_play_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_chenz_ready_to_play_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_chenz_ready_to_play_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_chenz_ready_to_play_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_chenz_ready_to_play_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_chenz_ready_to_play_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_chenz_ready_to_play_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_quiz_rewards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"eyebrow" varchar DEFAULT 'CHENZ QUIZ',
	"title" varchar DEFAULT 'Ready to Play Chenz Quiz?',
	"subtitle" varchar DEFAULT 'Think You Know Chennai?',
	"background_image_id" integer,
	"challenge_card_icon_id" integer,
	"challenge_card_title" varchar DEFAULT 'Ready to Take the Challenge?',
	"challenge_card_description" varchar DEFAULT 'Play the daily Chennai quiz, answer three questions and earn points. Build your score, maintain your streak and climb the leaderboard.',
	"challenge_card_schedule_label" varchar DEFAULT 'Daily Quiz',
	"challenge_card_schedule_time" varchar DEFAULT '7:00 AM - 11:00 PM',
	"challenge_card_button_text" varchar DEFAULT 'Play Today''s Quiz',
	"challenge_card_button_url" varchar DEFAULT '/quizzes',
	"challenge_card_bg_color" varchar DEFAULT '#FFE8F3',
	"challenge_card_accent_color" varchar DEFAULT '#F0157D',
	"reward_card_icon_id" integer,
	"reward_card_title" varchar DEFAULT 'Your Knowledge Deserves Rewards!',
	"reward_card_description" varchar DEFAULT 'Compete with fellow Chennai lovers and stand a chance to win a',
	"reward_card_voucher_image_id" integer,
	"reward_card_voucher_amount" varchar DEFAULT '₹300',
	"reward_card_voucher_label" varchar DEFAULT 'Daily Winner Voucher',
	"reward_card_button_text" varchar DEFAULT 'View Leaderboard',
	"reward_card_button_url" varchar DEFAULT '/leaderboard',
	"reward_card_bg_color" varchar DEFAULT '#EFE9FF',
	"reward_card_accent_color" varchar DEFAULT '#5B21F5',
	"align" "enum_pages_blocks_chenz_quiz_rewards_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_chenz_quiz_rewards_font_weight",
	"transform" "enum_pages_blocks_chenz_quiz_rewards_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_chenz_quiz_rewards_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_chenz_quiz_rewards_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_chenz_quiz_rewards_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_chenz_quiz_rewards_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_chenz_quiz_rewards_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_chenz_quiz_rewards_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_chenz_quiz_rewards_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_faq_faqs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"question" varchar,
	"answer" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_faq_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_faq" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"seo_h1" varchar,
	"section_bg_image_id" integer,
	"eyebrow" varchar DEFAULT 'FAQ',
	"heading" varchar DEFAULT 'Frequently Asked Questions',
	"description" varchar DEFAULT 'Find answers to common questions about stories, features, submissions, and events on Let’s Talk Chennai.',
	"allow_multiple_open" boolean DEFAULT false,
	"cta_text" varchar DEFAULT 'Have more questions? Contact our team',
	"cta_url" varchar,
	"align" "enum_pages_blocks_chenz_faq_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_chenz_faq_font_weight",
	"transform" "enum_pages_blocks_chenz_faq_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_chenz_faq_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_chenz_faq_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_chenz_faq_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_chenz_faq_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_chenz_faq_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_chenz_faq_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_chenz_faq_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_insta_reels_reels" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"subtitle" varchar DEFAULT '@chenzquiz',
	"thumbnail_id" integer,
	"redirect_url" varchar DEFAULT 'https://instagram.com'
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_insta_reels_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_insta_reels" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"top_badge" varchar DEFAULT 'INSTAGRAM REELS',
	"main_heading" varchar DEFAULT 'Watch & Explore Our',
	"highlight_text" varchar DEFAULT 'Reels',
	"sub_description" varchar DEFAULT 'Check out our latest trending Instagram reels and stories below!',
	"align" "enum_pages_blocks_chenz_insta_reels_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_chenz_insta_reels_font_weight",
	"transform" "enum_pages_blocks_chenz_insta_reels_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_chenz_insta_reels_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_chenz_insta_reels_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_chenz_insta_reels_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_chenz_insta_reels_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_chenz_insta_reels_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_chenz_insta_reels_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_chenz_insta_reels_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_creative_hero_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_chenz_creative_hero" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"eyebrow" varchar DEFAULT 'Creative Studio // 2026',
	"heading" varchar DEFAULT 'NOTHING',
	"subtitle" varchar DEFAULT 'Exploring the intersection of brutalist typography and fluid motion.',
	"cta_label" varchar DEFAULT 'Book a Call',
	"cta_url" varchar DEFAULT '/contact',
	"image_id" integer,
	"image_alt" varchar DEFAULT 'Hero Visual',
	"image_scale" "enum_pages_blocks_chenz_creative_hero_image_scale" DEFAULT '1',
	"image_rotation" "enum_pages_blocks_chenz_creative_hero_image_rotation" DEFAULT 'rotate-0',
	"background_color" varchar DEFAULT '#ffffff',
	"text_color" varchar DEFAULT '#0f172a',
	"interaction_enabled" boolean DEFAULT true,
	"animation_intensity" "enum_pages_blocks_chenz_creative_hero_animation_intensity" DEFAULT 'medium',
	"footer_text" varchar DEFAULT 'Paris / Tokyo / Remote',
	"align" "enum_pages_blocks_chenz_creative_hero_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_chenz_creative_hero_font_weight",
	"transform" "enum_pages_blocks_chenz_creative_hero_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_chenz_creative_hero_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_chenz_creative_hero_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_chenz_creative_hero_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_chenz_creative_hero_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_chenz_creative_hero_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_chenz_creative_hero_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_chenz_creative_hero_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_builder_row_columns_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_builder_row_columns" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"width" "enum_pages_blocks_builder_row_columns_width" DEFAULT '1/1',
	"valign" "enum_pages_blocks_builder_row_columns_valign" DEFAULT 'inherit',
	"link_url" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_builder_row_columns_font_weight",
	"transform" "enum_pages_blocks_builder_row_columns_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_builder_row_columns_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_builder_row_columns_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_builder_row_columns_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_builder_row_columns_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_builder_row_columns_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_builder_row_columns_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_builder_row_columns_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_builder_row_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_builder_row" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"gap" "enum_pages_blocks_builder_row_gap" DEFAULT 'md',
	"valign" "enum_pages_blocks_builder_row_valign" DEFAULT 'start',
	"justify" "enum_pages_blocks_builder_row_justify" DEFAULT 'start',
	"wrap" boolean DEFAULT true,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_builder_row_font_weight",
	"transform" "enum_pages_blocks_builder_row_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_builder_row_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_builder_row_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_builder_row_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_builder_row_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_builder_row_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_builder_row_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_builder_row_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_builder_section_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_builder_section" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"tag" "enum_pages_blocks_builder_section_tag" DEFAULT 'section',
	"width_mode" "enum_pages_blocks_builder_section_width_mode" DEFAULT 'contained',
	"height" "enum_pages_blocks_builder_section_height" DEFAULT 'auto',
	"min_height" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum_pages_blocks_builder_section_font_weight",
	"transform" "enum_pages_blocks_builder_section_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum_pages_blocks_builder_section_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum_pages_blocks_builder_section_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum_pages_blocks_builder_section_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum_pages_blocks_builder_section_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum_pages_blocks_builder_section_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum_pages_blocks_builder_section_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum_pages_blocks_builder_section_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_heading_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_heading" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar,
	"eyebrow" varchar,
	"level" "enum__pages_v_blocks_heading_level" DEFAULT 'h2',
	"align" "enum__pages_v_blocks_heading_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_heading_font_weight",
	"transform" "enum__pages_v_blocks_heading_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_heading_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_heading_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_heading_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_heading_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_heading_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_heading_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_heading_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_rich_text_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_rich_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"content" jsonb,
	"align" "enum__pages_v_blocks_rich_text_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_rich_text_font_weight",
	"transform" "enum__pages_v_blocks_rich_text_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_rich_text_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_rich_text_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_rich_text_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_rich_text_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_rich_text_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_rich_text_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_rich_text_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_button_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_button" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar,
	"url" varchar,
	"variant" "enum__pages_v_blocks_button_variant" DEFAULT 'primary',
	"size" "enum__pages_v_blocks_button_size" DEFAULT 'md',
	"new_tab" boolean DEFAULT false,
	"align" "enum__pages_v_blocks_button_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_button_font_weight",
	"transform" "enum__pages_v_blocks_button_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_button_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_button_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_button_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_button_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_button_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_button_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_button_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer,
	"caption" varchar,
	"ratio" "enum__pages_v_blocks_image_ratio" DEFAULT 'auto',
	"rounded" boolean DEFAULT false,
	"url" varchar,
	"align" "enum__pages_v_blocks_image_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_image_font_weight",
	"transform" "enum__pages_v_blocks_image_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_image_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_image_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_image_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_image_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_image_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_image_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_image_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_video_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_video" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"source" "enum__pages_v_blocks_video_source" DEFAULT 'embed',
	"embed_url" varchar,
	"file_id" integer,
	"poster_id" integer,
	"ratio" "enum__pages_v_blocks_video_ratio" DEFAULT '16/9',
	"controls" boolean DEFAULT true,
	"align" "enum__pages_v_blocks_video_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_video_font_weight",
	"transform" "enum__pages_v_blocks_video_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_video_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_video_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_video_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_video_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_video_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_video_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_video_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_divider_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_divider" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"height" numeric DEFAULT 32,
	"line" boolean DEFAULT false,
	"align" "enum__pages_v_blocks_divider_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_divider_font_weight",
	"transform" "enum__pages_v_blocks_divider_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_divider_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_divider_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_divider_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_divider_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_divider_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_divider_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_divider_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_spacer_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_spacer" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"h" numeric DEFAULT 48,
	"h_md" numeric,
	"h_sm" numeric,
	"align" "enum__pages_v_blocks_spacer_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_spacer_font_weight",
	"transform" "enum__pages_v_blocks_spacer_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_spacer_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_spacer_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_spacer_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_spacer_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_spacer_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_spacer_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_spacer_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_left_cards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar,
	"icon_type" "enum__pages_v_blocks_chenz_about_trivia_left_cards_icon_type" DEFAULT 'bulb',
	"custom_icon_id" integer,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_right_cards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar,
	"icon_type" "enum__pages_v_blocks_chenz_about_trivia_right_cards_icon_type" DEFAULT 'users',
	"custom_icon_id" integer,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"main_title" varchar DEFAULT 'Ready to Play',
	"highlight_text" varchar DEFAULT 'Trivia?',
	"sub_description" varchar DEFAULT 'Join the Chennai Trivia community.',
	"center_image_id" integer,
	"sign_up_text" varchar DEFAULT 'Sign Up',
	"sign_up_url" varchar DEFAULT '/signup',
	"login_text" varchar DEFAULT 'Login',
	"login_url" varchar DEFAULT '/login',
	"align" "enum__pages_v_blocks_chenz_about_trivia_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_chenz_about_trivia_font_weight",
	"transform" "enum__pages_v_blocks_chenz_about_trivia_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_chenz_about_trivia_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_chenz_about_trivia_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_chenz_about_trivia_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_chenz_about_trivia_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_chenz_about_trivia_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_chenz_about_trivia_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_chenz_about_trivia_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_steps" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"step_number" varchar,
	"title" varchar,
	"description" varchar,
	"icon_type" "enum__pages_v_blocks_chenz_how_it_works_steps_icon_type" DEFAULT 'userPlus',
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"top_subtitle" varchar DEFAULT 'CHENZ QUIZ',
	"main_title" varchar DEFAULT 'How It',
	"highlight_text" varchar DEFAULT 'Works',
	"sub_description" varchar DEFAULT 'Four simple steps to play, learn and celebrate Chennai.',
	"align" "enum__pages_v_blocks_chenz_how_it_works_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_chenz_how_it_works_font_weight",
	"transform" "enum__pages_v_blocks_chenz_how_it_works_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_chenz_how_it_works_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_chenz_how_it_works_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_chenz_how_it_works_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_chenz_how_it_works_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_chenz_how_it_works_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_chenz_how_it_works_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_chenz_how_it_works_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_cards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" varchar,
	"button_text" varchar,
	"button_url" varchar,
	"card_bg_color" "enum__pages_v_blocks_chenz_ready_to_play_cards_card_bg_color" DEFAULT 'white',
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"top_subtitle" varchar DEFAULT 'CHENZ QUIZ',
	"main_title" varchar DEFAULT 'Ready to Play',
	"highlight_text" varchar DEFAULT 'Trivia?',
	"sub_description" varchar DEFAULT 'Join the Chennai Trivia community.',
	"align" "enum__pages_v_blocks_chenz_ready_to_play_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_chenz_ready_to_play_font_weight",
	"transform" "enum__pages_v_blocks_chenz_ready_to_play_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_chenz_ready_to_play_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_chenz_ready_to_play_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_chenz_ready_to_play_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_chenz_ready_to_play_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_chenz_ready_to_play_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_chenz_ready_to_play_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_chenz_ready_to_play_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"eyebrow" varchar DEFAULT 'CHENZ QUIZ',
	"title" varchar DEFAULT 'Ready to Play Chenz Quiz?',
	"subtitle" varchar DEFAULT 'Think You Know Chennai?',
	"background_image_id" integer,
	"challenge_card_icon_id" integer,
	"challenge_card_title" varchar DEFAULT 'Ready to Take the Challenge?',
	"challenge_card_description" varchar DEFAULT 'Play the daily Chennai quiz, answer three questions and earn points. Build your score, maintain your streak and climb the leaderboard.',
	"challenge_card_schedule_label" varchar DEFAULT 'Daily Quiz',
	"challenge_card_schedule_time" varchar DEFAULT '7:00 AM - 11:00 PM',
	"challenge_card_button_text" varchar DEFAULT 'Play Today''s Quiz',
	"challenge_card_button_url" varchar DEFAULT '/quizzes',
	"challenge_card_bg_color" varchar DEFAULT '#FFE8F3',
	"challenge_card_accent_color" varchar DEFAULT '#F0157D',
	"reward_card_icon_id" integer,
	"reward_card_title" varchar DEFAULT 'Your Knowledge Deserves Rewards!',
	"reward_card_description" varchar DEFAULT 'Compete with fellow Chennai lovers and stand a chance to win a',
	"reward_card_voucher_image_id" integer,
	"reward_card_voucher_amount" varchar DEFAULT '₹300',
	"reward_card_voucher_label" varchar DEFAULT 'Daily Winner Voucher',
	"reward_card_button_text" varchar DEFAULT 'View Leaderboard',
	"reward_card_button_url" varchar DEFAULT '/leaderboard',
	"reward_card_bg_color" varchar DEFAULT '#EFE9FF',
	"reward_card_accent_color" varchar DEFAULT '#5B21F5',
	"align" "enum__pages_v_blocks_chenz_quiz_rewards_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_chenz_quiz_rewards_font_weight",
	"transform" "enum__pages_v_blocks_chenz_quiz_rewards_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_chenz_quiz_rewards_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_chenz_quiz_rewards_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_chenz_quiz_rewards_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_chenz_quiz_rewards_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_chenz_quiz_rewards_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_chenz_quiz_rewards_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_chenz_quiz_rewards_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_faq_faqs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"question" varchar,
	"answer" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_faq_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_faq" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"seo_h1" varchar,
	"section_bg_image_id" integer,
	"eyebrow" varchar DEFAULT 'FAQ',
	"heading" varchar DEFAULT 'Frequently Asked Questions',
	"description" varchar DEFAULT 'Find answers to common questions about stories, features, submissions, and events on Let’s Talk Chennai.',
	"allow_multiple_open" boolean DEFAULT false,
	"cta_text" varchar DEFAULT 'Have more questions? Contact our team',
	"cta_url" varchar,
	"align" "enum__pages_v_blocks_chenz_faq_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_chenz_faq_font_weight",
	"transform" "enum__pages_v_blocks_chenz_faq_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_chenz_faq_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_chenz_faq_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_chenz_faq_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_chenz_faq_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_chenz_faq_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_chenz_faq_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_chenz_faq_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_reels" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"subtitle" varchar DEFAULT '@chenzquiz',
	"thumbnail_id" integer,
	"redirect_url" varchar DEFAULT 'https://instagram.com',
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"top_badge" varchar DEFAULT 'INSTAGRAM REELS',
	"main_heading" varchar DEFAULT 'Watch & Explore Our',
	"highlight_text" varchar DEFAULT 'Reels',
	"sub_description" varchar DEFAULT 'Check out our latest trending Instagram reels and stories below!',
	"align" "enum__pages_v_blocks_chenz_insta_reels_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_chenz_insta_reels_font_weight",
	"transform" "enum__pages_v_blocks_chenz_insta_reels_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_chenz_insta_reels_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_chenz_insta_reels_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_chenz_insta_reels_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_chenz_insta_reels_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_chenz_insta_reels_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_chenz_insta_reels_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_chenz_insta_reels_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"eyebrow" varchar DEFAULT 'Creative Studio // 2026',
	"heading" varchar DEFAULT 'NOTHING',
	"subtitle" varchar DEFAULT 'Exploring the intersection of brutalist typography and fluid motion.',
	"cta_label" varchar DEFAULT 'Book a Call',
	"cta_url" varchar DEFAULT '/contact',
	"image_id" integer,
	"image_alt" varchar DEFAULT 'Hero Visual',
	"image_scale" "enum__pages_v_blocks_chenz_creative_hero_image_scale" DEFAULT '1',
	"image_rotation" "enum__pages_v_blocks_chenz_creative_hero_image_rotation" DEFAULT 'rotate-0',
	"background_color" varchar DEFAULT '#ffffff',
	"text_color" varchar DEFAULT '#0f172a',
	"interaction_enabled" boolean DEFAULT true,
	"animation_intensity" "enum__pages_v_blocks_chenz_creative_hero_animation_intensity" DEFAULT 'medium',
	"footer_text" varchar DEFAULT 'Paris / Tokyo / Remote',
	"align" "enum__pages_v_blocks_chenz_creative_hero_align" DEFAULT 'inherit',
	"max_width" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_chenz_creative_hero_font_weight",
	"transform" "enum__pages_v_blocks_chenz_creative_hero_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_chenz_creative_hero_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_chenz_creative_hero_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_chenz_creative_hero_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_chenz_creative_hero_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_chenz_creative_hero_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_chenz_creative_hero_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_chenz_creative_hero_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_builder_row_columns_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_builder_row_columns" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"width" "enum__pages_v_blocks_builder_row_columns_width" DEFAULT '1/1',
	"valign" "enum__pages_v_blocks_builder_row_columns_valign" DEFAULT 'inherit',
	"link_url" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_builder_row_columns_font_weight",
	"transform" "enum__pages_v_blocks_builder_row_columns_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_builder_row_columns_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_builder_row_columns_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_builder_row_columns_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_builder_row_columns_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_builder_row_columns_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_builder_row_columns_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_builder_row_columns_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_builder_row_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_builder_row" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"gap" "enum__pages_v_blocks_builder_row_gap" DEFAULT 'md',
	"valign" "enum__pages_v_blocks_builder_row_valign" DEFAULT 'start',
	"justify" "enum__pages_v_blocks_builder_row_justify" DEFAULT 'start',
	"wrap" boolean DEFAULT true,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_builder_row_font_weight",
	"transform" "enum__pages_v_blocks_builder_row_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_builder_row_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_builder_row_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_builder_row_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_builder_row_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_builder_row_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_builder_row_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_builder_row_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_builder_section_attrs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v_blocks_builder_section" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"tag" "enum__pages_v_blocks_builder_section_tag" DEFAULT 'section',
	"width_mode" "enum__pages_v_blocks_builder_section_width_mode" DEFAULT 'contained',
	"height" "enum__pages_v_blocks_builder_section_height" DEFAULT 'auto',
	"min_height" varchar,
	"space_pt" varchar,
	"space_pr" varchar,
	"space_pb" varchar,
	"space_pl" varchar,
	"space_mt" varchar,
	"space_mb" varchar,
	"space_md_pt" varchar,
	"space_md_pr" varchar,
	"space_md_pb" varchar,
	"space_md_pl" varchar,
	"space_md_mt" varchar,
	"space_md_mb" varchar,
	"space_sm_pt" varchar,
	"space_sm_pr" varchar,
	"space_sm_pb" varchar,
	"space_sm_pl" varchar,
	"space_sm_mt" varchar,
	"space_sm_mb" varchar,
	"color" varchar,
	"font_size" varchar,
	"line_height" varchar,
	"font_weight" "enum__pages_v_blocks_builder_section_font_weight",
	"transform" "enum__pages_v_blocks_builder_section_transform",
	"letter_spacing" varchar,
	"bw" varchar,
	"bc" varchar,
	"br" varchar,
	"bs" varchar,
	"bg_type" "enum__pages_v_blocks_builder_section_bg_type" DEFAULT 'none',
	"bg_color" varchar,
	"bg_g_from" varchar,
	"bg_g_to" varchar,
	"bg_g_angle" numeric,
	"bg_image_id" integer,
	"bg_pos" "enum__pages_v_blocks_builder_section_bg_pos" DEFAULT 'center-center',
	"bg_fit" "enum__pages_v_blocks_builder_section_bg_fit" DEFAULT 'cover',
	"bg_repeat" "enum__pages_v_blocks_builder_section_bg_repeat" DEFAULT 'no-repeat',
	"bg_attach" "enum__pages_v_blocks_builder_section_bg_attach" DEFAULT 'scroll',
	"bg_blend" "enum__pages_v_blocks_builder_section_bg_blend" DEFAULT 'normal',
	"bg_video_id" integer,
	"bg_poster_id" integer,
	"bg_overlay" varchar,
	"bg_overlay_opacity" numeric,
	"anim_preset" "enum__pages_v_blocks_builder_section_anim_preset" DEFAULT 'none',
	"anim_duration" numeric,
	"anim_delay" numeric,
	"anim_on_scroll" boolean DEFAULT true,
	"hide_desktop" boolean DEFAULT false,
	"hide_tablet" boolean DEFAULT false,
	"hide_mobile" boolean DEFAULT false,
	"css_class" varchar,
	"css_id" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

DO $$ BEGIN
  ALTER TABLE "pages_blocks_heading_attrs" ADD CONSTRAINT "pages_blocks_heading_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_rich_text_attrs" ADD CONSTRAINT "pages_blocks_rich_text_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_button_attrs" ADD CONSTRAINT "pages_blocks_button_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_button" ADD CONSTRAINT "pages_blocks_button_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_button" ADD CONSTRAINT "pages_blocks_button_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_button" ADD CONSTRAINT "pages_blocks_button_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_button" ADD CONSTRAINT "pages_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_image_attrs" ADD CONSTRAINT "pages_blocks_image_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_video_attrs" ADD CONSTRAINT "pages_blocks_video_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_divider_attrs" ADD CONSTRAINT "pages_blocks_divider_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_divider" ADD CONSTRAINT "pages_blocks_divider_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_divider" ADD CONSTRAINT "pages_blocks_divider_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_divider" ADD CONSTRAINT "pages_blocks_divider_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_divider" ADD CONSTRAINT "pages_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_spacer_attrs" ADD CONSTRAINT "pages_blocks_spacer_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_spacer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia_left_cards" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_left_cards_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia_left_cards" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_left_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_about_trivia"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia_right_cards" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_right_cards_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia_right_cards" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_right_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_about_trivia"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia_attrs" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_about_trivia"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_center_image_id_media_id_fk" FOREIGN KEY ("center_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_about_trivia" ADD CONSTRAINT "pages_blocks_chenz_about_trivia_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_how_it_works_steps" ADD CONSTRAINT "pages_blocks_chenz_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_how_it_works_attrs" ADD CONSTRAINT "pages_blocks_chenz_how_it_works_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_how_it_works" ADD CONSTRAINT "pages_blocks_chenz_how_it_works_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_how_it_works" ADD CONSTRAINT "pages_blocks_chenz_how_it_works_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_how_it_works" ADD CONSTRAINT "pages_blocks_chenz_how_it_works_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_how_it_works" ADD CONSTRAINT "pages_blocks_chenz_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_ready_to_play_cards" ADD CONSTRAINT "pages_blocks_chenz_ready_to_play_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_ready_to_play"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_ready_to_play_attrs" ADD CONSTRAINT "pages_blocks_chenz_ready_to_play_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_ready_to_play"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_ready_to_play" ADD CONSTRAINT "pages_blocks_chenz_ready_to_play_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_ready_to_play" ADD CONSTRAINT "pages_blocks_chenz_ready_to_play_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_ready_to_play" ADD CONSTRAINT "pages_blocks_chenz_ready_to_play_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_ready_to_play" ADD CONSTRAINT "pages_blocks_chenz_ready_to_play_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards_attrs" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_quiz_rewards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_challenge_card_icon_id_media_id_fk" FOREIGN KEY ("challenge_card_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_reward_card_icon_id_media_id_fk" FOREIGN KEY ("reward_card_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_reward_card_voucher_image_id_media_id_fk" FOREIGN KEY ("reward_card_voucher_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_quiz_rewards" ADD CONSTRAINT "pages_blocks_chenz_quiz_rewards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_faq_faqs" ADD CONSTRAINT "pages_blocks_chenz_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_faq"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_faq_attrs" ADD CONSTRAINT "pages_blocks_chenz_faq_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_faq"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_faq" ADD CONSTRAINT "pages_blocks_chenz_faq_section_bg_image_id_media_id_fk" FOREIGN KEY ("section_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_faq" ADD CONSTRAINT "pages_blocks_chenz_faq_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_faq" ADD CONSTRAINT "pages_blocks_chenz_faq_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_faq" ADD CONSTRAINT "pages_blocks_chenz_faq_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_faq" ADD CONSTRAINT "pages_blocks_chenz_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_insta_reels_reels" ADD CONSTRAINT "pages_blocks_chenz_insta_reels_reels_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_insta_reels_reels" ADD CONSTRAINT "pages_blocks_chenz_insta_reels_reels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_insta_reels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_insta_reels_attrs" ADD CONSTRAINT "pages_blocks_chenz_insta_reels_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_insta_reels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_insta_reels" ADD CONSTRAINT "pages_blocks_chenz_insta_reels_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_insta_reels" ADD CONSTRAINT "pages_blocks_chenz_insta_reels_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_insta_reels" ADD CONSTRAINT "pages_blocks_chenz_insta_reels_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_insta_reels" ADD CONSTRAINT "pages_blocks_chenz_insta_reels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_creative_hero_attrs" ADD CONSTRAINT "pages_blocks_chenz_creative_hero_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_chenz_creative_hero"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_creative_hero" ADD CONSTRAINT "pages_blocks_chenz_creative_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_creative_hero" ADD CONSTRAINT "pages_blocks_chenz_creative_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_creative_hero" ADD CONSTRAINT "pages_blocks_chenz_creative_hero_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_creative_hero" ADD CONSTRAINT "pages_blocks_chenz_creative_hero_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_chenz_creative_hero" ADD CONSTRAINT "pages_blocks_chenz_creative_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row_columns_attrs" ADD CONSTRAINT "pages_blocks_builder_row_columns_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_builder_row_columns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row_columns" ADD CONSTRAINT "pages_blocks_builder_row_columns_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row_columns" ADD CONSTRAINT "pages_blocks_builder_row_columns_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row_columns" ADD CONSTRAINT "pages_blocks_builder_row_columns_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row_columns" ADD CONSTRAINT "pages_blocks_builder_row_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_builder_row"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row_attrs" ADD CONSTRAINT "pages_blocks_builder_row_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_builder_row"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row" ADD CONSTRAINT "pages_blocks_builder_row_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row" ADD CONSTRAINT "pages_blocks_builder_row_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row" ADD CONSTRAINT "pages_blocks_builder_row_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_row" ADD CONSTRAINT "pages_blocks_builder_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_section_attrs" ADD CONSTRAINT "pages_blocks_builder_section_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_builder_section"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_section" ADD CONSTRAINT "pages_blocks_builder_section_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_section" ADD CONSTRAINT "pages_blocks_builder_section_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_section" ADD CONSTRAINT "pages_blocks_builder_section_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_blocks_builder_section" ADD CONSTRAINT "pages_blocks_builder_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_heading_attrs" ADD CONSTRAINT "_pages_v_blocks_heading_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_rich_text_attrs" ADD CONSTRAINT "_pages_v_blocks_rich_text_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_button_attrs" ADD CONSTRAINT "_pages_v_blocks_button_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_button" ADD CONSTRAINT "_pages_v_blocks_button_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_button" ADD CONSTRAINT "_pages_v_blocks_button_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_button" ADD CONSTRAINT "_pages_v_blocks_button_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_button" ADD CONSTRAINT "_pages_v_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image_attrs" ADD CONSTRAINT "_pages_v_blocks_image_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_video_attrs" ADD CONSTRAINT "_pages_v_blocks_video_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_divider_attrs" ADD CONSTRAINT "_pages_v_blocks_divider_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_divider" ADD CONSTRAINT "_pages_v_blocks_divider_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_divider" ADD CONSTRAINT "_pages_v_blocks_divider_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_divider" ADD CONSTRAINT "_pages_v_blocks_divider_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_divider" ADD CONSTRAINT "_pages_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_spacer_attrs" ADD CONSTRAINT "_pages_v_blocks_spacer_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_spacer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia_left_cards" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_left_cards_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia_left_cards" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_left_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_about_trivia"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia_right_cards" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_right_cards_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia_right_cards" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_right_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_about_trivia"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia_attrs" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_about_trivia"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_center_image_id_media_id_fk" FOREIGN KEY ("center_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_about_trivia" ADD CONSTRAINT "_pages_v_blocks_chenz_about_trivia_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_how_it_works_steps" ADD CONSTRAINT "_pages_v_blocks_chenz_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_how_it_works_attrs" ADD CONSTRAINT "_pages_v_blocks_chenz_how_it_works_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_how_it_works" ADD CONSTRAINT "_pages_v_blocks_chenz_how_it_works_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_how_it_works" ADD CONSTRAINT "_pages_v_blocks_chenz_how_it_works_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_how_it_works" ADD CONSTRAINT "_pages_v_blocks_chenz_how_it_works_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_how_it_works" ADD CONSTRAINT "_pages_v_blocks_chenz_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_ready_to_play_cards" ADD CONSTRAINT "_pages_v_blocks_chenz_ready_to_play_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_ready_to_play"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_ready_to_play_attrs" ADD CONSTRAINT "_pages_v_blocks_chenz_ready_to_play_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_ready_to_play"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_ready_to_play" ADD CONSTRAINT "_pages_v_blocks_chenz_ready_to_play_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_ready_to_play" ADD CONSTRAINT "_pages_v_blocks_chenz_ready_to_play_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_ready_to_play" ADD CONSTRAINT "_pages_v_blocks_chenz_ready_to_play_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_ready_to_play" ADD CONSTRAINT "_pages_v_blocks_chenz_ready_to_play_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards_attrs" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_quiz_rewards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_challenge_card_icon_id_media_id_fk" FOREIGN KEY ("challenge_card_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_reward_card_icon_id_media_id_fk" FOREIGN KEY ("reward_card_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_reward_card_voucher_image_id_media_id_fk" FOREIGN KEY ("reward_card_voucher_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_quiz_rewards" ADD CONSTRAINT "_pages_v_blocks_chenz_quiz_rewards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_faq_faqs" ADD CONSTRAINT "_pages_v_blocks_chenz_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_faq"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_faq_attrs" ADD CONSTRAINT "_pages_v_blocks_chenz_faq_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_faq"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_faq" ADD CONSTRAINT "_pages_v_blocks_chenz_faq_section_bg_image_id_media_id_fk" FOREIGN KEY ("section_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_faq" ADD CONSTRAINT "_pages_v_blocks_chenz_faq_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_faq" ADD CONSTRAINT "_pages_v_blocks_chenz_faq_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_faq" ADD CONSTRAINT "_pages_v_blocks_chenz_faq_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_faq" ADD CONSTRAINT "_pages_v_blocks_chenz_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_insta_reels_reels" ADD CONSTRAINT "_pages_v_blocks_chenz_insta_reels_reels_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_insta_reels_reels" ADD CONSTRAINT "_pages_v_blocks_chenz_insta_reels_reels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_insta_reels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_insta_reels_attrs" ADD CONSTRAINT "_pages_v_blocks_chenz_insta_reels_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_insta_reels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_insta_reels" ADD CONSTRAINT "_pages_v_blocks_chenz_insta_reels_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_insta_reels" ADD CONSTRAINT "_pages_v_blocks_chenz_insta_reels_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_insta_reels" ADD CONSTRAINT "_pages_v_blocks_chenz_insta_reels_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_insta_reels" ADD CONSTRAINT "_pages_v_blocks_chenz_insta_reels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_creative_hero_attrs" ADD CONSTRAINT "_pages_v_blocks_chenz_creative_hero_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_chenz_creative_hero"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_creative_hero" ADD CONSTRAINT "_pages_v_blocks_chenz_creative_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_creative_hero" ADD CONSTRAINT "_pages_v_blocks_chenz_creative_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_creative_hero" ADD CONSTRAINT "_pages_v_blocks_chenz_creative_hero_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_creative_hero" ADD CONSTRAINT "_pages_v_blocks_chenz_creative_hero_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_chenz_creative_hero" ADD CONSTRAINT "_pages_v_blocks_chenz_creative_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row_columns_attrs" ADD CONSTRAINT "_pages_v_blocks_builder_row_columns_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_builder_row_columns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row_columns" ADD CONSTRAINT "_pages_v_blocks_builder_row_columns_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row_columns" ADD CONSTRAINT "_pages_v_blocks_builder_row_columns_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row_columns" ADD CONSTRAINT "_pages_v_blocks_builder_row_columns_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row_columns" ADD CONSTRAINT "_pages_v_blocks_builder_row_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_builder_row"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row_attrs" ADD CONSTRAINT "_pages_v_blocks_builder_row_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_builder_row"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row" ADD CONSTRAINT "_pages_v_blocks_builder_row_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row" ADD CONSTRAINT "_pages_v_blocks_builder_row_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row" ADD CONSTRAINT "_pages_v_blocks_builder_row_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_row" ADD CONSTRAINT "_pages_v_blocks_builder_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_section_attrs" ADD CONSTRAINT "_pages_v_blocks_builder_section_attrs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_builder_section"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_section" ADD CONSTRAINT "_pages_v_blocks_builder_section_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_section" ADD CONSTRAINT "_pages_v_blocks_builder_section_bg_video_id_media_id_fk" FOREIGN KEY ("bg_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_section" ADD CONSTRAINT "_pages_v_blocks_builder_section_bg_poster_id_media_id_fk" FOREIGN KEY ("bg_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_builder_section" ADD CONSTRAINT "_pages_v_blocks_builder_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "pages_blocks_heading_attrs_order_idx" ON "pages_blocks_heading_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_heading_attrs_parent_id_idx" ON "pages_blocks_heading_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_heading_order_idx" ON "pages_blocks_heading" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_heading_parent_id_idx" ON "pages_blocks_heading" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_heading_path_idx" ON "pages_blocks_heading" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_heading_bg_bg_image_idx" ON "pages_blocks_heading" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_heading_bg_bg_video_idx" ON "pages_blocks_heading" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_heading_bg_bg_poster_idx" ON "pages_blocks_heading" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_attrs_order_idx" ON "pages_blocks_rich_text_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_attrs_parent_id_idx" ON "pages_blocks_rich_text_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_bg_bg_image_idx" ON "pages_blocks_rich_text" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_bg_bg_video_idx" ON "pages_blocks_rich_text" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_bg_bg_poster_idx" ON "pages_blocks_rich_text" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_button_attrs_order_idx" ON "pages_blocks_button_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_button_attrs_parent_id_idx" ON "pages_blocks_button_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_button_order_idx" ON "pages_blocks_button" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_button_parent_id_idx" ON "pages_blocks_button" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_button_path_idx" ON "pages_blocks_button" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_button_bg_bg_image_idx" ON "pages_blocks_button" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_button_bg_bg_video_idx" ON "pages_blocks_button" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_button_bg_bg_poster_idx" ON "pages_blocks_button" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_attrs_order_idx" ON "pages_blocks_image_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_attrs_parent_id_idx" ON "pages_blocks_image_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_bg_bg_image_idx" ON "pages_blocks_image" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_bg_bg_video_idx" ON "pages_blocks_image" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_image_bg_bg_poster_idx" ON "pages_blocks_image" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_attrs_order_idx" ON "pages_blocks_video_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_attrs_parent_id_idx" ON "pages_blocks_video_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_file_idx" ON "pages_blocks_video" USING btree ("file_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_poster_idx" ON "pages_blocks_video" USING btree ("poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_bg_bg_image_idx" ON "pages_blocks_video" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_bg_bg_video_idx" ON "pages_blocks_video" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_video_bg_bg_poster_idx" ON "pages_blocks_video" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_divider_attrs_order_idx" ON "pages_blocks_divider_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_divider_attrs_parent_id_idx" ON "pages_blocks_divider_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_divider_order_idx" ON "pages_blocks_divider" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_divider_parent_id_idx" ON "pages_blocks_divider" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_divider_path_idx" ON "pages_blocks_divider" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_divider_bg_bg_image_idx" ON "pages_blocks_divider" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_divider_bg_bg_video_idx" ON "pages_blocks_divider" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_divider_bg_bg_poster_idx" ON "pages_blocks_divider" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_attrs_order_idx" ON "pages_blocks_spacer_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_attrs_parent_id_idx" ON "pages_blocks_spacer_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_bg_bg_image_idx" ON "pages_blocks_spacer" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_bg_bg_video_idx" ON "pages_blocks_spacer" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_bg_bg_poster_idx" ON "pages_blocks_spacer" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_left_cards_order_idx" ON "pages_blocks_chenz_about_trivia_left_cards" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_left_cards_parent_id_idx" ON "pages_blocks_chenz_about_trivia_left_cards" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_left_cards_custom_icon_idx" ON "pages_blocks_chenz_about_trivia_left_cards" USING btree ("custom_icon_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_right_cards_order_idx" ON "pages_blocks_chenz_about_trivia_right_cards" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_right_cards_parent_id_idx" ON "pages_blocks_chenz_about_trivia_right_cards" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_right_cards_custom_icon_idx" ON "pages_blocks_chenz_about_trivia_right_cards" USING btree ("custom_icon_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_attrs_order_idx" ON "pages_blocks_chenz_about_trivia_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_attrs_parent_id_idx" ON "pages_blocks_chenz_about_trivia_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_order_idx" ON "pages_blocks_chenz_about_trivia" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_parent_id_idx" ON "pages_blocks_chenz_about_trivia" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_path_idx" ON "pages_blocks_chenz_about_trivia" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_center_image_idx" ON "pages_blocks_chenz_about_trivia" USING btree ("center_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_bg_bg_image_idx" ON "pages_blocks_chenz_about_trivia" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_bg_bg_video_idx" ON "pages_blocks_chenz_about_trivia" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_about_trivia_bg_bg_poster_idx" ON "pages_blocks_chenz_about_trivia" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_steps_order_idx" ON "pages_blocks_chenz_how_it_works_steps" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_steps_parent_id_idx" ON "pages_blocks_chenz_how_it_works_steps" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_attrs_order_idx" ON "pages_blocks_chenz_how_it_works_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_attrs_parent_id_idx" ON "pages_blocks_chenz_how_it_works_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_order_idx" ON "pages_blocks_chenz_how_it_works" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_parent_id_idx" ON "pages_blocks_chenz_how_it_works" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_path_idx" ON "pages_blocks_chenz_how_it_works" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_bg_bg_image_idx" ON "pages_blocks_chenz_how_it_works" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_bg_bg_video_idx" ON "pages_blocks_chenz_how_it_works" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_how_it_works_bg_bg_poster_idx" ON "pages_blocks_chenz_how_it_works" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_cards_order_idx" ON "pages_blocks_chenz_ready_to_play_cards" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_cards_parent_id_idx" ON "pages_blocks_chenz_ready_to_play_cards" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_attrs_order_idx" ON "pages_blocks_chenz_ready_to_play_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_attrs_parent_id_idx" ON "pages_blocks_chenz_ready_to_play_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_order_idx" ON "pages_blocks_chenz_ready_to_play" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_parent_id_idx" ON "pages_blocks_chenz_ready_to_play" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_path_idx" ON "pages_blocks_chenz_ready_to_play" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_bg_bg_image_idx" ON "pages_blocks_chenz_ready_to_play" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_bg_bg_video_idx" ON "pages_blocks_chenz_ready_to_play" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_ready_to_play_bg_bg_poster_idx" ON "pages_blocks_chenz_ready_to_play" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_attrs_order_idx" ON "pages_blocks_chenz_quiz_rewards_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_attrs_parent_id_idx" ON "pages_blocks_chenz_quiz_rewards_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_order_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_parent_id_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_path_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_background_image_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("background_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_challenge_card_challenge_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("challenge_card_icon_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_reward_card_reward_card__idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("reward_card_icon_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_reward_card_reward_car_1_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("reward_card_voucher_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_bg_bg_image_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_bg_bg_video_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_quiz_rewards_bg_bg_poster_idx" ON "pages_blocks_chenz_quiz_rewards" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_faqs_order_idx" ON "pages_blocks_chenz_faq_faqs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_faqs_parent_id_idx" ON "pages_blocks_chenz_faq_faqs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_attrs_order_idx" ON "pages_blocks_chenz_faq_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_attrs_parent_id_idx" ON "pages_blocks_chenz_faq_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_order_idx" ON "pages_blocks_chenz_faq" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_parent_id_idx" ON "pages_blocks_chenz_faq" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_path_idx" ON "pages_blocks_chenz_faq" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_section_bg_image_idx" ON "pages_blocks_chenz_faq" USING btree ("section_bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_bg_bg_image_idx" ON "pages_blocks_chenz_faq" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_bg_bg_video_idx" ON "pages_blocks_chenz_faq" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_faq_bg_bg_poster_idx" ON "pages_blocks_chenz_faq" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_reels_order_idx" ON "pages_blocks_chenz_insta_reels_reels" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_reels_parent_id_idx" ON "pages_blocks_chenz_insta_reels_reels" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_reels_thumbnail_idx" ON "pages_blocks_chenz_insta_reels_reels" USING btree ("thumbnail_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_attrs_order_idx" ON "pages_blocks_chenz_insta_reels_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_attrs_parent_id_idx" ON "pages_blocks_chenz_insta_reels_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_order_idx" ON "pages_blocks_chenz_insta_reels" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_parent_id_idx" ON "pages_blocks_chenz_insta_reels" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_path_idx" ON "pages_blocks_chenz_insta_reels" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_bg_bg_image_idx" ON "pages_blocks_chenz_insta_reels" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_bg_bg_video_idx" ON "pages_blocks_chenz_insta_reels" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_insta_reels_bg_bg_poster_idx" ON "pages_blocks_chenz_insta_reels" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_attrs_order_idx" ON "pages_blocks_chenz_creative_hero_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_attrs_parent_id_idx" ON "pages_blocks_chenz_creative_hero_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_order_idx" ON "pages_blocks_chenz_creative_hero" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_parent_id_idx" ON "pages_blocks_chenz_creative_hero" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_path_idx" ON "pages_blocks_chenz_creative_hero" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_image_idx" ON "pages_blocks_chenz_creative_hero" USING btree ("image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_bg_bg_image_idx" ON "pages_blocks_chenz_creative_hero" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_bg_bg_video_idx" ON "pages_blocks_chenz_creative_hero" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_chenz_creative_hero_bg_bg_poster_idx" ON "pages_blocks_chenz_creative_hero" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_columns_attrs_order_idx" ON "pages_blocks_builder_row_columns_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_columns_attrs_parent_id_idx" ON "pages_blocks_builder_row_columns_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_columns_order_idx" ON "pages_blocks_builder_row_columns" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_columns_parent_id_idx" ON "pages_blocks_builder_row_columns" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_columns_bg_bg_image_idx" ON "pages_blocks_builder_row_columns" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_columns_bg_bg_video_idx" ON "pages_blocks_builder_row_columns" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_columns_bg_bg_poster_idx" ON "pages_blocks_builder_row_columns" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_attrs_order_idx" ON "pages_blocks_builder_row_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_attrs_parent_id_idx" ON "pages_blocks_builder_row_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_order_idx" ON "pages_blocks_builder_row" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_parent_id_idx" ON "pages_blocks_builder_row" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_path_idx" ON "pages_blocks_builder_row" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_bg_bg_image_idx" ON "pages_blocks_builder_row" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_bg_bg_video_idx" ON "pages_blocks_builder_row" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_row_bg_bg_poster_idx" ON "pages_blocks_builder_row" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_section_attrs_order_idx" ON "pages_blocks_builder_section_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_section_attrs_parent_id_idx" ON "pages_blocks_builder_section_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_section_order_idx" ON "pages_blocks_builder_section" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_section_parent_id_idx" ON "pages_blocks_builder_section" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_section_path_idx" ON "pages_blocks_builder_section" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_section_bg_bg_image_idx" ON "pages_blocks_builder_section" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_section_bg_bg_video_idx" ON "pages_blocks_builder_section" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "pages_blocks_builder_section_bg_bg_poster_idx" ON "pages_blocks_builder_section" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_attrs_order_idx" ON "_pages_v_blocks_heading_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_attrs_parent_id_idx" ON "_pages_v_blocks_heading_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_order_idx" ON "_pages_v_blocks_heading" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_parent_id_idx" ON "_pages_v_blocks_heading" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_path_idx" ON "_pages_v_blocks_heading" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_bg_bg_image_idx" ON "_pages_v_blocks_heading" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_bg_bg_video_idx" ON "_pages_v_blocks_heading" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_bg_bg_poster_idx" ON "_pages_v_blocks_heading" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_attrs_order_idx" ON "_pages_v_blocks_rich_text_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_attrs_parent_id_idx" ON "_pages_v_blocks_rich_text_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_bg_bg_image_idx" ON "_pages_v_blocks_rich_text" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_bg_bg_video_idx" ON "_pages_v_blocks_rich_text" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_bg_bg_poster_idx" ON "_pages_v_blocks_rich_text" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_attrs_order_idx" ON "_pages_v_blocks_button_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_attrs_parent_id_idx" ON "_pages_v_blocks_button_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_order_idx" ON "_pages_v_blocks_button" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_parent_id_idx" ON "_pages_v_blocks_button" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_path_idx" ON "_pages_v_blocks_button" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_bg_bg_image_idx" ON "_pages_v_blocks_button" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_bg_bg_video_idx" ON "_pages_v_blocks_button" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_bg_bg_poster_idx" ON "_pages_v_blocks_button" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_attrs_order_idx" ON "_pages_v_blocks_image_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_attrs_parent_id_idx" ON "_pages_v_blocks_image_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_bg_bg_image_idx" ON "_pages_v_blocks_image" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_bg_bg_video_idx" ON "_pages_v_blocks_image" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_bg_bg_poster_idx" ON "_pages_v_blocks_image" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_attrs_order_idx" ON "_pages_v_blocks_video_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_attrs_parent_id_idx" ON "_pages_v_blocks_video_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_file_idx" ON "_pages_v_blocks_video" USING btree ("file_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_poster_idx" ON "_pages_v_blocks_video" USING btree ("poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_bg_bg_image_idx" ON "_pages_v_blocks_video" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_bg_bg_video_idx" ON "_pages_v_blocks_video" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_bg_bg_poster_idx" ON "_pages_v_blocks_video" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_attrs_order_idx" ON "_pages_v_blocks_divider_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_attrs_parent_id_idx" ON "_pages_v_blocks_divider_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_order_idx" ON "_pages_v_blocks_divider" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_parent_id_idx" ON "_pages_v_blocks_divider" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_path_idx" ON "_pages_v_blocks_divider" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_bg_bg_image_idx" ON "_pages_v_blocks_divider" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_bg_bg_video_idx" ON "_pages_v_blocks_divider" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_bg_bg_poster_idx" ON "_pages_v_blocks_divider" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_attrs_order_idx" ON "_pages_v_blocks_spacer_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_attrs_parent_id_idx" ON "_pages_v_blocks_spacer_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_bg_bg_image_idx" ON "_pages_v_blocks_spacer" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_bg_bg_video_idx" ON "_pages_v_blocks_spacer" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_bg_bg_poster_idx" ON "_pages_v_blocks_spacer" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_left_cards_order_idx" ON "_pages_v_blocks_chenz_about_trivia_left_cards" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_left_cards_parent_id_idx" ON "_pages_v_blocks_chenz_about_trivia_left_cards" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_left_cards_custom_ico_idx" ON "_pages_v_blocks_chenz_about_trivia_left_cards" USING btree ("custom_icon_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_right_cards_order_idx" ON "_pages_v_blocks_chenz_about_trivia_right_cards" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_right_cards_parent_id_idx" ON "_pages_v_blocks_chenz_about_trivia_right_cards" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_right_cards_custom_ic_idx" ON "_pages_v_blocks_chenz_about_trivia_right_cards" USING btree ("custom_icon_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_attrs_order_idx" ON "_pages_v_blocks_chenz_about_trivia_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_attrs_parent_id_idx" ON "_pages_v_blocks_chenz_about_trivia_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_order_idx" ON "_pages_v_blocks_chenz_about_trivia" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_parent_id_idx" ON "_pages_v_blocks_chenz_about_trivia" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_path_idx" ON "_pages_v_blocks_chenz_about_trivia" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_center_image_idx" ON "_pages_v_blocks_chenz_about_trivia" USING btree ("center_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_bg_bg_image_idx" ON "_pages_v_blocks_chenz_about_trivia" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_bg_bg_video_idx" ON "_pages_v_blocks_chenz_about_trivia" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_about_trivia_bg_bg_poster_idx" ON "_pages_v_blocks_chenz_about_trivia" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_steps_order_idx" ON "_pages_v_blocks_chenz_how_it_works_steps" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_steps_parent_id_idx" ON "_pages_v_blocks_chenz_how_it_works_steps" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_attrs_order_idx" ON "_pages_v_blocks_chenz_how_it_works_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_attrs_parent_id_idx" ON "_pages_v_blocks_chenz_how_it_works_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_order_idx" ON "_pages_v_blocks_chenz_how_it_works" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_parent_id_idx" ON "_pages_v_blocks_chenz_how_it_works" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_path_idx" ON "_pages_v_blocks_chenz_how_it_works" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_bg_bg_image_idx" ON "_pages_v_blocks_chenz_how_it_works" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_bg_bg_video_idx" ON "_pages_v_blocks_chenz_how_it_works" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_how_it_works_bg_bg_poster_idx" ON "_pages_v_blocks_chenz_how_it_works" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_cards_order_idx" ON "_pages_v_blocks_chenz_ready_to_play_cards" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_cards_parent_id_idx" ON "_pages_v_blocks_chenz_ready_to_play_cards" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_attrs_order_idx" ON "_pages_v_blocks_chenz_ready_to_play_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_attrs_parent_id_idx" ON "_pages_v_blocks_chenz_ready_to_play_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_order_idx" ON "_pages_v_blocks_chenz_ready_to_play" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_parent_id_idx" ON "_pages_v_blocks_chenz_ready_to_play" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_path_idx" ON "_pages_v_blocks_chenz_ready_to_play" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_bg_bg_image_idx" ON "_pages_v_blocks_chenz_ready_to_play" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_bg_bg_video_idx" ON "_pages_v_blocks_chenz_ready_to_play" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_ready_to_play_bg_bg_poster_idx" ON "_pages_v_blocks_chenz_ready_to_play" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_attrs_order_idx" ON "_pages_v_blocks_chenz_quiz_rewards_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_attrs_parent_id_idx" ON "_pages_v_blocks_chenz_quiz_rewards_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_order_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_parent_id_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_path_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_background_image_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("background_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_challenge_card_challe_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("challenge_card_icon_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_reward_card_reward_ca_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("reward_card_icon_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_reward_card_reward__1_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("reward_card_voucher_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_bg_bg_image_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_bg_bg_video_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_quiz_rewards_bg_bg_poster_idx" ON "_pages_v_blocks_chenz_quiz_rewards" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_faqs_order_idx" ON "_pages_v_blocks_chenz_faq_faqs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_faqs_parent_id_idx" ON "_pages_v_blocks_chenz_faq_faqs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_attrs_order_idx" ON "_pages_v_blocks_chenz_faq_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_attrs_parent_id_idx" ON "_pages_v_blocks_chenz_faq_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_order_idx" ON "_pages_v_blocks_chenz_faq" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_parent_id_idx" ON "_pages_v_blocks_chenz_faq" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_path_idx" ON "_pages_v_blocks_chenz_faq" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_section_bg_image_idx" ON "_pages_v_blocks_chenz_faq" USING btree ("section_bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_bg_bg_image_idx" ON "_pages_v_blocks_chenz_faq" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_bg_bg_video_idx" ON "_pages_v_blocks_chenz_faq" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_faq_bg_bg_poster_idx" ON "_pages_v_blocks_chenz_faq" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_reels_order_idx" ON "_pages_v_blocks_chenz_insta_reels_reels" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_reels_parent_id_idx" ON "_pages_v_blocks_chenz_insta_reels_reels" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_reels_thumbnail_idx" ON "_pages_v_blocks_chenz_insta_reels_reels" USING btree ("thumbnail_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_attrs_order_idx" ON "_pages_v_blocks_chenz_insta_reels_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_attrs_parent_id_idx" ON "_pages_v_blocks_chenz_insta_reels_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_order_idx" ON "_pages_v_blocks_chenz_insta_reels" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_parent_id_idx" ON "_pages_v_blocks_chenz_insta_reels" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_path_idx" ON "_pages_v_blocks_chenz_insta_reels" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_bg_bg_image_idx" ON "_pages_v_blocks_chenz_insta_reels" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_bg_bg_video_idx" ON "_pages_v_blocks_chenz_insta_reels" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_insta_reels_bg_bg_poster_idx" ON "_pages_v_blocks_chenz_insta_reels" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_attrs_order_idx" ON "_pages_v_blocks_chenz_creative_hero_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_attrs_parent_id_idx" ON "_pages_v_blocks_chenz_creative_hero_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_order_idx" ON "_pages_v_blocks_chenz_creative_hero" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_parent_id_idx" ON "_pages_v_blocks_chenz_creative_hero" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_path_idx" ON "_pages_v_blocks_chenz_creative_hero" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_image_idx" ON "_pages_v_blocks_chenz_creative_hero" USING btree ("image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_bg_bg_image_idx" ON "_pages_v_blocks_chenz_creative_hero" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_bg_bg_video_idx" ON "_pages_v_blocks_chenz_creative_hero" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_chenz_creative_hero_bg_bg_poster_idx" ON "_pages_v_blocks_chenz_creative_hero" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_columns_attrs_order_idx" ON "_pages_v_blocks_builder_row_columns_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_columns_attrs_parent_id_idx" ON "_pages_v_blocks_builder_row_columns_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_columns_order_idx" ON "_pages_v_blocks_builder_row_columns" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_columns_parent_id_idx" ON "_pages_v_blocks_builder_row_columns" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_columns_bg_bg_image_idx" ON "_pages_v_blocks_builder_row_columns" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_columns_bg_bg_video_idx" ON "_pages_v_blocks_builder_row_columns" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_columns_bg_bg_poster_idx" ON "_pages_v_blocks_builder_row_columns" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_attrs_order_idx" ON "_pages_v_blocks_builder_row_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_attrs_parent_id_idx" ON "_pages_v_blocks_builder_row_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_order_idx" ON "_pages_v_blocks_builder_row" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_parent_id_idx" ON "_pages_v_blocks_builder_row" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_path_idx" ON "_pages_v_blocks_builder_row" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_bg_bg_image_idx" ON "_pages_v_blocks_builder_row" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_bg_bg_video_idx" ON "_pages_v_blocks_builder_row" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_row_bg_bg_poster_idx" ON "_pages_v_blocks_builder_row" USING btree ("bg_poster_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_section_attrs_order_idx" ON "_pages_v_blocks_builder_section_attrs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_section_attrs_parent_id_idx" ON "_pages_v_blocks_builder_section_attrs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_section_order_idx" ON "_pages_v_blocks_builder_section" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_section_parent_id_idx" ON "_pages_v_blocks_builder_section" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_section_path_idx" ON "_pages_v_blocks_builder_section" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_section_bg_bg_image_idx" ON "_pages_v_blocks_builder_section" USING btree ("bg_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_section_bg_bg_video_idx" ON "_pages_v_blocks_builder_section" USING btree ("bg_video_id");

CREATE INDEX IF NOT EXISTS "_pages_v_blocks_builder_section_bg_bg_poster_idx" ON "_pages_v_blocks_builder_section" USING btree ("bg_poster_id");
