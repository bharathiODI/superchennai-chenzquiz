-- Full database schema as of migration 006, for an EMPTY database (a new machine).
-- scripts/db-migrate.mjs runs this only when the database has no tables yet, then marks
-- migrations 001-006 as applied; newer migrations run on top as usual.
-- Generated from the Payload/Drizzle schema (empty -> current). Do not edit by hand: regenerate
-- it (and rename to schema-after-NNN.sql) whenever a new migration changes the schema.

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

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
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'Defult');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
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

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'Defult');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_posts_blog_category" AS ENUM('technology', 'health', 'travel', 'education', 'finance', 'business', 'lifestyle', 'food', 'fitness', 'parenting', 'personal-development', 'fashion', 'beauty', 'gaming', 'entertainment', 'culture', 'politics', 'science', 'environment', 'real-estate', 'career', 'news', 'photography', 'spirituality', 'writing', 'diy', 'pets', 'automotive', 'home-garden', 'productivity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__posts_v_version_blog_category" AS ENUM('technology', 'health', 'travel', 'education', 'finance', 'business', 'lifestyle', 'food', 'fitness', 'parenting', 'personal-development', 'fashion', 'beauty', 'gaming', 'entertainment', 'culture', 'politics', 'science', 'environment', 'real-estate', 'career', 'news', 'photography', 'spirituality', 'writing', 'diy', 'pets', 'automotive', 'home-garden', 'productivity');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'client', 'user');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_quizzes_status" AS ENUM('draft', 'active', 'completed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_questions_game_type" AS ENUM('mcq', 'dropdown', 'wordle', 'word_finder', 'match_following', 'spot_lie', 'reorder', 'drag_drop');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_questions_category" AS ENUM('chennai', 'gk', 'science', 'geography');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_questions_drag_drop_group_drag_mode" AS ENUM('categories', 'sentence');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_questions_difficulty" AS ENUM('Easy', 'Medium', 'Hard');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_questions_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__questions_v_version_game_type" AS ENUM('mcq', 'dropdown', 'wordle', 'word_finder', 'match_following', 'spot_lie', 'reorder', 'drag_drop');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__questions_v_version_category" AS ENUM('chennai', 'gk', 'science', 'geography');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__questions_v_version_drag_drop_group_drag_mode" AS ENUM('categories', 'sentence');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__questions_v_version_difficulty" AS ENUM('Easy', 'Medium', 'Hard');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum__questions_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_quiz_rounds_status" AS ENUM('assigned', 'completed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_quiz_site_settings_leaderboard_default_tab" AS ENUM('daily', 'weekly', 'monthly', 'all');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "pages_hero_links" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
	"link_new_tab" boolean,
	"link_url" varchar,
	"link_label" varchar,
	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
);

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

CREATE TABLE IF NOT EXISTS "pages_meta_seo_keywords" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"keyword" varchar
);

CREATE TABLE IF NOT EXISTS "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"hero_type" "enum_pages_hero_type" DEFAULT 'Defult',
	"hero_heading" varchar,
	"hero_image_id" integer,
	"hero_mobile_image_id" integer,
	"hero_enable_hero" boolean DEFAULT true,
	"content" jsonb,
	"meta_title" varchar,
	"meta_image_id" integer,
	"meta_description" varchar,
	"meta_schema" jsonb,
	"meta_seo_title" varchar,
	"meta_seo_description" varchar,
	"meta_seo_canonical_u_r_l" varchar,
	"meta_seo_og_image_id" integer,
	"meta_seo_structured_data" jsonb,
	"published_at" timestamp(3) with time zone,
	"slug" varchar,
	"slug_lock" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_pages_status" DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS "pages_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"posts_id" integer
);

CREATE TABLE IF NOT EXISTS "_pages_v_version_hero_links" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
	"link_new_tab" boolean,
	"link_url" varchar,
	"link_label" varchar,
	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
	"_uuid" varchar
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

CREATE TABLE IF NOT EXISTS "_pages_v_version_meta_seo_keywords" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"keyword" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'Defult',
	"version_hero_heading" varchar,
	"version_hero_image_id" integer,
	"version_hero_mobile_image_id" integer,
	"version_hero_enable_hero" boolean DEFAULT true,
	"version_content" jsonb,
	"version_meta_title" varchar,
	"version_meta_image_id" integer,
	"version_meta_description" varchar,
	"version_meta_schema" jsonb,
	"version_meta_seo_title" varchar,
	"version_meta_seo_description" varchar,
	"version_meta_seo_canonical_u_r_l" varchar,
	"version_meta_seo_og_image_id" integer,
	"version_meta_seo_structured_data" jsonb,
	"version_published_at" timestamp(3) with time zone,
	"version_slug" varchar,
	"version_slug_lock" boolean DEFAULT true,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
);

CREATE TABLE IF NOT EXISTS "_pages_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"posts_id" integer
);

CREATE TABLE IF NOT EXISTS "posts_populated_authors" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"hero_image_id" integer,
	"content" jsonb,
	"meta_title" varchar,
	"meta_image_id" integer,
	"meta_description" varchar,
	"views" numeric DEFAULT 0,
	"likes" numeric DEFAULT 0,
	"published_at" timestamp(3) with time zone,
	"blog_category" "enum_posts_blog_category",
	"slug" varchar,
	"slug_lock" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_posts_status" DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS "posts_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"posts_id" integer,
	"users_id" integer
);

CREATE TABLE IF NOT EXISTS "_posts_v_version_populated_authors" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_uuid" varchar,
	"name" varchar
);

CREATE TABLE IF NOT EXISTS "_posts_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_hero_image_id" integer,
	"version_content" jsonb,
	"version_meta_title" varchar,
	"version_meta_image_id" integer,
	"version_meta_description" varchar,
	"version_views" numeric DEFAULT 0,
	"version_likes" numeric DEFAULT 0,
	"version_published_at" timestamp(3) with time zone,
	"version_blog_category" "enum__posts_v_version_blog_category",
	"version_slug" varchar,
	"version_slug_lock" boolean DEFAULT true,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
);

CREATE TABLE IF NOT EXISTS "_posts_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"posts_id" integer,
	"users_id" integer
);

CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar,
	"caption" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumbnail_url" varchar,
	"sizes_thumbnail_width" numeric,
	"sizes_thumbnail_height" numeric,
	"sizes_thumbnail_mime_type" varchar,
	"sizes_thumbnail_filesize" numeric,
	"sizes_thumbnail_filename" varchar,
	"sizes_square_url" varchar,
	"sizes_square_width" numeric,
	"sizes_square_height" numeric,
	"sizes_square_mime_type" varchar,
	"sizes_square_filesize" numeric,
	"sizes_square_filename" varchar,
	"sizes_small_url" varchar,
	"sizes_small_width" numeric,
	"sizes_small_height" numeric,
	"sizes_small_mime_type" varchar,
	"sizes_small_filesize" numeric,
	"sizes_small_filename" varchar,
	"sizes_medium_url" varchar,
	"sizes_medium_width" numeric,
	"sizes_medium_height" numeric,
	"sizes_medium_mime_type" varchar,
	"sizes_medium_filesize" numeric,
	"sizes_medium_filename" varchar,
	"sizes_large_url" varchar,
	"sizes_large_width" numeric,
	"sizes_large_height" numeric,
	"sizes_large_mime_type" varchar,
	"sizes_large_filesize" numeric,
	"sizes_large_filename" varchar,
	"sizes_xlarge_url" varchar,
	"sizes_xlarge_width" numeric,
	"sizes_xlarge_height" numeric,
	"sizes_xlarge_mime_type" varchar,
	"sizes_xlarge_filesize" numeric,
	"sizes_xlarge_filename" varchar,
	"sizes_og_url" varchar,
	"sizes_og_width" numeric,
	"sizes_og_height" numeric,
	"sizes_og_mime_type" varchar,
	"sizes_og_filesize" numeric,
	"sizes_og_filename" varchar
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "enum_users_role" DEFAULT 'client' NOT NULL,
	"name" varchar,
	"phone" varchar,
	"location" varchar,
	"profile_image_id" integer,
	"phone_verified" boolean DEFAULT false,
	"otp" varchar,
	"otp_expires" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric DEFAULT 0,
	"lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "quiz_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar,
	"email" varchar,
	"message" varchar,
	"total_x_p" numeric DEFAULT 0,
	"total_time_taken" numeric DEFAULT 0,
	"avatar_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "quizzes_sponsored_questions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"date" timestamp(3) with time zone NOT NULL,
	"round" numeric,
	"question_id" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"quiz_date" timestamp(3) with time zone NOT NULL,
	"quiz_end_date" timestamp(3) with time zone NOT NULL,
	"rounds_per_day" numeric DEFAULT 3,
	"questions_per_round" numeric DEFAULT 3,
	"sponsored_position" numeric DEFAULT 3,
	"status" "enum_quizzes_status" DEFAULT 'draft',
	"meta_title" varchar,
	"meta_image_id" integer,
	"meta_description" varchar,
	"meta_schema" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "quizzes_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"questions_id" integer
);

CREATE TABLE IF NOT EXISTS "questions_mcq_group_options" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"option_text" varchar,
	"option_image_id" integer
);

CREATE TABLE IF NOT EXISTS "questions_dropdown_group_options" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"option_text" varchar
);

CREATE TABLE IF NOT EXISTS "questions_word_finder_group_grid_rows" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"row_string" varchar
);

CREATE TABLE IF NOT EXISTS "questions_word_finder_group_words_to_find" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"word" varchar
);

CREATE TABLE IF NOT EXISTS "questions_match_group_pairs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"left_item" varchar,
	"right_item" varchar
);

CREATE TABLE IF NOT EXISTS "questions_spot_lie_group_statements" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"statement_text" varchar,
	"is_lie" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "questions_reorder_group_items_in_correct_order" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"item_text" varchar
);

CREATE TABLE IF NOT EXISTS "questions_drag_drop_group_sentence_words_order" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"word" varchar
);

CREATE TABLE IF NOT EXISTS "questions_drag_drop_group_drop_zones_zone_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"item_text" varchar
);

CREATE TABLE IF NOT EXISTS "questions_drag_drop_group_drop_zones" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"zone_title" varchar
);

CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"hero_image_id" integer,
	"mobile_image_id" integer,
	"content" jsonb,
	"quiz_id" integer,
	"question_number" numeric,
	"game_type" "enum_questions_game_type" DEFAULT 'mcq',
	"question_title" varchar,
	"category" "enum_questions_category" DEFAULT 'chennai',
	"mcq_group_question_text" jsonb,
	"mcq_group_question_image_id" integer,
	"mcq_group_correct_option_index" numeric,
	"dropdown_group_sentence_text" varchar,
	"dropdown_group_dropdown_label" varchar DEFAULT 'Select Answer',
	"dropdown_group_correct_answer" varchar,
	"wordle_group_clue_text" varchar,
	"wordle_group_answer_word" varchar,
	"wordle_group_attempts" numeric DEFAULT 6,
	"wordle_group_hint" varchar,
	"wordle_group_hint_image_id" integer,
	"word_finder_group_instruction" varchar DEFAULT 'Find all the hidden words',
	"match_group_instruction" varchar DEFAULT 'Match the following correctly',
	"reorder_group_instruction" varchar,
	"drag_drop_group_instruction" varchar,
	"drag_drop_group_drag_mode" "enum_questions_drag_drop_group_drag_mode" DEFAULT 'sentence',
	"time_limit" numeric DEFAULT 60,
	"points" numeric DEFAULT 10,
	"negative_points" numeric DEFAULT 0,
	"difficulty" "enum_questions_difficulty" DEFAULT 'Medium',
	"enable_double_up" boolean DEFAULT false,
	"explanation" jsonb,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"published_at" timestamp(3) with time zone,
	"order" numeric DEFAULT 10,
	"slug" varchar,
	"slug_lock" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_questions_status" DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_mcq_group_options" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"option_text" varchar,
	"option_image_id" integer,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_dropdown_group_options" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"option_text" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_word_finder_group_grid_rows" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"row_string" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_word_finder_group_words_to_find" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"word" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_match_group_pairs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"left_item" varchar,
	"right_item" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_spot_lie_group_statements" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"statement_text" varchar,
	"is_lie" boolean DEFAULT false,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_reorder_group_items_in_correct_order" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"item_text" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_drag_drop_group_sentence_words_order" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"word" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_drag_drop_group_drop_zones_zone_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"item_text" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v_version_drag_drop_group_drop_zones" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"zone_title" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_questions_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_hero_image_id" integer,
	"version_mobile_image_id" integer,
	"version_content" jsonb,
	"version_quiz_id" integer,
	"version_question_number" numeric,
	"version_game_type" "enum__questions_v_version_game_type" DEFAULT 'mcq',
	"version_question_title" varchar,
	"version_category" "enum__questions_v_version_category" DEFAULT 'chennai',
	"version_mcq_group_question_text" jsonb,
	"version_mcq_group_question_image_id" integer,
	"version_mcq_group_correct_option_index" numeric,
	"version_dropdown_group_sentence_text" varchar,
	"version_dropdown_group_dropdown_label" varchar DEFAULT 'Select Answer',
	"version_dropdown_group_correct_answer" varchar,
	"version_wordle_group_clue_text" varchar,
	"version_wordle_group_answer_word" varchar,
	"version_wordle_group_attempts" numeric DEFAULT 6,
	"version_wordle_group_hint" varchar,
	"version_wordle_group_hint_image_id" integer,
	"version_word_finder_group_instruction" varchar DEFAULT 'Find all the hidden words',
	"version_match_group_instruction" varchar DEFAULT 'Match the following correctly',
	"version_reorder_group_instruction" varchar,
	"version_drag_drop_group_instruction" varchar,
	"version_drag_drop_group_drag_mode" "enum__questions_v_version_drag_drop_group_drag_mode" DEFAULT 'sentence',
	"version_time_limit" numeric DEFAULT 60,
	"version_points" numeric DEFAULT 10,
	"version_negative_points" numeric DEFAULT 0,
	"version_difficulty" "enum__questions_v_version_difficulty" DEFAULT 'Medium',
	"version_enable_double_up" boolean DEFAULT false,
	"version_explanation" jsonb,
	"version_meta_title" varchar,
	"version_meta_description" varchar,
	"version_meta_image_id" integer,
	"version_published_at" timestamp(3) with time zone,
	"version_order" numeric DEFAULT 10,
	"version_slug" varchar,
	"version_slug_lock" boolean DEFAULT true,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__questions_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
);

