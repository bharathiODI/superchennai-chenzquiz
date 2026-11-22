// Players (quiz-users) log in to the same Payload API as the CMS team, with their own token, so
// "is anyone logged in?" is not enough to protect CMS content. Use this for anything that only the
// CMS team (the `users` collection, any role) should be able to do.
export const isCmsUser = ({ req: { user } }: { req: { user?: unknown } }): boolean =>
  Boolean(user && (user as { collection?: string }).collection === 'users')
