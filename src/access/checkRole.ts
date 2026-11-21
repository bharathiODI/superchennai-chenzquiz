// import type { User } from 'payload'

export const isNotAdmin = ({ user }: { user: any }) => {
  return user?.role !== 'admin'
}