import { ADMINS, userHas } from './roles'

// Old helper, kept for anything that still imports it. New code: hiddenUnless(...) from ./roles.
/** For admin.hidden: hide unless Super Admin or Administrator. */
export const isNotAdmin = ({ user }: { user: unknown }) => !userHas(user, ADMINS)