CREATE TABLE IF NOT EXISTS "user_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"quiz_id" integer NOT NULL,
	"score" numeric NOT NULL,
	"answers" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "quiz_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"quiz_id" integer NOT NULL,
	"score" numeric DEFAULT 0 NOT NULL,
	"total_questions" numeric DEFAULT 0 NOT NULL,
	"correct_answers" numeric DEFAULT 0 NOT NULL,
	"time_taken" numeric DEFAULT 0 NOT NULL,
	"completed_at" timestamp(3) with time zone NOT NULL,
	"rank_at_completion" numeric,
	"round" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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

CREATE TABLE IF NOT EXISTS "redirects" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" varchar NOT NULL,
	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
	"to_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "redirects_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"posts_id" integer
);

CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"required" boolean,
	"default_value" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_country" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_email" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_message" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"message" jsonb,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_number" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"default_value" numeric,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_select_options" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "forms_blocks_select" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"default_value" varchar,
	"placeholder" varchar,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_state" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"default_value" varchar,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_textarea" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"default_value" varchar,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_emails" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"email_to" varchar,
	"cc" varchar,
	"bcc" varchar,
	"reply_to" varchar,
	"email_from" varchar,
	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
	"message" jsonb
);

CREATE TABLE IF NOT EXISTS "forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"submit_button_label" varchar,
	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
	"confirmation_message" jsonb,
	"redirect_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "form_submissions_submission_data" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"field" varchar NOT NULL,
	"value" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "form_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "search_categories" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"relation_to" varchar,
	"title" varchar
);

CREATE TABLE IF NOT EXISTS "search" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"priority" numeric,
	"slug" varchar,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "search_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_kv" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"data" jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_jobs_log" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"executed_at" timestamp(3) with time zone NOT NULL,
	"completed_at" timestamp(3) with time zone NOT NULL,
	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
	"task_i_d" varchar NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"state" "enum_payload_jobs_log_state" NOT NULL,
	"error" jsonb
);

CREATE TABLE IF NOT EXISTS "payload_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"input" jsonb,
	"completed_at" timestamp(3) with time zone,
	"total_tried" numeric DEFAULT 0,
	"has_error" boolean DEFAULT false,
	"error" jsonb,
	"task_slug" "enum_payload_jobs_task_slug",
	"queue" varchar DEFAULT 'default',
	"wait_until" timestamp(3) with time zone,
	"processing" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"posts_id" integer,
	"media_id" integer,
	"users_id" integer,
	"quiz_users_id" integer,
	"quizzes_id" integer,
	"questions_id" integer,
	"user_submissions_id" integer,
	"quiz_attempts_id" integer,
	"quiz_rounds_id" integer,
	"redirects_id" integer,
	"forms_id" integer,
	"form_submissions_id" integer,
	"search_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"quiz_users_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "header_nav_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
	"link_new_tab" boolean,
	"link_url" varchar,
	"link_label" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "header" (
	"id" serial PRIMARY KEY NOT NULL,
	"logo_id" integer,
	"secondarylogo_id" integer,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "header_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"posts_id" integer
);

CREATE TABLE IF NOT EXISTS "footer_social_media" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"platform" varchar NOT NULL,
	"url" varchar NOT NULL,
	"icon_id" integer
);

CREATE TABLE IF NOT EXISTS "footer" (
	"id" serial PRIMARY KEY NOT NULL,
	"copyright" varchar,
	"company_info_support_email" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "quiz_settings_titles" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"min_x_p" numeric NOT NULL
);

