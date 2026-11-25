import { ADMINS, hiddenUnless, userHas } from '@/access/roles'
import type { Access, CollectionBeforeDeleteHook, CollectionConfig } from 'payload'

// Admins are CMS Super Admins / Administrators. Players (quiz-users) are logged in to the same API
// with their own token, so every rule below has to keep them out of each other's records.
// (Viewers and editors see players only through the Quiz Dashboard.)
const isCmsAdmin: Access = ({ req: { user } }) => userHas(user, ADMINS)

// Deleting a player in the CMS also deletes everything recorded for them.
const deletePlayerData: CollectionBeforeDeleteHook = async ({ id, req }) => {
  for (const collection of ['quiz-answers', 'quiz-rounds', 'quiz-attempts', 'user-submissions'] as const) {
    await req.payload.delete({
      collection: collection as any,
      where: { user: { equals: id } },
      overrideAccess: true,
      req,
    })
  }
}

const QuizUsersConfig: CollectionConfig = {
  slug: 'quiz-users',

  auth: {
    disableLocalStrategy: true,
    tokenExpiration: 2592000,
    // Player tokens are signed by our own OTP login (utilities/playerSession.ts) and carry
    // no session id. Payload 3.87 turns sessions on by default, which would reject them.
    useSessions: false,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'totalXP', 'totalTimeTaken', 'createdAt'],
    listSearchableFields: ['name', 'phone', 'email'],
    description: 'Players. Read-only here (changed only by the game), except Disqualified. Search by name, phone or email.',
    hidden: hiddenUnless(ADMINS),
    components: { beforeListTable: ['@/components/admin/ScoreExport#ScoreExport', '@/components/admin/ListExport#ListExport'] },
  },
  // Sign-up, login and scoring go through the app's own API routes (server side), so the REST API
  // only needs: admins manage players; a player can read their own record.
  access: {
    // Read-only in the CMS: scores and players are written only by the game itself, so nobody can
  // change them by mistake here. (Server code uses overrideAccess and is not affected.)
    create: () => false,
    read: (args) => {
      if (isCmsAdmin(args)) return true
      const user = args.req.user as any
      return user?.collection === 'quiz-users' ? { id: { equals: user.id } } : false
    },
    // Admins can only tick "Disqualified" (every other field is read-only, see below).
    update: isCmsAdmin,
    // Admins can still delete a player (with their rounds and scores - see the hook below).
    delete: isCmsAdmin,
  },
  hooks: {
    beforeDelete: [deletePlayerData],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      type: 'text',
      required: false,
      admin: {
        placeholder: 'example@domain.com',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: false,
      admin: {
        placeholder: 'Enter optional message or note',
      },
    },
    {
      name: 'disqualified',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Disqualified players can still log in but are left off the leaderboard. Use after reviewing a flag.',
      },
    },
    {
      name: 'totalXP',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total XP earned by playing daily quizzes',
      },
    },
    {
      name: 'totalTimeTaken', 
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total time taken in seconds across all quizzes',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      // Display only: the player's rounds and scores (no database column)
      name: 'gameHistory',
      type: 'ui',
      admin: { components: { Field: '@/components/admin/PlayerHistory#PlayerHistory' } },
    },
  ],
}

// Every field except "disqualified" stays read-only in the CMS.
export const QuizUsers: CollectionConfig = {
  ...QuizUsersConfig,
  fields: QuizUsersConfig.fields.map((f: any) =>
    f.name && f.name !== 'disqualified' ? { ...f, access: { ...(f.access || {}), update: () => false } } : f,
  ),
}
