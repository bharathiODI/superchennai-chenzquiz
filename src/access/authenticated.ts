import type { AccessArgs } from 'payload'

import type { User } from 'src/payload-types'

import { isCmsUser } from './isCmsUser'

type isAuthenticated = (args: AccessArgs<User>) => boolean

// Logged in to the CMS. A player's login (quiz-users) does not count.
export const authenticated: isAuthenticated = (args) => isCmsUser(args)