CREATE TABLE IF NOT EXISTS "quiz_settings_scoring_bonus_tiers" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"min_percent_left" numeric,
	"bonus" numeric
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
	"scoring_speed_bonus" boolean DEFAULT true,
	"scorecard_logo_id" integer,
	"scorecard_badge_logo_id" integer,
	"scorecard_headline" varchar DEFAULT 'I just played the',
	"scorecard_highlight" varchar DEFAULT 'Super Chennai Quiz!',
	"scorecard_image_id" integer,
	"scorecard_footer_text" varchar DEFAULT 'Think you know Chennai? Play at chenzquiz.superchennai.com',
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "quiz_site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"login_login_heading" varchar DEFAULT 'Welcome Back',
	"login_signup_heading" varchar DEFAULT 'Create Account',
	"login_login_subheading" varchar DEFAULT 'Enter your mobile number to get OTP and access your dashboard',
	"login_signup_subheading" varchar DEFAULT 'Join thousands of quiz fans across Chennai',
	"login_require_email" boolean DEFAULT true,
	"login_show_message_field" boolean DEFAULT true,
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
	"leaderboard_show_period_tabs" boolean DEFAULT false,
	"leaderboard_default_tab" "enum_quiz_site_settings_leaderboard_default_tab" DEFAULT 'all',
	"terms_title" varchar DEFAULT 'Terms & Conditions',
	"terms_agree_button" varchar DEFAULT 'I Agree',
	"terms_content" jsonb DEFAULT '{"root":{"direction":"ltr","format":"","indent":0,"version":1,"type":"root","children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"paragraph","textFormat":0,"textStyle":"","children":[{"type":"text","text":"ChenZ – Daily Trivia is an online trivia contest organised by Super Chennai. By participating in ChenZ – Daily Trivia, participants agree to abide by the following Terms & Conditions.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"1. Contest Format","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"Three trivia questions will be published every day at 8:00 AM.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Each question will have a time limit of 20 seconds.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"Participants must submit their answers within the allotted time.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":4,"children":[{"type":"text","text":"The quiz will be conducted through the ChenZ – Daily Trivia platform on the Super Chennai website or other designated digital platforms.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":5,"children":[{"type":"text","text":"The organisers reserve the right to determine the format, content and schedule of the contest.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"2. Scoring","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"Points will be awarded based on the correctness of answers and response time.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Participants who answer correctly in the shortest time will earn higher points.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"Incorrect or unanswered questions will receive zero points.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":4,"children":[{"type":"text","text":"Scores from all three questions will contribute to the participant’s daily score.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":5,"children":[{"type":"text","text":"Daily scores will also contribute towards the cumulative 90-day leaderboard.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":6,"children":[{"type":"text","text":"The scoring system implemented on the platform will determine the points awarded.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":7,"children":[{"type":"text","text":"Platform-recorded scores, subject to verification, will be considered for winner* determination and leaderboard rankings.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"3. Daily Winners & Gift Vouchers","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"Every day, participants who answer all three questions correctly in the fastest time will be eligible to win* daily gift vouchers.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"The three participants who complete all three questions correctly with the fastest overall response times will be declared the daily winners.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"Winners will be determined based on the time taken to correctly answer all three questions, subject to verification.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":4,"children":[{"type":"text","text":"Participants who do not answer all three questions correctly will not be eligible for the daily gift vouchers.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":5,"children":[{"type":"text","text":"In the event of a tie, the organisers may consider individual response times, overall performance or other appropriate tie-breaking criteria.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":6,"children":[{"type":"text","text":"Daily winners may be required to undergo verification before prizes are awarded.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":7,"children":[{"type":"text","text":"If a winner is found ineligible, fails verification or cannot be contacted within the stipulated time, the organisers reserve the right to select an alternate winner.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"4. 90-Day Contest & Leaderboard","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"ChenZ – Daily Trivia will run for a period of 90 days, subject to the schedule announced by the organisers.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Participants will accumulate points based on their performance across the daily quizzes throughout the contest period.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"Points earned from all three questions each day will contribute to the cumulative 90-day leaderboard.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":4,"children":[{"type":"text","text":"The leaderboard will reflect the cumulative scores of participants throughout the contest period.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":5,"children":[{"type":"text","text":"The participant with the highest cumulative score at the end of the 90-day contest will be declared the overall winner, subject to verification.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":6,"children":[{"type":"text","text":"Only valid scores recorded by the quiz platform during the contest period will be considered.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":7,"children":[{"type":"text","text":"The organisers reserve the right to review, verify or correct scores in the event of technical errors, suspected manipulation or discrepancies.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"5. Grand Prize","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"The participant who tops the final cumulative leaderboard at the end of the 90-day contest will win* an Apple Watch.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"The grand prize will be awarded after verification of the participant’s eligibility and final score.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"In the event of a tie, the organisers may use response time, overall performance or other appropriate criteria to determine the winner.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":4,"children":[{"type":"text","text":"The prize is non-transferable and cannot be exchanged for cash or any other alternative.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":5,"children":[{"type":"text","text":"The organisers reserve the right to substitute the prize with another of comparable value in circumstances beyond their control.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"6. Eligibility","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"ChenZ – Daily Trivia is open to participants of all age groups. There is no age restriction.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Participants must provide accurate information wherever requested.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"Each participant must use their own registered account to participate.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":4,"children":[{"type":"text","text":"Participation must be individual and independent.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":5,"children":[{"type":"text","text":"Multiple accounts, impersonation or participation on behalf of another individual may result in disqualification.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":6,"children":[{"type":"text","text":"Employees, representatives, contractors or individuals directly involved in organising or administering the contest may be excluded at the organisers’ discretion.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"7. Fair Participation & Disqualification","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"Participants are expected to compete fairly and independently.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Use of bots, scripts, automated tools, AI tools, external assistance, multiple accounts, response-time manipulation, technical exploits or any other means intended to gain an unfair advantage is prohibited.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"The organisers reserve the right to disqualify participants, invalidate scores, remove entries from the leaderboard or withhold prizes if they reasonably believe a participant has breached these Terms & Conditions, manipulated the contest or compromised its fairness or integrity.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"8. Prize Distribution & Verification","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"Daily gift voucher winners and the grand prize winner will be contacted using the details provided during registration or participation.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Winners may be required to provide proof of identity or other reasonably necessary information for verification.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"Prizes will be distributed only after successful verification.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":4,"children":[{"type":"text","text":"If a winner fails to respond within the stipulated period, fails verification or is found ineligible, the organisers reserve the right to select an alternate winner.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":5,"children":[{"type":"text","text":"Taxes, duties or other statutory deductions, if applicable, will be handled in accordance with applicable law.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"9. Technical Issues & Platform Availability","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"The organisers shall not be responsible for entries not received, recorded or processed due to internet connectivity issues, device malfunction, network delays, server downtime, technical errors or circumstances beyond their reasonable control.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"The organisers reserve the right to suspend, reschedule, modify or cancel the contest in the event of technical issues, suspected manipulation, security concerns or any circumstance that may affect the fairness or integrity of the contest.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"10. Personal Data & Privacy","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"Participant information may be collected and used for administering the quiz, recording scores, maintaining leaderboards, determining winners, verifying eligibility, contacting participants and distributing prizes.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Personal information will be handled in accordance with applicable laws and the Super Chennai Privacy Policy.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":3,"children":[{"type":"text","text":"Participants are advised to review the Privacy Policy available on the Super Chennai website before participating.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"11. Publicity & Winner Announcements","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"The organisers may publish the names, usernames, rankings or limited details of winners on the Super Chennai website, social media platforms and other official communication channels for the purpose of announcing results.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Any additional use of a winner’s photograph, video, testimonial or promotional content will be subject to consent where required.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"12. Contest Modification, Suspension or Cancellation","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"The organisers reserve the right to amend, suspend, extend, postpone, modify or discontinue the contest or these Terms & Conditions where necessary due to technical issues, fraud, misuse, operational requirements, legal obligations or circumstances beyond their reasonable control.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Any material changes will be communicated through the Super Chennai website or official communication channels.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"13. Organisers’ Decision","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"Decisions of the organisers regarding eligibility, scoring, score validation, leaderboard rankings, winner determination, tie-breaking, prize distribution and disqualification shall be final and binding, subject to applicable law.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"14. Limitation of Liability","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"The organisers shall not be held liable for any loss, damage, injury, claim or expense arising out of participation in the contest, acceptance or use of prizes, technical interruptions, platform failures or circumstances beyond their reasonable control, except where such liability cannot be excluded under applicable law.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"15. Governing Law & Jurisdiction","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"These Terms & Conditions shall be governed by the laws of India.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Any disputes arising in connection with the contest shall be subject to the jurisdiction of the competent courts in Chennai, Tamil Nadu, India.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"heading","tag":"h3","children":[{"type":"text","text":"16. Acceptance of Terms","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"list","listType":"bullet","tag":"ul","start":1,"children":[{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":1,"children":[{"type":"text","text":"By participating in ChenZ – Daily Trivia, participants acknowledge that they have read, understood and agreed to these Terms & Conditions.","format":0,"style":"","mode":"normal","detail":0,"version":1}]},{"direction":"ltr","format":"","indent":0,"version":1,"type":"listitem","value":2,"children":[{"type":"text","text":"Participants who do not agree to these Terms & Conditions should refrain from participating.","format":0,"style":"","mode":"normal","detail":0,"version":1}]}]}]}}'::jsonb,
	"test_players_allow_test_logins" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

