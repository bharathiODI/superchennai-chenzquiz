-- WordPress-style CMS roles (payload-builder playbook): new values for users.role.
-- On its own because Postgres can't use a new enum value in the transaction that adds it.
ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'superadmin';
ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'author';
ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'contributor';
ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'viewer';
