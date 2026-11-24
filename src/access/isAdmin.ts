import type { Access, AccessArgs } from 'payload'

import { ADMINS, EDITORS, userHas } from './roles'

// Old helpers, kept for anything that still imports them. New code: use ./roles (WordPress roles).
/** Super Admin or Administrator. */
export const isAdmin: Access = ({ req: { user } }) => userHas(user, ADMINS)
export const isAdminAdminAccess = ({ req: { user } }: AccessArgs): boolean => userHas(user, ADMINS)
/** Was "admin or client"; now Super Admin, Administrator or Editor. */
export const isAdminOrClientAdminAccess = ({ req: { user } }: AccessArgs): boolean => userHas(user, EDITORS)