DO $$ BEGIN
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

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
  ALTER TABLE "pages_meta_seo_keywords" ADD CONSTRAINT "pages_meta_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_seo_og_image_id_media_id_fk" FOREIGN KEY ("meta_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
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

DO $$ BEGIN
  ALTER TABLE "_pages_v_version_meta_seo_keywords" ADD CONSTRAINT "_pages_v_version_meta_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("version_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_meta_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_users" ADD CONSTRAINT "quiz_users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quizzes_sponsored_questions" ADD CONSTRAINT "quizzes_sponsored_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quizzes_sponsored_questions" ADD CONSTRAINT "quizzes_sponsored_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quizzes_rels" ADD CONSTRAINT "quizzes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quizzes_rels" ADD CONSTRAINT "quizzes_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_mcq_group_options" ADD CONSTRAINT "questions_mcq_group_options_option_image_id_media_id_fk" FOREIGN KEY ("option_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_mcq_group_options" ADD CONSTRAINT "questions_mcq_group_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_dropdown_group_options" ADD CONSTRAINT "questions_dropdown_group_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_word_finder_group_grid_rows" ADD CONSTRAINT "questions_word_finder_group_grid_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_word_finder_group_words_to_find" ADD CONSTRAINT "questions_word_finder_group_words_to_find_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_match_group_pairs" ADD CONSTRAINT "questions_match_group_pairs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_spot_lie_group_statements" ADD CONSTRAINT "questions_spot_lie_group_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_reorder_group_items_in_correct_order" ADD CONSTRAINT "questions_reorder_group_items_in_correct_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_drag_drop_group_sentence_words_order" ADD CONSTRAINT "questions_drag_drop_group_sentence_words_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_drag_drop_group_drop_zones_zone_items" ADD CONSTRAINT "questions_drag_drop_group_drop_zones_zone_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions_drag_drop_group_drop_zones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions_drag_drop_group_drop_zones" ADD CONSTRAINT "questions_drag_drop_group_drop_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions" ADD CONSTRAINT "questions_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions" ADD CONSTRAINT "questions_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions" ADD CONSTRAINT "questions_mcq_group_question_image_id_media_id_fk" FOREIGN KEY ("mcq_group_question_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions" ADD CONSTRAINT "questions_wordle_group_hint_image_id_media_id_fk" FOREIGN KEY ("wordle_group_hint_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "questions" ADD CONSTRAINT "questions_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_mcq_group_options" ADD CONSTRAINT "_questions_v_version_mcq_group_options_option_image_id_media_id_fk" FOREIGN KEY ("option_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_mcq_group_options" ADD CONSTRAINT "_questions_v_version_mcq_group_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_dropdown_group_options" ADD CONSTRAINT "_questions_v_version_dropdown_group_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_word_finder_group_grid_rows" ADD CONSTRAINT "_questions_v_version_word_finder_group_grid_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_word_finder_group_words_to_find" ADD CONSTRAINT "_questions_v_version_word_finder_group_words_to_find_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_match_group_pairs" ADD CONSTRAINT "_questions_v_version_match_group_pairs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_spot_lie_group_statements" ADD CONSTRAINT "_questions_v_version_spot_lie_group_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_reorder_group_items_in_correct_order" ADD CONSTRAINT "_questions_v_version_reorder_group_items_in_correct_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_drag_drop_group_sentence_words_order" ADD CONSTRAINT "_questions_v_version_drag_drop_group_sentence_words_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_drag_drop_group_drop_zones_zone_items" ADD CONSTRAINT "_questions_v_version_drag_drop_group_drop_zones_zone_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v_version_drag_drop_group_drop_zones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v_version_drag_drop_group_drop_zones" ADD CONSTRAINT "_questions_v_version_drag_drop_group_drop_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v" ADD CONSTRAINT "_questions_v_parent_id_questions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v" ADD CONSTRAINT "_questions_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v" ADD CONSTRAINT "_questions_v_version_mobile_image_id_media_id_fk" FOREIGN KEY ("version_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v" ADD CONSTRAINT "_questions_v_version_quiz_id_quizzes_id_fk" FOREIGN KEY ("version_quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v" ADD CONSTRAINT "_questions_v_version_mcq_group_question_image_id_media_id_fk" FOREIGN KEY ("version_mcq_group_question_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v" ADD CONSTRAINT "_questions_v_version_wordle_group_hint_image_id_media_id_fk" FOREIGN KEY ("version_wordle_group_hint_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "_questions_v" ADD CONSTRAINT "_questions_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "user_submissions" ADD CONSTRAINT "user_submissions_user_id_quiz_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."quiz_users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "user_submissions" ADD CONSTRAINT "user_submissions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_quiz_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."quiz_users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_rounds" ADD CONSTRAINT "quiz_rounds_user_id_quiz_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."quiz_users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_rounds" ADD CONSTRAINT "quiz_rounds_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_rounds" ADD CONSTRAINT "quiz_rounds_sponsored_question_id_questions_id_fk" FOREIGN KEY ("sponsored_question_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_rounds_rels" ADD CONSTRAINT "quiz_rounds_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_rounds"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_rounds_rels" ADD CONSTRAINT "quiz_rounds_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_users_fk" FOREIGN KEY ("quiz_users_id") REFERENCES "public"."quiz_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quizzes_fk" FOREIGN KEY ("quizzes_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_submissions_fk" FOREIGN KEY ("user_submissions_id") REFERENCES "public"."user_submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_attempts_fk" FOREIGN KEY ("quiz_attempts_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_rounds_fk" FOREIGN KEY ("quiz_rounds_id") REFERENCES "public"."quiz_rounds"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_quiz_users_fk" FOREIGN KEY ("quiz_users_id") REFERENCES "public"."quiz_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "header" ADD CONSTRAINT "header_secondarylogo_id_media_id_fk" FOREIGN KEY ("secondarylogo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "footer_social_media" ADD CONSTRAINT "footer_social_media_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "footer_social_media" ADD CONSTRAINT "footer_social_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_settings_titles" ADD CONSTRAINT "quiz_settings_titles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quiz_settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_settings_scoring_bonus_tiers" ADD CONSTRAINT "quiz_settings_scoring_bonus_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quiz_settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_settings" ADD CONSTRAINT "quiz_settings_scorecard_logo_id_media_id_fk" FOREIGN KEY ("scorecard_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_settings" ADD CONSTRAINT "quiz_settings_scorecard_badge_logo_id_media_id_fk" FOREIGN KEY ("scorecard_badge_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "quiz_settings" ADD CONSTRAINT "quiz_settings_scorecard_image_id_media_id_fk" FOREIGN KEY ("scorecard_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");

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

CREATE INDEX IF NOT EXISTS "pages_meta_seo_keywords_order_idx" ON "pages_meta_seo_keywords" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "pages_meta_seo_keywords_parent_id_idx" ON "pages_meta_seo_keywords" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");

CREATE INDEX IF NOT EXISTS "pages_hero_hero_mobile_image_idx" ON "pages" USING btree ("hero_mobile_image_id");

CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");

CREATE INDEX IF NOT EXISTS "pages_meta_seo_meta_seo_og_image_idx" ON "pages" USING btree ("meta_seo_og_image_id");

CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");

CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");

CREATE INDEX IF NOT EXISTS "pages_rels_order_idx" ON "pages_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "pages_rels_path_idx" ON "pages_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");

CREATE INDEX IF NOT EXISTS "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");

CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");

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

CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_seo_keywords_order_idx" ON "_pages_v_version_meta_seo_keywords" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_seo_keywords_parent_id_idx" ON "_pages_v_version_meta_seo_keywords" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_version_hero_mobile_image_idx" ON "_pages_v" USING btree ("version_hero_mobile_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_seo_version_meta_seo_og_image_idx" ON "_pages_v" USING btree ("version_meta_seo_og_image_id");

CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");

CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");

CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");

CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");

CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");

CREATE INDEX IF NOT EXISTS "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");

CREATE INDEX IF NOT EXISTS "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");

CREATE INDEX IF NOT EXISTS "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");

CREATE INDEX IF NOT EXISTS "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");

CREATE INDEX IF NOT EXISTS "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");

CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug");

CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "posts__status_idx" ON "posts" USING btree ("_status");

CREATE INDEX IF NOT EXISTS "posts_rels_order_idx" ON "posts_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "posts_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");

CREATE INDEX IF NOT EXISTS "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");

