import { cmsRole } from './roles'

// Players (quiz-users) log in to the same Payload API as the CMS team, with their own token, so
// "is anyone logged in?" is not enough to protect CMS content. True for a CMS account with a real
// role (Super Admin ... Viewer); "No access" accounts count as logged out.
export const isCmsUser = ({ req: { user } }: { req: { user?: unknown } }): boolean => cmsRole(user) !== null
