// import type { User } from 'payload'

// // Client role-a irundha UI-la hide panna False/True tharugira helper function
// export const isNotAdmin = ({ user }: { user: User | null }) => {
//   // User admin illa-na return true (Hide from Admin Panel UI)
//   return user?.role !== 'admin'
// }
// type-ஐ Flexible-ஆக மாற்றுவது
export const isNotAdmin = ({ user }: { user: any }) => {
  return user?.role !== 'admin'
}