CREATE INDEX IF NOT EXISTS "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");

CREATE INDEX IF NOT EXISTS "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");

CREATE INDEX IF NOT EXISTS "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");

CREATE INDEX IF NOT EXISTS "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");

CREATE INDEX IF NOT EXISTS "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");

CREATE INDEX IF NOT EXISTS "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");

CREATE INDEX IF NOT EXISTS "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");

CREATE INDEX IF NOT EXISTS "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");

CREATE INDEX IF NOT EXISTS "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");

CREATE INDEX IF NOT EXISTS "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");

CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");

CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");

CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");

CREATE INDEX IF NOT EXISTS "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");

CREATE INDEX IF NOT EXISTS "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");

CREATE INDEX IF NOT EXISTS "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");

CREATE INDEX IF NOT EXISTS "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");

CREATE INDEX IF NOT EXISTS "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");

CREATE INDEX IF NOT EXISTS "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");

CREATE INDEX IF NOT EXISTS "users_profile_image_idx" ON "users" USING btree ("profile_image_id");

CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");

CREATE INDEX IF NOT EXISTS "quiz_users_avatar_idx" ON "quiz_users" USING btree ("avatar_id");

CREATE INDEX IF NOT EXISTS "quiz_users_updated_at_idx" ON "quiz_users" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "quiz_users_created_at_idx" ON "quiz_users" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "quizzes_sponsored_questions_order_idx" ON "quizzes_sponsored_questions" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "quizzes_sponsored_questions_parent_id_idx" ON "quizzes_sponsored_questions" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "quizzes_sponsored_questions_question_idx" ON "quizzes_sponsored_questions" USING btree ("question_id");

