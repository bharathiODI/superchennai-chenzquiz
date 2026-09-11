import type { CollectionConfig } from 'payload'
import { isAdminOrClientAdminAccess } from '../../access/isAdmin'

export const EventDashboard: CollectionConfig = {
  slug: 'event-dashboard',

  access: {
    admin: isAdminOrClientAdminAccess,
    read: isAdminOrClientAdminAccess,
  },

  admin: {
    group: 'Events Management',
    hidden: false,

    components: {
      views: {
        list: {
          Component: '@/collections/EventDashboard/components/Dashboard',
        },
      },
    },
  },

  fields: [],
}
