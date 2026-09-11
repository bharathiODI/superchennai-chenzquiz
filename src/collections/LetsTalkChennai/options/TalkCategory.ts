import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isNotAdmin } from '@/access/checkRole'
import type { CollectionConfig } from 'payload'

export const TalkCategories: CollectionConfig<'talkcategories'> = {
  slug: 'talkcategories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    hidden: isNotAdmin,
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Frontend URL or tab filtering-ku use aagum (e.g. people-of-chennai)',
      },
    },
  ],
}
