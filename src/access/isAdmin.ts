// import type { Access, AccessArgs } from 'payload'

// // Standard CRUD access rules (create, read, update, delete)
// export const isAdmin: Access = ({ req: { user } }) => {
//   return Boolean(user && user.role === 'admin')
// }

// // access.admin property-kku strictly boolean return panna type definition
// export const isAdminAdminAccess = ({ req: { user } }: AccessArgs): boolean => {
//   return Boolean(user && user.role === 'admin')
// }

// export const isAdminOrClientAdminAccess = ({ req: { user } }: AccessArgs): boolean => {
//   return Boolean(user && (user.role === 'admin' || user.role === 'client'))
// }

import type { Access, AccessArgs } from 'payload'

// Define user shape with role to satisfy TypeScript
interface UserWithRole {
  role?: string
  [key: string]: unknown
}

// Standard CRUD access rules (create, read, update, delete)
export const isAdmin: Access = ({ req: { user } }) => {
  const typedUser = user as UserWithRole | null | undefined
  return Boolean(typedUser && typedUser.role === 'admin')
}

// access.admin property-kku strictly boolean return panna type definition
export const isAdminAdminAccess = ({ req: { user } }: AccessArgs): boolean => {
  const typedUser = user as UserWithRole | null | undefined
  return Boolean(typedUser && typedUser.role === 'admin')
}

export const isAdminOrClientAdminAccess = ({ req: { user } }: AccessArgs): boolean => {
  const typedUser = user as UserWithRole | null | undefined
  return Boolean(typedUser && (typedUser.role === 'admin' || typedUser.role === 'client'))
}