CREATE UNIQUE INDEX IF NOT EXISTS "quizzes_slug_idx" ON "quizzes" USING btree ("slug");

CREATE INDEX IF NOT EXISTS "quizzes_meta_meta_image_idx" ON "quizzes" USING btree ("meta_image_id");

CREATE INDEX IF NOT EXISTS "quizzes_updated_at_idx" ON "quizzes" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "quizzes_created_at_idx" ON "quizzes" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "quizzes_rels_order_idx" ON "quizzes_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "quizzes_rels_parent_idx" ON "quizzes_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "quizzes_rels_path_idx" ON "quizzes_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "quizzes_rels_questions_id_idx" ON "quizzes_rels" USING btree ("questions_id");

CREATE INDEX IF NOT EXISTS "questions_mcq_group_options_order_idx" ON "questions_mcq_group_options" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_mcq_group_options_parent_id_idx" ON "questions_mcq_group_options" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_mcq_group_options_option_image_idx" ON "questions_mcq_group_options" USING btree ("option_image_id");

CREATE INDEX IF NOT EXISTS "questions_dropdown_group_options_order_idx" ON "questions_dropdown_group_options" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_dropdown_group_options_parent_id_idx" ON "questions_dropdown_group_options" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_word_finder_group_grid_rows_order_idx" ON "questions_word_finder_group_grid_rows" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_word_finder_group_grid_rows_parent_id_idx" ON "questions_word_finder_group_grid_rows" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_word_finder_group_words_to_find_order_idx" ON "questions_word_finder_group_words_to_find" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_word_finder_group_words_to_find_parent_id_idx" ON "questions_word_finder_group_words_to_find" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_match_group_pairs_order_idx" ON "questions_match_group_pairs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_match_group_pairs_parent_id_idx" ON "questions_match_group_pairs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_spot_lie_group_statements_order_idx" ON "questions_spot_lie_group_statements" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_spot_lie_group_statements_parent_id_idx" ON "questions_spot_lie_group_statements" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_reorder_group_items_in_correct_order_order_idx" ON "questions_reorder_group_items_in_correct_order" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_reorder_group_items_in_correct_order_parent_id_idx" ON "questions_reorder_group_items_in_correct_order" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_drag_drop_group_sentence_words_order_order_idx" ON "questions_drag_drop_group_sentence_words_order" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_drag_drop_group_sentence_words_order_parent_id_idx" ON "questions_drag_drop_group_sentence_words_order" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_drag_drop_group_drop_zones_zone_items_order_idx" ON "questions_drag_drop_group_drop_zones_zone_items" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_drag_drop_group_drop_zones_zone_items_parent_id_idx" ON "questions_drag_drop_group_drop_zones_zone_items" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_drag_drop_group_drop_zones_order_idx" ON "questions_drag_drop_group_drop_zones" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "questions_drag_drop_group_drop_zones_parent_id_idx" ON "questions_drag_drop_group_drop_zones" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "questions_hero_image_idx" ON "questions" USING btree ("hero_image_id");

CREATE INDEX IF NOT EXISTS "questions_mobile_image_idx" ON "questions" USING btree ("mobile_image_id");

CREATE INDEX IF NOT EXISTS "questions_quiz_idx" ON "questions" USING btree ("quiz_id");

CREATE INDEX IF NOT EXISTS "questions_mcq_group_mcq_group_question_image_idx" ON "questions" USING btree ("mcq_group_question_image_id");

CREATE INDEX IF NOT EXISTS "questions_wordle_group_wordle_group_hint_image_idx" ON "questions" USING btree ("wordle_group_hint_image_id");

CREATE INDEX IF NOT EXISTS "questions_meta_meta_image_idx" ON "questions" USING btree ("meta_image_id");

CREATE INDEX IF NOT EXISTS "questions_slug_idx" ON "questions" USING btree ("slug");

CREATE INDEX IF NOT EXISTS "questions_updated_at_idx" ON "questions" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "questions_created_at_idx" ON "questions" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "questions__status_idx" ON "questions" USING btree ("_status");

