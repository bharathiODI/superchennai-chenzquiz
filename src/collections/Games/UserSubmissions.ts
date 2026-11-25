import type { CollectionConfig } from 'payload'
import { ADMINS, allow } from '@/access/roles'

export const UserSubmissions: CollectionConfig = {
  slug: 'user-submissions',
  disableDuplicate: true, // player data is never copied
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'quiz', 'score', 'createdAt'],
    // Nothing in the game writes these any more: hidden in the CMS (data kept)
    hidden: true,
    components: { beforeListTable: ['@/components/admin/ListExport#ListExport'] },
  },
  // Admin only over the REST API (players are logged in to the same API)
  access: {
    // Read-only in the CMS: scores and players are written only by the game itself, so nobody can
    // change them by mistake here. (Server code uses overrideAccess and is not affected.)
    create: () => false,
    read: allow(ADMINS),
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'quiz-users',
      required: true,
    },
    {
      name: 'quiz',
      type: 'relationship',
      relationTo: 'quizzes',
      required: true,
    },
    {
      name: 'score',
      type: 'number',
      required: true,
    },
    {
      name: 'answers',
      type: 'json', 
    },
  ],
}