CREATE INDEX IF NOT EXISTS "_questions_v_version_mcq_group_options_order_idx" ON "_questions_v_version_mcq_group_options" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_mcq_group_options_parent_id_idx" ON "_questions_v_version_mcq_group_options" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_mcq_group_options_option_image_idx" ON "_questions_v_version_mcq_group_options" USING btree ("option_image_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_dropdown_group_options_order_idx" ON "_questions_v_version_dropdown_group_options" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_dropdown_group_options_parent_id_idx" ON "_questions_v_version_dropdown_group_options" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_word_finder_group_grid_rows_order_idx" ON "_questions_v_version_word_finder_group_grid_rows" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_word_finder_group_grid_rows_parent_id_idx" ON "_questions_v_version_word_finder_group_grid_rows" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_word_finder_group_words_to_find_order_idx" ON "_questions_v_version_word_finder_group_words_to_find" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_word_finder_group_words_to_find_parent_id_idx" ON "_questions_v_version_word_finder_group_words_to_find" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_match_group_pairs_order_idx" ON "_questions_v_version_match_group_pairs" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_match_group_pairs_parent_id_idx" ON "_questions_v_version_match_group_pairs" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_spot_lie_group_statements_order_idx" ON "_questions_v_version_spot_lie_group_statements" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_spot_lie_group_statements_parent_id_idx" ON "_questions_v_version_spot_lie_group_statements" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_reorder_group_items_in_correct_order_order_idx" ON "_questions_v_version_reorder_group_items_in_correct_order" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_reorder_group_items_in_correct_order_parent_id_idx" ON "_questions_v_version_reorder_group_items_in_correct_order" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_drag_drop_group_sentence_words_order_order_idx" ON "_questions_v_version_drag_drop_group_sentence_words_order" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_drag_drop_group_sentence_words_order_parent_id_idx" ON "_questions_v_version_drag_drop_group_sentence_words_order" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_drag_drop_group_drop_zones_zone_items_order_idx" ON "_questions_v_version_drag_drop_group_drop_zones_zone_items" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_drag_drop_group_drop_zones_zone_items_parent_id_idx" ON "_questions_v_version_drag_drop_group_drop_zones_zone_items" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_drag_drop_group_drop_zones_order_idx" ON "_questions_v_version_drag_drop_group_drop_zones" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "_questions_v_version_drag_drop_group_drop_zones_parent_id_idx" ON "_questions_v_version_drag_drop_group_drop_zones" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_parent_idx" ON "_questions_v" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_version_hero_image_idx" ON "_questions_v" USING btree ("version_hero_image_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_version_mobile_image_idx" ON "_questions_v" USING btree ("version_mobile_image_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_version_quiz_idx" ON "_questions_v" USING btree ("version_quiz_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_mcq_group_version_mcq_group_questio_idx" ON "_questions_v" USING btree ("version_mcq_group_question_image_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_wordle_group_version_wordle_group_h_idx" ON "_questions_v" USING btree ("version_wordle_group_hint_image_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_meta_version_meta_image_idx" ON "_questions_v" USING btree ("version_meta_image_id");

CREATE INDEX IF NOT EXISTS "_questions_v_version_version_slug_idx" ON "_questions_v" USING btree ("version_slug");

CREATE INDEX IF NOT EXISTS "_questions_v_version_version_updated_at_idx" ON "_questions_v" USING btree ("version_updated_at");

CREATE INDEX IF NOT EXISTS "_questions_v_version_version_created_at_idx" ON "_questions_v" USING btree ("version_created_at");

CREATE INDEX IF NOT EXISTS "_questions_v_version_version__status_idx" ON "_questions_v" USING btree ("version__status");

CREATE INDEX IF NOT EXISTS "_questions_v_created_at_idx" ON "_questions_v" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "_questions_v_updated_at_idx" ON "_questions_v" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "_questions_v_latest_idx" ON "_questions_v" USING btree ("latest");

CREATE INDEX IF NOT EXISTS "_questions_v_autosave_idx" ON "_questions_v" USING btree ("autosave");

CREATE INDEX IF NOT EXISTS "user_submissions_user_idx" ON "user_submissions" USING btree ("user_id");

CREATE INDEX IF NOT EXISTS "user_submissions_quiz_idx" ON "user_submissions" USING btree ("quiz_id");

CREATE INDEX IF NOT EXISTS "user_submissions_updated_at_idx" ON "user_submissions" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "user_submissions_created_at_idx" ON "user_submissions" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "quiz_attempts_user_idx" ON "quiz_attempts" USING btree ("user_id");

CREATE INDEX IF NOT EXISTS "quiz_attempts_quiz_idx" ON "quiz_attempts" USING btree ("quiz_id");

CREATE INDEX IF NOT EXISTS "quiz_attempts_updated_at_idx" ON "quiz_attempts" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "quiz_attempts_created_at_idx" ON "quiz_attempts" USING btree ("created_at");

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

CREATE UNIQUE INDEX IF NOT EXISTS "redirects_from_idx" ON "redirects" USING btree ("from");

CREATE INDEX IF NOT EXISTS "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");

CREATE INDEX IF NOT EXISTS "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");

CREATE INDEX IF NOT EXISTS "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "forms_updated_at_idx" ON "forms" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");

CREATE INDEX IF NOT EXISTS "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "search_categories_order_idx" ON "search_categories" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "search_slug_idx" ON "search" USING btree ("slug");

CREATE INDEX IF NOT EXISTS "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");

CREATE INDEX IF NOT EXISTS "search_updated_at_idx" ON "search" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "search_created_at_idx" ON "search" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "search_rels_order_idx" ON "search_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "search_rels_path_idx" ON "search_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");

CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");

CREATE INDEX IF NOT EXISTS "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");

CREATE INDEX IF NOT EXISTS "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");

CREATE INDEX IF NOT EXISTS "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");

CREATE INDEX IF NOT EXISTS "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");

CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");

CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");

CREATE INDEX IF NOT EXISTS "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");

CREATE INDEX IF NOT EXISTS "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quiz_users_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_users_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quizzes_id_idx" ON "payload_locked_documents_rels" USING btree ("quizzes_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("questions_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_user_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("user_submissions_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quiz_attempts_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_attempts_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quiz_rounds_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_rounds_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");

CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");

CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");

CREATE INDEX IF NOT EXISTS "payload_preferences_rels_quiz_users_id_idx" ON "payload_preferences_rels" USING btree ("quiz_users_id");

CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");

CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "header_logo_idx" ON "header" USING btree ("logo_id");

CREATE INDEX IF NOT EXISTS "header_secondarylogo_idx" ON "header" USING btree ("secondarylogo_id");

CREATE INDEX IF NOT EXISTS "header_rels_order_idx" ON "header_rels" USING btree ("order");

CREATE INDEX IF NOT EXISTS "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");

CREATE INDEX IF NOT EXISTS "header_rels_path_idx" ON "header_rels" USING btree ("path");

CREATE INDEX IF NOT EXISTS "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");

CREATE INDEX IF NOT EXISTS "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");

CREATE INDEX IF NOT EXISTS "footer_social_media_order_idx" ON "footer_social_media" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "footer_social_media_parent_id_idx" ON "footer_social_media" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "footer_social_media_icon_idx" ON "footer_social_media" USING btree ("icon_id");

CREATE INDEX IF NOT EXISTS "quiz_settings_titles_order_idx" ON "quiz_settings_titles" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "quiz_settings_titles_parent_id_idx" ON "quiz_settings_titles" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "quiz_settings_scoring_bonus_tiers_order_idx" ON "quiz_settings_scoring_bonus_tiers" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "quiz_settings_scoring_bonus_tiers_parent_id_idx" ON "quiz_settings_scoring_bonus_tiers" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "quiz_settings_scorecard_scorecard_logo_idx" ON "quiz_settings" USING btree ("scorecard_logo_id");

CREATE INDEX IF NOT EXISTS "quiz_settings_scorecard_scorecard_badge_logo_idx" ON "quiz_settings" USING btree ("scorecard_badge_logo_id");

CREATE INDEX IF NOT EXISTS "quiz_settings_scorecard_scorecard_image_idx" ON "quiz_settings" USING btree ("scorecard_image_id");
